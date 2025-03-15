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
import { convertObjectId } from '@/utils/convertObjectId';

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

  async insertOrder(payload: {
    items: Array<{
      food: Food;
      tableId: string;
      quantity: number;
    }>;
    voucher: {
      code: string;
    };
    message: string;
  }) {
    const { items, voucher, message } = payload;

    try {
      if (items.length === 0) {
        throw new BadRequestError('No items to order');
      }
      const [newOrder] = await Promise.all([
        orderModel.create({
          tableId: items[0].tableId,
          items: items.map((item) => ({
            foodId: item.food._id,
            price: item.food.price,
            quantity: item.quantity,
          })),
          messages: message,
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
      await rejectedOrderModel.create({
        orderId,
        reason,
      });

      return new OkResponse('Rejected Order');
    } catch (error) {
      throw new InternalServerError('Something went wrong!');
    }
  }

  async getRejectedOrder() {
    const rejectedOrders = await rejectedOrderModel.find();
    return rejectedOrders
      ? new OkResponse('Rejected Orders found', { rejectedOrders })
      : new OkResponse('No rejected orders found');
  }

  async deleteRejectedOrder() {
    await rejectedOrderModel.deleteMany();
    return new OkResponse('All rejected orders deleted');
  }

  async reOrder(
    billId: string,
    orderId: string,
    payload: {
      items: Array<{
        food: Food;
        quantity: number;
        tableId: string;
      }>;
      message: string;
    },
  ) {
    const { items, message } = payload;

    const rejectedOrder = await rejectedOrderModel.findOne({ orderId });
    if (!rejectedOrder) {
      throw new BadRequestError('Rejected order not found');
    }

    if (items.length === 0) {
      throw new BadRequestError('No items to reorder');
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0,
    );

    const updatedBill = await billModel.findOneAndUpdate(
      { _id: billId },
      { totalPrice },
      { new: true },
    );

    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId },
      {
        items: items.map((item) => ({
          foodId: item.food._id,
          price: item.food.price,
          quantity: item.quantity,
        })),
        $push: { messages: message },
      },
      { new: true },
    );

    if (!updatedBill || !updatedOrder) {
      throw new BadRequestError('Order or bill not found');
    }

    await rejectedOrderModel.findOneAndDelete({ orderId });

    return new OkResponse('Order has been successfully reordered', {
      updatedBill,
      updatedOrder,
    });
  }

  async updateStatus(orderId: string, status: ORDER_STATUS) {
    await orderModel.findOneAndUpdate({ _id: orderId }, { status: status });
    return new OkResponse('Updated status');
  }

  async updateOrder(
    billId: string,
    orderId: string,

    payload: {
      items: Array<{
        food: Food;
        quantity: number;
        tableId: string;
      }>;
      message: string;
    },
  ) {
    const { items, message } = payload;

    try {
      if (items.length === 0) {
        throw new BadRequestError('No items to order');
      }

      //check quantity current if less than old quantity ordered before then throw error
      const order = (await orderModel.findOne({ _id: orderId })) as Order;
      const oldQuantityItems = order.items.map((item) => {
        return {
          foodId: item.foodId,
          quantity: item.quantity,
        };
      });
      const isLessQuantity = items.some((item) => {
        const oldQuantityItem = oldQuantityItems.find((oldItem) => {
          return oldItem.foodId.toString() === item.food._id.toString();
        });
        return oldQuantityItem && oldQuantityItem.quantity > item.quantity;
      });

      if (isLessQuantity) {
        throw new BadRequestError('Cannot reduce quantity');
      }

      const priceForNewFoods = items.reduce((sum, item) => {
        return sum + item.food.price * item.quantity;
      }, 0);

      //Adding message to bill
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
          status: ORDER_STATUS.ORDERED,
          $push: {
            messages: message,
          },
        },
        { new: true },
      );

      if (newBill == null || newOrder == null) {
        throw new BadRequestError('Order not found');
      }

      return new OkResponse('Order updated', { newBill, newOrder });
    } catch (error) {
      throw new InternalServerError(`Something went wrong`);
    }
  }

  async CompleteOrder(billId: string, orderId: string) {
    await Promise.all([
      billModel.findOneAndUpdate(
        { _id: billId },
        { isPaid: true },
        { new: true },
      ),
      orderModel.findOneAndUpdate(
        { _id: orderId },
        { status: ORDER_STATUS.DONE },
        { new: true },
      ),
    ]);

    const tableId = ((await orderModel.findOne({ _id: orderId })) as Order)
      .tableId;
    await tableModel.findOneAndUpdate(
      { _id: tableId },
      { isAvailable: true },
      { new: true },
    );
    return new OkResponse('Order completed');
  }
}

const orderService = new OrderService();
export default orderService;
