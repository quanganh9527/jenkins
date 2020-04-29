import * as actionTypes from "./actionTypes";
import { createAction } from "utilities";

export const displayNotification = (type, message) =>
  createAction(actionTypes.RECEIVE_MESSAGE_RENTING, {
    data: { type, message },
  });
export const resetNotification = () =>
  createAction(actionTypes.RECEIVE_MESSAGE_RENTING, { data: {} });

// Action create debtor renting contract
export const resetProps = () =>
  createAction(actionTypes.RESET_PROPS_RENTING_CONTRACT);
export const getCostTypes = (countryId) =>
  createAction(actionTypes.GET_COSTTYPES, { countryId });

export const createDebtorRentingContract = (data) =>
  createAction(actionTypes.CREATE_DEBTOR_RENTING_CONTRACT, { data });
export const updateDebtorRentingContract = (contractId, data) =>
  createAction(actionTypes.UPDATE_DEBTOR_RENTING_CONTRACT, {
    contractId,
    data,
  });

export const getDebtorRentingContracts = (params) =>
  createAction(actionTypes.GET_DEBTOR_RENTING_CONTRACTS, { params });
export const fetchCountDebtorRentingContracts = (params) =>
  createAction(actionTypes.FETCH_COUNT_DEBTOR_RENTING_CONTRACTS, { params });

export const getDebtorRentingContract = (contractId) =>
  createAction(actionTypes.GET_DEBTOR_RENTING_CONTRACT, { contractId });
