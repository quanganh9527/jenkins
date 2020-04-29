/**
 * Form validations
 */
import * as Yup from "yup";
import { yupUtils } from "../../utilities";

const { equalTo } = yupUtils;

const validationUpdatePassword = (intl) => {
  Yup.addMethod(Yup.string, "equalTo", equalTo);

  return Yup.object().shape({
    newPassword: Yup.string()
      .required(intl.formatMessage({ id: "components.errors.newPassword.require" }))
      .min(6, intl.formatMessage({ id: "components.errors.newPassword.min" })),
    newPasswordConfirm: Yup.string()
      .required(intl.formatMessage({ id: "components.errors.newPasswordConfirm.require" }))
      .equalTo(Yup.ref("newPassword"), intl.formatMessage({ id: "components.errors.newPasswordConfirm.match" })),
  });
};

const validationUpdateProfile = (intl) => {
  return Yup.object().shape(Object.assign(
    {
      firstName: Yup.string().required(intl.formatMessage({ id: "components.errors.firstName.require" })),
      lastName: Yup.string().required(intl.formatMessage({ id: "components.errors.lastName.require" })),
      gender: Yup.string().required(intl.formatMessage({ id: "components.errors.gender.require" })),
      username: Yup.string()
        .required(intl.formatMessage({ id: "components.errors.username.require" }))
        .min(5, intl.formatMessage({ id: "components.errors.username.min" }))
        .max(255, intl.formatMessage({ id: "components.errors.username.max" })),
      email: Yup.string()
        .required(intl.formatMessage({ id: "components.errors.email.require" }))
        .email(intl.formatMessage({ id: "components.errors.email.invalid" }))
    }
  ));
};

export {
  validationUpdatePassword,
  validationUpdateProfile
}