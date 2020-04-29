import React, { Fragment } from "react";
// ###
import PageLayout from "../../components/PageLayout";
import PageTitle from "../../components/PageTitle";
import { FormattedMessage } from "react-intl";

function Dashboard() {
  return (
    <Fragment>
      <PageLayout
      >
        <PageTitle
          heading={<FormattedMessage id="pages.home.title" />} 
          icon="page-title-custom-icon nav-icon-home"
        />
        <div className="not-found-page-content">
          <h4 className="content"><FormattedMessage id="pages.home.content" /></h4>
        </div>
      </PageLayout>
    </Fragment>
  );
}

export default Dashboard;
