import { OkResponse } from '@/core/success.response';
import orderTempModel from '@/models/orderTemp.model';

class OrderTempService {
  async get() {
    const orderTemp = await orderTempModel.find();
    return orderTemp
      ? new OkResponse('OrderTemp found', orderTemp)
      : new OkResponse('No OrderTemp found');
  }

  async delete() {
    await orderTempModel.deleteMany();
    return new OkResponse('All OrderTemp deleted');
  }
}

const orderTempService = new OrderTempService();
export default orderTempService;
