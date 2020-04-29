import {
  GET_ALL_ROLES,
  RECEIVE_ROLES,
  ADD_ACCOUNT,
  ADD_ACCOUNT_SUBMIT,
  UPDATE_ACCOUNT_SUBMIT,
  UPDATE_PASSWORD_SUBMIT,
  GET_ALL_USERS,
  RECEIVE_USERS,
  RECEIVE_MESSAGE_EMPLOYEE,
  SUBMIT_FORM_DATA,
  SET_ERRORS_FORM,
  SET_LOADING_GET_DATA,
  SET_SHOW_ROW_EMPTY_EMPLOYEE,
} from "./constants";

export const employeeActions = {
  getRoles,
  receiveRoles,
  addAccount,
  addAccountSubmit,
  updateAccountSubmit,
  updatePasswordAccountSubmit,
  getUsers,
  receiveUsers,
  displayNotification,
  resetNotification,
  submitFormData,
  resetErrorsForm,
  setLoadingData,
  setShowRowEmpty,
};
function submitFormData() {
  return { type: SUBMIT_FORM_DATA };
}
function displayNotification(type, message) {
  return {
    type: RECEIVE_MESSAGE_EMPLOYEE,
    payload: Object.assign(
      {},
      {
        type,
        message,
      },
    ),
  };
}
function resetNotification() {
  return {
    type: RECEIVE_MESSAGE_EMPLOYEE,
    payload: Object.assign(
      {},
      {
        type: "",
        message: "",
      },
    ),
  };
}

function getUsers(params) {
  return { type: GET_ALL_USERS, params: params };
}
function receiveUsers(users) {
  return { type: RECEIVE_USERS, users };
}
function getRoles() {
  return { type: GET_ALL_ROLES };
}
function addAccountSubmit(account) {
  return { type: ADD_ACCOUNT_SUBMIT, account };
}
function addAccount(account) {
  return { type: ADD_ACCOUNT, account };
}
function updateAccountSubmit(_id, account) {
  return { type: UPDATE_ACCOUNT_SUBMIT, _id, account };
}
function updatePasswordAccountSubmit(_id, password) {
  return { type: UPDATE_PASSWORD_SUBMIT, _id, password };
}
export function receiveRoles(roles) {
  return {
    type: RECEIVE_ROLES,
    roles: roles,
  };
}
function resetErrorsForm() {
  return { type: SET_ERRORS_FORM, data: {} };
}

function setLoadingData() {
  return { type: SET_LOADING_GET_DATA };
}

function setShowRowEmpty(isShowRowEmpty) {
  return { type: SET_SHOW_ROW_EMPTY_EMPLOYEE, isShowRowEmpty };
}
