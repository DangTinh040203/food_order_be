import express from 'express';

import foodController from '@/controllers/food.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { validationRequest } from '@/middlewares/validationRequest.middleware';
import { FoodValidation } from '@/validations/food.validation';

const router = express.Router();

router.get('/', asyncHandler(foodController.get));
router.delete(
  '/delete/:id',
  validationRequest(FoodValidation.deleteFoodSchema()),
  asyncHandler(foodController.delete),
);
router.post(
  '/insert',
  validationRequest(FoodValidation.insertFoodSchema()),
  asyncHandler(foodController.insert),
);

export default router;
