import { type Request, type Response } from 'express';

import orderTempService from '@/services/orderTemp.service';

class OrderTempController {
  async get(req: Request, res: Response) {
    res.send(await orderTempService.get());
  }
}

const orderTempController = new OrderTempController();
export default orderTempController;
