import { type Request, type Response } from 'express';

import { type ORDER_STATUS } from '@/constants';
import { type Food } from '@/models/food.model';
import orderService from '@/services/order.service';

class OrderController {
  async get(req: Request, res: Response) {
    res.send(await orderService.get());
  }
  async delete(req: Request, res: Response) {
    res.send(await orderService.delete());
  }
  async insert(req: Request, res: Response) {
    const {
      items,
      voucher,
    }: {
      items: Array<{
        food: Food;
        tableId: string;
        quantity: number;
      }>;
      voucher: {
        code: string;
      };
    } = req.body;
    res.send(await orderService.insert([items, voucher]));
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

  async updateOrder(req: Request, res: Response) {
    //orderId, items, billId
    const {
      billId,
      orderId,
      items,
    }: {
      items: Array<{
        food: Food;
        tableId: string;
        quantity: number;
      }>;
      billId: string;
      orderId: string;
    } = req.body;

    res.send(await orderService.updateOrder([billId, orderId, items]));
  }
}

const orderController = new OrderController();
export default orderController;
