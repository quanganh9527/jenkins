import React, { Fragment, memo } from "react";

import Flag from "react-flagkit";

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { useSelector, useDispatch } from "react-redux";
import { languageActions } from "../../../../containers/LanguageProvider/actions";

function HeaderDots() {
  const dispatch = useDispatch();

  const languageState = useSelector(state => state.language);
  const { locale } = languageState;


  const onHandleSwitchLanguage = (lo) => {
    if (lo && lo !== locale) {
      dispatch(languageActions.changeLocale(lo));
    }
  };

  return (
    <Fragment>
      <div className="header-dots ml-5">
        <UncontrolledDropdown>
          <DropdownToggle color="link">
            <div className="icon-wrapper icon-wrapper-alt rounded-circle">
              <div className="icon-wrapper-bg bg-focus" />
              <div className="language-icon">
                {locale === "EN" ? (
                  <Flag className="mr-3 opacity-8" country="GB" size="40" />
                ) : null}
                {locale === "NL" ? (
                  <Flag className="mr-3 opacity-8" country="NL" size="40" />
                ) : null}
              </div>
            </div>
          </DropdownToggle>
          <DropdownMenu right className="rm-pointers">
            <DropdownItem
              active={locale === "EN"}
              onClick={() => onHandleSwitchLanguage("EN")}
            >
              <Flag className="mr-3 opacity-8" country="GB" />
              English
            </DropdownItem>
            <DropdownItem
              active={locale === "NL"}
              onClick={() => onHandleSwitchLanguage("NL")}
            >
              <Flag className="mr-3 opacity-8" country="NL" />
              Dutch
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

      </div>
    </Fragment>
  );
}

export default memo(HeaderDots);
