import { ORDER_STATUS } from '@/constants';
import { InternalServerError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import billModel from '@/models/bill.model';
import { type Food } from '@/models/food.model';
import orderModel, { type Order } from '@/models/order.model';
import rejectedOrderModel from '@/models/rejected-order.model';
import tableModel from '@/models/table.model';

class OrderService {
  async insert(
    payload: Array<{
      food: Food;
      tableId: string;
      quantity: number;
    }>,
  ) {
    try {
      const [newOrder] = await Promise.all([
        orderModel.create({
          tableId: payload[0].tableId,
          items: payload.map((item) => ({
            foodId: item.food,
            quantity: item.quantity,
          })),
        }),
        tableModel.findOneAndUpdate(
          { _id: payload[0].tableId },
          { isAvailable: false },
          { new: true },
        ),
      ]);

      const billPrice = payload.reduce(
        (acc, item) => acc + item.food.price * item.quantity,
        0,
      );

      const newBill = await billModel.create({
        totalPrice: billPrice,
        orderId: newOrder._id,
      });

      return new CreatedResponse('Order successful!', {
        bill: newBill,
        order: newOrder,
      });
    } catch (error) {
      throw new InternalServerError('Soemthing went wrong');
    }
  }

  async rejectOrder(reason: string, orderId: string) {
    try {
      await Promise.all([
        orderModel.findOneAndUpdate({}, { status: ORDER_STATUS.REJECTED }),
        rejectedOrderModel.create({
          orderId,
          reason,
        }),
      ]);

      return new OkResponse('Rejected Order');
    } catch (error) {
      throw new InternalServerError('Something went wrong!');
    }
  }
}

const orderService = new OrderService();
export default orderService;
