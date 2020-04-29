/**
 * Form validations
 */

import * as Yup from "yup";

export const validationCostCenter = (intl) => {
  return Yup.object().shape(Object.assign(
    {
      name: Yup.string()
        .trim()
        .required(intl.formatMessage({id: "components.errors.name.require"})),
      costIdentifier: Yup.string()
        .trim()
        .required(intl.formatMessage({id: "components.errors.costIdentifier.require"}))
        .matches(/^PRP-\d{6}$/, intl.formatMessage({id: "components.errors.costIdentifier.match"})),
    }
  ));
};

export const validationCostType = (intl) => {
  return Yup.object().shape(Object.assign(
    {
      name: Yup.string()
        .trim()
        .required(intl.formatMessage({id: "components.errors.name.require"})),
      country: Yup.string()
        .trim()
        .required(intl.formatMessage({id: "components.errors.address.country.require"})),
      ledgerAccount: Yup.string()
        .trim()
        .required(intl.formatMessage({id: "components.errors.ledgerAccount.require"})),
      vattype: Yup.string()
        .trim()
        .required(intl.formatMessage({id: "components.errors.vatType.require"})),
    }
  ));
};

