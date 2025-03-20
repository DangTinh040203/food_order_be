import express from 'express';

import orderController from '@/controllers/order.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { validationRequest } from '@/middlewares/validationRequest.middleware';
import { OrderValidation } from '@/validations/order.validation';

const router = express.Router();

router.post(
  '/',
  validationRequest(OrderValidation.insertOrderSchema()),
  asyncHandler(orderController.insertOrder),
);

router.post(
  '/:orderId/reject',
  validationRequest(OrderValidation.rejectOrderSchema()),
  asyncHandler(orderController.rejectOrder),
);

router.get('/reject', asyncHandler(orderController.getRejectedOrder));

router.delete('/reject', asyncHandler(orderController.deleteRejectedOrder));

router.patch(
  '/:billId/:orderId/reorder',
  validationRequest(OrderValidation.updateOrderSchema()),
  asyncHandler(orderController.reOrder),
);

router.post(
  '/:orderId/status',
  validationRequest(OrderValidation.acceptOrderSchema()),
  asyncHandler(orderController.updateStatus),
);

router.patch(
  '/bill/:billId/order/:orderId',
  validationRequest(OrderValidation.updateOrderSchema()),
  asyncHandler(orderController.updateOrder),
);

router.patch(
  '/bill/:billId/order/:orderId/payment',
  asyncHandler(orderController.CompleteOrder),
);

router.get('/', asyncHandler(orderController.get));

router.delete('/', asyncHandler(orderController.delete));

export default router;
