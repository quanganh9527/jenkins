/**
 *
 * Root saga
 *
 */
import { all, fork } from "redux-saga/effects";

import watchAccountSaga from "../containers/EmployeesPage/sagas";
import watchLocationSaga from "../containers/LocationsPage/sagas";
import watchProfieSaga from "../containers/UserProfilePage/sagas";
import watchContactSaga from "../containers/ContactsPage/sagas";

import watchInspectionSaga from "../containers/InspectionsPage/sagas";
import watchInvoiceSaga from "../containers/InvoicesPage/sagas";
import watchLanguageSaga from "../containers/LanguageProvider/sagas";
import watchRentingContract from "containers/ContractsPage/saga";
const rootSaga = function* rootSaga() {
  yield all(
    [
      watchAccountSaga(),
      watchLocationSaga(),
      watchProfieSaga(),
      watchContactSaga(),
      watchInspectionSaga(),
      watchInvoiceSaga(),
      watchLanguageSaga(),
      watchRentingContract()
      // sagas
    ].map(saga => fork(saga)),
  );
};

export default rootSaga;
