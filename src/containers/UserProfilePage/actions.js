import {
  UPDATE_PROFILE,
  UPDATE_PASSWORD_PROFILE,
  RECEIVE_MESSAGE,
  FETCH_USER,
  FETCH_USER_SUCCEEDED,
  FETCH_USER_FAILED,
  RESET_PROPS,
  UPDATE_USER,
  UPDATE_USER_SUCCEEDED,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_PASSWORD_SUCCEEDED,
} from "./constants";

export const profileActions = {
  displayNotification,
  resetNotification,
  updateProFile,
  updatePasswordProfile,
};

function displayNotification(type, message) {
  return {
    type: RECEIVE_MESSAGE,
    payload: Object.assign(
      {},
      {
        type,
        message,
      },
    ),
  };
}
function resetNotification() {
  return {
    type: RECEIVE_MESSAGE,
    payload: Object.assign(
      {},
      {
        type: "",
        message: "",
      },
    ),
  };
}

function updateProFile(data) {
  return { type: UPDATE_PROFILE, data };
}
function updatePasswordProfile(password) {
  return { type: UPDATE_PASSWORD_PROFILE, password };
}

export const fetchUser = () => ({
  type: FETCH_USER,
});
export const fetchUserFailed = error => ({
  type: FETCH_USER_FAILED,
  payload: {
    error,
  },
});
export const fetchUserSucceeded = user => ({
  type: FETCH_USER_SUCCEEDED,
  payload: {
    user,
  },
});
export const resetProps = () => ({
  type: RESET_PROPS,
});

export const updateUser = (user, setIsSubmitting) => ({
  type: UPDATE_USER,
  payload: { user, setIsSubmitting },
});
export const updateUserSucceeded = user => ({
  type: UPDATE_USER_SUCCEEDED,
  payload: { user },
});
export const updateUserPassword = (
  password,
  setIsSubmitting,
  onToggleOpen,
) => ({
  type: UPDATE_USER_PASSWORD,
  payload: { password, setIsSubmitting, onToggleOpen },
});
export const updateUserPasswordSucceeded = () => ({
  type: UPDATE_USER_PASSWORD_SUCCEEDED,
});
