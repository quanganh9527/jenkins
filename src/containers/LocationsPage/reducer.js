import { filter } from "lodash";
import {
  RECEIVE_LOCATIONS,
  RECEIVE_LOCATION_ALL,
  RECEIVE_MESSAGE,
  RECEIVE_PERSONS,
  RECEIVE_GROUPINGS,
  RECEIVE_COUNTRIES,
  RECEIVE_REGIONS,
  RECEIVE_LOCATION,
  RECEIVE_UNIT,
  UPDATE_SELECTED_UNIT,
  ADD_SELECTED_UNIT,
  REMOVE_INSPECTION,
  SUCCESS_REMOVE_ALL,
  SUCCESS_COPY_INSPECTIONS,
  SUBMITTING_ADD_INSPECTION,
  SUBMITTING_COPY_TEMPLATE,
  RECEIVE_COSTCENTERS,
  FETCH_COUNT_LOCATIONS_SUCCESS,
  GET_LOCATIONS_REQUEST_STATUS,
  GET_UNIT_REQUEST_STATUS,
  RESET_GET_UNIT_REQUEST_STATUS,
} from "./constants";
import { unionBy } from "lodash"

const initState = {
  totalLocation: 0,
  fetchingUnitPoint: {},
};
function locationReducer(state = initState, action) {
  switch (action.type) {
    case RECEIVE_MESSAGE:
      return {
        ...state,
        notification: action.payload || action.notification,
      };
    case RECEIVE_LOCATIONS:
      return {
        ...state,
        locations: action.locations,
        isFetching: false,
      };
    case RECEIVE_LOCATION_ALL:
      return {
        ...state,
        locationAll: action.itemUpdate
        ? unionBy([action.itemUpdate], state.locationAll, "_id")
        : action.locations,
      };
    case RECEIVE_LOCATION:
      return {
        ...state,
        location: action.data,
      };
    case RECEIVE_UNIT:
      return {
        ...state,
        unit: action.data,
      };
    case RECEIVE_PERSONS:
      return {
        ...state,
        persons: action.data,
      };
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        countries: action.data,
      };
    case RECEIVE_COSTCENTERS:
      return {
        ...state,
        costCenters: action.data,
      };
    case RECEIVE_REGIONS:
      return {
        ...state,
        regions: action.data,
      };
    case RECEIVE_GROUPINGS:
      return {
        ...state,
        groupings: action.data,
      };
    case ADD_SELECTED_UNIT:
      return {
        ...state,
        unitSelectedTemaplate: action.data,
      };
    case SUBMITTING_ADD_INSPECTION:
      return {
        ...state,
        isAddInspectionSubmitting: action.data || false,
      };
    case UPDATE_SELECTED_UNIT:
      let dataUnitAddedd = action.data;
      let inspectionsAdd = state.unitSelectedTemaplate.inspectiontemplates;
      inspectionsAdd.push(dataUnitAddedd);
      return {
        ...state,
      };
    case REMOVE_INSPECTION:
      let inspectionsRemove = state.unitSelectedTemaplate.inspectiontemplates;
      inspectionsRemove = filter(
        inspectionsRemove,
        (item) => item._id !== action.data,
      );
      state.unitSelectedTemaplate.inspectiontemplates = inspectionsRemove;
      return {
        ...state,
      };
    case SUCCESS_REMOVE_ALL:
      state.unitSelectedTemaplate.inspectiontemplates = [];
      return {
        ...state,
      };
    case SUCCESS_COPY_INSPECTIONS:
      let inspections = state.unitSelectedTemaplate.inspectiontemplates;
      state.unitSelectedTemaplate.inspectiontemplates = inspections.concat(
        action.data,
      );
      return {
        ...state,
      };
    case SUBMITTING_COPY_TEMPLATE:
      return {
        ...state,
        isCopyTemlateSubmitting: action.data,
      };
    case FETCH_COUNT_LOCATIONS_SUCCESS:
      return {
        ...state,
        totalLocation: action.data,
      };
    case GET_LOCATIONS_REQUEST_STATUS:
      return {
        ...state,
        isFetching: action.data,
      };
    case GET_UNIT_REQUEST_STATUS:
      return {
        ...state,
        fetchingUnitPoint: Object.assign(state.fetchingUnitPoint, action.data),
      };
    case RESET_GET_UNIT_REQUEST_STATUS:
      return {
        ...state,
        fetchingUnitPoint: {},
      };
    default:
      return state;
  }
}
export default locationReducer;
