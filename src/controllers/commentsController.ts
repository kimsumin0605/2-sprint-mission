import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { CommentService } from "../services/commentService";
import { CreateCommentDto, UpdateCommentDto } from "../dtos/comment.dto";

const commentService = new CommentService();

export class CommentController {
  async createProductComment(req: Request, res: Response) {
    const user = req.user!;
    const { id } = req.params;

    const dto = plainToInstance(CreateCommentDto, req.body);
    await validateOrReject(dto);

    const comment = await commentService.createProductComment({
      content: dto.content,
      authorId: user.id,
      productId: parseInt(id, 10),
    });

    res.status(201).json(comment);
  }

  async createArticleComment(req: Request, res: Response) {
    const user = req.user!;
    const { id } = req.params;

    const dto = plainToInstance(CreateCommentDto, req.body);
    await validateOrReject(dto);

    const comment = await commentService.createArticleComment({
      content: dto.content,
      authorId: user.id,
      articleId: parseInt(id, 10),
    });

    res.status(201).json(comment);
  }

  async getCommentList(req: Request, res: Response) {
    const comments = await commentService.getAllComments();
    res.json(comments);
  }

  async updateComment(req: Request, res: Response) {
    const user = req.user!;
    const { id } = req.params;

    const dto = plainToInstance(UpdateCommentDto, req.body);
    await validateOrReject(dto);

    const comment = await commentService.updateComment(
      parseInt(id, 10),
      user.id,
      dto.content
    );

    res.status(200).json(comment);
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;
    await commentService.deleteComment(parseInt(id, 10));
    res.status(204).send();
  }
}
