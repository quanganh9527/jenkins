/**
 *
 * PageTitle component
 *
 */
import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Button, FormGroup, CustomInput } from "reactstrap";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import "./styles.scss";

function PageTitle({
  icon,
  heading,
  subheading,
  hasAction = false,
  hasActionName = 'Save',
  hasAddNew = false,
  hasAddNewText = 'Add new',
  addNewLink = "/",
  handleSubmit,
  checkboxParam,
  callFunction = undefined
}) {
  let onHandleAddNew;
  const history = useHistory();
  if (typeof callFunction === 'undefined') {
    onHandleAddNew = () => {
      history.push(addNewLink);
    };
  } else {
    onHandleAddNew = callFunction;
  }

  return (
    <div className="app-page-title">
      <div className="page-title-wrapper">
        <div className="page-title-heading">
          <div className={cx("page-title-icon page-icon-bg")}>
            <i className={icon} />
          </div>
          <div>
            {heading}
            <div className={cx("page-title-subheading")}>{subheading}</div>
          </div>
        </div>

        {hasAction && (
          <div className="page-title-actions">
            <FormGroup inline className="mb-0">
              <CustomInput
                type="checkbox"
                id="exampleCustomCheckbox"
                label={<FormattedMessage id="components.checkBox.active" />}
                checked={checkboxParam.value}
                onChange={() => checkboxParam.handleChange()}
                inline
              />
              <Button
                className="btn-shadow mr-3"
                color="success"
                size="lg"
                onClick={() => handleSubmit()}
              >
                {hasActionName}
              </Button>
            </FormGroup>
          </div>
        )}
        {hasAddNew && (
          <div className="page-title-actions">
            <FormGroup inline className="mb-0">
              <Button
                className="btn-shadow mr-3"
                color="success"
                size="lg"
                type="button"
                onClick={() => onHandleAddNew()}
              >
                {hasAddNewText}
              </Button>
            </FormGroup>
          </div>
        )}
      </div>
    </div>
  );
}

PageTitle.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hasAction: PropTypes.bool,
  hasAddNew: PropTypes.bool,
  hasAddNewText: PropTypes.any,
  hasActionName: PropTypes.any,
  addNewLink: PropTypes.string,
  checkboxParam: PropTypes.shape({
    value: PropTypes.bool,
    handleChange: PropTypes.func,
  }),
  callFunction: PropTypes.func
};

PageTitle.defaultProps = {
  heading: "Dashboard",
  subheading: "",
  icon: "",
  hasAction: false,
  hasAddNew: false,
  hasAddNewText: 'Add new',
  addNewLink: "/",
  hasActionName: "Save",
  checkboxParam: {
    value: false,
    handleChange: () => { },
  },
  callFunction: undefined
};

export default PageTitle;
