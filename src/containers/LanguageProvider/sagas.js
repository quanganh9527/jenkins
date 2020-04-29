import { call, put, all, takeEvery } from "redux-saga/effects";
import {
  CHANGE_LOCALE, RECEIVE_LOCALE
} from "./constants";
import { usersPermissions } from "../../services/usersPermissions.service";


export function* changeLocale({ locale }) {
  try {
    yield call(usersPermissions.updateAccount, "me", { language: locale });
    yield put({ type: RECEIVE_LOCALE, data: locale });
  } catch (error) {
    throw error
    // yield put({ type: RECEIVE_MESSAGE, notification });
  }
}



export default function defaultLanguageSaga() {
  return function* watchLanguageSaga() {
    yield all([
      yield takeEvery(CHANGE_LOCALE, changeLocale),
    ]);
  };
}
