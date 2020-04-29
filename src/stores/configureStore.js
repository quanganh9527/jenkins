import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import { history } from "../utilities/history";

const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState = {}) {
  /**
   *
   * Create store with 2 middlewares
   * 1. sagaMiddleware
   * 2. routerMiddleware
   *
   */

  let middlewares = [sagaMiddleware, routerMiddleware(history)];

  /**
   *
   * If env is developments then add redux-logger
   * to middlewares
   *
   */
  if (process.env.NODE_ENV === "development") {
    const { createLogger } = require("redux-logger");
    const logger = createLogger({
      collapsed: true,
    });
    middlewares.push(logger);
  }

  const enhancers = [applyMiddleware(...middlewares)];

  // config with redux-devtool
  const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    name: "EE-Accomodations",
    shouldHotReload: false,
  });

  const store = createStore(
    rootReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );

  if (module.hot) {
    module.hot.accept("./rootReducer.js", () => {
      import("./rootReducer").then(reducerModule => {
        const createReducers = reducerModule.default;
        const nextReducers = createReducers(store.injectedReducers);
        store.replaceReducer(nextReducers);
      });
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
}

const store = configureStore({});
export default store;
