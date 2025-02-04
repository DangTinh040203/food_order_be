import express from 'express';

import { Test } from '@/models/test.model';

const router = express.Router();

router.use('/test', async (req, res) => {
  const oke = await Test.create({ name: 'Test' + req.body.name });
  res.send('Hello World');
});

export default router;
