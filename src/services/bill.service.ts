import { OkResponse } from '@/core/success.response';
import billModel from '@/models/bill.model';

class BillService {
  async get() {
    const bills = await billModel.find();
    return new OkResponse('Bills found', bills);
  }
  async deleteAll() {
    await billModel.deleteMany();
    return new OkResponse('All bills deleted');
  }
}

const billService = new BillService();
export default billService;
