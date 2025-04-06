import { type Request, type Response } from 'express';

import { type Voucher } from '@/models/voucher.model';
import voucherService from '@/services/voucher.service';

class VoucherController {
  async insertVoucher(req: Request, res: Response) {
    const payload: Omit<Voucher, 'id'> = req.body;
    res.send(await voucherService.insertVoucher(payload));
  }

  async deleteVoucher(req: Request, res: Response) {
    const voucherId = req.params.id;
    res.send(await voucherService.deleteVoucher(voucherId));
  }

  async updateVoucher(req: Request, res: Response) {
    const voucherId = req.params.id;
    const payload: Partial<Voucher> = req.body;
    res.send(await voucherService.updateVoucher(voucherId, payload));
  }

  async getVoucherById(req: Request, res: Response) {
    const voucherId = req.params.id;
    res.send(await voucherService.getVoucherById(voucherId));
  }

  async getVouchers(req: Request, res: Response) {
    res.send(await voucherService.getVouchers());
  }
}

const voucherController = new VoucherController();
export default voucherController;
