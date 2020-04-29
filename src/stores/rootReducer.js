/**
 * Root reducer
 */

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import ThemeOptions from "../containers/Theme/ThemeOptions";
import employee from "../containers/EmployeesPage/reducer";
import location from "../containers/LocationsPage/reducer";
import profile from "../containers/UserProfilePage/reducer";
import contact from "../containers/ContactsPage/reducer";

import inspection from "../containers/InspectionsPage/reducer";
import invoice from "../containers/InvoicesPage/reducer";
import language from "../containers/LanguageProvider/reducer";
import loadingProvider from "../containers/LoadingProvider/reducer";
import rentingContract from "containers/ContractsPage/reducer";
import { history } from "../utilities/history";

export default function createReducer() {
  const rootReducer = combineReducers({
    router: connectRouter(history),
    ThemeOptions,
    employee,
    location,
    profile,
    contact,
    inspection,
    invoice,
    language,
    loadingProvider,
    rentingContract
  });

  return rootReducer;
}
