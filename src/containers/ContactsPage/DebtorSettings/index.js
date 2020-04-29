import React, { memo } from "react";

// ###
import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";

import DebtorContact from "./DebtorContact";

import { FormattedMessage } from "react-intl";

function DebtorSettings() {
  return (
    <React.Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.debtorContact" />}
          icon="page-title-custom-icon nav-icon-contacts"
        />
        <DebtorContact />
      </PageLayout>
    </React.Fragment>
  );
}

export default memo(DebtorSettings);
