import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { likeService } from "../services/likeService";
import { ToggleLikeParamDto } from "../dtos/like.dto";

export class LikeController {
  async toggleProductLike(req: Request, res: Response) {
    const user = req.user!;
    const dto = plainToInstance(ToggleLikeParamDto, req.params);
    await validateOrReject(dto);

    const result = await likeService.toggleLike({
      userId: user.id,
      productId: dto.id,
    });

    res.status(200).json(result);
  }

  async toggleArticleLike(req: Request, res: Response) {
    const user = req.user!;
    const dto = plainToInstance(ToggleLikeParamDto, req.params);
    await validateOrReject(dto);

    const result = await likeService.toggleLike({
      userId: user.id,
      articleId: dto.id,
    });

    res.status(200).json(result);
  }

  async getLikedProducts(req: Request, res: Response) {
    const user = req.user!;
    const likes = await likeService.getLikedProductsByUser(user.id);
    res.json(likes);
  }

  async getLikedArticles(req: Request, res: Response) {
    const user = req.user!;
    const likes = await likeService.getLikedArticlesByUser(user.id);
    res.json(likes);
  }
}
