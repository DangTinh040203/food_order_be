import { type Request, type Response } from 'express';

import { type ORDER_STATUS } from '@/constants';
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

  async updateStatus(req: Request, res: Response) {
    const { orderId, status }: { orderId: string; status: ORDER_STATUS } =
      req.body;
    res.send(await orderService.updateStatus(orderId, status));
  }
}

const orderController = new OrderController();
export default orderController;
