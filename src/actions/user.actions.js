import { userConstants } from '../constants';
import { alertActions } from './';
import { userService } from '../services';
import { history } from '../helpers';

export const userActions = {
    login,
    logout,
    getCurrentAccount
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        // call api service
        userService.login(username, password).then(user => {
            dispatch(success(user));
            dispatch(getCurrentAccount());
            history.push('/');
        }).catch(error => {
            dispatch(alertActions.error(error));
            dispatch(failure(error));
            console.log('action error', error);
        });
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}
function getCurrentAccount() {
    return dispatch => {
        userService.getAccount().then(user => {
            dispatch(success(user));
        }).catch(error => {
            // dispatch(alertActions.error(error));
            dispatch(logout());
            history.push('/login');
            console.log('action error', error);
        });
    };
    function success(user) { return { type: userConstants.GET_USER, user } }
}