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
  message: string;
}

interface OrderUpdateRequest {
  items: Array<{
    food: Food;
    tableId: string;
    quantity: number;
  }>;
  message: string;
}

class OrderController {
  async get(req: Request, res: Response) {
    res.send(await orderService.get());
  }

  async getById(req: Request, res: Response) {
    const orderId = req.params.id;
    res.send(await orderService.getById(orderId));
  }

  async deleteById(req: Request, res: Response) {
    const orderId = req.params.id;
    res.send(await orderService.deleteById({ orderId }));
  }
  async insertOrder(req: Request, res: Response) {
    const payload: OrderInsertRequest = req.body;
    res.send(await orderService.insertOrder(payload));
  }

  async rejectOrder(req: Request, res: Response) {
    const orderId = req.params.orderId;
    const { reason }: { reason: string } = req.body;
    res.send(await orderService.rejectOrder(reason, orderId));
  }

  async getRejectedOrder(req: Request, res: Response) {
    res.send(await orderService.getRejectedOrder());
  }

  async deleteRejectedOrder(req: Request, res: Response) {
    res.send(await orderService.deleteRejectedOrder());
  }

  async updateOrder(req: Request, res: Response) {
    const { billId, orderId } = req.params;
    const payload: OrderUpdateRequest = req.body;
    res.send(await orderService.updateOrder(billId, orderId, payload));
  }

  async updateStatus(req: Request, res: Response) {
    const orderId = req.params.orderId;
    const { status }: { status: ORDER_STATUS } = req.body;
    res.send(await orderService.updateStatus(orderId, status));
  }
  async CompleteOrder(req: Request, res: Response) {
    const { billId, orderId } = req.params;
    res.send(await orderService.CompleteOrder(billId, orderId));
  }
}

const orderController = new OrderController();
export default orderController;
