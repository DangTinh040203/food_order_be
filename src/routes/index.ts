import express from 'express';

import foodRoute from '@/routes/food.route';
import swaggerRouter from '@/routes/swagger.router';
import tableRoute from '@/routes/table.route';
import testRoute from '@/routes/test.route';

const router = express.Router();

router.use('/food', foodRoute);
router.use('/table', tableRoute);
router.use('/test', testRoute);
router.use('/', swaggerRouter);

export default router;
