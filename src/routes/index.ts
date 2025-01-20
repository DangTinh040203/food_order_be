import express from 'express';

import { InternalServerError } from '@/core/error.response';

const router = express.Router();

router.use('/test', (req, res) => {
  throw new InternalServerError();
});

export default router;
