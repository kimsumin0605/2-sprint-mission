import { object, string, size, optional } from "superstruct";

export const CreateArticleDto = object({
  title: size(string(), 1, 255),
  content: string(),
});

export const UpdateArticleDto = object({
  title: optional(size(string(), 1, 255)),
  content: optional(string()),
});

