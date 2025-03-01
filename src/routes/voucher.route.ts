import express from 'express';

import voucherController from '@/controllers/voucher.controller';

const router = express.Router();

router.post('/', voucherController.insertVoucher);
router.get('/', voucherController.getVouchers);

export default router;
