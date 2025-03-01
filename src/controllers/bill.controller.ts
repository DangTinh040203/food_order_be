import type { Request, Response } from 'express';

import billService from '@/services/bill.service';

class BillController {
  async get(req: Request, res: Response) {
    res.send(await billService.get());
  }
  async deleteAll(req: Request, res: Response) {
    res.send(await billService.deleteAll());
  }
}

const billController = new BillController();
export default billController;
