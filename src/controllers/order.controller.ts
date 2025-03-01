import { type Request, type Response } from 'express';

import { type ORDER_STATUS } from '@/constants';
import { type Food } from '@/models/food.model';
import orderService from '@/services/order.service';

interface OrderInsertRequest {
  items: Array<{
    food: Food;
    tableId: string;
    quantity: number;
  }>;
  voucher: {
    code: string;
  };
}

interface OrderUpdateRequest {
  food: Food;
  quantity: number;
  tableId: string;
}

class OrderController {
  async get(req: Request, res: Response) {
    res.send(await orderService.get());
  }
  async delete(req: Request, res: Response) {
    res.send(await orderService.delete());
  }
  async insertOrder(req: Request, res: Response) {
    const { items, voucher }: OrderInsertRequest = req.body;
    res.send(await orderService.insertOrder([items, voucher]));
  }

  async rejectOrder(req: Request, res: Response) {
    const orderId = req.params.orderId;
    const { reason }: { reason: string } = req.body;
    res.send(await orderService.rejectOrder(reason, orderId));
  }

  async updateStatus(req: Request, res: Response) {
    const orderId = req.params.orderId;
    const { status }: { status: ORDER_STATUS } = req.body;
    res.send(await orderService.updateStatus(orderId, status));
  }

  async updateOrder(req: Request, res: Response) {
    const { billId, orderId } = req.params;
    const items: Array<OrderUpdateRequest> = req.body;
    res.send(await orderService.updateOrder(billId, orderId, items));
  }
}

const orderController = new OrderController();
export default orderController;
