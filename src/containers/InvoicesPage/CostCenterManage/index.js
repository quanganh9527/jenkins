/**
 *
 * Manage Cost Center page
 *
 */
import React, { Fragment, useEffect } from "react";

import PageLayout from "../../../components/PageLayout";
import CostCenterList from "./CostCenterList";
import DialogAddNewCenter from "./DialogAddNewCenter";
import PageTitle from "../../../components/PageTitle";

import { FormattedMessage } from "react-intl";

import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../actions";

function CostCenterManage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(invoiceActions.setIsOpenAddItemModal(false));
  }, [dispatch]);

  const invoiceState = useSelector(state => state.invoice);
  let { isOpenAddItemModal } = invoiceState;

  const onToggleOpenAddCenterModal = () => {
    dispatch(invoiceActions.setIsOpenAddItemModal(!isOpenAddItemModal));
  }

  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.managerCostCenters" />}
          icon="page-title-custom-icon nav-icon-invoices"
          hasAddNew={true}
          hasAddNewText={<FormattedMessage id="components.button.addNew" />}
          callFunction={() => {
            dispatch(invoiceActions.setSelectedCostCenter());
            onToggleOpenAddCenterModal()
          }}
        />
      </PageLayout>
      <CostCenterList
        onToggleOpen={onToggleOpenAddCenterModal}
      />
      {isOpenAddItemModal && (
        <DialogAddNewCenter
          isOpen={isOpenAddItemModal}
          onToggleOpen={onToggleOpenAddCenterModal}
        />
      )}
    </Fragment>
  );

}

export default CostCenterManage;
