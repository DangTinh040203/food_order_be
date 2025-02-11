import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import s3 from '@/configs/s3.config';
import { InternalServerError } from '@/core/error.response';
import { CreatedResponse } from '@/core/success.response';

export class UploadService {
  async uploadImageFromLocal(file: Express.Multer.File) {
    try {
      const imageName = `${Date.now().toString()}_${file.originalname}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await s3.send(uploadCommand);

      const signUrlcommand = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: imageName,
      });
      const url = await getSignedUrl(s3, signUrlcommand, { expiresIn: 3600 });

      return new CreatedResponse('Created image', { url });
    } catch (error) {
      console.log('🚀 ~ UploadService ~ uploadImageFromLocal ~ error:', error);
      throw new InternalServerError();
    }
  }
}
