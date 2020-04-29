import {
  RECEIVE_MESSAGE,
  RECEIVE_PROFILE,
  FETCH_USER_SUCCEEDED,
  RESET_PROPS,
  UPDATE_USER_SUCCEEDED,
} from "./constants";

import { createReducer } from "../../utilities";

const initialState = {
  user: null,
  notification: null,
};

// function profileReducer(state = {}, action) {
//   switch (action.type) {
//     case RECEIVE_MESSAGE:
//       return {
//         ...state,
//         notification: action.payload || action.notification
//       }
//     case RECEIVE_PROFILE:
//       return {
//         ...state,
//         user: action.response
//       }
//     default:
//       return state
//   }
// }
// export default profileReducer

const handleActions = {
  [RECEIVE_MESSAGE]: (state, action) => {
    state.notification = action.payload || action.notification;
  },
  [RECEIVE_PROFILE]: (state, action) => {
    state.user = action.response;
  },
  [FETCH_USER_SUCCEEDED]: (state, action) => {
    const { user } = action.payload;
    state.user = user;
  },
  [UPDATE_USER_SUCCEEDED]: (state, action) => {
    const { user } = action.payload;
    state.user = user;
  },
  [RESET_PROPS]: (state, action) => {
    state.user = null;
  },
};

export default createReducer(initialState, handleActions);
export { initialState };
