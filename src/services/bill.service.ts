import { OkResponse } from '@/core/success.response';
import billModel, { type Bill } from '@/models/bill.model';
import { convertObjectId } from '@/utils/convertObjectId';

class BillService {
  async get() {
    const bills = await billModel.find();
    return new OkResponse('Bills found', bills);
  }

  async insertBill(payload: Bill) {
    const bill = await billModel.create(payload);
    return new OkResponse('Bill created', bill);
  }

  async getById(billId: string) {
    const bill = await billModel.findById({
      _id: convertObjectId(billId),
    });
    if (!bill) throw new Error('Bill not found');
    return new OkResponse('Bill found', bill);
  }

  async deleteById(billId: string) {
    const bill = await billModel.findByIdAndDelete({
      _id: convertObjectId(billId),
    });
    if (!bill) throw new Error('Bill not found');
    return new OkResponse('Bill deleted', bill);
  }

  async deleteAll() {
    await billModel.deleteMany();
    return new OkResponse('All bills deleted');
  }
}

const billService = new BillService();
export default billService;
