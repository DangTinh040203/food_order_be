import express from 'express';

import orderController from '@/controllers/order.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { validationRequest } from '@/middlewares/validationRequest.middleware';
import { OrderValidation } from '@/validations/order.validation';

const router = express.Router();

router.post(
  '/insert',
  validationRequest(OrderValidation.insertOrderSchema()),
  asyncHandler(orderController.insert),
);

router.post(
  '/reject',
  validationRequest(OrderValidation.rejectOrderSchema()),
  asyncHandler(orderController.rejectOrder),
);

router.post(
  '/update-status',
  validationRequest(OrderValidation.acceptOrderSchema()),
  asyncHandler(orderController.updateStatus),
);

router.patch(
  '/update',
  validationRequest(OrderValidation.insertOrderSchema()),
  asyncHandler(orderController.updateOrder),
);

router.get('/', asyncHandler(orderController.get));

router.delete('/delete', asyncHandler(orderController.delete));
export default router;
