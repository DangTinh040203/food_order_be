import { type Request, type Response } from 'express';

import { type Food } from '@/models/food.model';
import foodService from '@/services/food.service';
import { UploadService } from '@/services/upload.service';
import { convertObjectId } from '@/utils/convertObjectId';

const uploadService = new UploadService();

class FoodController {
  async get(req: Request, res: Response) {
    res.send(await foodService.get(req));
  }

  async getById(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    res.send(await foodService.getById(id));
  }

  async insertFood(req: Request, res: Response) {
    const payload: Omit<Food, 'id'> = req.body;
    res.send(await foodService.insertFood(payload));
  }

  async updateFoodAvailability(req: Request, res: Response) {
    const id = req.params.id;
    const { isAvailable } = req.body as { isAvailable: boolean };
    res.send(await foodService.updateFoodAvailability(id, isAvailable));
  }

  async updateFood(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    const payload: Partial<Food> = req.body;
    res.send(await foodService.updateFood(id, payload));
  }

  async deleteFood(req: Request, res: Response) {
    const id = convertObjectId(req.params.id);
    res.send(await foodService.deleteFood(id));
  }

  async uploadFoodThumbnail(req: Request, res: Response) {
    const thumbnail = req.file;
    res.send(
      await uploadService.uploadImageFromLocal(
        thumbnail as Express.Multer.File,
      ),
    );
  }
}

const foodController = new FoodController();
export default foodController;
