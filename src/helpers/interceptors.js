import axios from 'axios';
import { userActions } from '../actions';
export default {
  setupInterceptors: (store, history) => {
    axios.interceptors.response.use((response) => {
      console.log('interceptors success: ', response);
      return response;
    }, function (error) {
      console.log('interceptors error: ', error);
      // Do something with response error
      if (error.response && error.response.status === 401) {
        console.log('unauthorized, logging out ...');
        store.dispatch(userActions.logout());
        history.push('/login');
      }
      if (error.response) {
        console.log('error response', error.response);
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.error_description) {
          return Promise.reject(error.response.data.error_description);
        } else if (error.response.data.title) {
          return Promise.reject(error.response.data.title);
        } else if (error.response.data.message) {
          return Promise.reject(error.response.data.message);
        }
      } else if (error.request) {
        console.log('error request', error.request);
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        if (error.request.response) {
          if (typeof error.request.response === 'string') {
            let errorText = JSON.parse(error.request.response);
            return Promise.reject(errorText.error_description || '');
          }
        }
      }
      // Something happened in setting up the request that triggered an Error
      return Promise.reject('Most likely a server timeout or an internet connection error');
    });
  },
};