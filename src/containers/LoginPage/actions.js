/**
 * LoginPage actions
 */
import { createAction } from "../../utilities";
import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT_SUCCESS, GET_CURRENTUSER_SUCCESS } from "./constants";

export const logInSuccess = user => createAction(LOGIN_SUCCESS, { user });

export const logInFailed = error => createAction(LOGIN_FAILED, { error }, true);

export const logOutSuccess = () => createAction(LOGOUT_SUCCESS, {});
export const getUserCurrent = user => createAction(GET_CURRENTUSER_SUCCESS, { user })
