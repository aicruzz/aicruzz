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
  const fileBuffer = fs.readFileSync(filePath);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/jpeg',
    })
  );

  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}