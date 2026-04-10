import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function uploadToS3(filePath: string, key: string) {
  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: fileStream,
    ContentType: getContentType(key),

    // ✅ FIX: FORCE DOWNLOAD IN BROWSER
    ContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
  });

  await s3.send(command);

  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

function getContentType(key: string) {
  if (key.endsWith('.mp4')) return 'video/mp4';
  if (key.endsWith('.jpg')) return 'image/jpeg';
  if (key.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}