/**
 * Form validations
 */

import * as Yup from "yup";

export const validationLogin = () => {
  return Yup.object().shape({
    identifier: Yup.string().required("Username or email is required."),
    password: Yup.string().required("Password is required.")
  });
};
