import express from 'express';

import foodRoute from '@/routes/food.route';

const router = express.Router();

router.use('/food', foodRoute);

export default router;
