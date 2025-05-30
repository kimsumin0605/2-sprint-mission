import * as s from 'superstruct';

const BoardType = s.enums(['product', 'article']);

export const CreateCommentDto = s.object({
  content: s.size(s.string(), 1, 300),
  boardType: BoardType,
  productId: s.optional(s.number()),
  articleId: s.optional(s.number()),
});
