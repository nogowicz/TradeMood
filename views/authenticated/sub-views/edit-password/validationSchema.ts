import { object, string, ref } from 'yup';

export const schema = object({
  newPassword: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please provide your password'),
  confirmNewPassword: string()
    .min(6, 'Password must be at least 6 characters')
    .oneOf([ref('newPassword')], 'Password must match')
    .required('Password must match'),
}).required();
