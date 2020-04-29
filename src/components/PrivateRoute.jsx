import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        return (
            localStorage.getItem('user')
                ?
                <div>
                    {
                        rest.loggedIn && rest.user && rest.user.login ?
                            <Component {...props} />
                            :
                            <div className="d-flex justify-content-center"><Spinner  color="primary"/></div>
                    }
                </div>
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        );
    }} />
)
function mapStateToProps(state) {
    const { authentication } = state;
    const { user, loggedIn } = authentication;
    return {
        user,
        loggedIn
    };
}

const connectedHomePage = connect(mapStateToProps)(PrivateRoute);
export { connectedHomePage as PrivateRoute };