import React from "react";
// import PropTypes from "prop-types";
import Select from "react-select";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Row,
  Col,
  FormGroup,
  CardBody,
  CardTitle,
  Label,
  Button,
  UncontrolledTooltip,
  CustomInput,
} from "reactstrap";
import { isEmpty } from "lodash";

import ReactSelectLazy from "components/ReactSelectLazy";

import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";

// ### icons
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";

const TableFilters = (props) => {
  const {
    intl,
    location,
    onHandleResetFilters,
    // onChangeLocationSelect,
    onChangeUnitSelect,
    onChangeSubUnitSelect,
    onChangeInspectorSelect,
  } = props;

  const filterOption = React.useCallback((option, searchText) => {
    const label = option.data.label.toLowerCase();
    const text = searchText.toLowerCase();
    if (label.includes(text)) {
      return true;
    } else {
      return false;
    }
  }, []);

  return (
    <Row className="justify-content-center">
      <Col sm={11}>
        <CardTitle className="d-flex align-items-center mb-0">
          <FormattedMessage id="components.formTitle.filters" />
          <Button
            color="link"
            type="button"
            onClick={onHandleResetFilters}
            className="btn-icon btn-icon-only btn-pill btn-filter"
            id="UncontrolledTooltipExample"
          >
            <FontAwesomeIcon icon={faFilter} className="fas fa-slash" />
            <FontAwesomeIcon icon={faTimes} className="second-icon" />
          </Button>
          <UncontrolledTooltip
            placement="right"
            target="UncontrolledTooltipExample"
          >
            Clear all filters
          </UncontrolledTooltip>
        </CardTitle>

        <CardBody className="pb-0">
          <FormGroup row>
            <Label sm={2}>
              <FormattedMessage id="pages.inspection.location" />:{" "}
            </Label>
            <Col sm={10}>
              <ReactSelectLazy
                intl={intl}
                value={!isEmpty(location) ? location : null}
                placeholder={intl.formatMessage({
                  id: "components.input.placeholder.locationIdentifier",
                })}
                noOptionsMessage={() => (
                  <FormattedMessage id="components.select.noOption" />
                )}
                // onChange={(val) => onChangeLocationSelect(val)}
                onChange={(val) => {}}
                defaultOptions={[]}
                fetchDataAsync={fetchDataLocationAsync}
                isClearable={true}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={2}>
              <FormattedMessage id="components.table.filters.unit" />:{" "}
            </Label>
            <Col sm={10}>
              <Select
                value={""}
                onChange={onChangeUnitSelect}
                options={[]}
                placeholder={
                  <FormattedMessage id="components.input.placeholder.unitIdentifier" />
                }
                isClearable
                isSearchable
                isDisabled={false}
                filterOption={filterOption}
                noOptionsMessage={() => (
                  <FormattedMessage id="components.select.noOption" />
                )}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={2}>
              <FormattedMessage id="components.table.filters.subUnit" />:{" "}
            </Label>
            <Col sm={10}>
              <Select
                value={""}
                onChange={onChangeSubUnitSelect}
                options={[]}
                placeholder={
                  <FormattedMessage id="components.input.placeholder.subUnitIdentifier" />
                }
                isClearable
                isSearchable
                isDisabled={false}
                filterOption={filterOption}
                noOptionsMessage={() => (
                  <FormattedMessage id="components.select.noOption" />
                )}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={2}>
              <FormattedMessage id="pages.inspection.inspector" />:{" "}
            </Label>
            <Col sm={10}>
              <Select
                value={""}
                onChange={onChangeInspectorSelect}
                options={[]}
                placeholder={
                  <FormattedMessage id="components.input.placeholder.employeeFullName" />
                }
                isClearable
                isSearchable
                isDisabled={false}
                filterOption={filterOption}
                noOptionsMessage={() => (
                  <FormattedMessage id="components.select.noOption" />
                )}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col sm={2}></Col>
            <Col sm={10}>
              <CustomInput
                type="checkbox"
                id="ckbShowDisabled"
                label={
                  <FormattedMessage id="components.checkBox.showOnlyActive" />
                }
                checked={false}
                value={false}
                onChange={() => {}}
              />
            </Col>
          </FormGroup>
        </CardBody>
      </Col>
    </Row>
  );
};

export default React.memo(TableFilters);
