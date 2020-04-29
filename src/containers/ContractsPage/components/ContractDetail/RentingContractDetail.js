/**
 * Add debtor renting contract page
 *
 * Requied Fields: custormer, startDate, locationIdentier
 * 1 contract has at least 1 agreement
 *
 * ----------
 * Agreement
 * Requied Fields: type, description
 * has at least units when type accommodation
 * ----------
 *
 * -------
 * Update Debtor renting part
 *  * Status 0/99/100: 0 Allow to all action, 99 Just edit endDate costline & add new Agreemnt, 100: Just view
 * active filed Inactive/endDateContract > current Date => Just view detail Status: 100
 * startedDate contract > current Date => Allow edit all data Status: 0
 * contract Started (<= current Date) => Status: 99
 *            Allow edit endDate of Contract
 *            Allow edit endDate of Costline general -> override endDate of costline
 *            Allow add new AgreemntLine
 * --------
 * Please update doc if have change Biz. Tks
 */
import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import __ from "lodash";
import moment from "moment";
import {
  Col,
  Container,
  Card,
  Row,
  Button,
  CardHeader,
  CardBody,
  FormGroup,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  FormFeedback,
  Alert,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import NumericInput from "react-numeric-input";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import ReactSelectLazy from "components/ReactSelectLazy";
import { funcMakeTreeUnitLocations } from "containers/InspectionsPage/InspectionShared";
import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";
import AgreementLines from "../AgreementLines";
import DialogConfirmOverrideDate from "./DialogConfirmOverrideDate";
import {
  fetchDataCustomer,
  makeDataParamsCreateUpdateRentingContract,
} from "../../utils";
import {
  validationDebtorRentingContract,
  validationAgreementLines,
  overrideDateContract,
} from "../../validation";
import { TIME_HIDDEN_NOTIFICATION } from "constants/alert.constants";
import Utils from "utilities/utils";
import { routers } from "../../constants";
import * as actions from "../../actions";
import { contractService } from "services";
import * as selector from "../../selector";
import { loadingProviderActions } from "containers/LoadingProvider/actions";
import "../../style.scss";

const RentingContractDetail = (props) => {
  const { intl, rentingContractId, contractType } = props;
  // Global
  const dispatch = useDispatch();
  const history = useHistory();
  const noitification = useSelector(selector.getNotification());
  const contract = useSelector(selector.makeSelectDebtorRentingContract());
  // Local state

  const inputElLocation = useRef(null);
  const inputElCostomer = useRef(null);
  const [status, setStatus] = useState(0);
  const [customer, setCustomer] = useState({});
  const [active, setActive] = useState(true);
  const [noticeDays, setNoticeDays] = useState(null);
  const [isLoadingDebtor, setIsLoadingDebtor] = useState(false);
  const [invoiceContact, setInvoiceContact] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState({});
  const [treeUnit, setTreeUnit] = useState([]);
  const [country, setCountry] = useState(null);
  const [agreementLines, setAgreementLines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenOverrideDate, setIsOpenOverrideDate] = useState(false);
  const [dateOverrideDate, setDateOverrideDate] = useState({
    newDate: null,
    oldDate: null,
    title: "",
    description: "",
  });
  // init data
  const initDataRentingContract = useCallback(
    ({
      agreementLines,
      customer,
      invoiceContact,
      startDate,
      endDate,
      location,
      treeUnit,
      country,
      active,
      noticeDays,
    }) => {
      setActive(active);
      setNoticeDays(noticeDays);
      if (__.isEmpty(agreementLines)) {
        // Set default agreement
        setAgreementLines([
          {
            costLineGenerals: [],
            type: "Accommodation",
            units: [], // Array Object
            treeData: treeUnit || [], // Current tree of Agreement
            nodesToggle: [], // Cureent node toggle of Agreement
          },
        ]);
      } else {
        setAgreementLines(agreementLines);
      }
      setCustomer(customer || {});
      setInvoiceContact(invoiceContact || null);
      if (startDate && moment(startDate).isValid()) {
        setStartDate(moment(startDate).toDate());
      } else {
        setStartDate(new Date());
      }
      if (endDate && moment(endDate).isValid()) {
        setEndDate(moment(endDate).toDate());
      } else {
        setEndDate(null);
      }
      setLocation(location || {});
      setTreeUnit(treeUnit || []);
      setCountry(country || null);
    },
    [],
  );
  // Effects
  useEffect(() => {
    // TODO: Convert data contract to form edit contract
    if (!__.isEmpty(contract) && rentingContractId === contract._id) {
      const { startDate: startDateContract } = contract;
      initDataRentingContract(
        __.pick(contract, [
          "agreementLines",
          "customer",
          "invoiceContact",
          "startDate",
          "endDate",
          "location",
          "treeUnit",
          "country",
          "active",
          "noticeDays",
        ]),
      );
      // Handle status of Contract

      if (!contract.active) {
        setStatus(100); // Just view detail
      } else if (
        startDateContract &&
        moment(startDateContract).isValid() &&
        moment(new Date().toISOString()).startOf("date").valueOf() >=
          moment(moment(startDateContract).toISOString())
            .startOf("date")
            .valueOf()
      ) {
        // Contract running
        setStatus(99);
      } else {
        setStatus(0);
      }
    } else {
      initDataRentingContract({ active: true });
      setStatus(0);
    }
  }, [rentingContractId, contract, initDataRentingContract]);
  // Functions

  // TODO: Handle Form
  const handleChangeCustomer = useCallback(async (value) => {
    if (__.isEmpty(value)) {
      setCustomer({});
      setInvoiceContact(null);
      return;
    }

    const { debtorcontact, type } = value;
    if (
      __.isEmpty(debtorcontact) ||
      (type === "grouping" && !debtorcontact.isDebtor)
    ) {
      /**
       * Specical type grouping
       * TODO try to find person debotor of grouping
       */
      console.log(type);

      if (type === "grouping") {
        setIsLoadingDebtor(true);
        try {
          const personGrouping = await contractService.getPerson({
            active: true,
            groupings: value._id,
          });
          const personDebtor = __.find(
            personGrouping,
            (item) =>
              !__.isEmpty(item.debtorcontact) &&
              item.debtorcontact._id &&
              item.debtorcontact.isDebtor,
          );
          if (!__.isEmpty(personDebtor) && personDebtor._id) {
            setInvoiceContact(personDebtor.debtorcontact._id);
          } else {
            setInvoiceContact(null);
          }
        } catch (error) {
          console.log(
            "handleChangeCustomer-> Error get person of grouping: ",
            error,
          );
          setInvoiceContact(null);
        } finally {
          setIsLoadingDebtor(false);
        }
      } else {
        setInvoiceContact(null);
      }
    } else if (debtorcontact && debtorcontact._id && debtorcontact.isDebtor) {
      setInvoiceContact(debtorcontact._id);
    } else {
      setInvoiceContact(null);
    }
    setCustomer(value);
  }, []);
  const resetAgreementLocationChanged = useCallback(
    (treeUnit, location = {}) => {
      console.log("Reset agreement locaiton changed: ", location);

      const _country = location.country;
      let _agreementLines = [...agreementLines];
      __.forEach(_agreementLines, (agreement, idx) => {
        _agreementLines[idx].units = [];
        _agreementLines[idx].treeData = treeUnit || [];
        // TODO: Check and remove costype diff country
        let costLineGenerals = [...agreement.costLineGenerals];
        costLineGenerals = __.map(costLineGenerals, (costLine) => {
          if (_country && country) {
            if (_country !== country) {
              costLine.costType = null;
            }
          } else {
            costLine.costType = null;
          }
          return costLine;
        });
        _agreementLines[idx].costLineGenerals = costLineGenerals;
      });
      setCountry(_country || null);
      setAgreementLines(_agreementLines);
    },
    [agreementLines, country],
  );
  const getCostTypes = useCallback(
    (location) => {
      const { country } = location;
      dispatch(actions.getCostTypes(country || ""));
    },
    [dispatch],
  );
  const handleChangeLocation = useCallback(
    (location) => {
      setLocation(location);
      const treeUnit = funcMakeTreeUnitLocations(location);
      setTreeUnit(treeUnit);

      //TODO: Remove agreement lines units selected & update treeData selector
      resetAgreementLocationChanged(treeUnit, location);
      // Get new costTypes
      getCostTypes(location || {});
    },
    [resetAgreementLocationChanged, getCostTypes],
  );

  // Handl change startDate/endData of contract override
  const handleChangeStartDate = useCallback(
    (date) => {
      const _agreementLines = [...agreementLines];
      const isAllowOvveride = overrideDateContract.showOverrideStartDate(
        date,
        _agreementLines,
        status,
      );

      if (!isAllowOvveride) {
        setStartDate(date);
      } else {
        // Open Confirm override
        setIsOpenOverrideDate(true);
        setDateOverrideDate({
          newDate: date,
          oldDate: startDate,
          type: "startDate",
          title: intl.formatMessage({
            id: "pages.contracts.dialog.overrideStartDate",
          }),
          description: intl.formatMessage({
            id: "pages.contracts.dialog.overrideStartDate.description",
          }),
        });
      }
    },
    [intl, agreementLines, startDate, status],
  );
  const handleChangeEndDate = useCallback(
    (date) => {
      const _agreementLines = [...agreementLines];
      const isshowOverride = overrideDateContract.showOverrideEndDate(
        date,
        _agreementLines,
      );
      if (!isshowOverride) {
        setEndDate(date);
      } else {
        // Open Confirm override
        setIsOpenOverrideDate(true);
        setDateOverrideDate({
          newDate: date,
          oldDate: endDate,
          type: "endDate",
          title: intl.formatMessage({
            id:
              status === 99
                ? "pages.contracts.dialog.endContract"
                : "pages.contracts.dialog.overrideEndDate",
          }),
          description: intl.formatMessage({
            id:
              status === 99
                ? "pages.contracts.dialog.endContract.description"
                : "pages.contracts.dialog.overrideEndDate.description",
          }),
        });
      }
    },
    [intl, agreementLines, endDate, status],
  );
  const handleSubmitOverrideDate = useCallback(() => {
    const { type, newDate } = dateOverrideDate;
    if (type === "startDate") {
      setAgreementLines(
        overrideDateContract.overrideStartDate(newDate, [...agreementLines]),
      );
      setStartDate(newDate);
    } else {
      setAgreementLines(
        overrideDateContract.overrideEndDate(newDate, [...agreementLines]),
      );
      setEndDate(newDate);
    }
    setIsOpenOverrideDate(false);
    setDateOverrideDate({});
  }, [dateOverrideDate, agreementLines]);
  const handleCancelOverride = useCallback(() => {
    const { type, oldDate } = dateOverrideDate;
    if (type === "startDate") {
      setStartDate(oldDate);
    } else {
      setEndDate(oldDate);
    }
    setIsOpenOverrideDate(false);
    setDateOverrideDate({});
  }, [dateOverrideDate]);

  const handleFocusErrorForm = __.debounce((indexAggrement, indexCostLine) => {
    const formdata = document.getElementById(
      "form-addd-debtor-renting-contract",
    );
    if (formdata) {
      let elementsInvalid = formdata.getElementsByClassName("is-invalid");
      if (elementsInvalid.length) {
        let element = elementsInvalid[0];
        let classElement = elementsInvalid[0].getAttribute("class");
        // Special for react select
        if (__.includes(classElement, "input-selection")) {
          let inputsSelect = element.getElementsByTagName("input");
          inputsSelect.length && inputsSelect[0].focus();
        } else {
          element.focus();
        }
        // element.focus();
      }
    }
  }, 300);

  // Handle save data
  const onCancelDebtorRenting = useCallback(() => {
    history.replace(routers[contractType]);
    initDataRentingContract({ active: true });
  }, [history, contractType, initDataRentingContract]);
  const handleCreateOrUpdateDebotorReting = useCallback(() => {
    if (isSubmitting) return;
    // Start overlay
    dispatch(loadingProviderActions.setStatusLoadingProvider());

    setIsSubmitting(true);
    setIsSubmitted(true);
    const {
      agreementLines: _agreementLines,
      isInValid: isInValidAgreents,
    } = validationAgreementLines([...agreementLines]);

    const rentingData = makeDataParamsCreateUpdateRentingContract(
      active,
      noticeDays,
      customer,
      invoiceContact,
      location,
      startDate,
      endDate,
      [...agreementLines],
      rentingContractId,
    );
    /**
     * TODO:
     * Prevent change data
     * Start validation data
     * Push dispath saga
     */

    // Start Validation

    const formState = validationDebtorRentingContract(rentingData);
    console.log("rentingData params: ", rentingData);
    const { isInValid } = formState;
    if (!isInValid && !isInValidAgreents) {
      setIsSubmitting(false);
      if (rentingContractId) {
        dispatch(
          actions.updateDebtorRentingContract(rentingContractId, rentingData),
        );
      } else {
        dispatch(actions.createDebtorRentingContract(rentingData));
      }
    } else {
      setIsSubmitting(false);
      if (isInValidAgreents) {
        setAgreementLines(_agreementLines);
      }
      // Hidden overlay
      dispatch(loadingProviderActions.setStatusLoadingProvider());
      //TODO: Start focus error filed
      handleFocusErrorForm();
    }
  }, [
    dispatch,
    rentingContractId,
    active,
    noticeDays,
    customer,
    invoiceContact,
    location,
    startDate,
    endDate,
    agreementLines,
    isSubmitting,
    handleFocusErrorForm,
  ]);
  useEffect(() => {
    if (noitification && noitification.message) {
      setTimeout(() => {
        dispatch(actions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  }, [dispatch, noitification]);
  console.log("agreementLines root: ", agreementLines);
  console.log("status of contract: ", status);

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card className="main-card">
            <CardHeader>
              <div className="btn-actions-pane-left">
                {rentingContractId && (
                  <span className="inspection-id">{contract.contractId}</span>
                )}
              </div>
              <div className="btn-actions-pane-right">
                <Button
                  size="sm"
                  color="secondary"
                  className="mr-2"
                  type="button"
                  onClick={onCancelDebtorRenting}
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="components.button.cancel" />
                </Button>
                {!rentingContractId ? (
                  <Button
                    size="sm"
                    color="success"
                    type="button"
                    onClick={handleCreateOrUpdateDebotorReting}
                    className="ml-2"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="components.button.create" />
                  </Button>
                ) : contract && __.includes([0, 99], status) ? (
                  <Button
                    size="sm"
                    color="success"
                    type="button"
                    onClick={handleCreateOrUpdateDebotorReting}
                    className="ml-2"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="components.button.save" />
                  </Button>
                ) : null}
              </div>
            </CardHeader>

            <CardBody className="" id="form-addd-debtor-renting-contract">
              {noitification && noitification.message && (
                <Alert
                  color={
                    noitification.type === "success" ? "success" : "danger"
                  }
                  isOpen={!!noitification.message}
                >
                  {Utils.showNotify(intl, noitification)}
                </Alert>
              )}
              <FormGroup row className="align-items-center pl-3 pr-3 ">
                <Col sm={12} className="">
                  <CustomInput
                    type="checkbox"
                    id="ckbShowOnlyActve"
                    label={<FormattedMessage id="components.checkBox.active" />}
                    checked={active}
                    value={active}
                    disabled={
                      __.includes([99, 100], status) || !rentingContractId
                    }
                    onChange={() => setActive(!active)}
                  />
                </Col>
              </FormGroup>

              <FormGroup row className="align-items-center pl-3 pr-3 ">
                <Col sm={12}>
                  <ReactSelectLazy
                    refProp={inputElCostomer}
                    intl={intl}
                    isDisabled={__.includes([99, 100], status)}
                    value={!__.isEmpty(customer) ? customer : null}
                    placeholder={intl.formatMessage({
                      id: "components.table.filters.customer",
                    })}
                    noOptionsMessage={() => (
                      <FormattedMessage id="components.select.noOption" />
                    )}
                    onChange={(val) => handleChangeCustomer(val)}
                    defaultOptions={[]}
                    fetchDataAsync={(inputSearch, _start, _limit, _options) =>
                      fetchDataCustomer(
                        inputSearch,
                        _start,
                        _limit,
                        _options,
                        intl,
                      )
                    }
                    isDisplayGroup={true}
                    isClearable={true}
                    className={`${
                      isSubmitted && __.isEmpty(customer) ? "is-invalid" : ""
                    } input-selection`}
                  />
                  {isSubmitted && __.isEmpty(customer) ? (
                    <FormFeedback className="d-block">
                      {intl.formatMessage({
                        id: "pages.contracts.errors.customer.require",
                      })}
                    </FormFeedback>
                  ) : !__.isEmpty(customer) &&
                    !invoiceContact &&
                    !isLoadingDebtor ? (
                    <FormFeedback className="d-block">
                      {intl.formatMessage({
                        id:
                          "pages.contracts.errors.customer.debotorContact.require",
                      })}
                    </FormFeedback>
                  ) : null}
                </Col>
              </FormGroup>

              <FormGroup row className="align-items-center pl-3 pr-3">
                <Col sm={6} className="z-index-7">
                  <InputGroup>
                    <DatePicker
                      className={`${
                        isSubmitted && !moment(startDate).isValid()
                          ? "is-invalid"
                          : ""
                      } form-control`}
                      dayClassName={(date) =>
                        __.includes([29, 30, 31], moment(date).get("date"))
                          ? "disabled-date"
                          : ""
                      }
                      selected={startDate}
                      onChange={handleChangeStartDate}
                      selectsStart
                      endDate={endDate}
                      startDate={startDate}
                      maxDate={endDate}
                      disabled={__.includes([99, 100], status)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText={intl.formatMessage({
                        id: "components.input.placeholder.startDate",
                      })}
                    />
                    <InputGroupAddon addonType="append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                  {isSubmitted && !moment(startDate).isValid() && (
                    <FormFeedback className="d-block">
                      {intl.formatMessage({
                        id: "pages.contracts.errors.startDate.require",
                      })}
                    </FormFeedback>
                  )}
                </Col>
                <Col sm={6} className="z-index-7">
                  <InputGroup>
                    <DatePicker
                      className="form-control"
                      selected={endDate}
                      onChange={handleChangeEndDate}
                      selectsEnd
                      endDate={endDate}
                      startDate={startDate}
                      minDate={
                        startDate && moment(startDate).isValid()
                          ? moment(startDate).add("days", 1).toDate()
                          : moment(new Date()).add("days", 1).toDate()
                      }
                      isClearable={!__.includes([100], status)}
                      disabled={__.includes([100], status)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText={intl.formatMessage({
                        id: "components.input.placeholder.endDate",
                      })}
                    />
                    <InputGroupAddon addonType="append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                  {/* For same line GUI */}
                  {isSubmitted && !moment(startDate).isValid() && (
                    <FormFeedback className="d-block"> &nbsp;</FormFeedback>
                  )}
                </Col>
              </FormGroup>

              <FormGroup row className="align-items-center pl-3 pr-3">
                <Col sm={12} className="z-index-6">
                  <NumericInput
                    className={`${
                      isSubmitted && !noticeDays ? "is-invalid" : ""
                    } form-control`}
                    min={1}
                    value={noticeDays}
                    max={100}
                    disabled={__.includes([99, 100], status)}
                    onChange={(val) => setNoticeDays(val)}
                    placeholder={intl.formatMessage({
                      id: "pages.contracts.noticePeriod",
                    })}
                    step={1}
                    strict
                  />
                  {isSubmitted && !noticeDays && (
                    <FormFeedback className="d-block">
                      {intl.formatMessage({
                        id: "pages.contracts.errors.noticeDays.require",
                      })}
                    </FormFeedback>
                  )}
                </Col>
              </FormGroup>

              <FormGroup row className="align-items-center pl-3 pr-3 ">
                <Col sm={12} className="">
                  <ReactSelectLazy
                    refProp={inputElLocation}
                    intl={intl}
                    isDisabled={__.includes([99, 100], status)}
                    value={!__.isEmpty(location) ? location : null}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.locationIdentifier",
                    })}
                    noOptionsMessage={() => (
                      <FormattedMessage id="components.select.noOption" />
                    )}
                    onChange={(val) => handleChangeLocation(val)}
                    defaultOptions={[]}
                    fetchDataAsync={fetchDataLocationAsync}
                    className={`${
                      isSubmitted && __.isEmpty(location) ? "is-invalid" : ""
                    } input-selection`}
                  />
                  {isSubmitted && __.isEmpty(location) && (
                    <FormFeedback className="d-block">
                      {intl.formatMessage({
                        id: "pages.contracts.errors.locationIdentifier.require",
                      })}
                    </FormFeedback>
                  )}
                </Col>
              </FormGroup>

              <Row>
                <Col md={12}>
                  <hr />
                </Col>
              </Row>
              <AgreementLines
                {...props}
                status={status}
                rentingContractId={rentingContractId}
                agreementLines={agreementLines}
                setAgreementLines={setAgreementLines}
                startDateContract={startDate}
                endDateContract={endDate}
                location={location}
                treeUnit={treeUnit}
                setTreeUnit={setTreeUnit}
                isSubmitted={isSubmitted}
                isSubmitting={isSubmitting}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <DialogConfirmOverrideDate
        isOpen={isOpenOverrideDate}
        data={dateOverrideDate}
        handleSubmit={handleSubmitOverrideDate}
        cancel={handleCancelOverride}
      />
    </Container>
  );
};
RentingContractDetail.propTypes = {
  rentingContractId: PropTypes.string,
};
RentingContractDetail.defaultProps = {
  rentingContractId: null,
};
export default React.memo(injectIntl(RentingContractDetail));
