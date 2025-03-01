import { CreatedResponse, OkResponse } from '@/core/success.response';
import voucherModel, { type Voucher } from '@/models/voucher.model';

class VoucherService {
  async insertVoucher(payload: Omit<Voucher, 'id'>) {
    const voucher = await voucherModel.insertMany(payload);
    return new CreatedResponse('Voucher created successfully', voucher);
  }
  async getVouchers() {
    const vouchers = await voucherModel.find();
    return new OkResponse('Get voucher successfully!', vouchers);
  }
}

const voucherService = new VoucherService();
export default voucherService;
