import { type Request, type Response } from 'express';

import { type Voucher } from '@/models/voucher.model';
import voucherService from '@/services/voucher.service';

class VoucherController {
  async insert(req: Request, res: Response) {
    const payload: Omit<Voucher, 'id'> = req.body;
    res.send(await voucherService.insert(payload));
  }
  async get(req: Request, res: Response) {
    res.send(await voucherService.get());
  }
}

const voucherController = new VoucherController();
export default voucherController;
