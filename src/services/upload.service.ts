import { PutObjectCommand } from '@aws-sdk/client-s3';

import s3 from '@/configs/s3.config';
import { InternalServerError } from '@/core/error.response';
import { CreatedResponse } from '@/core/success.response';

export class UploadService {
  async uploadImageFromLocal(file: Express.Multer.File) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `${file.originalname}_s${Date.now()}`,
        Body: file.buffer,
      });

      const result = await s3.send(command);

      return new CreatedResponse('Created image', result);
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
