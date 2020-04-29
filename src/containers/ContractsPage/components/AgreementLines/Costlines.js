/**
 * Costline
 * Start date of a cost line must >= start date of the contract and >= today
 * End date of a cost line must <= end date of the contract and > start date contract and >= today
 */
import React, { useCallback } from "react";
import __ from "lodash";
import {
  Col,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
  ButtonGroup,
  FormFeedback,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import NumberFormat from "react-number-format";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { MinusIcon } from "containers/Icons";

import { costLineOptions, periodOptions } from "../../constants";
import * as selector from "../../selector";
import moment from "moment";
const CostLines = (props) => {
  const {
    intl,
    status,
    endDateContract,
    startDateContract,
    agreementLines,
    setAgreementLines,
    agreement,
    indexAgreement,
    isSubmitted,
  } = props;
  const costTypes = useSelector(selector.makeSelectCostTypes());
  const minDate =
    startDateContract &&
    moment(startDateContract).isValid() &&
    moment(moment(startDateContract).toISOString()).valueOf() > moment(new Date().toISOString()).valueOf()
      ? startDateContract
      : new Date();
  //Local state
  const _costLineOptions = costLineOptions(intl);
  const _periodOptions = periodOptions(intl);

  // Model costline by type

  // Handle form
  const handleChangeValueCostLine = useCallback(
    (indexCostLine, key, value) => {
      let data = [...agreementLines];
      data[indexAgreement].costLineGenerals[indexCostLine][key] = value;
      setAgreementLines(data);
    },
    [agreementLines, indexAgreement, setAgreementLines],
  );
  const hanldeRemmoveCostLine = useCallback(
    (indexCostLine) => {
      let data = [...agreementLines];
      data[indexAgreement].costLineGenerals.splice(indexCostLine, 1);
      setAgreementLines(data);
    },
    [agreementLines, indexAgreement, setAgreementLines],
  );

  return __.map(agreement.costLineGenerals, (costLine, indexCostLine) => {
    const {
      _id: costLineId,
      type,
      period,
      description,
      amount,
      invoiceDate,
      startDate,
      endDate,
      costType,
    } = costLine;
    const isPeriodic = type === "Periodic";

    return (
      <div key={indexCostLine} className="d-flex bd-highlight">
        <div className="p-2 w-100 bd-highlight">
          <FormGroup row className="align-items-center pl-3 pr-3 ">
            <Col sm={3} className="">
              <Select
                className={`${
                  isSubmitted && !type ? "is-invalid" : ""
                } input-selection`}
                value={
                  type
                    ? __.find(_costLineOptions, (item) => item.value === type)
                    : null
                }
                onChange={({ value }) =>
                  handleChangeValueCostLine(indexCostLine, "type", value)
                }
                isDisabled={__.includes([99, 100], status) && costLineId} //Case 99 add new
                options={_costLineOptions}
                placeholder={""}
                noOptionsMessage={() => (
                  <FormattedMessage id="components.select.noOption" />
                )}
                styles={{
                  container: (base, state) => {
                    return {
                      ...base,
                      zIndex: state.isFocused ? "999" : "1",
                    };
                  },
                }}
              />
              {isSubmitted && !type && (
                <FormFeedback className="d-block">
                  {intl.formatMessage({
                    id: "pages.contracts.errors.costLine.type.require",
                  })}
                </FormFeedback>
              )}
            </Col>
            {isPeriodic && (
              <Col sm={3} className="">
                <Select
                  className={`${
                    isSubmitted && !period ? "is-invalid" : ""
                  } input-selection`}
                  value={
                    period
                      ? __.find(_periodOptions, (item) => item.value === period)
                      : null
                  }
                  onChange={({ value }) =>
                    handleChangeValueCostLine(indexCostLine, "period", value)
                  }
                  isDisabled={__.includes([99, 100], status) && costLineId} //Case 99 add new
                  options={_periodOptions}
                  placeholder={""}
                  noOptionsMessage={() => (
                    <FormattedMessage id="components.select.noOption" />
                  )}
                  styles={{
                    container: (base, state) => {
                      return {
                        ...base,
                        zIndex: state.isFocused ? "999" : "1",
                      };
                    },
                  }}
                />
                {isSubmitted && !period && (
                  <FormFeedback className="d-block">
                    {intl.formatMessage({
                      id: "pages.contracts.errors.costLine.period.require",
                    })}
                  </FormFeedback>
                )}
              </Col>
            )}
            <Col sm={isPeriodic ? 6 : 9}>
              <FormattedMessage id="pages.contracts.costlineDesc">
                {(placeholder) => (
                  <Input
                    className={`${
                      isSubmitted && !description ? "is-invalid" : ""
                    }`}
                    type="text"
                    placeholder={placeholder}
                    disabled={__.includes([99, 100], status) && costLineId}
                    value={description || ""}
                    onChange={({ target }) =>
                      handleChangeValueCostLine(
                        indexCostLine,
                        "description",
                        target.value,
                      )
                    }
                    maxLength={250}
                  />
                )}
              </FormattedMessage>
              {isSubmitted && !description && (
                <FormFeedback className="d-block">
                  {intl.formatMessage({
                    id: "pages.contracts.errors.costLine.description.require",
                  })}
                </FormFeedback>
              )}
            </Col>
          </FormGroup>

          <FormGroup row className="align-items-center pl-3 pr-3 ">
            <Col sm={3} className="">
              <Select
                className={`${
                  isSubmitted && __.isEmpty(costType) ? "is-invalid" : ""
                } input-selection`}
                value={costType || null}
                onChange={(val) =>
                  handleChangeValueCostLine(indexCostLine, "costType", val)
                }
                options={costTypes || []}
                placeholder={
                  <FormattedMessage id="components.input.placeholder.costType" />
                }
                isDisabled={__.includes([99, 100], status) && costLineId}
                isSearchable={__.includes([0], status) || !costLineId}
                noOptionsMessage={() => (
                  <FormattedMessage id="components.select.noOption" />
                )}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt._id}
                styles={{
                  container: (base, state) => {
                    return {
                      ...base,
                      zIndex: state.isFocused ? "999" : "1",
                    };
                  },
                }}
              />
              {isSubmitted && __.isEmpty(costType) && (
                <FormFeedback className="d-block">
                  {intl.formatMessage({
                    id: "pages.contracts.errors.costLine.costType.require",
                  })}
                </FormFeedback>
              )}
            </Col>
            {isPeriodic ? (
              <>
                <Col sm={3}>
                  <InputGroup>
                    <DatePicker
                      className={`${
                        isSubmitted &&
                        (!startDate || !moment(startDate).isValid())
                          ? "is-invalid"
                          : ""
                      } form-control`}
                      dayClassName={(date) =>
                        __.includes([29, 30, 31], moment(date).get("date"))
                          ? "disabled-date"
                          : ""
                      }
                      selected={startDate || null}
                      onChange={(date) => {
                        handleChangeValueCostLine(
                          indexCostLine,
                          "startDate",
                          date,
                        );
                        //Set invoiceDate = startDate when periodic
                        handleChangeValueCostLine(
                          indexCostLine,
                          "invoiceDate",
                          date,
                        );
                      }}
                      selectsStart
                      endDate={endDate}
                      startDate={startDate}
                      maxDate={endDate}
                      minDate={minDate}
                      isClearable={
                        !__.includes([99, 100], status) || !costLineId
                      }
                      disabled={__.includes([99, 100], status) && costLineId}
                      dateFormat="dd/MM/yyyy"
                      placeholderText={intl.formatMessage({
                        id: "components.input.placeholder.startDate",
                      })}
                      popperModifiers={{
                        offset: { enabled: true, offset: "5px, 10px" },
                        preventOverflow: {
                          enabled: true,
                          escapeWithReference: false,
                          boundariesElement: "viewport",
                        },
                      }}
                    />

                    <InputGroupAddon addonType="append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                  {isSubmitted && (!startDate || !moment(startDate).isValid()) && (
                    <FormFeedback className="d-block">
                      {intl.formatMessage({
                        id: "pages.contracts.errors.costLine.startDate.require",
                      })}
                    </FormFeedback>
                  )}
                </Col>
                <Col sm={3}>
                  <InputGroup>
                    <FormattedMessage id="components.input.placeholder.endDate">
                      {(placeholder) => (
                        <DatePicker
                          className="form-control"
                          selected={endDate || null}
                          onChange={(date) =>
                            handleChangeValueCostLine(
                              indexCostLine,
                              "endDate",
                              date,
                            )
                          }
                          selectsEnd
                          endDate={endDate}
                          startDate={startDate}
                          minDate={
                            startDate || moment(startDate).isValid()
                              ? moment(startDate).add("days", 1).toDate()
                              : moment(new Date()).add("days", 1).toDate()
                          }
                          maxDate={
                            endDateContract && moment(endDateContract).isValid()
                              ? endDateContract
                              : null
                          }
                          isClearable
                          disabled={__.includes([100], status)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText={placeholder}
                        />
                      )}
                    </FormattedMessage>

                    <InputGroupAddon addonType="append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </>
            ) : (
              <Col sm={6}>
                <InputGroup>
                  <FormattedMessage id="pages.contracts.invoiceDate">
                    {(placeholder) => (
                      <DatePicker
                        className={`${
                          isSubmitted &&
                          (!invoiceDate || !moment(invoiceDate).isValid())
                            ? "is-invalid"
                            : ""
                        } form-control`}
                        dayClassName={(date) =>
                          __.includes([29, 30, 31], moment(date).get("date"))
                            ? "disabled-date"
                            : ""
                        }
                        selected={invoiceDate || null}
                        onChange={(date) =>
                          handleChangeValueCostLine(
                            indexCostLine,
                            "invoiceDate",
                            date,
                          )
                        }
                        disabled={__.includes([99, 100], status) && costLineId}
                        selectsStart
                        endDate={null}
                        startDate={null}
                        maxDate={null}
                        minDate={minDate}
                        isClearable={
                          !__.includes([99, 100], status) || !costLineId
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText={placeholder}
                      />
                    )}
                  </FormattedMessage>

                  <InputGroupAddon addonType="append">
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                  </InputGroupAddon>
                </InputGroup>
                {isSubmitted &&
                  (!invoiceDate || !moment(invoiceDate).isValid()) && (
                    <FormFeedback className="d-block">
                      {intl.formatMessage({
                        id:
                          "pages.contracts.errors.costLine.invoiceDate.require",
                      })}
                    </FormFeedback>
                  )}
              </Col>
            )}

            <Col sm={3}>
              <NumberFormat
                thousandSeparator="."
                decimalSeparator=","
                className={`${
                  isSubmitted && !amount ? "is-invalid" : ""
                } form-control`}
                decimalScale={2}
                fixedDecimalScale={true}
                inputMode="numeric"
                allowNegative={false}
                allowLeadingZeros={false}
                disabled={__.includes([99, 100], status) && costLineId}
                isAllowed={(values) => {
                  const { formattedValue, floatValue } = values;
                  return formattedValue === "" || floatValue <= 10000;
                }}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  handleChangeValueCostLine(
                    indexCostLine,
                    "amount",
                    floatValue,
                  );
                }}
                placeholder="€"
                prefix="€ "
                value={amount || ""}
              />
              {isSubmitted && !amount && (
                <FormFeedback className="d-block">
                  {intl.formatMessage({
                    id: "pages.contracts.errors.costLine.amount.require",
                  })}
                </FormFeedback>
              )}
            </Col>
          </FormGroup>
        </div>
        {(__.includes([0], status) ||
          (!costLineId && __.includes([99], status))) && (
          <div className="p-2 flex-shrink-1 bd-highlight">
            <ButtonGroup size="sm">
              <Button
                color="light"
                className="btn-icon btn-icon-only bd-r-50 btn-condition"
                onClick={() => hanldeRemmoveCostLine(indexCostLine)}
              >
                <MinusIcon />
              </Button>
            </ButtonGroup>
          </div>
        )}
      </div>
    );
  });
};
export default CostLines;
