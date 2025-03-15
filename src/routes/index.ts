import express from 'express';

import billRoute from '@/routes/bill.route';
import foodRoute from '@/routes/food.route';
import orderRoute from '@/routes/order.route';
import swaggerRouter from '@/routes/swagger.router';
import tableRoute from '@/routes/table.route';
import testRoute from '@/routes/test.route';
import voucherRoute from '@/routes/voucher.route';

const router = express.Router();

router.use('/food', foodRoute);
router.use('/order', orderRoute);
router.use('/table', tableRoute);
router.use('/voucher', voucherRoute);
router.use('/test', testRoute);
router.use('/bill', billRoute);
router.use('/swagger', swaggerRouter);

export default router;
