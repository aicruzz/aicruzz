import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export async function mergeVideos(files: string[], videoId: string) {
  const listFile = `/tmp/${videoId}-list.txt`;
  const output = `/tmp/${videoId}-final.mp4`;

  fs.writeFileSync(
    listFile,
    files.map((f) => `file '${f}'`).join('\n')
  );

  return new Promise<string>((resolve, reject) => {
    ffmpeg()
      .input(listFile)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions(['-c copy'])
      .save(output)
      .on('end', () => resolve(output))
      .on('error', reject);
  });
}