/**
 *
 * Locations list
 *
 */
import React, { Fragment } from "react";

import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";
import LocationList from "./List";

import { FormattedMessage } from "react-intl";

function Locations() {
  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.locationsOverview" />}
          icon="page-title-custom-icon nav-icon-locations"
        />
        <LocationList />
      </PageLayout>
    </Fragment>
  );
}

export default Locations;
