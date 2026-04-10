import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

// @ts-ignore
import ffprobePath from 'ffprobe-static';

ffmpeg.setFfmpegPath(ffmpegPath as string);
ffmpeg.setFfprobePath(ffprobePath.path);

const input = '/tmp/test.mp4';
const output = '/tmp/test.jpg';

ffmpeg(input)
  .on('start', (cmd) => {
    console.log('FFmpeg started:', cmd);
  })
  .on('end', () => {
    console.log('✅ Thumbnail created:', output);
  })
  .on('error', (err) => {
    console.error('❌ Error:', err.message);
  })
  .screenshots({
    count: 1,
    folder: '/tmp',
    filename: 'test.jpg',
    size: '320x?',
  });