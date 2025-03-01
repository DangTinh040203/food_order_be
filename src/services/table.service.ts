import { type Request } from 'express';
import { type Types } from 'mongoose';

import { SOCKET_ACTIONS } from '@/constants/socket';
import { NotFoundError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import tableModel, { type Table } from '@/models/table.model';
import SocketInstance from '@/services/socket.instance';

class TableService {
  async get(req: Request) {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page as string);
    limit = parseInt(limit as string);

    const options = {
      page,
      limit,
      sort: { createAt: -1 },
    };

    const tables = await tableModel.paginate({}, options);
    return new OkResponse('Tables found successfully', tables);
  }

  async insertTable(payload: Omit<Table, 'id'>) {
    const tables = await tableModel.create(payload);
    const io = SocketInstance.getIO();
    io.emit(SOCKET_ACTIONS.INSERT_TABLE, tables);
    return new CreatedResponse('Tables created successfully', tables);
  }

  async deleteTable(id: Types.ObjectId) {
    const tables = await tableModel.findByIdAndDelete(id);
    if (!tables) throw new NotFoundError('Tables not found');
    return new OkResponse('tables deleted successfully', tables);
  }

  async updateTable(foodId: Types.ObjectId, payload: Partial<Table>) {
    const table = await tableModel.findByIdAndUpdate(foodId, payload, {
      new: true,
    });

    if (!table) throw new NotFoundError('Tables not found');
    return new OkResponse('Tables updated successfully', table);
  }
}

const tableService = new TableService();
export default tableService;
