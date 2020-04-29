/**
 *
 * Contacts list
 *
 */
import React, { Fragment } from "react";

// ####
import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";

// ###
import PeopleList from "./PeopleList";

import { FormattedMessage } from "react-intl";

function Contacts() {
  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.peopleOverview" />}
          icon="page-title-custom-icon nav-icon-contacts"
          hasAddNew={true}
          hasAddNewText={<FormattedMessage id="components.button.addNew" />}
          addNewLink="/contacts/people/new"
        />
        <PeopleList />
      </PageLayout>
    </Fragment>
  );
}

export default Contacts;
