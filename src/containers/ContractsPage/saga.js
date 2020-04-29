import { takeLatest, all, put, call } from "redux-saga/effects";
import { push } from "connected-react-router";
import __ from "lodash";
import { routers } from "./constants";
import * as actionTypes from "./actionTypes";
import * as loadingActionTypes from "containers/LoadingProvider/constants";
import { convertResponseContractToFormdata } from "./utils";
import { contractService, locationService } from "services";
//TODOS: Add debtor renting contract
export function* getCostTypes({ payload: { countryId } }) {
  try {
    if (!countryId) {
      yield put({ type: actionTypes.RECEIVE_COSTTYPES, data: [] });
    } else {
      const costTypes = yield call(contractService.getCostTypes, {
        country: countryId,
        active: true,
        _limit: -1,
        _sort: "updatedDate:DESC",
      });

      yield put({ type: actionTypes.RECEIVE_COSTTYPES, data: costTypes });
    }
  } catch (error) {
    let notification = {
      type: "error",
      message: error.message || "Error",
    };
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: notification,
    });
  }
}
export function* createDebtorRentingContract({ payload: { data } }) {
  try {
    yield call(contractService.createDebtorRentingContract, data);
    yield put(push(routers["Debtor"]));
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: {
        type: "success",
        message: "Debtor renting contract created successfully",
        key: "pages.contracts.createDebtorContract.success",
      },
    });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.message || "Error",
    };
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: notification,
    });
  } finally {
    yield put({
      type: loadingActionTypes.HIDDEN_STATUS_REQUEST_LOADING_PROVIDER,
    });
  }
}
export function* updateDebtorRentingContract({
  payload: { contractId, data },
}) {
  try {
    yield call(contractService.updateDebtorRentingContract, contractId, data);
    yield put(push(routers["Debtor"]));
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: {
        type: "success",
        message: "Debtor renting contract updated successfully",
        key: "pages.contracts.updateDebtorContract.success",
      },
    });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.message || "Error",
    };
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: notification,
    });
  } finally {
    yield put({
      type: loadingActionTypes.HIDDEN_STATUS_REQUEST_LOADING_PROVIDER,
    });
  }
}
export function* getDebtorRentingContract({ payload: { contractId } }) {
  try {
    yield put({
      type: loadingActionTypes.SET_STATUS_REQUEST_LOADING_PROVIDER,
    });
    let data = yield call(contractService.getDebtorRentingContract, contractId);
    let costTypes = [];
    let location = [];
    //TODO: Get costtype & location data units
    if (!__.isEmpty(data) && data._id) {
      if (!__.isEmpty(data.location && data.location._id)) {
        if (data.location.country) {
          costTypes = yield call(contractService.getCostTypes, {
            country: data.location.country,
            active: true,
            _limit: -1,
            _sort: "updatedDate:DESC",
          });
        }
        // TODO: Get units/sub units of loation
        location = yield call(locationService.getLocation, data.location._id);
        // TODO: Convert data form
        const contract = yield call(
          convertResponseContractToFormdata,
          data,
          costTypes,
          location,
        );
        yield put({
          type: actionTypes.RECEIVE_DEBTOR_RENTING_CONTRACT,
          data: contract,
        });
      }
    }
    yield put({ type: actionTypes.RECEIVE_COSTTYPES, data: costTypes });
  } catch (error) {
    console.log("function* getDebtorRentingContract error: ", error);

    let notification = {
      type: "error",
      message: error.message || "Error",
    };
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: notification,
    });
    yield put(push(routers["Debtor"]));
  } finally {
    yield put({
      type: loadingActionTypes.HIDDEN_STATUS_REQUEST_LOADING_PROVIDER,
    });
  }
}
export function* getDebtorRentingContracts({ payload: { params } }) {
  try {
    yield put({
      type: actionTypes.DEBTOR_RENTING_CONTRACTS_REQUEST_STATUS,
      data: true,
    });
    const data = yield call(contractService.getDebtorRentingContracts, params);
    yield put({
      type: actionTypes.RECEIVE_DEBTOR_RENTING_CONTRACTS,
      data: data,
    });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.message || "Error",
    };
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: notification,
    });
  } finally {
    yield put({
      type: actionTypes.DEBTOR_RENTING_CONTRACTS_REQUEST_STATUS,
      data: false,
    });
  }
}
export function* fetchCountDebtorRentingContract({ payload: { params } }) {
  try {
    const data = yield call(
      contractService.getCountDebtorRentingContracts,
      params,
    );
    yield put({
      type: actionTypes.RECEIVE_COUNT_DEBTOR_RENTING_CONTRACTS,
      data: data,
    });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.message || "Error",
    };
    yield put({
      type: actionTypes.RECEIVE_MESSAGE_RENTING,
      data: notification,
    });
  }
}
// ----------------------
export default function root() {
  return function* watch() {
    yield all([
      yield takeLatest(actionTypes.GET_COSTTYPES, getCostTypes),
      yield takeLatest(
        actionTypes.CREATE_DEBTOR_RENTING_CONTRACT,
        createDebtorRentingContract,
      ),
      yield takeLatest(
        actionTypes.UPDATE_DEBTOR_RENTING_CONTRACT,
        updateDebtorRentingContract,
      ),
      yield takeLatest(
        actionTypes.GET_DEBTOR_RENTING_CONTRACTS,
        getDebtorRentingContracts,
      ),
      yield takeLatest(
        actionTypes.GET_DEBTOR_RENTING_CONTRACT,
        getDebtorRentingContract,
      ),
      yield takeLatest(
        actionTypes.FETCH_COUNT_DEBTOR_RENTING_CONTRACTS,
        fetchCountDebtorRentingContract,
      ),
    ]);
  };
}
