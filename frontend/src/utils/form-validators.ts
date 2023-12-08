export const isValidUsername = (userName: string): boolean => {
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
export const isValidPassword = (password: string): boolean => {
  return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,30})$/.test(password);
};

export const isValidPhone = (phoneNumber: string): boolean => {
  return /^[0-9]{10,15}$/.test(phoneNumber);
};
