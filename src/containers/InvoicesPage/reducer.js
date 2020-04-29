import {
  RECEIVE_MESSAGE_INVOICE,
  //COST CENTERS
  RECEIVE_COST_CENTER_ALL,
  RECEIVE_COST_CENTERS,
  CREATE_COST_CENTER,
  UPDATE_COST_CENTER,
  SET_SELECTED_COST_CENTER,
  COST_CENTER_RECEIVE_MESSAGE_INVOICE,
  SET_IS_OPEN_ADD_ITEM_MODAL,
  //COST TYPES
  RECEIVE_COST_TYPES,
  SET_SELECTED_COST_TYPE,
  RECEIVE_LEDGER_ACCOUNTS,
  RECEIVE_VAT_TYPES,
  RECEIVE_COUNTRIES,
  CREATE_COST_TYPE,
  UPDATE_COST_TYPE,
  //CUSTOM COST LINES
  RECEIVE_COST_LINES,
  //REVIEW INVOICES
  GET_REVIEW_INVOICES_REQUEST_STATUS,
  RECEIVE_REVIEW_INVOICES,
  SET_SELECTED_REVIEW_INVOICE,
  RECEIVE_DETAIL_INVOICE,
  RECEIVE_PARAMS_INVOICES,
  RECEIVE_SELECT_INVOICE,
  CREATE_REVIEW_INVOICES,
  //PAGINATION
  FETCH_COUNT_COSTCENTER_SUCCESS,
  GET_COSTCENTER_REQUEST_STATUS,
} from "./constants";
import { unionBy } from "lodash"

const intitState = {
  isFetchingCostCenter: false,
};
function invoiceReducer(state = intitState, action) {
  switch (action.type) {
    case RECEIVE_MESSAGE_INVOICE:
      return {
        ...state,
        notification: action.payload || action.notification,
      };

    //COST_CENTER
    case COST_CENTER_RECEIVE_MESSAGE_INVOICE:
      return {
        ...state,
        notificationCostCenter: action.notification,
      };
    case RECEIVE_COST_CENTER_ALL:
      return {
        ...state,
        costCenterAll: action.itemUpdate
          ? unionBy([action.itemUpdate], state.costCenterAll, "_id")
          : action.data,
      };
    case RECEIVE_COST_CENTERS:
      return {
        ...state,
        costCenters: action.data,
      };
    case CREATE_COST_CENTER:
      return {
        ...state,
        costCenters: state.costCenters.concat([action.centerCreated]),
      };
    case UPDATE_COST_CENTER:
      return {
        ...state,
        costCenters: (state.costCenters || []).map((item) =>
          item._id === action.centerUpdated._id ? action.centerUpdated : item,
        ),
      };
    case SET_SELECTED_COST_CENTER:
      return {
        ...state,
        selectedCostCenter: action.selectedCostCenter,
      };
    case SET_IS_OPEN_ADD_ITEM_MODAL:
      return {
        ...state,
        isOpenAddItemModal: action.data,
      };

    //COST TYPE
    case RECEIVE_COST_TYPES:
      return {
        ...state,
        costTypes: action.data,
      };
    case RECEIVE_LEDGER_ACCOUNTS:
      return {
        ...state,
        ledgerAccounts: action.data,
      };
    case RECEIVE_VAT_TYPES:
      return {
        ...state,
        vatTypes: action.data,
      };
    case SET_SELECTED_COST_TYPE:
      return {
        ...state,
        selectedCostType: action.selectedCostType,
      };
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        countries: action.data,
      };
    case CREATE_COST_TYPE:
      return {
        ...state,
        costTypes: state.costTypes.concat([action.costTypeCreated]),
      };
    case UPDATE_COST_TYPE:
      return {
        ...state,
        costTypes: (state.costTypes || []).map((item) =>
          item._id === action.costTypeUpdated._id
            ? action.costTypeUpdated
            : item,
        ),
      };

    //COST LINES
    case RECEIVE_COST_LINES:
      return {
        ...state,
        costLines: action.data,
      };

    //INVOICES
    case GET_REVIEW_INVOICES_REQUEST_STATUS:
      return {
        ...state,
        isFetchingReviewInvoice: action.data,
      };
    case RECEIVE_REVIEW_INVOICES:
      return {
        ...state,
        reviewInvoices: action.data,
      };
    case RECEIVE_DETAIL_INVOICE:
      return {
        ...state,
        detailInvoices: action.data,
      };

    case RECEIVE_SELECT_INVOICE:
      return {
        ...state,
        selectRow: action.data,
      };
    case CREATE_REVIEW_INVOICES:
      return {
        ...state,
        approveInvoices: action.data,
      };

    case SET_SELECTED_REVIEW_INVOICE:
      return {
        ...state,
        selectedReviewInvoice: action.selectedReviewInvoice,
      };
    case RECEIVE_PARAMS_INVOICES:
      return {
        ...state,
        receiveParamsInvoices: action.data,
      };

    //PAGINATION
    case FETCH_COUNT_COSTCENTER_SUCCESS:
      return {
        ...state,
        totalOfCostcenter: action.data,
      };
    case GET_COSTCENTER_REQUEST_STATUS:
      return {
        ...state,
        isFetchingCostCenter: action.data,
      };
    default:
      return state;
  }
}
export default invoiceReducer;
