import express from 'express';

import foodRoute from '@/routes/food.route';
import tableRoute from '@/routes/table.route';

const router = express.Router();

router.use('/food', foodRoute);
router.use('/table', tableRoute);

export default router;
