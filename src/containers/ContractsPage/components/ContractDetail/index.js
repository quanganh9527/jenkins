import React, { memo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "../../actions";
// ###
import RentingContractDetail from "./RentingContractDetail";

const DebtorContractForm = (props) => {
  // Selector global
  const dispatch = useDispatch();

  const { contractId } = useParams();

  const isCreate = contractId === "create";
  useEffect(() => {
    if (!isCreate && contractId) {
      // TODO Get debtor renting contract
      dispatch(actions.getDebtorRentingContract(contractId));
    }
  }, [dispatch, contractId, isCreate]);
  return (
    <>
      {isCreate ? (
        <RentingContractDetail {...props} />
      ) : (
        <RentingContractDetail {...props} rentingContractId={contractId} />
      )}
    </>
  );
};

export default memo(DebtorContractForm);
