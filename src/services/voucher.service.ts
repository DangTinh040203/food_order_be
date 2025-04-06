import { CreatedResponse, OkResponse } from '@/core/success.response';
import voucherModel, { type Voucher } from '@/models/voucher.model';
import { convertObjectId } from '@/utils/convertObjectId';

class VoucherService {
  async insertVoucher(payload: Omit<Voucher, 'id'>) {
    const voucher = await voucherModel.insertMany(payload);
    return new CreatedResponse('Voucher created successfully', voucher);
  }

  async deleteVoucher(voucherId: string) {
    const voucher = await voucherModel.findByIdAndDelete({
      _id: convertObjectId(voucherId),
    });
    if (!voucher) throw new Error('Voucher not found');
    return new OkResponse('Voucher deleted successfully', voucher);
  }

  async updateVoucher(voucherId: string, payload: Partial<Voucher>) {
    const voucher = await voucherModel.findByIdAndUpdate(
      { _id: convertObjectId(voucherId) },
      payload,
      { new: true },
    );
    if (!voucher) throw new Error('Voucher not found');
    return new OkResponse('Voucher updated successfully', voucher);
  }

  async getVoucherById(voucherId: string) {
    const voucher = await voucherModel.findById({
      _id: convertObjectId(voucherId),
    });
    if (!voucher) throw new Error('Voucher not found');
    return new OkResponse('Voucher found successfully', voucher);
  }

  async getVouchers() {
    const vouchers = await voucherModel.find();
    return new OkResponse('Get voucher successfully!', vouchers);
  }
}

const voucherService = new VoucherService();
export default voucherService;
