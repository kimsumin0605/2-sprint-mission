import { object, string, size, pattern, optional } from 'superstruct';

export const RegisterUserStruct = object({
  email: pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  nickname: size(string(), 2, 10),
  password: size(string(), 6, 15),
});

export const ChangePasswordStruct = object({
  currentPassword: size(string(), 6, 20),
  newPassword: size(string(), 6, 20),
});

export const UpdateUserStruct = object({
  ninkname: optional(size(string(), 2, 10)),
  image: optional(string()),
});