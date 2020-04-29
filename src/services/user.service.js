import axios from 'axios';
import qs from 'querystring';
import { config } from '../helpers/config';
import { authHeader } from '../helpers';
export const userService = {
    login,
    logout,
    getAccount,
    getUsers
};

function login(username, password) {
    var details = {
        "username": username,
        "password": password,
        "grant_type": "password",
        "scope": "openid"
    };
    const configPost = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': "Basic " + btoa(config.client_id + ":" + config.client_secret)
        }
    }
    return axios.post(`${config.gateway_url_uaa}/oauth/token`, qs.stringify(details), configPost).then(function (response) {
        // handle success
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
function getAccount() {
    return axios.get(`${config.gateway_url_uaa}/api/account`, {
        headers: authHeader()
    })
        .then(function (response) {
            // handle success
            return response.data;
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

function getUsers() {
    return axios.get(`${config.gateway_url_uaa}/users`, {
        headers: authHeader()
    })
        .then(function (response) {
            // handle success
            return response.data;
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

