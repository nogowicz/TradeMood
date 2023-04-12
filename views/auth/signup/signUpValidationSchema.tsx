import { object, string } from "yup";

export const schema = object({
    firstName: string()
        .max(25, 'Your first name is too long')
        .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Please enter valid name')
        .required('Please provide your first name'),
    lastName: string()
        .max(25, 'Your first name is too long')
        .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Please enter valid name')
        .required('Please provide your last name'),
    // email: string().email().required(),
    // password: string().min(6).required(),
    // //@ts-ignore
    // confirmPassword: string().min(6).oneOf([ref('password'), null], 'Password must match').required(),
}).required();