// import axios from "axios";
// import Config from "../config";
import __ from 'lodash';
import AxiosInstance from './interceptor';
// import authUtils from "./auth";

const internals = {};

// // create an instance of axios
// const instance = axios.create({
//   baseURL: Config.serverURI,
//   headers: { "Content-Type": "application/json" },
// });

// // when user login and received a token
// // then set Authorization
// const setAuthTokenToHeaders = token => {
//   if (token && token.length) {
//     instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete instance.defaults.headers.common["Authorization"];
//   }
// };
// if (authUtils.getToken()) {
//   setAuthTokenToHeaders(authUtils.getToken());
// }

// internals.setAuthTokenToHeaders = setAuthTokenToHeaders;

internals.get = (url, params, options) => {
  let config = {
    method: "GET",
    url: url,
    params
  };
  config = Object.assign(config, options);
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error && __.isObject(error.data)) {
        throw error.response.data;
      }
      throw new Error(error.statusText);
    });
};

internals.post = (url, payload, options) => {
  let config = {
    method: "POST",
    url: url,
    data: payload
  };
  config = Object.assign(config, options);
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error && __.isObject(error.data)) {
        throw error.data;
      }
      throw new Error(error.statusText);
    });
};


internals.put = (url, payload, options) => {
  let config = {
    method: "PUT",
    url: url,
    data: payload
  };
  config = Object.assign(config, options);
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error && __.isObject(error.data)) {
        throw error.data;
      }
      throw new Error(error.statusText);
    });
};

export default internals;
