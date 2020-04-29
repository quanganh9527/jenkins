/**
 * Form validations
 */

import * as Yup from "yup";

export const validationCreateAccount = (intl, isEdited) => {
  // isEdited for add password validtion
  return Yup.object().shape(Object.assign(
    {
      firstName: Yup.string().required(intl.formatMessage({ id: "components.errors.firstName.require" })),
      lastName: Yup.string().required(intl.formatMessage({ id: "components.errors.lastName.require" })),
      genderSelect: Yup.string().required(intl.formatMessage({ id: "components.errors.gender.require" })),
      languageSelect: Yup.string().required(intl.formatMessage({ id: "components.errors.language.require" })),
      email: Yup.string()
        .required(intl.formatMessage({ id: "components.errors.email.require" }))
        .email(intl.formatMessage({ id: "components.errors.email.invalid" })),
      phoneNumber1: Yup.string().required(intl.formatMessage({ id: "components.errors.phoneNumber1.require" })),
      username: Yup.string()
        .required(intl.formatMessage({ id: "components.errors.username.require" }))
        .min(5, intl.formatMessage({ id: "components.errors.username.min" }))
        .max(255, intl.formatMessage({ id: "components.errors.username.max" }))
    },
    !isEdited ? {
      password: Yup.string()
        .required(intl.formatMessage({ id: "components.errors.password.require" }))
        .min(6, intl.formatMessage({ id: "components.errors.password.min" }))
    } : {},
    { rolesSelect: Yup.string().required(intl.formatMessage({ id: "components.errors.roles.require" })), }
  ));
};
