import * as s from 'superstruct';

const { size, optional } = s;

export const CreateDto = s.object({
  name: size(s.string(), 1, 30),
  description: s.string(),
  price: s.number(),
  tags: s.array(s.string()),
});

export const UpdateDto = s.object({
  name: optional(size(s.string(), 1, 255)),
  description: optional(s.string()),
  price: optional(s.number()),
  tags: optional(s.array(s.string())),
});
