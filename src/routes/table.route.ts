import express from 'express';

import tableController from '@/controllers/table.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { validationRequest } from '@/middlewares/validationRequest.middleware';
import { TableValidation } from '@/validations/table.validation';

const router = express.Router();

router.get('/', asyncHandler(tableController.get));

router.patch(
  '/:id',
  validationRequest(TableValidation.updateTableSchema()),
  asyncHandler(tableController.updateTable),
);

router.delete(
  '/:id',
  validationRequest(TableValidation.deleteTableSchema()),
  asyncHandler(tableController.deleteTable),
);

router.post(
  '/',
  validationRequest(TableValidation.insertTableSchema()),
  asyncHandler(tableController.insertTable),
);

export default router;
