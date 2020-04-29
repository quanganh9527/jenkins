/**
 * Form validations
 */

import * as Yup from "yup";

export const validationInspectionCleaning = (intl) => {
  // isEdited for add password validtion
  return Yup.object().shape(Object.assign(
    {
      location: Yup.string().required(intl.formatMessage({ id: "components.errors.location.require" })),
      inspector: Yup.string().required(intl.formatMessage({ id: "components.errors.cleaner.require" })),
      dateInspection: Yup.string().required(intl.formatMessage({ id: "components.errors.dateCleaning.require" })).nullable()
    }
  ));
};

export const validationCleaningReject = (intl) => {
  return Yup.object().shape({
    rejectMessage: Yup.string().required(intl.formatMessage({ id: "components.errors.message.require" }))
  });
}