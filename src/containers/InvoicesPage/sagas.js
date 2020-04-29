import { takeLatest, call, put, all, takeEvery } from "redux-saga/effects";
import {
  RECEIVE_MESSAGE_INVOICE,
  //Cost center
  GET_COST_CENTER_ALL,
  GET_COST_CENTERS,
  RECEIVE_COST_CENTER_ALL,
  RECEIVE_COST_CENTERS,
  SUBMIT_CREATE_COST_CENTER,
  SUBMIT_UPDATE_COST_CENTER,
  CREATE_COST_CENTER,
  UPDATE_COST_CENTER,
  SET_IS_OPEN_ADD_ITEM_MODAL,
  //Cost type
  GET_COST_TYPES,
  RECEIVE_COST_TYPES,
  GET_INIT_DATA_COST_TYPE,
  RECEIVE_LEDGER_ACCOUNTS,
  RECEIVE_VAT_TYPES,
  RECEIVE_COUNTRIES,
  SUBMIT_CREATE_COST_TYPE,
  SUBMIT_UPDATE_COST_TYPE,
  CREATE_COST_TYPE,
  UPDATE_COST_TYPE,
  //Cost line
  RECEIVE_COST_LINES,
  UPDATE_COST_LINE_MUL,
  GET_CUSTOM_COST_LINE,
  //Invoice
  GET_REVIEW_INVOICES_REQUEST_STATUS,
  RECEIVE_REVIEW_INVOICES,
  SUBMIT_GET_REVIEW_INVOICES,
  CREATE_REVIEW_INVOICES,
  SUBMIT_CREATE_REVIEW_INVOICES,
  RECEIVE_DETAIL_INVOICE,
  GET_DETAIL_INVOICE,
  RECEIVE_PARAMS_INVOICES,
  RECEIVE_SELECT_INVOICE,
  SET_SELECT_INVOICE,
  //Pagination
  FETCH_COUNT_COSTCENTER,
  FETCH_COUNT_COSTCENTER_SUCCESS,
  GET_COSTCENTER_REQUEST_STATUS,
  COST_CENTER_RECEIVE_MESSAGE_INVOICE,
} from "./constants";
import { HIDDEN_STATUS_REQUEST_LOADING_PROVIDER } from "../LoadingProvider/constants";
import {
  invoiceService,
  locationService,
  inspectionService,
} from "../../services";
import { uniqBy } from "lodash";
//COST CENTERS
export function* getCostCenterAll() {
  try {
    const costCenters = yield call(invoiceService.getCostCenters);
    yield put({ type: RECEIVE_COST_CENTER_ALL, data: costCenters });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

export function* getCostCenters({ params }) {
  try {
    // isFetchData location
    yield put({ type: GET_COSTCENTER_REQUEST_STATUS, data: true });
    const costCenters = yield call(invoiceService.getCostCenters, params);
    yield put({ type: RECEIVE_COST_CENTERS, data: costCenters });
    yield put({ type: GET_COSTCENTER_REQUEST_STATUS, data: false });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
    yield put({ type: GET_COSTCENTER_REQUEST_STATUS, data: false });
  }
}

function* fetchCountCostCenter({ params }) {
  try {
    const totalCostCenter = yield call(
      invoiceService.fetchCountCostCenters,
      params,
    );
    yield put({ type: FETCH_COUNT_COSTCENTER_SUCCESS, data: totalCostCenter });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

function* createCostCenter({ costCenter }) {
  try {
    const centerCreated = yield call(
      invoiceService.addNewCostCenter,
      costCenter,
    );
    yield put({ type: CREATE_COST_CENTER, centerCreated });
    yield put({ type: RECEIVE_COST_CENTER_ALL, itemUpdate: centerCreated });
    let notification = {
      type: "success",
      message: "Cost center added successfully",
      page: "costcenter",
      key: "pages.invoice.addCostCenter.success",
    };
    yield put({ type: COST_CENTER_RECEIVE_MESSAGE_INVOICE, notification });
    yield put({ type: SET_IS_OPEN_ADD_ITEM_MODAL, data: false });
    // yield call(getCostCenters);
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
      position: "modal",
      page: "costcenter",
    };
    yield put({ type: COST_CENTER_RECEIVE_MESSAGE_INVOICE, notification });
  }
}

function* updateCostCenter({ centerId, costCenter }) {
  try {
    const centerUpdated = yield call(
      invoiceService.updateCostCenter,
      centerId,
      costCenter,
    );
    yield put({ type: UPDATE_COST_CENTER, centerUpdated });
    yield put({ type: RECEIVE_COST_CENTER_ALL, itemUpdate: centerUpdated });
    let notification = {
      type: "success",
      message: "Cost center updated successfully",
      page: "costcenter",
      key: "pages.invoice.updateCostCenter.success",
    };
    yield put({ type: COST_CENTER_RECEIVE_MESSAGE_INVOICE, notification });
    yield put({ type: SET_IS_OPEN_ADD_ITEM_MODAL, data: false });
    // yield call(getCostCenters);
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
      position: "modal",
      page: "costcenter",
    };
    yield put({ type: COST_CENTER_RECEIVE_MESSAGE_INVOICE, notification });
  }
}

//COST TYPES
function* getInitDataCostType() {
  try {
    const ledgerAccounts = yield call(invoiceService.getLedgerAccounts);
    yield put({ type: RECEIVE_LEDGER_ACCOUNTS, data: ledgerAccounts });

    const vatTypes = yield call(invoiceService.getVatTypes);
    yield put({ type: RECEIVE_VAT_TYPES, data: vatTypes });

    const countries = yield call(locationService.getCountries);
    yield put({ type: RECEIVE_COUNTRIES, data: countries });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

function* getCostTypes() {
  try {
    const costTypes = yield call(invoiceService.getCostTypes);
    yield put({ type: RECEIVE_COST_TYPES, data: costTypes });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

function* createCostType({ costType }) {
  try {
    const costTypeCreated = yield call(invoiceService.addNewCostType, costType);
    yield put({ type: CREATE_COST_TYPE, costTypeCreated });
    let notification = {
      type: "success",
      message: "Cost type added successfully",
      page: "costtype",
      key: "pages.invoice.addCostType.success",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
    yield put({ type: SET_IS_OPEN_ADD_ITEM_MODAL, data: false });
    yield call(getCostTypes); // call update new
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
      position: "modal",
      page: "costtype",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

function* updateCostType({ typeId, costType }) {
  try {
    const costTypeUpdated = yield call(
      invoiceService.updateCostType,
      typeId,
      costType,
    );
    yield put({ type: UPDATE_COST_TYPE, costTypeUpdated });
    let notification = {
      type: "success",
      message: "Cost type updated successfully",
      page: "costtype",
      key: "pages.invoice.updateCostType.success",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
    yield put({ type: SET_IS_OPEN_ADD_ITEM_MODAL, data: false });
    yield call(getCostTypes);
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
      position: "modal",
      page: "costtype",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

//Cost line
function* getCustomCostLine({ searchData }) {
  try {
    const costLines = yield call(
      inspectionService.getInspectionBills,
      searchData,
    );
    yield put({ type: RECEIVE_COST_LINES, data: costLines });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

function* updateCostLineMul({ data }) {
  try {
    yield call(
      inspectionService.updateInspectionBillMultiple,
      data,
    );
    yield put({ type: RECEIVE_COST_LINES, data: [{}] });
    let notification = {
      type: "success",
      message: "Cost lines added successfully",
      page: "costline",
      key: "pages.invoice.addCostLines.success",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
      page: "costline",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  } finally {
     // hidden loading provider
     yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

//Invoices
function* getReviewInvoices({ searchData }) {
  try {
    yield put({ type: GET_REVIEW_INVOICES_REQUEST_STATUS, data: true });
    let reviewInvoices = yield call(
      invoiceService.getReviewInvoices,
      searchData,
    );
    // remove duplicated invoice
    reviewInvoices = uniqBy(reviewInvoices, function(elem) {
      return [elem.debtor, elem.costLines].join();
    });

    yield put({ type: RECEIVE_REVIEW_INVOICES, data: reviewInvoices });
    yield put({ type: RECEIVE_PARAMS_INVOICES, data: searchData });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  } finally {
    yield put({ type: GET_REVIEW_INVOICES_REQUEST_STATUS, data: false });
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
 }
}

function* createReviewInvoice({ invoices, searchData }) {
  try {
    const approveInvoices = yield call(invoiceService.addNewInvoice, invoices);
    yield put({ type: CREATE_REVIEW_INVOICES, data: approveInvoices });
    const reviewInvoices = yield call(
      invoiceService.getReviewInvoices,
      searchData,
    );
    yield put({ type: RECEIVE_REVIEW_INVOICES, data: reviewInvoices });
    let notification = {
      type: "success",
      message: "Invoice added successfully",
      key: "pages.invoice.addInvoice.success",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  } finally {
     // hidden loading provider
     yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* getDetailInvoice({ searchData }) {
  try {
    const detailInvoices = yield call(
      invoiceService.getReviewInvoices,
      searchData,
    );
    yield put({ type: RECEIVE_DETAIL_INVOICE, data: detailInvoices });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}
export function* getSelectInvoice({ selectRow }) {
  try {
    yield put({ type: RECEIVE_SELECT_INVOICE, data: selectRow });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INVOICE, notification });
  }
}

export default function defaultInvoiceSaga() {
  return function* watchInvoiceSaga() {
    yield all([
      // costcenters
      yield takeLatest(GET_COST_CENTER_ALL, getCostCenterAll),
      yield takeLatest(GET_COST_CENTERS, getCostCenters),
      yield takeEvery(SUBMIT_CREATE_COST_CENTER, createCostCenter),
      yield takeEvery(SUBMIT_UPDATE_COST_CENTER, updateCostCenter),
      yield takeEvery(FETCH_COUNT_COSTCENTER, fetchCountCostCenter),

      // costtype
      yield takeLatest(GET_INIT_DATA_COST_TYPE, getInitDataCostType),
      yield takeLatest(GET_COST_TYPES, getCostTypes),
      yield takeEvery(SUBMIT_CREATE_COST_TYPE, createCostType),
      yield takeEvery(SUBMIT_UPDATE_COST_TYPE, updateCostType),

      //invoice custom costline
      yield takeLatest(GET_CUSTOM_COST_LINE, getCustomCostLine),
      yield takeEvery(UPDATE_COST_LINE_MUL, updateCostLineMul),

      //review invoices
      yield takeLatest(SUBMIT_GET_REVIEW_INVOICES, getReviewInvoices),
      yield takeEvery(SUBMIT_CREATE_REVIEW_INVOICES, createReviewInvoice),
      yield takeLatest(GET_DETAIL_INVOICE, getDetailInvoice),
      yield takeEvery(SET_SELECT_INVOICE, getSelectInvoice),
    ]);
  };
}
