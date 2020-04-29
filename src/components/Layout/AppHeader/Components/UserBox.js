import React, { Fragment, memo } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
  DropdownItem,
} from "reactstrap";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

import "./styles.scss";

import { useUserDispatch } from "../../../../containers/LoginPage/context";
import { useSelector } from "react-redux";
import { authUtils } from "../../../../utilities";
import { FormattedMessage } from "react-intl";

function UserBox() {
  const history = useHistory();
  const dispatch = useUserDispatch();
  const profile = useSelector(state => state.profile);

  const userInfo = authUtils.getUserInfo();
  const user = profile.user || userInfo || {};
  const { signOut } = dispatch;

  const onHandleLogOut = () => {
    signOut(history);
  };

  const onHandleGotoProfile = () => {
    history.push("/user-profile");
  };

  return (
    <Fragment>
      <div className="pr-0 pl-3 ml-1">
        <div className="widget-content p-0">
          <div className="widget-content-wrapper">
            <div className="widget-content-left">
              <UncontrolledButtonDropdown>
                <DropdownToggle
                  color="default"
                  className="p-0 d-flex align-items-center"
                >
                  <div className="user-header-name mr-5">
                    <div className="widget-heading">{`${user.firstName ||
                      ""} ${user.lastName || ""}`}</div>
                  </div>
                  <FontAwesomeIcon className="opacity-8" icon={faAngleDown} />
                </DropdownToggle>

                <DropdownMenu
                  right
                  className="rm-pointers dropdown-menu-sm dropdown-menu-hover-link"
                >
                  <DropdownItem onClick={onHandleGotoProfile}>
                    <span>
                      <FormattedMessage id="layouts.appHeader.userBox.profile" />
                    </span>
                  </DropdownItem>
                  <DropdownItem onClick={onHandleLogOut}>
                    <span>
                      <FormattedMessage id="layouts.appHeader.userBox.logout" />
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default memo(UserBox);
