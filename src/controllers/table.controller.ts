import { type Request, type Response } from 'express';

import { type Table } from '@/models/table.model';
import tableService from '@/services/table.service';
import { convertObjectId } from '@/utils/convertObjectId';

class TableController {
  async get(req: Request, res: Response) {
    res.send(await tableService.get(req));
  }

  async insertTable(req: Request, res: Response) {
    const payload: Omit<Table, 'id'> = req.body;
    res.send(await tableService.insertTable(payload));
  }

  async updateTable(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    const payload: Partial<Table> = req.body;
    res.send(await tableService.updateTable(id, payload));
  }

  async deleteTable(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    res.send(await tableService.deleteTable(id));
  }
}

const foodController = new TableController();
export default foodController;
