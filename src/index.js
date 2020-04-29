import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import { createHashHistory } from "history";

import * as serviceWorker from "./serviceWorker";

import store from "./stores/configureStore";
import App from "./containers/App";
import { UserProvider } from "./containers/LoginPage/context";

import { history } from "./utilities/history";

(async window => {
  // const initialState = {};
  // const history = createHashHistory({ basename: "/" });
  // const store = configureStore(initialState);
  const rootEl = document.getElementById("root");

  const render = (Component, el) => {
    ReactDOM.render(
      <Provider store={store}>
        <UserProvider>
          <Component history={history} />
        </UserProvider>
      </Provider>,
      el,
    );
  };

  render(App, rootEl);
})(window);

serviceWorker.unregister();
