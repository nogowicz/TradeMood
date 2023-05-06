import { object, string } from 'yup';

export const schema = object({
  newEmail: string()
    .email('Email is not valid')
    .required('Please provide your email'),
}).required();
