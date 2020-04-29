/**
 *
 * Inspections list
 *
 */
import React, { Fragment } from "react";

import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";
import InspectionList from "./InspectionList";
import MaintenanceList from "./MaintenanceList";
import CleaningList from "./CleaningList";
import { FormattedMessage } from "react-intl";
import { INSPECTION_JOB_TYPES } from "../constants";
import "./style.scss"

const PageTitleHeading = {
  "Inspection": "components.pageTitle.inspectionOverview",
  "Maintenance": "components.pageTitle.maintenanceOverview",
  "Cleaning": "components.pageTitle.cleaningOverview"
}
function Inspections(props) {
  const { jobType } = props;
  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id={PageTitleHeading[jobType] || "components.pageTitle.inspectionOverview"} />}
          icon="page-title-custom-icon nav-icon-inspections"
        />
        {
          jobType === INSPECTION_JOB_TYPES.INSPECTION ? <InspectionList {...props} />
          :  
          jobType === INSPECTION_JOB_TYPES.MAINTENANCE ? <MaintenanceList {...props}/>
          :
          jobType === INSPECTION_JOB_TYPES.CLEANING ? <CleaningList {...props}/>
          :
          null
        }
      </PageLayout>
    </Fragment>
  );
}

export default Inspections;
