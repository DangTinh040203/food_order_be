import type { Request, Response } from 'express';

import { type Bill } from '@/models/bill.model';
import billService from '@/services/bill.service';

class BillController {
  async get(req: Request, res: Response) {
    res.send(await billService.get());
  }

  async insertBill(req: Request, res: Response) {
    const payload: Bill = req.body;
    res.send(await billService.insertBill(payload));
  }

  async getById(req: Request, res: Response) {
    const billId = req.params.id;
    res.send(await billService.getById(billId));
  }

  async deleteById(req: Request, res: Response) {
    const billId = req.params.id;
    res.send(await billService.deleteById(billId));
  }

  async deleteAll(req: Request, res: Response) {
    res.send(await billService.deleteAll());
  }
}

const billController = new BillController();
export default billController;
