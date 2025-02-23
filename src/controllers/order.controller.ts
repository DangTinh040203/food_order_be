import { type Request, type Response } from 'express';

import { type Food } from '@/models/food.model';
import orderService from '@/services/order.service';

class OrderController {
  async insert(req: Request, res: Response) {
    const {
      items,
    }: {
      items: Array<{
        food: Food;
        tableId: string;
        quantity: number;
      }>;
    } = req.body;

    res.send(await orderService.insert(items));
  }

  async rejectOrder(req: Request, res: Response) {
    const { reason, orderId }: { reason: string; orderId: string } = req.body;
    res.send(await orderService.rejectOrder(reason, orderId));
  }
}

const orderController = new OrderController();
export default orderController;
