import axios from "axios";
import Config from "../config";
import authUtils from "./auth";
import { useHistory } from "react-router-dom";
const AxiosInstance = axios.create({
  baseURL: Config.serverURI,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  config => {
    let token = authUtils.getToken();

    if (token && token.length) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

AxiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // const originalRequest = error.config;
    if (!error.response) {
      return Promise.reject("Network Error");
    }
    if (error.response.status === 401) {
      authUtils.clearToken();

      const history = useHistory();
      history.push("/login");
      window.location.reload(true);
    }
    // else if ((error.response.status === 401) && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   return AuthService.getToken()
    //     .then(token => {
    //       const authTokenResponse = path(['data', 'response'], token)
    //       AxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + authTokenResponse;
    //       originalRequest.headers['Authorization'] = 'Bearer ' + authTokenResponse;
    //       return axios(originalRequest);
    //     })
    //     .catch(err => err)
    // } else {
    //   return error.response
    // }
    return Promise.reject(error.response);
  },
);

export default AxiosInstance;
