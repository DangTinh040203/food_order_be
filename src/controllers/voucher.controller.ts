import { type Request, type Response } from 'express';

import { type Voucher } from '@/models/voucher.model';
import voucherService from '@/services/voucher.service';

class VoucherController {
  async insertVoucher(req: Request, res: Response) {
    const payload: Omit<Voucher, 'id'> = req.body;
    res.send(await voucherService.insertVoucher(payload));
  }
  async getVouchers(req: Request, res: Response) {
    res.send(await voucherService.getVouchers());
  }
}

const voucherController = new VoucherController();
export default voucherController;
