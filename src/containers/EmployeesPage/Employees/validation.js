/**
 * Form validations
 */

import * as Yup from "yup";

export const validationResetPassword = (intl) => {
  return Yup.object().shape({
    resetPassword: Yup.string()
      .required(intl.formatMessage({ id: "components.errors.newPassword.require" }))
      .min(6, intl.formatMessage({ id: "components.errors.newPassword.min" }))
  });
};
