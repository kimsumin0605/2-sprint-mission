export type CreateCommentInput = {
  content: string;
  authorId: number;
  productId?: number;
  articleId?: number;
}