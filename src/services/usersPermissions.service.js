import AxiosInstance from '../utilities/interceptor';
import { filter, includes, find } from 'lodash';
export const usersPermissions = {
  fetchUsers,
  fetchRoles,
  addAccount,
  updateAccount,
  updatePassword,
  updatePasswordProfile
};

function fetchUsers(params) {
  let config = {
    method: "GET",
    url: '/users',
  };
  if (params) {
    config.params = params;
  }
  config.params = { ...params || {}, "_sort": "updatedDate:DESC", "_limit": -1 };
  return AxiosInstance(config)
    .then(response => {
      let users = filter(response.data || [], item => find(item.roles, roleItem => roleItem.type !== 'root'));
      return users;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function fetchRoles() {
  let config = {
    method: "GET",
    url: '/users-permissions/roles',
  };
  config.params = { ...config.params || {}, "_limit": -1 };
  return AxiosInstance(config)
    .then(response => {
      let roles = filter(response.data.roles || [], item => !includes(['root','authenticated', 'public' ], item.type));
      return roles;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function addAccount(account) {
  let config = {
    method: "POST",
    url: `/users`,
    data: account
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function updateAccount(userId, account) {
  let config = {
    method: "PUT",
    url: `/users/${userId}`,
    data: account
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}
function updatePassword(userId, password) {
  let config = {
    method: "PUT",
    url: `users/admin/${userId}`,
    data: { password }
  };
  return AxiosInstance(config)
    .then(response => {
      console.log('update password success: ', response);
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function updatePasswordProfile(password) {
  let config = {
    method: "POST",
    url: `/auth/reset-password/me`,
    data: { password }
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}