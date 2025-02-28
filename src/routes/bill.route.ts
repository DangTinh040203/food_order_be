import express from 'express';

import billController from '@/controllers/bill.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';

const router = express.Router();

router.get('/', asyncHandler(billController.get));
router.delete('/delete', asyncHandler(billController.delete)); //delete All

export default router;
