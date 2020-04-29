import moment from "moment";
const FORMAT_DATE = "DD/MM/YYYY";
export const debtorRentingContractsColumns = (intl) => {
  return [
    {
      dataField: "contractId",
      text: intl.formatMessage({
        id: "pages.contracts.table.column.debtorId",
      }),
      sort: true,
    },
    {
      dataField: "customer.name",
      text: intl.formatMessage({
        id: "pages.contracts.table.column.customer",
      }),
      sort: true,
    },
    {
      dataField: "locationIdentifier",
      text: intl.formatMessage({
        id: "pages.contracts.table.column.location",
      }),
      sort: true,
    },
    {
      dataField: "startDate",
      text: intl.formatMessage({
        id: "pages.contracts.table.column.startDate",
      }),
      formatter: (date) => moment(date).format(FORMAT_DATE),
      sort: true,
      style: {
        width: "130px",
      },
      headerStyle: {
        width: "130px",
      },
    },
    {
      dataField: "endDate",
      text: intl.formatMessage({
        id: "pages.contracts.table.column.endDate",
      }),
      formatter: (date) =>
        date && moment(date).isValid() ? moment(date).format(FORMAT_DATE) : "",
      sort: true,
      style: {
        width: "130px",
      },
      headerStyle: {
        width: "130px",
      },
    },
  ];
};

export const agreementTypeOptions = (intl) => [
  {
    value: "Service",
    label: intl.formatMessage({ id: "pages.contracts.agreementType.service" }),
  },
  {
    value: "Product",
    label: intl.formatMessage({ id: "pages.contracts.agreementType.product" }),
  },
  {
    value: "Accommodation",
    label: intl.formatMessage({
      id: "pages.contracts.agreementType.accomodation",
    }),
  },
];

export const costLineOptions = (intl) => [
  {
    value: "Periodic",
    label: intl.formatMessage({ id: "pages.contracts.periodic" }),
  },
  {
    value: "One-time",
    label: intl.formatMessage({ id: "pages.contracts.oneTime" }),
  },
  {
    value: "Deposit",
    label: intl.formatMessage({ id: "pages.contracts.deposit" }),
  },
];

export const periodOptions = (intl) => [
  { value: "Weekly", label: intl.formatMessage({ id: "pages.contracts.periodOptions.weekly" })},
  { value: "Four-weekly", label: intl.formatMessage({ id: "pages.contracts.periodOptions.fourEeekly" })},
  { value: "Monthly", label: intl.formatMessage({ id: "pages.contracts.periodOptions.monthly" }), },
];

export const routers = {
  Debtor: "/contracts/debtor-renting-contracts",
  Creator: "",
};

export const contractTranslate = {
  Debtor: {
    headingCreate: "pages.contracts.button.addDebtorRentingContact",
    headingDetail: "pages.contracts.button.debtorRentingContactDetails",
  },
  Creditor: {},
};
