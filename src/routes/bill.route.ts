import express from 'express';

import billController from '@/controllers/bill.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';

const router = express.Router();

router.get('/', asyncHandler(billController.get));
router.delete('/', asyncHandler(billController.deleteAll));
router.get('/:id', asyncHandler(billController.getById));
router.post('/', asyncHandler(billController.insertBill));
router.delete('/:id', asyncHandler(billController.deleteById));

export default router;
