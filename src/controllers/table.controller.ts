import { type Request, type Response } from 'express';

import { type Table } from '@/models/table.model';
import tableService from '@/services/table.service';
import { convertObjectId } from '@/utils/convertObjectId';

class TableController {
  async get(req: Request, res: Response) {
    res.send(await tableService.get(req));
  }

  async insert(req: Request, res: Response) {
    const payload: Omit<Table, 'id'> = req.body;
    res.send(await tableService.insert(payload));
  }

  async update(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    const payload: Partial<Table> = req.body;
    res.send(await tableService.update(id, payload));
  }

  async delete(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    res.send(await tableService.delete(id));
  }
}

const foodController = new TableController();
export default foodController;
