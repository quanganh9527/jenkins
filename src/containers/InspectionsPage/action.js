import {
  RECEIVE_MESSAGE_INSPECTION,
  GET_INIT_NEW_INSPECTION,
  SUBMIT_OPEN_NEW_INSPECTION,
  SUBMIT_GET_UNITS_TEMPLATE,
  SUBMIT_GET_INSPECTIONS,
  SUBMIT_GET_INSPECTION,
  RECEIVE_GET_INSPECTION,
  RECEIVE_GET_LOCATION,
  SUBMIT_GET_COSTTYPES,
  SUBMIT_GET_CONTACTS,
  SUBMIT_GET_DEBTORCONTACT,
  SUBMIT_REJECT_INSPECTION,
  SUBMIT_COMPLETE_INSPECTION,
  SUBMITED_COMPLETE_INSPECTION,
  SUBMIT_DOWNLOAD_REPORT,
  SUBMIT_GET_MAINTENANCES,
  SUBMIT_OPEN_NEW_MAINTENANCE,
  SUBMIT_COMPLETE_MAINTENANCE,
  SUBMIT_REJECT_MAINTENANCE,
  SUBMIT_GET_CLEANINGS,
  SUBMIT_OPEN_NEW_CLEANING,
  SUBMIT_REJECT_CLEANING,
  SUBMIT_COMPLETE_CLEANING,
  // Pagination
  // Inspeciton
  INSPECTION_FETCH_COUNT_DATA,
  INSPECTION_GET_DATA_REQUEST_STATUS,
  INSPECTION_REVIEW_REQUEST_STATUS,
  // Maintenace
  MAINTENANCE_FETCH_COUNT_DATA,
  MAINTENANCE_GET_DATA_REQUEST_STATUS,
  // Cleaning
  CLEANING_FETCH_COUNT_DATA,
  CLEANING_GET_DATA_REQUEST_STATUS,
} from "./constants";
import { actionTypes } from "./constants";
import { createAction } from "utilities";

export const inspectionActions = {
  resetNotification,
  displayNotification,
  submitOpenInspectionTemplate,
  submitOpenNewInspection,
  submitGetUnitsTemplate,
  getAllInspection,
  getInspection,
  receiveInspection,
  receiveLocation,
  getCostTypes,
  getContacts,
  getDebtorContacts,
  submitRejectInspection,
  submitcompletedInspection,
  submitedCompletedInpsection,
  submitDownloadFileReport,
  getAllMaintenance,
  submitOpenNewMaintenance,
  submitRejectMaintenance,
  submitcompletedMaintenance,
  getAllCleaning,
  submitOpenNewCleaning,
  submitRejectCleaning,
  submitcompletedCleaning,
  // Paginations
  // Inspection
  fetchCountInspections,
  setStatusRequestInspections,
  setStatusRequestInspectionData,
  // Maintenace
  fetchCountMaintenance,
  setStatusRequestMaintenance,
  // Cleaning
  fetchCountCleaning,
  setStatusRequestCleaning,
};

function displayNotification(type, message) {
  return {
    type: RECEIVE_MESSAGE_INSPECTION,
    payload: Object.assign(
      {},
      {
        type,
        message,
      },
    ),
  };
}
function resetNotification(type) {
  return {
    type: type || RECEIVE_MESSAGE_INSPECTION,
    payload: Object.assign(
      {},
      {
        type: "",
        message: "",
      },
    ),
  };
}

function submitOpenInspectionTemplate(role) {
  return {
    type: GET_INIT_NEW_INSPECTION,
    role: role,
  };
}

function submitOpenNewInspection(inspection) {
  return {
    type: SUBMIT_OPEN_NEW_INSPECTION,
    inspection: inspection,
  };
}

function submitGetUnitsTemplate(unitIds) {
  return {
    type: SUBMIT_GET_UNITS_TEMPLATE,
    unitIds: unitIds,
  };
}

function getAllInspection(searchData) {
  return {
    type: SUBMIT_GET_INSPECTIONS,
    searchData: searchData,
  };
}

function receiveInspection(inspection = {}) {
  return {
    type: RECEIVE_GET_INSPECTION,
    data: inspection,
  };
}

function receiveLocation(location = {}) {
  return {
    type: RECEIVE_GET_LOCATION,
    data: location,
  };
}

function getInspection(id, roleByJobType, user) {
  return {
    type: SUBMIT_GET_INSPECTION,
    id: id,
    roleByJobType,
    user
  };
}

function getCostTypes(params) {
  return {
    type: SUBMIT_GET_COSTTYPES,
    params: params,
  };
}

function getContacts(params) {
  return {
    type: SUBMIT_GET_CONTACTS,
    params: params,
  };
}
function getDebtorContacts() {
  return {
    type: SUBMIT_GET_DEBTORCONTACT,
  };
}
function submitedCompletedInpsection(isSubmitted) {
  return { type: SUBMITED_COMPLETE_INSPECTION, data: isSubmitted };
}
function submitRejectInspection(inspectionId, rejectMessage) {
  return {
    type: SUBMIT_REJECT_INSPECTION,
    inspectionId: inspectionId,
    rejectMessage: rejectMessage,
  };
}
function submitcompletedInspection(inspectionId, inspectionData) {
  return {
    type: SUBMIT_COMPLETE_INSPECTION,
    inspectionId: inspectionId,
    inspectionData: inspectionData,
  };
}

function submitDownloadFileReport(identifier) {
  return {
    type: SUBMIT_DOWNLOAD_REPORT,
    identifier: identifier,
  };
}

// action Maintenance
function getAllMaintenance(searchData) {
  return {
    type: SUBMIT_GET_MAINTENANCES,
    searchData: searchData,
  };
}

function submitOpenNewMaintenance(inspection) {
  return {
    type: SUBMIT_OPEN_NEW_MAINTENANCE,
    inspection: inspection,
  };
}

function submitRejectMaintenance(inspectionId, rejectMessage) {
  return {
    type: SUBMIT_REJECT_MAINTENANCE,
    inspectionId: inspectionId,
    rejectMessage: rejectMessage,
  };
}

function submitcompletedMaintenance(inspectionId, inspectionData) {
  return {
    type: SUBMIT_COMPLETE_MAINTENANCE,
    inspectionId: inspectionId,
    inspectionData: inspectionData,
  };
}

//Cleaning

function getAllCleaning(searchData) {
  return {
    type: SUBMIT_GET_CLEANINGS,
    searchData: searchData,
  };
}

function submitOpenNewCleaning(inspection) {
  return {
    type: SUBMIT_OPEN_NEW_CLEANING,
    inspection: inspection,
  };
}

function submitRejectCleaning(inspectionId, rejectMessage) {
  return {
    type: SUBMIT_REJECT_CLEANING,
    inspectionId: inspectionId,
    rejectMessage: rejectMessage,
  };
}

function submitcompletedCleaning(inspectionId, inspectionData) {
  return {
    type: SUBMIT_COMPLETE_CLEANING,
    inspectionId: inspectionId,
    inspectionData: inspectionData,
  };
}

// Pagination Inspection, Maintenance, Cleaning
// Inspection

function fetchCountInspections(params) {
  return { type: INSPECTION_FETCH_COUNT_DATA, params };
}
function setStatusRequestInspections(status) {
  return { type: INSPECTION_GET_DATA_REQUEST_STATUS, status };
}
// Page detail
function setStatusRequestInspectionData(status) {
  return { type: INSPECTION_REVIEW_REQUEST_STATUS, status };
}
// Maintenance

function fetchCountMaintenance(params) {
  return { type: MAINTENANCE_FETCH_COUNT_DATA, params };
}
function setStatusRequestMaintenance(status) {
  return { type: MAINTENANCE_GET_DATA_REQUEST_STATUS, status };
}

// Cleaning
function fetchCountCleaning(params) {
  return { type: CLEANING_FETCH_COUNT_DATA, params };
}
function setStatusRequestCleaning(status) {
  return { type: CLEANING_GET_DATA_REQUEST_STATUS, status };
}

/**
 * Em Dinh: https://infodation.atlassian.net/browse/EEAC-597?oldIssueView=true
 */
export const updateInspection = (data, jobId, jobType, status) =>
  createAction(actionTypes.UPDATE_INSPECTION, { data, jobId, jobType, status });
export const updateInspectionSuccess = (response) =>
  createAction(actionTypes.UPDATE_INSPECTION_SUCCESS, { response });
export const updateInspectionFailed = (errorMessage) =>
  createAction(actionTypes.UPDATE_INSPECTION_FAILED, { errorMessage });
/**
 * End of Em Dinh
 */
