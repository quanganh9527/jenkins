import {
  RECEIVE_ROLES,
  RECEIVE_USERS,
  RECEIVE_MESSAGE_EMPLOYEE,
  RESET_FORM_DATA,
  SUBMIT_FORM_DATA,
  ADD_ACCOUNT,
  UPDATE_ACCOUNT,
  SET_ERRORS_FORM,
  SET_LOADING_GET_DATA,
  SET_SHOW_ROW_EMPTY_EMPLOYEE,
} from "./constants";

function employeeReducer(
  state = {
    isLoadingData: false,
  },
  action,
) {
  switch (action.type) {
    case RESET_FORM_DATA:
      return {
        ...state,
        isResetForm: true,
      };
    case SUBMIT_FORM_DATA:
      return {
        ...state,
        isResetForm: false,
      };
    case RECEIVE_MESSAGE_EMPLOYEE:
      return {
        ...state,
        notification: action.payload || action.notification,
      };
    case RECEIVE_ROLES:
      return {
        ...state,
        roles: action.roles,
      };
    case RECEIVE_USERS:
      return {
        ...state,
        users: action.users,
      };
    case ADD_ACCOUNT:
      return {
        ...state,
        users: state.users.concat([action.accountCreated]),
      };
    case UPDATE_ACCOUNT: {
      return {
        ...state,
        users: (state.users || []).map(user =>
          user._id === action.accountUpdated._id ? action.accountUpdated : user,
        ),
      };
    }
    case SET_ERRORS_FORM: {
      return {
        ...state,
        errors: action.data,
      };
    }
    case SET_LOADING_GET_DATA: {
      return {
        ...state,
        isLoadingData: !state.isLoadingData,
      };
    }
    case SET_SHOW_ROW_EMPTY_EMPLOYEE: 
      return {
        ...state,
        isShowRowEmpty: action.isShowRowEmpty,
      };
    default:
      return state;
  }
}
export default employeeReducer;
