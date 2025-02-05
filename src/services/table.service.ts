import { type Request } from 'express';
import { type Types } from 'mongoose';

import { NotFoundError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import tableModel, { type Table } from '@/models/table.model';

class TableService {
  async get(req: Request) {
    const tables = await tableModel.find();
    return new OkResponse('Tables found successfully', tables);
  }

  async insert(payload: Omit<Table, 'id'>) {
    const tables = await tableModel.create(payload);
    return new CreatedResponse('Tables created successfully', tables);
  }

  async delete(id: Types.ObjectId) {
    const tables = await tableModel.findByIdAndDelete(id);
    if (!tables) throw new NotFoundError('Tables not found');
    return new OkResponse('tables deleted successfully', tables);
  }

  async update(foodId: Types.ObjectId, payload: Partial<Table>) {
    const table = await tableModel.findByIdAndUpdate(foodId, payload, {
      new: true,
    });

    if (!table) throw new NotFoundError('Tables not found');
    return new OkResponse('Tables updated successfully', table);
  }
}

const tableService = new TableService();
export default tableService;
