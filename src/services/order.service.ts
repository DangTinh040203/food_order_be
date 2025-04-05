import { ORDER_STATUS } from '@/constants';
import { SOCKET_ACTIONS } from '@/constants/socket';
import {
  BadRequestError,
  ErrorResponse,
  InternalServerError,
} from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import billModel, { type Bill } from '@/models/bill.model';
import { type Food } from '@/models/food.model';
import orderModel, { type Order } from '@/models/order.model';
import orderTempModel, { type OrderTemp } from '@/models/orderTemp.model';
import rejectedOrderModel from '@/models/rejected-order.model';
import tableModel from '@/models/table.model';
import voucherModel from '@/models/voucher.model';
import SocketInstance from '@/services/socket.instance';

class OrderService {
  async get() {
    const orders = await orderModel.find();
    const bills = await billModel.find();
    const ordersTemp = await orderTempModel.find();
    return orders
      ? new OkResponse('Orders found', { bills, orders, ordersTemp })
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
        }),
        tableModel.findOneAndUpdate(
          { _id: items[0].tableId },
          { isAvailable: false },
          { new: true },
        ),
      ]);

      const newOrderTemp = await orderTempModel.create({
        orderId: newOrder._id,
        items: items.map((item) => ({
          foodId: item.food._id,
          price: item.food.price,
          quantity: item.quantity,
        })),
        messages: message,
      });

      console.log('newOrderTemp', newOrderTemp);

      const voucherId =
        voucher && voucher.code
          ? await voucherModel.findOne({
              code: voucher.code,
            })
          : null;

      const newBill = await billModel.create({
        totalPrice: 0,
        orderId: newOrder._id,
        voucherId: voucherId ? voucherId._id : null,
      });

      const io = SocketInstance.getIO();
      io.emit(SOCKET_ACTIONS.INSERT_ORDER, {
        bill: newBill,
        order: newOrder,
        newOrderTemp: newOrderTemp,
      });

      return new CreatedResponse('Order successful!', {
        bill: newBill,
        order: newOrder,
        newOrderTemp: newOrderTemp,
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

    const updatedBill = await billModel.findOneAndUpdate(
      { _id: billId },
      { new: true },
    );

    const updatedOrder = await orderTempModel.findOneAndUpdate(
      { orderId: orderId },
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

    // if (!updatedBill || !updatedOrder) {
    //   throw new BadRequestError('Order or bill not found');
    // }

    await rejectedOrderModel.findOneAndDelete({ orderId });

    return new OkResponse('Order has been successfully reordered', {
      updatedBill,
      updatedOrder,
    });
  }

  async updateStatus(orderId: string, status: ORDER_STATUS) {
    const orderedItem = (await orderTempModel.findOne({
      orderId,
    })) as OrderTemp;

    if (orderedItem) {
      const order = await orderModel.findOne({ _id: orderId });

      if (order) {
        await Promise.all(
          orderedItem.items.map(async (newItem) => {
            const existingItem = order.items.find((item) => {
              return item.foodId.toString() === newItem.foodId.toString();
            });

            console.log('existingItem', existingItem);

            if (existingItem) {
              await orderModel.updateOne(
                { _id: orderId, 'items.foodId': newItem.foodId },
                { $inc: { 'items.$.quantity': newItem.quantity } },
              );
            } else {
              await orderModel.updateOne(
                { _id: orderId },
                { $push: { items: newItem } },
              );
            }
          }),
        );

        await orderModel.updateOne(
          { _id: orderId },
          { $set: { status: status } },
        );
      } else {
        await orderModel.create({
          _id: orderId,
          items: orderedItem.items,
          status,
        });
      }

      const items = (await orderModel.findOne({ _id: orderId })) as Order;

      const billPrice = items.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      await billModel.findOneAndUpdate(
        { orderId },
        { totalPrice: billPrice },
        { upsert: true },
      );

      await orderTempModel.findOneAndDelete({ orderId });

      return new OkResponse('Updated status');
    }

    return new BadRequestError('Order not found');
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
      const order = (await orderModel.findOne({ _id: orderId })) as Order;

      await orderModel.findOneAndUpdate(
        { _id: orderId },
        {
          status: ORDER_STATUS.ORDERED,
        },
        { new: true },
      );

      const newBill = await billModel.findOne({ _id: billId });

      const newOrderTemp = await orderTempModel.findOneAndUpdate(
        { orderId: orderId },
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
        { new: true, upsert: true },
      );

      return new OkResponse('Order updated', { newBill, newOrderTemp });
    } catch (error) {
      throw new InternalServerError(`Something went wrong`);
    }
  }

  async getOrderById(orderId: string) {
    const data = await orderModel.findById(orderId);
    if (!data) {
      throw new BadRequestError('Order not found');
    }
    return new OkResponse('Order found', { data });
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
