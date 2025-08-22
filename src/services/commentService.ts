import { CommentRepository } from "../repositories/commentRepository";
import { ArticleRepository } from "../repositories/articleRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import { ForbiddenError } from "../lib/errors/BadRequestError";
import { NotificationService } from "../services/notificationService";

const commentRepository = new CommentRepository();
const articleRepository = new ArticleRepository();
const notificationService = new NotificationService();

export class CommentService {
  async createProductComment(input: {
    content: string;
    authorId: number;
    productId: number;
  }) {
    return commentRepository.createForProduct(input);
  }

  async createArticleComment(input: {
    content: string;
    authorId: number;
    articleId: number;
  }) {
    const comment = await commentRepository.createForArticle(input);

    const article = await articleRepository.getById(input.articleId);
    if (article?.authorId && article.authorId !== input.authorId) {
      await notificationService.createNotification(article.authorId, {
        type: "COMMENT",
        message: "게시글에 새 댓글을 남겼습니다.",
        data: JSON.stringify({
          articleId: input.articleId,
          commentId: comment.id,
        }),
      });
    }

    return comment;
  }

  async getCommentById(id: number) {
    const comment = await commentRepository.getById(id);
    if (!comment) throw new NotFoundError("Comment", id);
    return comment;
  }

  async getAllComments() {
    return commentRepository.getAll();
  }

  async updateComment(commentId: number, userId: number, content: string) {
    const comment = await commentRepository.getById(commentId);
    if (!comment) throw new NotFoundError("댓글", commentId);
    if (comment.authorId !== userId) {
      throw new ForbiddenError("댓글을 수정할 권한이 없습니다.");
    }

    return commentRepository.update(commentId, { content });
  }

  async deleteComment(id: number) {
    const comment = await commentRepository.getById(id);
    if (!comment) throw new NotFoundError("Comment", id);
    return commentRepository.deleteById(id);
  }
}
