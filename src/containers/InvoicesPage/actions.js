import {
  RECEIVE_MESSAGE_INVOICE,
  //COST CENTER
  GET_COST_CENTERS,
  SUBMIT_CREATE_COST_CENTER,
  SUBMIT_UPDATE_COST_CENTER,
  SET_SELECTED_COST_CENTER,
  SET_IS_OPEN_ADD_ITEM_MODAL,
  //COST TYPE
  GET_COST_TYPES,
  SET_SELECTED_COST_TYPE,
  GET_INIT_DATA_COST_TYPE,
  SUBMIT_CREATE_COST_TYPE,
  SUBMIT_UPDATE_COST_TYPE,
  //COST LINES
  GET_CUSTOM_COST_LINE,
  RECEIVE_COST_LINES,
  UPDATE_COST_LINE_MUL,
  //INVOICES
  SUBMIT_GET_REVIEW_INVOICES,
  GET_REVIEW_INVOICES_REQUEST_STATUS,
  SUBMIT_CREATE_REVIEW_INVOICES,
  SET_SELECTED_REVIEW_INVOICE,
  GET_DETAIL_INVOICE,
  SET_SELECT_INVOICE,
  //PAGINATION
  FETCH_COUNT_COSTCENTER,
  GET_COSTCENTER_REQUEST_STATUS,
} from "./constants";

export const invoiceActions = {
  resetNotification,
  displayNotification,
  //COST CENTER
  getCostCenters,
  submitCreateCostCenter,
  submitUpdateCostCenter,
  setSelectedCostCenter,
  setIsOpenAddItemModal,
  //COST TYPE
  getCostTypes,
  submitCreateCostType,
  submitUpdateCostType,
  setSelectedCostType,
  getInitDataCostType,
  //COST LINES
  setCustomCostLine,
  updateCostLineMul,
  getCustomCostLine,
  //INVOICES
  getReviewInvoices,
  setStatusRequestReviewInvoices,
  submitCreateInvoice,
  setSelectedReviewInvoice,
  getDetailInvoice,
  getSelectInvoice,
  //PAGINATION
  fetchCountCostCenters,
  setStatusRequestCostCenters,
};

function displayNotification(type, message) {
  return {
    type: RECEIVE_MESSAGE_INVOICE,
    payload: Object.assign(
      {},
      {
        type,
        message,
      },
    ),
  };
}
function resetNotification(type = RECEIVE_MESSAGE_INVOICE) {
  return {
    type: type,
    payload: Object.assign(
      {},
      {
        type: "",
        message: "",
      },
    ),
  };
}

//Cost Centers
function getCostCenters(params = {}, type = GET_COST_CENTERS) {
  return { type: type, params: params };
}
function submitCreateCostCenter(data) {
  return { type: SUBMIT_CREATE_COST_CENTER, costCenter: data };
}
function submitUpdateCostCenter(centerId, data) {
  return {
    type: SUBMIT_UPDATE_COST_CENTER,
    centerId: centerId,
    costCenter: data,
  };
}
function setSelectedCostCenter(data = {}) {
  return { type: SET_SELECTED_COST_CENTER, selectedCostCenter: data };
}
function setIsOpenAddItemModal(data) {
  return { type: SET_IS_OPEN_ADD_ITEM_MODAL, data };
}

// Location pagination
function fetchCountCostCenters(params) {
  return { type: FETCH_COUNT_COSTCENTER, params };
}
function setStatusRequestCostCenters(status) {
  return { type: GET_COSTCENTER_REQUEST_STATUS, status };
}

//Cost types
function getCostTypes() {
  return { type: GET_COST_TYPES };
}
function submitCreateCostType(data) {
  return { type: SUBMIT_CREATE_COST_TYPE, costType: data };
}
function submitUpdateCostType(typeId, data) {
  return { type: SUBMIT_UPDATE_COST_TYPE, typeId: typeId, costType: data };
}
function setSelectedCostType(data = {}) {
  return { type: SET_SELECTED_COST_TYPE, selectedCostType: data };
}
function getInitDataCostType() {
  return { type: GET_INIT_DATA_COST_TYPE };
}

//Invoices
function getReviewInvoices(searchData) {
  return { type: SUBMIT_GET_REVIEW_INVOICES, searchData: searchData };
}
function setStatusRequestReviewInvoices(status) {
  return { type: GET_REVIEW_INVOICES_REQUEST_STATUS, status };
}
function submitCreateInvoice(invoices, searchData) {
  return {
    type: SUBMIT_CREATE_REVIEW_INVOICES,
    invoices: invoices,
    searchData: searchData,
  };
}
function setSelectedReviewInvoice(data = {}) {
  return { type: SET_SELECTED_REVIEW_INVOICE, selectedReviewInvoice: data };
}
function getDetailInvoice(searchData) {
  return { type: GET_DETAIL_INVOICE, searchData: searchData };
}
function getSelectInvoice(selectRow) {
  return { type: SET_SELECT_INVOICE, selectRow: selectRow };
}

//CUSTOM COST LINES
function getCustomCostLine(searchData) {
  return { type: GET_CUSTOM_COST_LINE, searchData: searchData };
}

function setCustomCostLine(data) {
  return { type: RECEIVE_COST_LINES, data: data };
}

function updateCostLineMul(data) {
  return { type: UPDATE_COST_LINE_MUL, data: data };
}
