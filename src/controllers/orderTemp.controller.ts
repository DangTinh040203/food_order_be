import { type Request, type Response } from 'express';

import orderTempService from '@/services/orderTemp.service';

class OrderTempController {
  async get(req: Request, res: Response) {
    res.send(await orderTempService.get());
  }

  async delete(req: Request, res: Response) {
    res.send(await orderTempService.delete());
  }
}

const orderTempController = new OrderTempController();
export default orderTempController;
