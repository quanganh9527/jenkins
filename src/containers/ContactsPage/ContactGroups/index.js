/**
 *
 * Contact groups
 *
 */
import React, { Fragment } from "react";

// ###
import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";

// ####
import GroupList from "./GroupList";

import { FormattedMessage } from "react-intl";

function ContactGroups() {
  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.groupingsOverview" />}
          icon="page-title-custom-icon nav-icon-contacts"
          hasAddNew={true}
          hasAddNewText={<FormattedMessage id="components.button.addNew" />}
          addNewLink="/contacts/group/new"
        />
        <GroupList />
      </PageLayout>
    </Fragment>
  );
}

export default ContactGroups;
