import {
  GET_PERSONS, RECEIVE_MESSAGE_CONTACT, GET_GROUPINGS, GET_GROUPING, RECEIVE_GROUPING,
  SUBMIT_CREATE_GROUPING, SUBMIT_UPDATE_GROUPING, LOAD_INIT_DATA_GROUPING,
  LOAD_INIT_DATA_PERSON, GET_PERSON, RECEIVE_PERSON, SUBMIT_CREATE_PERSON, SUBMIT_UPDATE_PERSON,
  SUBMIT_CREATE_DEBTOR_CONTACT, SUBMIT_UPDATE_DEBTOR_CONTACT, LOAD_INIT_DATA_DEBTOR_CONTACT,
  SET_ERRORS_FORM_GROUPING, GET_DEBTOR_CONTACT_LIST,
  FETCH_COUNT_GROUPING, GET_GROUPING_REQUEST_STATUS,
  FETCH_COUNT_PEOPLE, GET_PEOPLE_REQUEST_STATUS
} from './constants';

export const contactActions = {
  resetNotification,
  displayNotification,
  getPersons,
  getGroupings,
  getGrouping,
  submitCreateGrouping,
  submitUpdateGrouping,
  getInitDataGrouping,
  setGroupingSelected,
  getInitDataPerson,
  getPerson,
  setPersonSelected,
  submitCreatePerson,
  submitUpdatePerson,
  submitCreateDebtorCotact,
  submitUpdateDebtorCotact,
  getInitDataDebtorContact,
  getDebtorContactList,
  resetErrorsFormGrouping,
  fetchCountPeople,
  setStatusRequestPeople,
  fetchCountGrouping,
  setStatusRequestGrouping
};


function displayNotification(type, message) {
  return {
    type: RECEIVE_MESSAGE_CONTACT,
    payload: Object.assign({}, {
      type,
      message
    })
  }
}
function resetNotification() {
  return {
    type: RECEIVE_MESSAGE_CONTACT,
    payload: Object.assign({}, {
      type: "",
      message: ""
    })
  }
}

// People
function getPersons(params, type = GET_PERSONS) {
  return { type: type, params: params };
}
function fetchCountPeople(params) {
  return { type: FETCH_COUNT_PEOPLE, params }
}
function setStatusRequestPeople(status) {
  return { type: GET_PEOPLE_REQUEST_STATUS, status }
}
// Grouping
function getGroupings(params, type = GET_GROUPINGS) {
  return { type: type, params };
}

function fetchCountGrouping(params) {
  return { type: FETCH_COUNT_GROUPING, params }
}
function setStatusRequestGrouping(status) {
  return { type: GET_GROUPING_REQUEST_STATUS, status }
}
function getGrouping(groupingId) {
  return { type: GET_GROUPING, groupingId: groupingId };
}
// CRU GROUPINGS

function setGroupingSelected(group = {}) {
  return { type: RECEIVE_GROUPING, data: group };
}
function getInitDataGrouping() {
  return { type: LOAD_INIT_DATA_GROUPING };
}
function submitCreateGrouping(group) {
  return { type: SUBMIT_CREATE_GROUPING, group: group }
}
function submitUpdateGrouping(groupId, group) {
  return { type: SUBMIT_UPDATE_GROUPING, groupId: groupId, group: group }
}

// CRU  PERSON
function getInitDataPerson() {
  return { type: LOAD_INIT_DATA_PERSON };
}

function getPerson(personId) {
  return { type: GET_PERSON, personId: personId };
}

function setPersonSelected(person = {}) {
  return { type: RECEIVE_PERSON, data: person };
}

function submitCreatePerson(data) {
  return { type: SUBMIT_CREATE_PERSON, person: data }
}
function submitUpdatePerson(personId, data) {
  return { type: SUBMIT_UPDATE_PERSON, personId: personId, person: data }
}
function resetErrorsFormGrouping() {
  return { type: SET_ERRORS_FORM_GROUPING, data: {} };
}

//DebtorCotact
function getInitDataDebtorContact() {
  return { type: LOAD_INIT_DATA_DEBTOR_CONTACT };
}
function getDebtorContactList() {
  return { type: GET_DEBTOR_CONTACT_LIST };
}

function submitCreateDebtorCotact(data) {
  return { type: SUBMIT_CREATE_DEBTOR_CONTACT, debtorContact: data }
}
function submitUpdateDebtorCotact(debtorId, data) {
  return { type: SUBMIT_UPDATE_DEBTOR_CONTACT, debtorId, debtorContact: data }
}