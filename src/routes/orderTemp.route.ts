import express from 'express';

import orderTempController from '@/controllers/orderTemp.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';

const router = express.Router();

router.get('/', asyncHandler(orderTempController.get));


export default router;
