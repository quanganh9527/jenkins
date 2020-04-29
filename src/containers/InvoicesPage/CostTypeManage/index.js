/**
 *
 * Manage Cost Center page
 *
 */
import React, { Fragment, useEffect } from "react";

import PageLayout from "../../../components/PageLayout";
import CostTypeList from "./CostTypeList";
import DialogAddNewCostType from "./DialogAddNewCostType";
import PageTitle from "../../../components/PageTitle";

import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../actions";

import { FormattedMessage } from "react-intl";

function CostTypeManage() {
  const dispatch = useDispatch();

  // const [isOpenAddTypeModal, setIsOpenAddTypeModal] = useState(false);

  useEffect(() => {
    dispatch(invoiceActions.getInitDataCostType());
    dispatch(invoiceActions.setIsOpenAddItemModal(false));
  }, [dispatch]);

  const invoiceState = useSelector(state => state.invoice);
  let { isOpenAddItemModal } = invoiceState;

  const onToggleOpenAddTypeModal = () => {
    dispatch(invoiceActions.setIsOpenAddItemModal(!isOpenAddItemModal));
  }

  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={<FormattedMessage id="components.pageTitle.managerCostTypes" />}
          icon="page-title-custom-icon nav-icon-invoices"
          hasAddNew={true}
          hasAddNewText={<FormattedMessage id="components.button.addNew" />}
          callFunction={() => {
            dispatch(invoiceActions.setSelectedCostType());
            onToggleOpenAddTypeModal()
          }}
        />
      </PageLayout>
      <CostTypeList
        onToggleOpen={onToggleOpenAddTypeModal}
      />
      {isOpenAddItemModal && (
        <DialogAddNewCostType
          isOpen={isOpenAddItemModal}
          onToggleOpen={onToggleOpenAddTypeModal}
        />
      )}
    </Fragment>
  );

}

export default CostTypeManage;
