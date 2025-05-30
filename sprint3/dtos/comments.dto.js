import * as s from 'superstruct';


export const CreateCommentDto = s.object({
  content: s.size(s.string(), 1, 300),
  boardType: BoardType,
  productId: s.optional(s.number()),
  articleId: s.optional(s.number()),
});
