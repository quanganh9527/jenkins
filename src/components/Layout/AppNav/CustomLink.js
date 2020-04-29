import React, { useEffect } from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { useHistory } from "react-router-dom";

const CustomLink = ({
  className,
  classNameActive,
  classNameHasActiveChild,
  active,
  hasActiveChild,
  to,
  externalLink,
  hasSubMenu,
  toggleSubMenu,
  activateMe,
  children,
}) => {
  const history = useHistory();

  const currentPathName = to.substring(1);

  useEffect(() => {
    history.listen(event => {
      if (event.pathname === currentPathName) {
        activateMe();
      }
    });
  }, [activateMe, history, currentPathName]);

  return hasSubMenu || externalLink ? (
    <a
      className={classnames(
        className,
        active && classNameActive,
        hasActiveChild && classNameHasActiveChild,
      )}
      href={to}
      onClick={hasSubMenu ? toggleSubMenu : activateMe}
      target={externalLink ? "_blank" : undefined}
    >
      {children}
    </a>
  ) : (
    <Link
      className={classnames(className, active ? classNameActive : "")}
      to={currentPathName}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
