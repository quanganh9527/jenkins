import React, { useEffect } from "react";

import { authUtils } from "../../utilities";
import * as API from "./services";
import {
  logInSuccess,
  logOutSuccess,
  logInFailed,
  getUserCurrent,
} from "./actions";
import loginReducer, { initialState } from "./reducer";
import { useDispatch } from "react-redux";

import LoadingIndicator from "../../components/LoadingIndicator";
import { languageActions } from "../../containers/LanguageProvider/actions";

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

function UserProvider({ children }) {
  const hasToken = authUtils.getToken();
  const dispatchRedux = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await API.getProfile();
        authUtils.setUserInfo({
          firstName: userData.firstName,
          lastName: userData.lastName,
          navigations: userData.navigations,
        });
        dispatchRedux(
          languageActions.setLocale(userData.language.toUpperCase()),
        );
        dispatch(logInSuccess(userData));
      } catch (error) {
        dispatch(logInFailed(error));
      }
    };
    if (!state.user && !!hasToken) {
      getCurrentUser();
    }
  });
  const [state, dispatch] = React.useReducer(loginReducer, {
    ...initialState,
    isAuthenticated: !!hasToken,
  });

  // const { user } = state;
  if (!state.user && !!hasToken) return <LoadingIndicator />;

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const state = React.useContext(UserStateContext);
  if (state === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return state;
}

function useUserDispatch() {
  const dispatchRedux = useDispatch();
  const dispatch = React.useContext(UserDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }

  async function signIn(identifier, password, setIsSubmitting, setError) {
    setIsSubmitting(true);
    setError(null);

    // TODO - call api
    try {
      const user = await API.login(identifier.replace(/\s+/g, ""), password);

      dispatchRedux(
        languageActions.setLocale(user.user.language.toUpperCase()),
      );
      authUtils.setToken(user.jwt);
      authUtils.setUserInfo({
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        navigations: user.user.navigations,
      });
      setIsSubmitting(false);
      setError(null);
      dispatch(logInSuccess(user.user));
    } catch (error) {
      setIsSubmitting(false);
      setError(error.message);
      dispatch(logInFailed(error.message));
    }
  }

  // async function updateProfile(data, setIsSubmitting, setError) {
  //   setIsSubmitting(true);
  //   setError(null);

  //   console.log('updating');
  //   // TODO - call api
  //   try {
  //     const user = await API.update(data);
  //     setIsSubmitting(false);
  //     setError(null);
  //     // dispatch(logInSuccess(user.data.user));
  //   } catch (error) {
  //     setIsSubmitting(false);
  //     setError(error.message);
  //     // dispatch(logInFailed(error.message));
  //   };

  // }

  async function signOut(history) {
    authUtils.clearToken();

    dispatch(logOutSuccess());
    history.push("/login");
    window.location.reload(true);
  }
  async function getProfiletUser() {
    try {
      const user = await API.getProfile();
      authUtils.setUserInfo({
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        navigations: user.user.navigations,
      });
      
      dispatch(getUserCurrent(user.user));
    } catch (error) {
      dispatch(logInFailed(error.message));
    }
  }
  return {
    signIn,
    signOut,
    getProfiletUser,
  };
}

export { UserProvider, useUserState, useUserDispatch };
