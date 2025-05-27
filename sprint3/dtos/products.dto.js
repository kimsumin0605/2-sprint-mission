import { object, string, size, number, array, optional} from "superstruct";


export const CreateDto = object({
    name: size(string(), 1, 30),
    description: string(),
    price: number().min(0),
    tags: array(string()),
});

export const UpdateDto = object({
  name: optional(size(string(), 1, 255)),
  description: optional(string()),
  price: optional(number().min(0)),
  tags: optional(array(string())),
});

