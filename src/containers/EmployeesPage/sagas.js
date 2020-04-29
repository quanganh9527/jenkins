import { takeLatest, call, put, all, takeEvery } from "redux-saga/effects";
import {
  RECEIVE_ROLES,
  GET_ALL_ROLES,
  ADD_ACCOUNT_SUBMIT,
  UPDATE_ACCOUNT_SUBMIT,
  UPDATE_PASSWORD_SUBMIT,
  GET_ALL_USERS,
  RECEIVE_USERS,
  RECEIVE_MESSAGE_EMPLOYEE,
  RESET_FORM_DATA,
  ADD_ACCOUNT,
  UPDATE_ACCOUNT,
  SET_ERRORS_FORM,
  SET_LOADING_GET_DATA,
  SET_SHOW_ROW_EMPTY_EMPLOYEE,
} from "./constants";
import { usersPermissions } from "../../services/usersPermissions.service";
import { HIDDEN_STATUS_REQUEST_LOADING_PROVIDER } from "../LoadingProvider/constants";
export function* getusers({ params = {} }) {
  try {
    yield put({ type: SET_LOADING_GET_DATA }); // set loading on
    const users = yield call(usersPermissions.fetchUsers, params);
    yield put({ type: RECEIVE_USERS, users });
    yield put({ type: SET_LOADING_GET_DATA }); // set loading off
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: SET_LOADING_GET_DATA });
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
  }
}
export function* getRoles() {
  try {
    const roles = yield call(usersPermissions.fetchRoles);
    yield put({ type: RECEIVE_ROLES, roles });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
  }
}

export function* addAccount({ account }) {
  try {
    const accountCreated = yield call(usersPermissions.addAccount, account);

    yield put({ type: ADD_ACCOUNT, accountCreated });
    yield put({ type: RESET_FORM_DATA });
    yield put({ type: SET_SHOW_ROW_EMPTY_EMPLOYEE, isShowRowEmpty: false });
    let notification = {
      type: "success",
      display: "rightLeft",
      message: "Employee added successfully",
      key: "pages.profile.addEmployee.success"
    };
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
    yield call(getusers, {});
  } catch (error) {
    let notification = {
      type: "error",
      display: "rightLeft",
      message: error.data.message || "Error",
    };
    let { data } = error;
    yield put({ type: SET_ERRORS_FORM, data: data.data });
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
  }
}
function* updateAccount({ _id, account }) {
  try {
    const accountUpdated = yield call(
      usersPermissions.updateAccount,
      _id,
      account,
    );
    yield put({ type: UPDATE_ACCOUNT, accountUpdated });
    yield put({ type: RESET_FORM_DATA });
    let notification = {
      type: "success",
      display: "rightLeft",
      message: "Employee updated successfully",
      key: "pages.profile.updateEmployee.success"
    };
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
    yield call(getusers, {});
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      display: "rightLeft",
      message: data && data.message ? data.message : "Error",
    };
    yield put({ type: SET_ERRORS_FORM, data: data.data });
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
  }
}
function* updatePasswordAccount({ _id, password }) {
  try {
    const accountUpdated = yield call(
      usersPermissions.updatePassword,
      _id,
      password,
    );
    let notification = {
      type: "success",
      message: accountUpdated.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_EMPLOYEE, notification });
  }
}

export default function defaultEmployeeSaga() {
  return function* watchEmployeeSaga() {
    yield all([
      yield takeLatest(GET_ALL_ROLES, getRoles),
      yield takeLatest(GET_ALL_USERS, getusers),
      yield takeEvery(ADD_ACCOUNT_SUBMIT, addAccount),
      yield takeEvery(UPDATE_ACCOUNT_SUBMIT, updateAccount),
      yield takeEvery(UPDATE_PASSWORD_SUBMIT, updatePasswordAccount),
    ]);
  };
}
