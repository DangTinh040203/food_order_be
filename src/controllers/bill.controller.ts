import type { Request, Response } from 'express';

import billService from '@/services/bill.service';

class BillController {
  async get(req: Request, res: Response) {
    res.send(await billService.get());
  }
  async delete(req: Request, res: Response) {
    res.send(await billService.delete());
  }
}

const billController = new BillController();
export default billController;
