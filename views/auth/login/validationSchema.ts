import { object, string } from 'yup';

export const schema = object({
  email: string()
    .email('Email is not valid')
    .required('Please provide your email'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please provide your password'),
}).required();
