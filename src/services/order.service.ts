import { ORDER_STATUS } from '@/constants';
import { SOCKET_ACTIONS } from '@/constants/socket';
import { BadRequestError, InternalServerError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import billModel, { type Bill } from '@/models/bill.model';
import { type Food } from '@/models/food.model';
import orderModel, { type Order } from '@/models/order.model';
import rejectedOrderModel from '@/models/rejected-order.model';
import tableModel from '@/models/table.model';
import voucherModel from '@/models/voucher.model';
import SocketInstance from '@/services/socket.instance';

class OrderService {
  async get() {
    const orders = await orderModel.find();
    const bills = await billModel.find();
    return orders
      ? new OkResponse('Orders found', { bills, orders })
      : new OkResponse('No orders found');
  }
  async delete() {
    await orderModel.deleteMany();
    await tableModel.updateMany({}, { isAvailable: true });
    return new OkResponse('All orders deleted');
  }
  async insertOrder(
    payload: [
      Array<{
        food: Food;
        tableId: string;
        quantity: number;
      }>,
      { code: string },
    ],
  ) {
    const [items, voucher] = payload;
    try {
      if (items.length === 0) {
        throw new BadRequestError('No items to order');
      }
      const [newOrder] = await Promise.all([
        orderModel.create({
          tableId: payload[0][0].tableId,
          items: items.map((item) => ({
            foodId: item.food._id,
            price: item.food.price,
            quantity: item.quantity,
          })),
        }),
        tableModel.findOneAndUpdate(
          { _id: items[0].tableId },
          { isAvailable: false },
          { new: true },
        ),
      ]);

      const billPrice = items.reduce(
        (acc, item) => acc + item.food.price * item.quantity,
        0,
      );

      const voucherId =
        voucher && voucher.code
          ? await voucherModel.findOne({
              code: voucher.code,
            })
          : null;

      const newBill = await billModel.create({
        totalPrice: billPrice,
        orderId: newOrder._id,
        voucherId: voucherId ? voucherId._id : null,
      });

      const io = SocketInstance.getIO();
      io.emit(SOCKET_ACTIONS.INSERT_ORDER, { bill: newBill, order: newOrder });
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

  async updateStatus(orderId: string, status: ORDER_STATUS) {
    await orderModel.findOneAndUpdate({ _id: orderId }, { status: status });
    return new OkResponse('Updated status');
  }

  async updateOrder(
    billId: string,
    orderId: string,
    payload: Array<{
      food: Food;
      quantity: number;
      tableId: string;
    }>,
  ) {
    const items = payload;

    try {
      if (items.length === 0) {
        throw new BadRequestError('No items to order');
      }
      const priceForNewFoods = items.reduce((sum, item) => {
        return sum + item.food.price * item.quantity;
      }, 0);

      const newBill = await billModel.findOneAndUpdate(
        { _id: billId },
        {
          $set: {
            totalPrice: priceForNewFoods,
          },
        },
        { new: true },
      );

      const newOrder = await orderModel.findOneAndUpdate(
        {
          _id: orderId,
        },
        {
          items: items.map((item) => ({
            foodId: item.food._id,
            price: item.food.price,
            quantity: item.quantity,
          })),
        },
        { new: true },
      );

      return new OkResponse('Order updated', { newBill, newOrder });
    } catch (error) {
      throw new InternalServerError('Something went wrong');
    }
  }
}

const orderService = new OrderService();
export default orderService;
