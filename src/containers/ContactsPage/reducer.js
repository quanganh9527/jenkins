import {
  //Init data
  RECEIVE_MESSAGE_CONTACT,
  RECEIVE_PERSON_ALL,
  RECEIVE_PERSONS,
  RECEIVE_GROUPING_ALL,
  RECEIVE_GROUPINGS,
  RECEIVE_COUNTRIES,
  RECEIVE_REGIONS,
  //Grouping
  RECEIVE_GROUPING,
  CREATED_GROUPING,
  UPDATED_GROUPING,
  SET_ERRORS_FORM_GROUPING,
  //Person
  RECEIVE_PERSON,
  //Detor
  RECEIVE_DEBTOR_CONTACTS,
  DEBTOR_CONTACT_REQUEST_STATUS,
  RECEIVE_DEBTOR_CONTACT,
  //Pagination
  GET_PEOPLE_REQUEST_STATUS,
  FETCH_COUNT_PEOPLE_SUCCESS,
  GET_GROUPING_REQUEST_STATUS,
  FETCH_COUNT_GROUPING_SUCCESS,
} from "./constants";
import { unionBy } from "lodash";

const initState = {
  isFetchingPeople: false,
  isFetchingGrouping: false,
};
function employeeReducer(state = initState, action) {
  switch (action.type) {
    case RECEIVE_MESSAGE_CONTACT:
      return {
        ...state,
        notification: action.payload || action.notification,
      };
    case RECEIVE_PERSON_ALL:
      return {
        ...state,
        personAll: action.itemUpdate
          ? unionBy([action.itemUpdate], state.personAll, "_id")
          : action.data,
      };
    case RECEIVE_PERSONS:
      return {
        ...state,
        persons: action.data,
      };
    case RECEIVE_GROUPING_ALL:
      return {
        ...state,
        groupingAll: action.itemUpdate
          ? unionBy([action.itemUpdate], state.groupingAll, "_id")
          : action.data,
      };
    case RECEIVE_GROUPINGS:
      return {
        ...state,
        groupings: action.data,
      };
    case RECEIVE_GROUPING:
      return {
        ...state,
        grouping: action.data,
      };
    case RECEIVE_PERSON:
      return {
        ...state,
        person: action.data,
      };
    case CREATED_GROUPING:
      return {
        ...state,
      };
    case RECEIVE_DEBTOR_CONTACTS:
      return {
        ...state,
        debtorContacts: action.data,
      };
    case DEBTOR_CONTACT_REQUEST_STATUS:
      return {
        ...state,
        isFetchingDebtorContact: action.data,
      };
    case RECEIVE_DEBTOR_CONTACT:
      return {
        ...state,
        debtor: action.data,
      };
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        countries: action.data,
      };
    case RECEIVE_REGIONS:
      return {
        ...state,
        regions: action.data,
      };
    case UPDATED_GROUPING:
      return {
        ...state,
      };
    case SET_ERRORS_FORM_GROUPING: {
      return {
        ...state,
        errorsGrouping: action.data,
      };
    }
    case FETCH_COUNT_PEOPLE_SUCCESS:
      return {
        ...state,
        totalOfPeople: action.data,
      };
    case GET_PEOPLE_REQUEST_STATUS:
      return {
        ...state,
        isFetchingPeople: action.data,
      };
    case FETCH_COUNT_GROUPING_SUCCESS:
      return {
        ...state,
        totalOfGrouping: action.data,
      };
    case GET_GROUPING_REQUEST_STATUS:
      return {
        ...state,
        isFetchingGrouping: action.data,
      };
    default:
      return state;
  }
}
export default employeeReducer;
