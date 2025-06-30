import { object, string, size, pattern } from 'superstruct';

export const RegisterUserStruct = object({
  email: pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/), 
  nickname: size(string(), 2, 10),
  password: size(string(), 6, 15),
});
