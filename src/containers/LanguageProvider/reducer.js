import { RECEIVE_LOCALE } from './constants';

const initialState = {
  locale: "EN"
}

function languageReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_LOCALE:
      return {
        ...state,
        locale: action.data || "EN"
      }
    default:
      return state
  }
}
export default languageReducer