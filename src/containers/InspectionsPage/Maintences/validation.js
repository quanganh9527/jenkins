/**
 * Form validations
 */

import * as Yup from "yup";

export const validationInspectionMaintenance = (intl) => {
  // isEdited for add password validtion
  return Yup.object().shape(Object.assign(
    {
      location: Yup.string().required(intl.formatMessage({ id: "pages.maintenance.errors.location.require" })),
      inspector: Yup.string().required(intl.formatMessage({ id: "pages.maintenance.errors.mechanic.require" })),
      dateInspection: Yup.string().required(intl.formatMessage({ id: "pages.maintenance.errors.dateOfMaintenanceJob.require" })).nullable()
    }
  ));
};

export const validationMaintenanceReject = (intl) => {
  return Yup.object().shape({
    rejectMessage: Yup.string().required(intl.formatMessage({ id: "pages.maintenance.errors.message.require" }))
  });
}