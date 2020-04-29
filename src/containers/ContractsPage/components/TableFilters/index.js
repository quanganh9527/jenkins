import React from "react";
import { isEmpty } from "lodash";
import {
  Row,
  Col,
  FormGroup,
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  Label,
  Button,
  UncontrolledTooltip,
  CustomInput,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import ReactSelectLazy from "components/ReactSelectLazy";
import { fetchDataCustomer } from "../../utils";
import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";
// ### icons
import {
  faCalendarAlt,
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const TableFilters = (props) => {
  const {
    intl,
    active,
    onChangeStatusActive,
    location,
    onChangeLocationSelect,
    customer,
    onChangeCustomerSelect,
    startDate,
    endDate,
    handleChangeStartDate,
    handleChangeEndDate,
    isRunning,
    onHandleResetFilters,
  } = props;

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
              <FormattedMessage id="components.table.filters.customer" />:{" "}
            </Label>
            <Col sm={10}>
              <ReactSelectLazy
                intl={intl}
                value={!isEmpty(customer) ? customer : null}
                placeholder={intl.formatMessage({
                  id: "components.table.filters.customer",
                })}
                noOptionsMessage={() => (
                  <FormattedMessage id="components.select.noOption" />
                )}
                onChange={(val) => onChangeCustomerSelect(val)}
                defaultOptions={[]}
                fetchDataAsync={(inputSearch, _start, _limit, _options) =>
                  fetchDataCustomer(inputSearch, _start, _limit, _options, intl)
                }
                isDisplayGroup={true}
                isClearable={true}
              />
            </Col>
          </FormGroup>

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
                onChange={(val) => onChangeLocationSelect(val)}
                defaultOptions={[]}
                fetchDataAsync={fetchDataLocationAsync}
                isClearable={true}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={2}>
              <FormattedMessage id="components.table.filters.startDateFrom" />:
            </Label>
            <Col sm={10}>
              <Row>
                <Col sm={5}>
                  <InputGroup>
                    <DatePicker
                      className="form-control"
                      selected={startDate}
                      onChange={handleChangeStartDate}
                      selectsStart
                      endDate={endDate}
                      startDate={startDate}
                      maxDate={endDate}
                      isClearable
                      disabled={isRunning}
                      dateFormat="dd/MM/yyyy"
                    />
                    <InputGroupAddon addonType="append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col sm={2} className="px-0">
                  <Label sm={12}>
                    <FormattedMessage id="components.table.filters.startDateTo" />
                    :{" "}
                  </Label>
                </Col>
                <Col sm={5}>
                  <InputGroup>
                    <DatePicker
                      className="form-control"
                      selected={endDate}
                      onChange={handleChangeEndDate}
                      selectsEnd
                      endDate={endDate}
                      startDate={startDate}
                      minDate={startDate}
                      isClearable
                      disabled={isRunning}
                      dateFormat="dd/MM/yyyy"
                    />
                    <InputGroupAddon addonType="append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>

          <FormGroup row>
            <CustomInput
              type="checkbox"
              id="ckbShowOnlyActve"
              label={
                <FormattedMessage id="components.table.filters.showActive" />
              }
              checked={active}
              value={active}
              onChange={() => onChangeStatusActive(!active)}
            />
          </FormGroup>
        </CardBody>
      </Col>
    </Row>
  );
};

TableFilters.propTypes = {
  active: PropTypes.bool,
  onChangeStatusActive: PropTypes.func,
  locations: PropTypes.arrayOf(PropTypes.object),
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChangeLocationSelect: PropTypes.func,
  handleChangeStartDate: PropTypes.func,
  handleChangeEndDate: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  isRunning: PropTypes.bool,
};

TableFilters.defaultProps = {
  active: true,
  locations: [],
  location: "",
  onChangeLocationSelect: () => {},
  onChangeStatusActive: () => {},
  handleChangeStartDate: () => {},
  handleChangeEndDate: () => {},
  startDate: null,
  endDate: null,
  isRunning: false,
  customers: [],
  customer: "",
  onChangeCustomerSelect: () => {},
};

export default React.memo(TableFilters);
