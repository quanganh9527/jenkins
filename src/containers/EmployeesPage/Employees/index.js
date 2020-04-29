/**
 *
 * Employees list
 *
 */
import React, { Fragment } from "react";

import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";
import EmployeeList from "./EmployeeList";
import { FormattedMessage } from "react-intl";
// styles
import "../styles.scss";
function Employees() {
  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.employeeAccounts" />}
          icon="pe-7s-users icon-gradient page-title-custom-icon"
        />
        <EmployeeList />
      </PageLayout>
    </Fragment>
  );
}

export default Employees;
