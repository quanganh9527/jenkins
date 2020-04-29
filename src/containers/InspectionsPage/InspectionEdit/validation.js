/**
 * Form validations
 */

import * as Yup from "yup";

export const validationInspection = (intl) => {
  // isEdited for add password validtion
  return Yup.object().shape({
    location: Yup.string().required(intl.formatMessage({ id: "components.errors.location.require" })),
    inspector: Yup.string().required(intl.formatMessage({ id: "components.errors.inspector.require" })),
    dateInspection: Yup.string().required(intl.formatMessage({ id: "components.errors.dateInspection.require" })).nullable(),
    type: Yup.string().required(intl.formatMessage({ id: "components.errors.type.require" }))
  });
};


export const validationInspectionReject = (intl) => {
  return Yup.object().shape({
    rejectMessage: Yup.string().required(intl.formatMessage({ id: "components.errors.message.require" }))
  });
}

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