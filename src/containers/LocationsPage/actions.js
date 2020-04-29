import {
  GET_LOCATIONS,
  RECEIVE_MESSAGE,
  LOAD_INIT_DATA,
  SUBMIT_CREATE_LOCATION,
  SUBMIT_UPDATE_LOCATION,
  GET_LOCATION,
  GET_COUNTRIES,
  GET_REGIONS,
  RECEIVE_LOCATION,
  GET_UNIT,
  ADD_INSPECTION,
  REMOVE_INSPECTION,
  REMOVE_ALL_INSPECTION,
  ADD_SELECTED_UNIT,
  SUBMIT_REMOVE_POINT,
  COPY_INSPECTION_TEMPLATE,
  FETCH_COUNT_LOCATIONS,
  GET_LOCATIONS_REQUEST_STATUS,
  GET_UNIT_REQUEST_STATUS,
  RESET_GET_UNIT_REQUEST_STATUS,
} from "./constants";

export const locationActions = {
  displayNotification,
  resetNotification,
  //Init data
  getLocations,
  getLocation,
  getInitData,
  getCountries,
  getRegions,
  //Location
  submitCreateLocation,
  submitUpdateLocation,
  resetLocation,
  //Inspection template
  getUnit,
  addInspection,
  removeInspection,
  removeAllInspectionByUnitId,
  addSelectedUnit,
  removePointUnit,
  copyInspectionTemplate,
  //Location panigation
  fetchCountLocation,
  setStatusRequestLocations,
  getUnitStatusRequest,
  resetUnitStatusRequest,
};

function removePointUnit(pointId) {
  return { type: SUBMIT_REMOVE_POINT, pointId: pointId };
}
function displayNotification(type, message) {
  return {
    type: RECEIVE_MESSAGE,
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
    type: RECEIVE_MESSAGE,
    payload: Object.assign(
      {},
      {
        type: "",
        message: "",
      },
    ),
  };
}

//Init data
function getLocations(params, type = GET_LOCATIONS) {
  return { type: type, params: params };
}

function getLocation(locationId) {
  return { type: GET_LOCATION, locationId: locationId };
}

function getInitData() {
  return { type: LOAD_INIT_DATA };
}

function getCountries() {
  return { type: GET_COUNTRIES }
}

function getRegions() {
  return { type: GET_REGIONS }
}
//Location
function submitCreateLocation(location, costcenter) {
  return {
    type: SUBMIT_CREATE_LOCATION,
    location: location,
    costcenter: costcenter,
  };
}

function submitUpdateLocation(locationId, location) {
  return {
    type: SUBMIT_UPDATE_LOCATION,
    locationId: locationId,
    location: location,
  };
}

function resetLocation(location = {}) {
  return { type: RECEIVE_LOCATION, data: location };
}

//Inspection template
function getUnit(unitId) {
  return { type: GET_UNIT, unitId: unitId };
}

function getUnitStatusRequest(status) {
  return { type: GET_UNIT_REQUEST_STATUS, data: status };
}
function resetUnitStatusRequest() {
  return { type: RESET_GET_UNIT_REQUEST_STATUS };
}

function addInspection(inspectionTemplate) {
  return { type: ADD_INSPECTION, inspectionTemplate };
}

function removeInspection(inspectionId) {
  return { type: REMOVE_INSPECTION, inspectionId: inspectionId };
}

function removeAllInspectionByUnitId(unitId) {
  return { type: REMOVE_ALL_INSPECTION, unitId: unitId };
}
function addSelectedUnit(unit) {
  return { type: ADD_SELECTED_UNIT, data: unit };
}

function copyInspectionTemplate(unitIdsFrom, unitIdsTo, selectedUnitId) {
  return {
    type: COPY_INSPECTION_TEMPLATE,
    unitIdsFrom,
    unitIdsTo,
    selectedUnitId,
  };
}

// Location pagination
function fetchCountLocation(params) {
  return { type: FETCH_COUNT_LOCATIONS, params };
}

function setStatusRequestLocations(status) {
  return { type: GET_LOCATIONS_REQUEST_STATUS, status };
}
