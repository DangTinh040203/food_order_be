import { type Request, type Response } from 'express';

import { type Food } from '@/models/food.model';
import foodService from '@/services/food.service';
import { convertObjectId } from '@/utils/convertObjectId';

class FoodController {
  async get(req: Request, res: Response) {}

  async insert(req: Request, res: Response) {
    const payload: Omit<Food, 'id'> = req.body;
    console.log('🚀 ~ FoodController ~ insert ~ payload:', payload);
    res.send(await foodService.insert(payload));
  }

  async update(req: Request, res: Response) {}

  async delete(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    res.send(await foodService.delete(id));
  }
}

const foodController = new FoodController();
export default foodController;
