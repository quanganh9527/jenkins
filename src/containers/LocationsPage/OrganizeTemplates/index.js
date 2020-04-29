/**
 *
 * Organize Templates
 *
 */
import React, { Fragment } from "react";

// ####
import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";
import { FormattedMessage } from "react-intl";
import InspectionTemplate from "./InspectionTemplate";
import "./styles.scss";

function OrganizeTemplates() {
  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.inspectionTemplate" />}
          icon="page-title-custom-icon nav-icon-locations"
        />
        <InspectionTemplate />
      </PageLayout>
    </Fragment>
  );
}

export default OrganizeTemplates;
