import express from 'express';

import voucherController from '@/controllers/voucher.controller';

const router = express.Router();

router.post('/', voucherController.insertVoucher);
router.get('/', voucherController.getVouchers);
router.get('/:id', voucherController.getVoucherById);
router.delete('/:id', voucherController.deleteVoucher);
router.patch('/:id', voucherController.updateVoucher);

export default router;
