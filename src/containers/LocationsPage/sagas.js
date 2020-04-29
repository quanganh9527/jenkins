import { takeLatest, call, put, all, takeEvery } from "redux-saga/effects";
import { push } from "react-router-redux";
import {
  GET_LOCATION_ALL,
  GET_LOCATIONS,
  RECEIVE_LOCATIONS,
  RECEIVE_LOCATION_ALL,
  RECEIVE_MESSAGE,
  LOAD_INIT_DATA,
  GET_COUNTRIES,
  GET_REGIONS,
  RECEIVE_COUNTRIES,
  RECEIVE_REGIONS,
  SUBMIT_CREATE_LOCATION,
  SUBMIT_UPDATE_LOCATION,
  GET_LOCATION,
  RECEIVE_LOCATION,
  GET_UNIT,
  RECEIVE_UNIT,
  ADD_INSPECTION,
  SUBMITTING_ADD_INSPECTION,
  REMOVE_INSPECTION,
  REMOVE_ALL_INSPECTION,
  UPDATE_SELECTED_UNIT,
  SUCCESS_REMOVE_ALL,
  SUBMIT_REMOVE_POINT,
  RECEIVE_COSTCENTERS,
  COPY_INSPECTION_TEMPLATE,
  SUCCESS_COPY_INSPECTIONS,
  SUBMITTING_COPY_TEMPLATE,
  FETCH_COUNT_LOCATIONS,
  FETCH_COUNT_LOCATIONS_SUCCESS,
  GET_LOCATIONS_REQUEST_STATUS,
  GET_UNIT_REQUEST_STATUS,
} from "./constants";
import { HIDDEN_STATUS_REQUEST_LOADING_PROVIDER } from "../LoadingProvider/constants";
import { locationService, invoiceService } from "../../services";
import _ from "lodash";

export function* getLocationAll() {
  try {
    //get all locations
      const locations = yield call(locationService.getLocations);
      yield put({ type: RECEIVE_LOCATION_ALL, locations });
      return;
    // yield locations;
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

export function* getLocations({ params, getAll }) {
  try {
    // isFetchData location
    yield put({ type: GET_LOCATIONS_REQUEST_STATUS, data: true });
    const locations = yield call(locationService.getLocations, params);
    yield put({ type: RECEIVE_LOCATIONS, locations });

    yield put({ type: RECEIVE_LOCATION, data: {} });
    yield put({ type: GET_LOCATIONS_REQUEST_STATUS, data: false });
    // yield locations;
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
    yield put({ type: GET_LOCATIONS_REQUEST_STATUS, data: false });
  }
}



export function* getLocation({ locationId }) {
  try {
    if (locationId) {
      const location = yield call(locationService.getLocation, locationId);
      yield put({ type: RECEIVE_LOCATION, data: location });
    } else {
      yield put({ type: RECEIVE_LOCATION, data: {} });
    }
    // yield locations;
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

function* fetchCountLocation({ params }) {
  try {
    const totalLocation = yield call(
      locationService.fetchCountLocations,
      params,
    );
    yield put({ type: FETCH_COUNT_LOCATIONS_SUCCESS, data: totalLocation });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}
export function* getInitData() {
  try {
    // get list countries, regions, contact persons, groupings
    const countries = yield call(locationService.getCountries);
    yield put({ type: RECEIVE_COUNTRIES, data: countries });

    const costCenters = yield call(locationService.getCostCenters, {
      active: true,
    });
    yield put({ type: RECEIVE_COSTCENTERS, data: costCenters });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

export function* getCountries() {
  try {
    // get list countries
    const countries = yield call(locationService.getCountries);
    yield put({ type: RECEIVE_COUNTRIES, data: countries });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

export function* getRegions() {
  try {
    // get list regions
    const regions = yield call(locationService.getRegions);
    yield put({ type: RECEIVE_REGIONS, data: regions });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

/**
 * Saga action location
 */
function* createLocation({ location, costcenter }) {
  try {
    if (costcenter) {
      const costcenterData = yield call(
        invoiceService.addNewCostCenter,
        costcenter,
      );
      location.costcenter = costcenterData._id;
    }

    let locationItem = yield call(locationService.addNewLocation, location);
    yield put({ type: RECEIVE_LOCATION_ALL, itemUpdate: locationItem });
    yield put(push(`/locations`));
    let notification = {
      type: "success",
      message: "Location added successfully",
      key: "pages.location.addLocation.success",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      message: data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}
function* updateLocation({ locationId, location }) {
  try {
    let locationItem = yield call(locationService.updateLocation, locationId, location);
    yield put({ type: RECEIVE_LOCATION_ALL, itemUpdate: locationItem });
    let notification = {
      type: "success",
      message: "Location updated successfully",
      key: "pages.location.updateLocation.success",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
    yield put(push(`/locations`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

/**
 * Saga action inpsection template
 */
export function* getUnit({ unitId }) {
  try {
    const unit = yield call(locationService.getUnit, unitId);
    yield put({ type: RECEIVE_UNIT, data: unit });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: GET_UNIT_REQUEST_STATUS, data: { [unitId]: false } });
  }
}

function* copyInspectionTemplate({ unitIdsFrom, unitIdsTo, selectedUnitId }) {
  try {
    yield put({ type: SUBMITTING_COPY_TEMPLATE, data: true });
    let templates = yield call(
      locationService.getInspectionByUnitIds,
      _.union(unitIdsFrom, unitIdsTo),
    );

    let templateFrom = [];
    let templateTo = [];
    _.forEach(templates, (items) => {
      let unitId = _.get(items, "[0].unitInspection._id", "");
      if (_.includes(unitIdsFrom, unitId)) {
        templateFrom = templateFrom.concat(
          _.orderBy(items, [(item) => item.position || 0]),
        );
      }
      if (_.includes(unitIdsTo, unitId)) {
        templateTo = templateTo.concat(items);
      }
    });

    let data = [];
    _.forEach(unitIdsTo, (unitId) => {
      let maxPossition = _.get(
        _.maxBy(
          templateTo,
          (i) => i.unitInspection._id === unitId && i.position,
        ),
        "position",
        0,
      );
      _.forEach(templateFrom, (teamplate) => {
        data.push({
          unitInspection: unitId,
          itemDescription: teamplate.itemDescription,
          position: ++maxPossition,
        });
      });
    });

    let resp = yield call(locationService.addMultiInspection, data);
    let inspectionOfSelectedUnit = _.filter(
      resp,
      (item) => item.unitInspection._id === selectedUnitId,
    );
    yield put({
      type: SUCCESS_COPY_INSPECTIONS,
      data: inspectionOfSelectedUnit,
    });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
    yield put({ type: SUBMITTING_COPY_TEMPLATE, data: false });
  }
}

function* addInspection({ inspectionTemplate }) {
  try {
    yield put({ type: SUBMITTING_ADD_INSPECTION, data: true });
    let unitData = yield call(
      locationService.addInspection,
      inspectionTemplate,
    );
    yield put({ type: UPDATE_SELECTED_UNIT, data: unitData });
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      message: data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    yield put({ type: SUBMITTING_ADD_INSPECTION, data: false });
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

function* removeInspection({ pointId }) {
  try {
    yield call(locationService.removeInspection, pointId);
    yield put({ type: REMOVE_INSPECTION, data: pointId });
    // yield put(push(`/locations`));
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      message: data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

function* removeAllInspectionByUnitId({ unitId }) {
  try {
    yield call(locationService.removeAllInspectionByUnitId, unitId);
    yield put({ type: SUCCESS_REMOVE_ALL });
    // yield put(push(`/locations`));
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      message: data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export default function defaultLocationSaga() {
  return function* watchLocationSaga() {
    yield all([
      //Init data
      yield takeLatest(GET_LOCATION_ALL, getLocationAll),
      yield takeLatest(GET_LOCATIONS, getLocations),
      yield takeLatest(GET_LOCATION, getLocation),
      yield takeLatest(GET_UNIT, getUnit),
      yield takeLatest(LOAD_INIT_DATA, getInitData),
      yield takeLatest(GET_COUNTRIES, getCountries),
      yield takeLatest(GET_REGIONS, getRegions),

      //Locations
      yield takeEvery(SUBMIT_CREATE_LOCATION, createLocation),
      yield takeEvery(SUBMIT_UPDATE_LOCATION, updateLocation),

      //Inspection teamplate
      yield takeEvery(ADD_INSPECTION, addInspection),
      yield takeEvery(SUBMIT_REMOVE_POINT, removeInspection),
      yield takeEvery(REMOVE_ALL_INSPECTION, removeAllInspectionByUnitId),
      yield takeEvery(COPY_INSPECTION_TEMPLATE, copyInspectionTemplate),

      yield takeEvery(FETCH_COUNT_LOCATIONS, fetchCountLocation),
    ]);
  };
}
