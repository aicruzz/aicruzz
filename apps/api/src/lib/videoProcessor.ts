import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';
import fs from 'fs';
import axios from 'axios';

import { uploadToS3 } from './s3';
import { db } from '../db/pool';
import { io } from '../index';

ffmpeg.setFfmpegPath(ffmpegPath!);
ffmpeg.setFfprobePath((ffprobePath as any).path);

// ✅ WAIT UNTIL S3 FILE IS REALLY READY
async function waitForS3(url: string, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.head(url);
      return true;
    } catch {
      console.log(`⏳ Waiting for S3... (${i + 1})`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('S3 file not ready');
}

export async function processVideo(
  videoId: string,
  inputPath: string,
  userId: string
) {
  const thumbnailPath = `/tmp/${videoId}.jpg`;

  try {
    // 🔵 START
    io.to(userId).emit('video:progress', {
      videoId,
      progress: 5,
    });

    // 🎬 Thumbnail
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['2'],
          filename: `${videoId}.jpg`,
          folder: '/tmp',
          size: '320x?',
        })
        .on('end', resolve)
        .on('error', reject);
    });

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 25,
    });

    // ☁️ Upload video
    const videoUrl = await uploadToS3(
      inputPath,
      `videos/${videoId}.mp4`
    );

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 60,
    });

    // 🖼 Upload thumbnail
    const thumbnailUrl = await uploadToS3(
      thumbnailPath,
      `thumbnails/${videoId}.jpg`
    );

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 80,
    });

    // 🔥 CRITICAL FIX → WAIT FOR S3
    await waitForS3(videoUrl);
    await waitForS3(thumbnailUrl);

    // 💾 Save DB AFTER S3 READY
    await db.query(
      `UPDATE videos 
       SET url=$1, "thumbnailUrl"=$2, status='done' 
       WHERE id=$3`,
      [videoUrl, thumbnailUrl, videoId]
    );

    // 🧹 cleanup
    fs.unlinkSync(thumbnailPath);

    // 🟢 FINAL EMIT (NOW SAFE)
    io.to(userId).emit('video:update', {
      id: videoId,
      status: 'done',
      url: videoUrl,
      thumbnailUrl,
    });

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 100,
    });

    console.log('✅ Video READY (S3 confirmed):', videoId);

  } catch (err) {
    console.error('❌ Processing failed:', err);

    await db.query(
      `UPDATE videos SET status='failed' WHERE id=$1`,
      [videoId]
    );

    io.to(userId).emit('video:update', {
      id: videoId,
      status: 'failed',
    });
  }
}