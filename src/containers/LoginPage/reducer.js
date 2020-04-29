import { createReducer } from "../../utilities";
import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT_SUCCESS, GET_CURRENTUSER_SUCCESS } from "./constants";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const handleActions = {
  [LOGIN_SUCCESS]: (state, action) => {
    const { user } = action.payload;
    state.isAuthenticated = true;
    state.user = user;
  },
  [LOGIN_FAILED]: (state, action) => {
    state.isAuthenticated = false;
    state.user = null;
  },
  [LOGOUT_SUCCESS]: (state, action) => {
    state.isAuthenticated = false;
    state.user = null;
  },
  [GET_CURRENTUSER_SUCCESS]: (state, action) => {
    const { user } = action.payload;
    state.user = user;
  },
};

export default createReducer(initialState, handleActions);
export { initialState };
