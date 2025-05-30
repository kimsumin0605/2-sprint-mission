import * as s from 'superstruct';

const { size } = s;

export const CreateArticleDto = s.object({
  title: size(s.string(), 1, 255),
  content: s.string(),
});

export const UpdateArticleDto = s.object({
  title: s.optional(size(s.string(), 1, 255)),
  content: s.optional(s.string()),
});

