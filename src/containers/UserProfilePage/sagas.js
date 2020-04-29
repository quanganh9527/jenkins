import { takeEvery, call, put, all, takeLatest } from "redux-saga/effects";
import {
  UPDATE_PROFILE,
  RECEIVE_PROFILE,
  UPDATE_PASSWORD_PROFILE,
  RECEIVE_MESSAGE,
  FETCH_USER,
  UPDATE_USER,
  UPDATE_USER_PASSWORD,
} from "./constants";

import { RECEIVE_LOCALE } from "../LanguageProvider/constants";

import { usersPermissions } from "../../services/usersPermissions.service";

// ###
import { authUtils } from "../../utilities";
import * as userAPI from "../LoginPage/services";
import {
  fetchUserSucceeded,
  updateUserSucceeded,
  updateUserPasswordSucceeded,
} from "./actions";

export function* updateProfile({ data }) {
  try {
    const response = yield call(usersPermissions.updateAccount, "me", data);
    const notification = {
      type: "success",
      message: response.message || "Update profile success",
    };

    authUtils.setUserInfo({
      firstName: response.firstName,
      lastName: response.lastName,
    });
    yield put({ type: RECEIVE_PROFILE, response });
    yield put({ type: RECEIVE_MESSAGE, notification });
  } catch (error) {
    console.log("TCL: function*updateProfile -> error", error);
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

export function* updatePasswordProfile({ password }) {
  try {
    const response = yield call(
      usersPermissions.updatePasswordProfile,
      password,
    );
    let notification = {
      type: "success",
      message: response.message || "Update password success",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

export function* fetchUserProfile() {
  try {
    const data = yield call(userAPI.getProfile);
    yield put(fetchUserSucceeded(data));
  } catch (error) {
    console.log("TCL: function*fetchUserProfile -> error", error);
  }
}

export function* updateUser({ payload }) {
  try {
    const { user, setIsSubmitting } = payload;
    const updatedUser = yield call(usersPermissions.updateAccount, "me", user);
    const notification = {
      type: "success",
      message: "Update profile success",
      key: "pages.profile.updateProfile.success",
    };
    authUtils.setUserInfo({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });
    yield put(updateUserSucceeded(updatedUser));
    yield put({ type: RECEIVE_LOCALE, data: updatedUser.language });
    setIsSubmitting(false);
    yield put({ type: RECEIVE_MESSAGE, notification });
  } catch (error) {
    const notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

export function* updateUserPassword({ payload }) {
  try {
    const { password, setIsSubmitting, onToggleOpen } = payload;
    const response = yield call(
      usersPermissions.updatePasswordProfile,
      password,
    );
    let notification = {
      type: "success",
      message: response.message || "Update password success",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
    setIsSubmitting(false);
    onToggleOpen();
    yield put(updateUserPasswordSucceeded());
  } catch (error) {
    const notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE, notification });
  }
}

export default function defaultProfileSaga() {
  return function* watchProfileSaga() {
    yield all([
      yield takeEvery(UPDATE_PROFILE, updateProfile),
      yield takeEvery(UPDATE_PASSWORD_PROFILE, updatePasswordProfile),
      yield takeLatest(FETCH_USER, fetchUserProfile),
      yield takeLatest(UPDATE_USER, updateUser),
      yield takeLatest(UPDATE_USER_PASSWORD, updateUserPassword),
    ]);
  };
}
