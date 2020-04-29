import {
  RECEIVE_MESSAGE_INSPECTION,
  RECEIVE_MESSAGE_MAINTENANCE,
  RECEIVE_MESSAGE_CLEANING,
  RECEIVE_LOCATIONS,
  RECEIVE_INSPECTORS,
  RECEIVE_UNITS_TEMPLATE,
  RECEIVE_GET_INSPECTIONS,
  RECEIVE_GET_INSPECTION,
  RECEIVE_GET_LOCATION,
  RECEIVE_GET_COSTTYPES,
  RECEIVE_GET_DEBTORCONTACT,
  RECEIVE_GET_PERSONS,
  RECEIVE_GET_GROUPINGS,
  SUBMITED_COMPLETE_INSPECTION,
  RECEIVE_LOADING_STATUS,
  RECEIVE_GET_MAINTENANCES,
  RECEIVE_GET_CLEANINGS,
  // Pagination
  // Inspection
  INSPECTION_FETCH_COUNT_DATA_SUCCESS,
  INSPECTION_GET_DATA_REQUEST_STATUS,
  INSPECTION_REVIEW_REQUEST_STATUS,
  // Maintenance
  MAINTENANCE_FETCH_COUNT_DATA_SUCCESS,
  MAINTENANCE_GET_DATA_REQUEST_STATUS,
  // Cleaning
  CLEANING_FETCH_COUNT_DATA_SUCCESS,
  CLEANING_GET_DATA_REQUEST_STATUS,
} from "./constants";
import { actionTypes } from "./constants";

const initState = {
  isFetchingInspection: false,
  isFetchingMaintenace: false,
  isFetchingCleaning: false,
};

function inspectionReducer(state = initState, action) {
  switch (action.type) {
    case RECEIVE_MESSAGE_INSPECTION:
      return {
        ...state,
        notification: action.payload || action.notification,
      };
    case RECEIVE_MESSAGE_MAINTENANCE:
      return {
        ...state,
        notificationMaintenance: action.payload || action.notification,
      };
    case RECEIVE_MESSAGE_CLEANING:
      return {
        ...state,
        notificationCleaning: action.payload || action.notification,
      };
    case RECEIVE_LOCATIONS:
      return {
        ...state,
        locations: action.data,
      };
    case RECEIVE_INSPECTORS:
      return {
        ...state,
        inspectors: action.data,
      };
    case RECEIVE_UNITS_TEMPLATE:
      return {
        ...state,
        unitsTemplate: action.data,
      };
    case RECEIVE_GET_INSPECTIONS:
      return {
        ...state,
        inspections: action.data,
      };
    case RECEIVE_GET_INSPECTION:
      return {
        ...state,
        inspection: action.data,
      };
    case RECEIVE_GET_LOCATION:
      return {
        ...state,
        location: action.data,
      };
    case RECEIVE_GET_COSTTYPES:
      return {
        ...state,
        costTypes: action.data,
      };
    case RECEIVE_GET_PERSONS:
      return {
        ...state,
        persons: action.data,
      };
    case RECEIVE_GET_GROUPINGS:
      return {
        ...state,
        groupings: action.data,
      };
    case RECEIVE_GET_DEBTORCONTACT:
      return {
        ...state,
        debtorContacts: action.data,
      };
    case SUBMITED_COMPLETE_INSPECTION:
      return {
        ...state,
        isSubmitted: action.data,
      };
    case RECEIVE_LOADING_STATUS:
      return {
        ...state,
        loadingStatus: action.data || false,
      };
    case RECEIVE_GET_MAINTENANCES:
      return {
        ...state,
        maintenances: action.data,
      };
    case RECEIVE_GET_CLEANINGS:
      return {
        ...state,
        cleanings: action.data,
      };
    /// INSPECIONS
    case INSPECTION_FETCH_COUNT_DATA_SUCCESS:
      return {
        ...state,
        totalOfInspections: action.data,
      };
    case INSPECTION_GET_DATA_REQUEST_STATUS:
      return {
        ...state,
        isFetchingInspection: action.data,
      };
    case INSPECTION_REVIEW_REQUEST_STATUS:
      return {
        ...state,
        isFetchingInspectionData: action.data,
      };
    // MAINTENANCE
    case MAINTENANCE_FETCH_COUNT_DATA_SUCCESS:
      return {
        ...state,
        totalOfMaintenances: action.data,
      };
    case MAINTENANCE_GET_DATA_REQUEST_STATUS:
      return {
        ...state,
        isFetchingMaintenace: action.data,
      };
    case CLEANING_FETCH_COUNT_DATA_SUCCESS:
      return {
        ...state,
        totalOfCleanings: action.data,
      };
    case CLEANING_GET_DATA_REQUEST_STATUS:
      return {
        ...state,
        isFetchingCleaning: action.data,
      };
    case actionTypes.UPDATE_INSPECTION_SUCCESS:
      const { response } = action.payload;
      return {
        ...state,
        inspection: { ...response },
      };
    default:
      return state;
  }
}
export default inspectionReducer;
