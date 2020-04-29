/**
 *
 * Manage Cost Center page
 *
 */
import React, { Fragment, useState ,memo} from "react";

import PageLayout from "../../../components/PageLayout";
import InvoceTypeList from "./InvoceTypeList";
import DialogADetailInvoices from "./DialogADetailInvoices";
import PageTitle from "../../../components/PageTitle";

import { FormattedMessage } from "react-intl";

function ReviewInvoice() {
  const [isOpenAddCenterModal, setIsOpenAddCenterModal] = useState(false);

  const onToggleOpenAddCenterModal = () => {
    setIsOpenAddCenterModal(!isOpenAddCenterModal);
  }

  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.invoiceReviewOverview" />}
          icon="page-title-custom-icon nav-icon-invoices"
        />
      </PageLayout>
      <InvoceTypeList
        onToggleOpen={onToggleOpenAddCenterModal}
      />
      {isOpenAddCenterModal && (
        <DialogADetailInvoices
          isOpen={isOpenAddCenterModal}
          onToggleOpen={onToggleOpenAddCenterModal}
        />
      )}
    </Fragment>
  );

}

export default memo(ReviewInvoice);
