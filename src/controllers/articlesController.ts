import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { ArticleService } from "../services/articleService";
import {
  CreateArticleDto,
  UpdateArticleDto,
  GetArticleListDto,
} from "../dtos/article.dto";

const articleService = new ArticleService();

export class ArticleController {
  async create(req: Request, res: Response) {
    const user = req.user!;
    const dto = plainToInstance(CreateArticleDto, req.body);
    await validateOrReject(dto);

    const article = await articleService.create({
      ...dto,
      author: { connect: { id: user.id } },
    });

    res.status(201).json(article);
  }

  async getOne(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    const article = await articleService.getById(id, userId);
    res.json(article);
  }

  async getList(req: Request, res: Response) {
    const dto = plainToInstance(GetArticleListDto, req.query);
    await validateOrReject(dto);
    const list = await articleService.getList(dto);
    res.json(list);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const dto = plainToInstance(UpdateArticleDto, req.body);
    await validateOrReject(dto);
    const user = req.user!;

    const updated = await articleService.update(id, dto, user.id);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const user = req.user!;
    await articleService.delete(id, user.id);
    res.status(204).send();
  }
}
