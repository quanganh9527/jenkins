/**
 * Form validations
 */

import * as Yup from "yup";

export const validationLocation = intl => {
  return Yup.object().shape({
    street: Yup.string().required(
      intl.formatMessage({ id: "components.errors.address.region.require" }),
    ),
    number: Yup.string().required(
      intl.formatMessage({ id: "components.errors.address.number.require" }),
    ),
    postalCode: Yup.string()
      .trim()
      .required("Postal code is required12345."),
    city: Yup.string().required(
      intl.formatMessage({ id: "components.errors.address.city.require" }),
    ),
    regionSelect: Yup.string().required(
      intl.formatMessage({ id: "components.errors.address.country.require" }),
    ),
    countrySelect: Yup.string().required(
      intl.formatMessage({ id: "components.errors.costCenter.require" }),
    ),
    costcenterSelect: Yup.string().required(
      intl.formatMessage({ id: "components.errors.address.street.require" }),
    ),
  });
};

export const postalCodeRequired = intl => {
  return {
    required: intl.formatMessage({
      id: "components.errors.address.postalCode.require",
    }),
  };
};
export const postalCodeNlValidation = intl => {
  return {
    required: intl.formatMessage({
      id: "components.errors.address.postalCode.require",
    }),
    pattern: {
      value: /^(?:NL-)?(\d{4})\s*([a-zA-Z]{2})$/i,
      message: intl.formatMessage({
        id: "components.errors.address.postalCode.matchNL",
      }),
    },
  };
};

export const postalCodeDEValidation = intl => {
  return {
    required: intl.formatMessage({
      id: "components.errors.address.postalCode.require",
    }),
    pattern: {
      value: /^[1-9][0-9]{4}$/i,
      message: intl.formatMessage({
        id: "components.errors.address.postalCode.matchDE",
      }),
    },
  };
};
