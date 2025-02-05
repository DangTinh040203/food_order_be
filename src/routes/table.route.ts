import express from 'express';

import tableController from '@/controllers/table.controller';
import { asyncHandler } from '@/middlewares/asyncHandler.middleware';
import { validationRequest } from '@/middlewares/validationRequest.middleware';
import { TableValidation } from '@/validations/table.validation';

const router = express.Router();

router.get('/', asyncHandler(tableController.get));

router.patch(
  '/update/:id',
  validationRequest(TableValidation.updateTableSchema()),
  asyncHandler(tableController.update),
);

router.delete(
  '/delete/:id',
  validationRequest(TableValidation.deleteTableSchema()),
  asyncHandler(tableController.delete),
);

router.post(
  '/insert',
  validationRequest(TableValidation.insertTableSchema()),
  asyncHandler(tableController.insert),
);

export default router;
