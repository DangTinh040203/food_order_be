import express from 'express';

import voucherController from '@/controllers/voucher.controller';

const router = express.Router();

router.post('/insert', voucherController.insert);
router.get('/get', voucherController.get);

export default router;
