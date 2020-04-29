import {
  SET_STATUS_REQUEST_LOADING_PROVIDER,
  HIDDEN_STATUS_REQUEST_LOADING_PROVIDER,
} from "./constants";
const initState = {
  isSubmittingStatusProvider: false,
};
function loadingProvider(state = initState, action) {
  switch (action.type) {
    case SET_STATUS_REQUEST_LOADING_PROVIDER:
      return {
        ...state,
        isSubmittingStatusProvider: !state.isSubmittingStatusProvider,
      };
    case HIDDEN_STATUS_REQUEST_LOADING_PROVIDER:
      return {
        ...state,
        isSubmittingStatusProvider: false,
      };
    default:
      return state;
  }
}
export default loadingProvider;
