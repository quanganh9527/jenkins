export const inspectionSchedulersColums = (intl) => {
  return [
    {
      dataField: "id",
      text: intl.formatMessage({
        id: "pages.inspectionScheduler.table.schedulerIdentifier",
      }),
      sort: true,
    },
    {
      dataField: "locationName",
      text: intl.formatMessage({
        id: "pages.inspectionScheduler.table.locationName",
      }),
      sort: true,
    },
    {
      dataField: "unitName",
      text: intl.formatMessage({
        id: "pages.inspectionScheduler.table.unitName",
      }),
      sort: true,
    },
    {
      dataField: "subUnitName",
      text: intl.formatMessage({
        id: "pages.inspectionScheduler.table.subUnitName",
      }),
      sort: true,
    },
    {
      dataField: "inspector",
      text: intl.formatMessage({
        id: "pages.inspectionScheduler.table.inspector",
      }),
      sort: true,
    },
    {
      dataField: "startFrom",
      text: intl.formatMessage({
        id: "pages.inspectionScheduler.table.startFrom",
      }),
      sort: true,
    },
  ];
};
