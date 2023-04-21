import { object, string } from 'yup';

export const schema = object({
  email: string().email().required(),
  password: string().min(6).required(),
}).required();
