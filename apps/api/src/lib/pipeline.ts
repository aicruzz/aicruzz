import { generateScript } from './stages/script';
import { generateSceneVideo } from './stages/video';
import { mergeVideos } from './stages/merge';
import { uploadToS3 } from './s3';
import { db } from '../db/pool';
import { io } from '../index';
import fs from 'fs';

export async function runVideoPipeline({
  videoId,
  prompt,
  userId,
  style,
}: {
  videoId: string;
  prompt: string;
  userId: string;
  style?: string;
}) {
  try {
    // 🔵 START
    io.to(userId).emit('video:progress', {
      videoId,
      progress: 5,
      status: 'processing',
    });

    // 1️⃣ SCRIPT
    const script = await generateScript(prompt);

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 15,
    });

    // 2️⃣ GENERATE SCENES (PARALLEL)
    const clips = await Promise.all(
      script.scenes.map((scene, i) =>
        generateSceneVideo({
          prompt: scene.text,
          index: i,
          style,
        })
      )
    );

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 60,
    });

    // 3️⃣ MERGE
    const outputPath = await mergeVideos(clips, videoId);

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 80,
    });

    // 4️⃣ UPLOAD
    const videoUrl = await uploadToS3(outputPath, `videos/${videoId}.mp4`);

    // 5️⃣ THUMBNAIL (simple first frame)
    const thumbnailUrl = videoUrl + '?thumb=1'; // temporary (can improve later)

    // 6️⃣ SAVE DB
    await db.query(
      `UPDATE videos SET url=$1, "thumbnailUrl"=$2, status='done' WHERE id=$3`,
      [videoUrl, thumbnailUrl, videoId]
    );

    // 🟢 FINAL EMIT (CRITICAL)
    io.to(userId).emit('video:update', {
      id: videoId,
      status: 'done',
      url: videoUrl,
      thumbnailUrl,
    });

    io.to(userId).emit('video:progress', {
      videoId,
      progress: 100,
      status: 'done',
    });

    // 🧹 cleanup
    clips.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

  } catch (err) {
    console.error('PIPELINE ERROR:', err);

    await db.query(`UPDATE videos SET status='failed' WHERE id=$1`, [videoId]);

    io.to(userId).emit('video:update', {
      id: videoId,
      status: 'failed',
    });
  }
}