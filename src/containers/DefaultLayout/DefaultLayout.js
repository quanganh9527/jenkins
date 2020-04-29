import React, { Fragment, Component } from 'react';
import { Route } from 'react-router-dom';

// Layout

import AppHeader from './AppHeader/';
import AppSidebar from './AppSidebar/';
// import AppFooter from './AppFooter/';

// Theme Options
// import ThemeOptions from '../../Layout/ThemeOptions/';

class DefaultLayout extends Component {

    render() {
        return (
            <Fragment>
                {/* <ThemeOptions/> */}
                <AppHeader />
                <div className="app-main">
                    <AppSidebar />
                    <div className="app-main__outer">
                        <div className="app-main__inner">
                            DashBoard
                             </div>
                        {/* <AppFooter /> */}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default DefaultLayout;
