import { FormattedMessage } from 'react-intl';
import { object, string, ref } from 'yup';

export const schema = object({
  firstName: string()
    .max(25, 'Your first name is too long')
    .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Please enter valid name')
    .required('Please provide your first name'),
  lastName: string()
    .max(25, 'Your first name is too long')
    .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Please enter valid name')
    .required('Please provide your last name'),
  email: string()
    .email('Email is not valid')
    .required('Please provide your email'),
  password: string()
    .min(6, 'Password must be at lest 6 characters')
    .required('Please provide your password'),
  confirmPassword: string()
    .min(6, 'Password must be at lest 6 characters')
    .oneOf([ref('password')], 'Password must match')
    .required('Password must match'),
}).required();
