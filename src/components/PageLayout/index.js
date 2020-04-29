/**
 *
 * PageLayout components
 *
 */
import React, { Fragment } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PropTypes from "prop-types";

function PageLayout({ children }) {
  return (
    <Fragment>
      <ReactCSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear={true}
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        {children}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
}

PageLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

PageLayout.defaultProps = {
  children: <></>,
};

export default PageLayout;
