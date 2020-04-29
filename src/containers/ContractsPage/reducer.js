import * as actionTypes from "./actionTypes";
const initState = {
  notification: {},
  costTypes: [],
  isFetchingDebtorRenting: false,
  debtorRentingContracts: [],
  countDebtorRentingContract: 0,
  debtorRentingContract: {},
};

function setDataReducer(state, action, key) {
  return {
    ...state,
    [key]: action.data,
  };
}

function rentingContractReducer(state = initState, action) {
  switch (action.type) {
    case actionTypes.RECEIVE_MESSAGE_RENTING:
      return setDataReducer(state, action, "notification");
    case actionTypes.RECEIVE_COSTTYPES:
      return setDataReducer(state, action, "costTypes");
    case actionTypes.DEBTOR_RENTING_CONTRACTS_REQUEST_STATUS:
      return setDataReducer(state, action, "isFetchingDebtorRenting");
    case actionTypes.RECEIVE_DEBTOR_RENTING_CONTRACTS:
      return setDataReducer(state, action, "debtorRentingContracts");
    case actionTypes.RECEIVE_DEBTOR_RENTING_CONTRACT:
      return setDataReducer(state, action, "debtorRentingContract");
    case actionTypes.RECEIVE_DEBTOR_RENTING_CONTRACT_LOCATION:
      return setDataReducer(state, action, "debtorRentingContractLocation");
    case actionTypes.RECEIVE_COUNT_DEBTOR_RENTING_CONTRACTS:
      return setDataReducer(state, action, "countDebtorRentingContract");
    case actionTypes.RESET_PROPS_RENTING_CONTRACT:
      return {
        ...state,
        notification: {},
        costTypes: [],
        debtorRentingContract: {},
      }
    default:
      return state;
  }
}

export default rentingContractReducer;
