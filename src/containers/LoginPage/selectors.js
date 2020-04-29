/**
 *
 * LoginPage selectors
 *
 */
import { createSelector } from "reselect";

const selectAuth = state => state.auth;

const selectAuthState = createSelector(
  selectAuth,
  state => state
);

export default selectAuthState;
