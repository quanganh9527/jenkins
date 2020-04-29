/**
 * Form validations
 */

import * as Yup from "yup";
import { find } from "lodash";
export const regexpNL = /^(?:NL-)?(\d{4})\s*([a-zA-Z]{2})$/i;
export const regexpG = /^[1-9][0-9]{4}$/i;

export const validationGrouping = (intl, isValidateAddress2, countryId1, countryId2, countries) => {
  let country1 = find(countries, item => item._id === countryId1);
  let country2 = find(countries, item => item._id === countryId2);
  const postalCodeValidation = Yup.string()
    .trim()
    .required(intl.formatMessage({ id: "components.errors.address.postalCode.require" }))

  const postalCodeNLValidation = Yup.string()
    .trim()
    .required(intl.formatMessage({ id: "components.errors.address.postalCode.require" }))
    .matches(
      regexpNL,
      intl.formatMessage({ id: "components.errors.address.postalCode.matchNL" })
    );
  const postalCodeGEValidation = Yup.string()
    .trim()
    .required(intl.formatMessage({ id: "components.errors.address.postalCode.require" }))
    .matches(
      regexpG,
      intl.formatMessage({ id: "components.errors.address.postalCode.matchDE" })
    );
    
  let regexPostcode1 = postalCodeValidation;
  let regexPostcode2 = postalCodeValidation;
  if (country1) {
    switch (country1.code) {
      case 'nl':
        regexPostcode1 = postalCodeNLValidation;
        break;
      case 'de':
        regexPostcode1 = postalCodeGEValidation;
        break;
      default:
        regexPostcode1 = postalCodeValidation;
        break;
    }
  }
  if (country2) {
    switch (country2.code) {
      case 'nl':
        regexPostcode2 = postalCodeNLValidation;
        break;
      case 'de':
        regexPostcode2 = postalCodeGEValidation;
        break;
      default:
        regexPostcode2 = postalCodeValidation;
        break;
    }
  }
  return Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: "components.errors.name.require" })),
    email: Yup.string()
      .required(intl.formatMessage({ id: "components.errors.email.require" }))
      .email(intl.formatMessage({ id: "components.errors.email.invalid" })),
    phoneNumber1: Yup.string().required(intl.formatMessage({ id: "components.errors.phoneNumber1.require" })),
    address1: Yup.object().shape({
      street: Yup.string().required(intl.formatMessage({ id: "components.errors.address.street.require" })),
      number: Yup.string().required(intl.formatMessage({ id: "components.errors.address.number.require" })),
      city: Yup.string().required(intl.formatMessage({ id: "components.errors.address.city.require" })),
      postalCode: regexPostcode1,
      region: Yup.string().required(intl.formatMessage({ id: "components.errors.address.region.require" })),
      country: Yup.string().required(intl.formatMessage({ id: "components.errors.address.country.require" })),
    }),
    address2: Yup.object().shape(
      isValidateAddress2
        ? {
          postalCode: regexPostcode2
        }
        : {},
    ),
  });
};

export const validationPerson = (intl, isValidateAddress2, countryId1, countryId2, countries) => {
  let country1 = find(countries, item => item._id === countryId1);
  const postalCodeValidation = Yup.string()
  .trim()
  .required(intl.formatMessage({ id: "components.errors.address.postalCode.require" }))

const postalCodeNLValidation = Yup.string()
  .trim()
  .required(intl.formatMessage({ id: "components.errors.address.postalCode.require" }))
  .matches(
    regexpNL,
    intl.formatMessage({ id: "components.errors.address.postalCode.matchNL" })
  );
const postalCodeGEValidation = Yup.string()
  .trim()
  .required(intl.formatMessage({ id: "components.errors.address.postalCode.require" }))
  .matches(
    regexpG,
    intl.formatMessage({ id: "components.errors.address.postalCode.matchDE" })
  );
  
let regexPostcode1 = postalCodeValidation;
let regexPostcode2 = postalCodeValidation;
if (country1) {
  switch (country1.code) {
    case 'nl':
      regexPostcode1 = postalCodeNLValidation;
      break;
    case 'de':
      regexPostcode1 = postalCodeGEValidation;
      break;
    default:
      regexPostcode1 = postalCodeValidation;
      break;
  }
}

  return Yup.object().shape(
    Object.assign({
      firstName: Yup.string().required(intl.formatMessage({ id: "components.errors.firstName.require" })),
      lastName: Yup.string().required(intl.formatMessage({ id: "components.errors.lastName.require" })),
      email: Yup.string()
        .required(intl.formatMessage({ id: "components.errors.email.require" }))
        .email(intl.formatMessage({ id: "components.errors.email.invalid" })),
      phoneNumber1: Yup.string().required(intl.formatMessage({ id: "components.errors.phoneNumber1.require" })),
      address1: Yup.object().shape({
        street: Yup.string().required(intl.formatMessage({ id: "components.errors.address.street.require" })),
        number: Yup.string().required(intl.formatMessage({ id: "components.errors.address.number.require" })),
        city: Yup.string().required(intl.formatMessage({ id: "components.errors.address.city.require" })),
        postalCode: regexPostcode1,
        region: Yup.string().required(intl.formatMessage({ id: "components.errors.address.region.require" })),
        country: Yup.string().required(intl.formatMessage({ id: "components.errors.address.country.require" })),
      }),
      address2: Yup.object().shape(
        isValidateAddress2
          ? {
            postalCode: regexPostcode2,
          }
          : {},
      ),
    }),
  );
};

export const validationDebtorContact = (intl) => {
  return Yup.object().shape(
    Object.assign({
      paymentTerm: Yup.number()
        .typeError(intl.formatMessage({ id: "components.errors.paymentTerm.number" }))
        .min(0, intl.formatMessage({ id: "components.errors.paymentTerm.min" })),
      accountView: Yup.string()
        .trim()
        .required(intl.formatMessage({ id: "components.errors.accountView.require" }))
        .matches(
          /^CON-\d{5}$/,
          intl.formatMessage({ id: "components.errors.accountView.match" }),
        ),
    }),
  );
};
