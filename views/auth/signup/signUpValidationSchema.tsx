import { object, string } from "yup";

export const schema = object({
    firstName: string()
        .max(25)
        // .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Please enter valid name')
        .required(),
    lastName: string()
        .max(25)
        .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Please enter valid name')
        .required(),
    // email: string().email().required(),
    // password: string().min(6).required(),
    // //@ts-ignore
    // confirmPassword: string().min(6).oneOf([ref('password'), null], 'Password must match').required(),
}).required();