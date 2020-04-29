/**
 *
 * Invoices book
 *
 */
import React, { Fragment } from "react";

import PageLayout from "../../../components/PageLayout";

function InvoicesBook() {
  return (
    <Fragment>
      <PageLayout
        pageTitleProps={{
          heading: "Book Invoices",
          subheading:
            "Yet another dashboard built using only the included Architech elements and components.",
          icon: "page-title-custom-icon nav-icon-invoices",
        }}
      />
    </Fragment>
  );
}

export default InvoicesBook;
