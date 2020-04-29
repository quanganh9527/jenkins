/**
 *
 * Inspections list
 *
 */
import React, { Fragment, useRef } from "react";

import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";
import CostLineCreate from "./CostLineCreate";

import { FormattedMessage, injectIntl } from "react-intl";

function CustomCostLine({ intl }) {
  const childRef = useRef();

  const handleSubmit = () => {
    // call child submit form
    childRef.current.handleSubmitForm();
  }

  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.customCostLine" />}
          icon="page-title-custom-icon nav-icon-inspections"
          hasAddNew={true}
          hasAddNewText={<FormattedMessage id="components.button.create" />}
          callFunction={() => {
            handleSubmit();
          }}
        />
        <CostLineCreate
          ref={childRef}
          intl={intl}
        />
      </PageLayout>
    </Fragment>
  );
}

export default injectIntl(CustomCostLine);
