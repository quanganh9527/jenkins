import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { injectIntl } from "react-intl";
import DebtorContractForm from "./components/ContractDetail";
import PageLayout from "components/PageLayout";
import PageTitle from "components/PageTitle";
import * as actions from "./actions";
import { contractTranslate } from "./constants";
const AddContracts = (props) => {
  const { intl } = props;
  const { contractId } = useParams();
  const contractType = "Debtor";
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.resetProps());
  },[dispatch]);
  return (
    <PageLayout>
      <PageTitle
        heading={intl.formatMessage({
          id: contractId
            ? contractTranslate[contractType].headingDetail
            : contractTranslate[contractType].headingCreate,
        })}
        icon="page-title-custom-icon nav-icon-inspections"
      />
      <DebtorContractForm {...props} contractType={contractType} />
    </PageLayout>
  );
};

export default React.memo(injectIntl(AddContracts));
