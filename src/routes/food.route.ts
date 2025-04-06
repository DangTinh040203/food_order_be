import express from 'express';

import { uploadMemory } from '@/configs/multer.config';
import foodController from '@/controllers/food.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { validationRequest } from '@/middlewares/validationRequest.middleware';
import { FoodValidation } from '@/validations/food.validation';

const router = express.Router();

router.get('/', asyncHandler(foodController.get));
router.get('/:id', asyncHandler(foodController.getById));

router.patch(
  '/:id',
  validationRequest(FoodValidation.updateFoodSchema()),
  asyncHandler(foodController.updateFood),
);

router.patch(
  '/:id/availability',
  validationRequest(FoodValidation.updateFoodAvailabilitySchema()),
  asyncHandler(foodController.updateFoodAvailability),
);

router.delete(
  '/:id',
  validationRequest(FoodValidation.deleteFoodSchema()),
  asyncHandler(foodController.deleteFood),
);

router.post(
  '/',
  validationRequest(FoodValidation.insertFoodSchema()),
  asyncHandler(foodController.insertFood),
);

router.post(
  '/thumbnail',
  uploadMemory.single('thumbnail'),
  asyncHandler(foodController.uploadFoodThumbnail),
);

export default router;
