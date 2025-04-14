import { OkResponse } from '@/core/success.response';
import orderTempModel from '@/models/orderTemp.model';

class OrderTempService {
  async get() {
    const orderTemp = await orderTempModel.find();
    return orderTemp
      ? new OkResponse('OrderTemp found', orderTemp)
      : new OkResponse('No OrderTemp found');
  }
}

const orderTempService = new OrderTempService();
export default orderTempService;
