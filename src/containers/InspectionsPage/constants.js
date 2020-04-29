export const RECEIVE_MESSAGE_INSPECTION = "RECEIVE_MESSAGE_INSPECTION";
export const RECEIVE_MESSAGE_MAINTENANCE = "RECEIVE_MESSAGE_MAINTENANCE";
export const RECEIVE_MESSAGE_CLEANING = "RECEIVE_MESSAGE_CLEANING";

export const GET_INIT_NEW_INSPECTION = "GET_INIT_NEW_INSPECTION";
export const RECEIVE_LOCATIONS = "RECEIVE_LOCATIONS";

export const RECEIVE_INSPECTORS = "RECEIVE_INSPECTORS";

export const SUBMIT_GET_UNITS_TEMPLATE = "SUBMIT_GET_UNITS_TEMPLATE";
export const RECEIVE_UNITS_TEMPLATE = "RECEIVE_UNITS_TEMPLATE";

export const SUBMIT_OPEN_NEW_INSPECTION = "SUBMIT_OPEN_NEW_INSPECTION";

export const SUBMIT_GET_INSPECTIONS = "SUBMIT_GET_INSPECTIONS";
export const SUBMIT_GET_MAINTENANCES = "SUBMIT_GET_MAINTENANCES";
export const SUBMIT_GET_CLEANINGS = "SUBMIT_GET_CLEANINGS";
export const RECEIVE_GET_INSPECTIONS = "RECEIVE_GET_INSPECTIONS";

export const SUBMIT_GET_INSPECTION = "SUBMIT_GET_INSPECTION";
export const RECEIVE_GET_INSPECTION = "RECEIVE_GET_INSPECTION";

export const RECEIVE_GET_LOCATION = "RECEIVE_GET_LOCATION";

export const SUBMIT_GET_COSTTYPES = "SUBMIT_GET_COSTTYPES";
export const RECEIVE_GET_COSTTYPES = "RECEIVE_GET_COSTTYPES";

export const SUBMIT_GET_DEBTORCONTACT = "SUBMIT_GET_DEBTORCONTACT";
export const RECEIVE_GET_DEBTORCONTACT = "RECEIVE_GET_DEBTORCONTACT";

export const SUBMIT_GET_CONTACTS = "SUBMIT_GET_CONTACTS";
export const RECEIVE_GET_PERSONS = "RECEIVE_GET_PERSONS";
export const RECEIVE_GET_GROUPINGS = "RECEIVE_GET_GROUPINGS";

export const SUBMITED_COMPLETE_INSPECTION = "SUBMITED_COMPLETE_INSPECTION";
export const SUBMIT_REJECT_INSPECTION = "SUBMIT_REJECT_INSPECTION";
export const SUBMIT_COMPLETE_INSPECTION = "SUBMIT_COMPLETE_INSPECTION";

export const RECEIVE_LOADING_STATUS = "RECEIVE_LOADING_STATUS";

export const SUBMIT_DOWNLOAD_REPORT = "SUBMIT_DOWNLOAD_REPORT";

// pagination inspecitons
export const INSPECTION_GET_DATA_REQUEST_STATUS =
  "Inspection/GET_DATA_REQUEST_STATUS";
export const INSPECTION_FETCH_COUNT_DATA = "Inspection/FETCH_COUNT_DATA";
export const INSPECTION_FETCH_COUNT_DATA_SUCCESS =
  "Inspection/FETCH_COUNT_DATA_SUCCESS";

export const INSPECTION_REVIEW_REQUEST_STATUS =
  "InspectionReview/INSPECTION_REVIEW_REQUEST_STATUS";

// Maintenance Actions
export const SUBMIT_OPEN_NEW_MAINTENANCE = "SUBMIT_OPEN_NEW_MAINTENANCE";
export const RECEIVE_GET_MAINTENANCES = "RECEIVE_GET_MAINTENANCES";
export const SUBMIT_REJECT_MAINTENANCE = "SUBMIT_REJECT_MAINTENANCE";
export const SUBMIT_COMPLETE_MAINTENANCE = "SUBMIT_COMPLETE_MAINTENANCE";

export const MAINTENANCE_GET_DATA_REQUEST_STATUS =
  "Maintenance/GET_DATA_REQUEST_STATUS";
export const MAINTENANCE_FETCH_COUNT_DATA = "Maintenance/FETCH_COUNT_DATA";
export const MAINTENANCE_FETCH_COUNT_DATA_SUCCESS =
  "Maintenance/FETCH_COUNT_DATA_SUCCESS";

// Cleaning Actions
export const RECEIVE_GET_CLEANINGS = "RECEIVE_GET_CLEANINGS";
export const SUBMIT_OPEN_NEW_CLEANING = "SUBMIT_OPEN_NEW_CLEANING";
export const SUBMIT_REJECT_CLEANING = "SUBMIT_REJECT_CLEANING";
export const SUBMIT_COMPLETE_CLEANING = "SUBMIT_COMPLETE_CLEANING";

// Pagination
export const CLEANING_GET_DATA_REQUEST_STATUS =
  "Cleaning/GET_DATA_REQUEST_STATUS";
export const CLEANING_FETCH_COUNT_DATA = "Cleaning/FETCH_COUNT_DATA";
export const CLEANING_FETCH_COUNT_DATA_SUCCESS =
  "Cleaning/FETCH_COUNT_DATA_SUCCESS";

// Constants Variable
export const INSPECTION_STATUS = {
  OPEN: "Open",
  INPROGRESS: "In Progress",
  READY: "Ready",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

export const INSPECTION_ITEM_STATUS = {
  NONE: "None",
  GREEN: "Green",
  YELLOW: "Yellow",
  RED: "Red",
};

export const BILL_TYPE = {
  CUSTOM: "Custom",
  RENT: "Rent",
  JOB: "Job",
};

export const BILL_STATUS = {
  OPEN: "Open",
  CLOSED: "Closed",
};

export const INSPECTION_JOB_TYPES = {
  INSPECTION: "Inspection",
  MAINTENANCE: "Maintenance",
  CLEANING: "Cleaning",
};
// maintenance_viewer, cleaning_viewer, inspection_viewer

export const ROLE_INSPECTION_CAN_VIEW = [
  "root",
  "inspection_reviewer_all_inspections",
  // "inspection_planner",
];
export const ROLE_MAINTENANCE_CAN_VIEW = [
  "root",
  "maintenance_reviewer",
  // "maintenance_planner",
];
export const ROLE_CLEANING_CAN_VIEW = [
  "root",
  "cleaning_reviewer",
  // "cleaning_planner",
];


export const ROLE_INSPECTION_CAN_EDIT = [
  "root",
  "inspection_planner",
];
export const ROLE_MAINTENANCE_CAN_EDIT = [
  "root",
  "maintenance_planner",
];
export const ROLE_CLEANING_CAN_EDIT = [
  "root",
  "cleaning_planner",
];

export const ROLE_INSPECTION_CAN_REVIEW = [
  "root",
  "inspection_reviewer_all_inspections",
];
export const ROLE_MAINTENANCE_CAN_REVIEW = [
  "root",
  "maintenance_reviewer",
];
export const ROLE_CLEANING_CAN_REVIEW = [
  "root",
  "cleaning_reviewer",
];
// ----------

export const ROLE_INSPECTION_PLANNER = ["inspection_planner"];
export const ROLE_MAINTENANCE_PLANNER = ["maintenance_planner"];
export const ROLE_CLEANING_PLANNER = ["cleaning_planner"];

export const ROLE_INSPECTION_VIEWER = ["inspection_viewer"];
export const ROLE_MAINTENANCE_VIEWER = ["maintenance_viewer"];
export const ROLE_CLEANING_VIEWER = ["cleaning_viewer"];

/**
 * Em Dinh: https://infodation.atlassian.net/browse/EEAC-597?oldIssueView=true
 */
const UPDATE_INSPECTION = "UPDATE_INSPECTION";
const UPDATE_INSPECTION_SUCCESS = "UPDATE_INSPECTION_SUCCESS";
const UPDATE_INSPECTION_FAILED = "UPDATE_INSPECTION_FAILED";
export const actionTypes = {
  UPDATE_INSPECTION,
  UPDATE_INSPECTION_SUCCESS,
  UPDATE_INSPECTION_FAILED,
};
/**
 * End of Em Dinh
 */
