import { object, string, ref } from 'yup';

const nameRegex =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

export const schema = object({
  firstName: string()
    .max(25, 'Your first name is too long')
    .matches(nameRegex, 'Please enter valid first name')
    .required('Please provide your first name'),
  lastName: string()
    .max(25, 'Your last name is too long')
    .matches(nameRegex, 'Please enter valid last name')
    .required('Please provide your last name'),
}).required();
