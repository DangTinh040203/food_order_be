import express from 'express';

import { uploadMemory } from '@/configs/multer.config';
import { UploadService } from '@/services/upload.service';

const uploadService = new UploadService();

const router = express.Router();

router.use('/', uploadMemory.single('file'), async (req, res) => {
  const { file } = req;
  res.send(
    await uploadService.uploadImageFromLocal(file as Express.Multer.File),
  );
});

export default router;
