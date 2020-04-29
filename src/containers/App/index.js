import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";

// import "./font";
import "./styles.scss";

import { useUserState } from "../LoginPage/context";

// ###
import LoadingIndicator from "../../components/LoadingIndicator";

// ###
import { LoadingProvider } from "../../containers/LoadingProvider";

// ###
import AppLocale from "i18n";

import LoginPage from "../LoginPage";
const AdminLayout = React.lazy(() => import("../Admin"));

export default function App(props) {
  const { isAuthenticated } = useUserState();

  const languageState = useSelector(state => state.language);
  const { locale } = languageState;

  const currentAppLocale = AppLocale[locale];

  return (
    <ConnectedRouter history={props.history}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Suspense fallback={<LoadingIndicator />}>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/" component={AdminLayout} />
          </Switch>
          <LoadingProvider />
        </Suspense>
      </IntlProvider>
    </ConnectedRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...options }) {
    const finalComponent = isAuthenticated ? component : LoginPage;
    return <Route {...options} component={finalComponent} />;
  }
}
