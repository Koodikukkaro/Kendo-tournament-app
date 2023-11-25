import { type RegisterFormData } from "./Registration";

const validateEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-åäöÅÄÖ]+@[a-zA-Z0-9.-åäöÅÄÖ]+\.[a-zA-ZåäöÅÄÖ]{2,}$/.test(
    email
  );
};

export const isValidEmail = ({ email }: RegisterFormData): boolean => {
  return validateEmail(email);
};

export const isValidGuardianEmail = ({
  guardiansEmail
}: RegisterFormData): boolean => {
  return guardiansEmail !== undefined && validateEmail(guardiansEmail);
};

export const isValidPhone = ({ phoneNumber }: RegisterFormData): boolean => {
  return /^[0-9]{10,15}$/.test(phoneNumber);
};

export const isValidPassword = ({ password }: RegisterFormData): boolean => {
  return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,30})$/.test(password);
};

export const isValidUsername = ({ userName }: RegisterFormData): boolean => {
  if (userName === undefined || userName === "") {
    return true;
  }

  return (
    userName === undefined ||
    /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._åäöÅÄÖ]+(?<![_.])$/.test(
      userName
    )
  );
};

export const doPasswordsMatch = ({
  password,
  passwordConfirmation
}: RegisterFormData): boolean => {
  return password === passwordConfirmation;
};

export const isEmptyTextField = (fieldValue?: string): boolean => {
  return fieldValue === undefined || fieldValue.trim() === "";
};
