import express from 'express';

import orderController from '@/controllers/order.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { validationRequest } from '@/middlewares/validationRequest.middleware';
import { OrderValidation } from '@/validations/order.validation';

const router = express.Router();

router.get('/', asyncHandler(orderController.get));

router.get('/:id', asyncHandler(orderController.getById));

router.post(
  '/',
  validationRequest(OrderValidation.insertOrderSchema()),
  asyncHandler(orderController.insertOrder),
);

router.post(
  '/:orderId',
  validationRequest(OrderValidation.rejectOrderSchema()),
  asyncHandler(orderController.rejectOrder),
);

router.delete('/reject', asyncHandler(orderController.deleteRejectedOrder));

router.post(
  '/:orderId/status',
  validationRequest(OrderValidation.acceptOrderSchema()),
  asyncHandler(orderController.updateStatus),
);

router.patch(
  '/:orderId/:billId/',
  validationRequest(OrderValidation.updateOrderSchema()),
  asyncHandler(orderController.updateOrder),
);

router.patch(
  '/:orderId/:billId/payment',
  asyncHandler(orderController.CompleteOrder),
);

router.delete('/:id', asyncHandler(orderController.deleteById));

export default router;
