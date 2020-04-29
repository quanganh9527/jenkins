import { takeLatest, call, put, all, takeEvery } from "redux-saga/effects";
import { push } from "react-router-redux";
import {
  GET_PERSON_ALL,
  GET_PERSONS,
  RECEIVE_PERSON_ALL,
  RECEIVE_PERSONS,
  RECEIVE_MESSAGE_CONTACT,
  GET_GROUPING_ALL,
  GET_GROUPINGS,
  GET_GROUPING,
  RECEIVE_GROUPING_ALL,
  RECEIVE_GROUPINGS,
  RECEIVE_GROUPING,
  SUBMIT_CREATE_GROUPING,
  SUBMIT_UPDATE_GROUPING,
  RECEIVE_COUNTRIES,
  LOAD_INIT_DATA_GROUPING,
  LOAD_INIT_DATA_PERSON,
  GET_PERSON,
  RECEIVE_PERSON,
  SUBMIT_CREATE_PERSON,
  SUBMIT_UPDATE_PERSON,
  LOAD_INIT_DATA_DEBTOR_CONTACT,
  RECEIVE_DEBTOR_CONTACTS,
  RECEIVE_DEBTOR_CONTACT,
  SUBMIT_CREATE_DEBTOR_CONTACT,
  SUBMIT_UPDATE_DEBTOR_CONTACT,
  SET_ERRORS_FORM_GROUPING,
  GET_DEBTOR_CONTACT_LIST,
  FETCH_COUNT_PEOPLE,
  FETCH_COUNT_PEOPLE_SUCCESS,
  GET_PEOPLE_REQUEST_STATUS,
  FETCH_COUNT_GROUPING,
  FETCH_COUNT_GROUPING_SUCCESS,
  GET_GROUPING_REQUEST_STATUS,
  DEBTOR_CONTACT_REQUEST_STATUS,
} from "./constants";
import { HIDDEN_STATUS_REQUEST_LOADING_PROVIDER } from "../LoadingProvider/constants";
import { locationService, contactService } from "../../services";

//Init data
export function* getPersonAll() {
  try {
    const person = yield call(locationService.getContactPerson);
    yield put({ type: RECEIVE_PERSON_ALL, data: person });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

export function* getPersons({ params }) {
  try {
    yield put({ type: GET_PEOPLE_REQUEST_STATUS, data: true });
    const persons = yield call(locationService.getContactPerson, params);
    yield put({ type: RECEIVE_PERSONS, data: persons });
    yield put({ type: GET_PEOPLE_REQUEST_STATUS, data: false });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put({ type: GET_PEOPLE_REQUEST_STATUS, data: false });
  }
}

function* fetchCountPeople({ params }) {
  try {
    const total = yield call(contactService.fetchCountPeople, params);
    yield put({ type: FETCH_COUNT_PEOPLE_SUCCESS, data: total });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

export function* getGroupingAll() {
  try {
    const groupings = yield call(locationService.getContactGroupings);
    yield put({ type: RECEIVE_GROUPING_ALL, data: groupings });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

export function* getGroupings({ params }) {
  try {
    yield put({ type: GET_GROUPING_REQUEST_STATUS, data: true });
    const groupings = yield call(locationService.getContactGroupings, params);
    yield put({ type: RECEIVE_GROUPINGS, data: groupings });
    yield put({ type: GET_GROUPING_REQUEST_STATUS, data: false });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put({ type: GET_GROUPING_REQUEST_STATUS, data: false });
  }
}

function* fetchCountGrouping({ params }) {
  try {
    const total = yield call(contactService.fetchCountGrouping, params);
    yield put({ type: FETCH_COUNT_GROUPING_SUCCESS, data: total });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

export function* getGrouping({ groupingId }) {
  try {
    const grouping = yield call(contactService.getGrouping, groupingId);
    yield put({ type: RECEIVE_GROUPING, data: grouping });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* getPerson({ personId }) {
  try {
    const person = yield call(contactService.getPerson, personId);
    yield put({ type: RECEIVE_PERSON, data: person });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

// GROUPINGS

function* getInitDataGroupingForm() {
  try {
    const groupings = yield call(locationService.getContactGroupings);
    yield put({ type: RECEIVE_GROUPINGS, data: groupings });

    const countries = yield call(locationService.getCountries);
    yield put({ type: RECEIVE_COUNTRIES, data: countries });

    // const regions = yield call(locationService.getRegions);
    // yield put({ type: RECEIVE_REGIONS, data: regions });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

function* createGrouping({ group }) {
  try {
    let groupingItem = yield call(contactService.addNewGrouping, group);
    yield put({ type: RECEIVE_GROUPING_ALL, itemUpdate: groupingItem });
    let notification = {
      type: "success",
      message: "Grouping added successfully",
      key: "pages.contact.addGrouping.success"
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put(push(`/contacts/group`));
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      message: data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put({ type: SET_ERRORS_FORM_GROUPING, data: data.data });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

function* updateGrouping({ groupId, group }) {
  try {
    let groupingItem = yield call(contactService.updateGrouping, groupId, group);
    yield put({ type: RECEIVE_GROUPING_ALL, itemUpdate: groupingItem });
    let notification = {
      type: "success",
      message: "Grouping updated successfully",
      key: "pages.contact.updateGrouping.success"
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put(push(`/contacts/group`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    let { data } = error;
    yield put({ type: SET_ERRORS_FORM_GROUPING, data: data.data });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

//PERSON
function* getInitDataPersonForm() {
  try {
    const groupings = yield call(locationService.getContactGroupings);
    yield put({ type: RECEIVE_GROUPINGS, data: groupings });

    const countries = yield call(locationService.getCountries);
    yield put({ type: RECEIVE_COUNTRIES, data: countries });

    // const regions = yield call(locationService.getRegions);
    // yield put({ type: RECEIVE_REGIONS, data: regions });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

function* createPerson({ person }) {
  try {
    let personItem = yield call(contactService.addNewPerson, person);
    yield put({ type: RECEIVE_PERSON_ALL, itemUpdate: personItem });
    let notification = {
      type: "success",
      message: "Person added successfully",
      key: "pages.contact.addPerson.success"
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put(push(`/contacts/people`));
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      message: data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

function* updatePerson({ personId, person }) {
  try {
    let personItem = yield call(contactService.updatePerson, personId, person);
    yield put({ type: RECEIVE_PERSON_ALL, itemUpdate: personItem });
    let notification = {
      type: "success",
      message: "Person updated successfully",
      key: "pages.contact.updatePerson.success"
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put(push(`/contacts/people`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

//DebtorCotact
function* getInitDataDebtorCotact() {
  try {
    const persons = yield call(locationService.getContactPerson);
    yield put({ type: RECEIVE_PERSONS, data: persons });

    const groupings = yield call(locationService.getContactGroupings);
    yield put({ type: RECEIVE_GROUPINGS, data: groupings });

    const debtorContacts = yield call(contactService.getDebtorContactList);
    yield put({ type: RECEIVE_DEBTOR_CONTACTS, data: debtorContacts });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

function* getDebtorContactList() {
  try {
    yield put({ type: DEBTOR_CONTACT_REQUEST_STATUS, data: true });
    const debtorContacts = yield call(contactService.getDebtorContactList);
    yield put({ type: RECEIVE_DEBTOR_CONTACTS, data: debtorContacts });
    yield put({ type: DEBTOR_CONTACT_REQUEST_STATUS, data: false });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
    yield put({ type: DEBTOR_CONTACT_REQUEST_STATUS, data: false });
  }
}

function* createDebtorCotact({ debtorContact }) {
  try {
    const debtor = yield call(contactService.addDebtorCotact, debtorContact);
    yield put({ type: RECEIVE_DEBTOR_CONTACT, data: debtor });
    let notification = {
      type: "success",
      message: "Added successfully",
      key: "pages.contact.addDebtor.success"
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });

    const debtorContacts = yield call(contactService.getDebtorContactList);
    yield put({ type: RECEIVE_DEBTOR_CONTACTS, data: debtorContacts });
  } catch (error) {
    let { data } = error;
    let notification = {
      type: "error",
      message: data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

function* updateDebtorCotact({ debtorId, debtorContact }) {
  try {
    const debtor = yield call(
      contactService.updateDebtorCotact,
      debtorId,
      debtorContact,
    );
    yield put({ type: RECEIVE_DEBTOR_CONTACT, data: debtor });
    let notification = {
      type: "success",
      message: "Updated successfully",
      key: "pages.contact.updateDebtor.success"
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });

    const debtorContacts = yield call(contactService.getDebtorContactList);
    yield put({ type: RECEIVE_DEBTOR_CONTACTS, data: debtorContacts });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CONTACT, notification });
  }
}

export default function defaultContactSaga() {
  return function* watchContactSaga() {
    yield all([
      yield takeLatest(GET_PERSON_ALL, getPersonAll),
      yield takeLatest(GET_PERSONS, getPersons),
      yield takeLatest(GET_GROUPING_ALL, getGroupingAll),
      yield takeLatest(GET_GROUPINGS, getGroupings),
      yield takeEvery(FETCH_COUNT_PEOPLE, fetchCountPeople),
      yield takeEvery(FETCH_COUNT_GROUPING, fetchCountGrouping),

      yield takeLatest(GET_GROUPING, getGrouping),
      yield takeEvery(LOAD_INIT_DATA_GROUPING, getInitDataGroupingForm),
      yield takeEvery(SUBMIT_CREATE_GROUPING, createGrouping),
      yield takeEvery(SUBMIT_UPDATE_GROUPING, updateGrouping),

      yield takeEvery(LOAD_INIT_DATA_PERSON, getInitDataPersonForm),
      yield takeLatest(GET_PERSON, getPerson),
      yield takeEvery(SUBMIT_CREATE_PERSON, createPerson),
      yield takeEvery(SUBMIT_UPDATE_PERSON, updatePerson),

      yield takeEvery(LOAD_INIT_DATA_DEBTOR_CONTACT, getInitDataDebtorCotact),
      yield takeLatest(GET_DEBTOR_CONTACT_LIST, getDebtorContactList),
      yield takeEvery(SUBMIT_CREATE_DEBTOR_CONTACT, createDebtorCotact),
      yield takeEvery(SUBMIT_UPDATE_DEBTOR_CONTACT, updateDebtorCotact),
    ]);
  };
}
