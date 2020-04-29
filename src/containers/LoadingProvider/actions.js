import { SET_STATUS_REQUEST_LOADING_PROVIDER } from "./constants";
export const loadingProviderActions = {
  setStatusLoadingProvider,
};

function setStatusLoadingProvider(type) {
  return {
    type: SET_STATUS_REQUEST_LOADING_PROVIDER,
  };
}
