import React, { Fragment, useState, useEffect, memo, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  BreadcrumbItem,
  Alert,
} from "reactstrap";
import { map, find, filter, forEach } from "lodash";
import { useHistory } from "react-router-dom";
import Select from "react-select";
// import DropdownTreeSelect from "react-dropdown-tree-select";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextareaAutosize from "react-textarea-autosize";
import "react-dropdown-tree-select/dist/styles.css";
import DatePicker from "react-datepicker";
// import "./styles.scss";
import ViewSummary from "./ViewSummary";
import ViewUnit from "./ViewUnit";

import LoadingIndicator from "../../../components/LoadingIndicator";
// ###
import PageTitle from "../../../components/PageTitle";

import { useSelector, useDispatch } from "react-redux";
import { inspectionActions } from "../action";
import { INSPECTION_STATUS } from "../constants";

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

const optionTypeInspection = [
  { label: "Begin", value: "Begin" },
  { label: "End", value: "End" },
  { label: "Periodic", value: "Periodic" },
];

const getTitlesByJobType = intl => {
  const titles = {
    Inspection: {
      router: "/inspections",
      inspector: intl.formatMessage({
        id: "pages.inspection.inspector",
      }),
      planner: intl.formatMessage({
        id: "pages.inspection.inspectionPlanner",
      }),
      date_of_inspection: intl.formatMessage({
        id: "pages.inspection.dayOfInspection",
      }),
    },
    Maintenance: {
      router: "/maintenances",
      inspector: intl.formatMessage({
        id: "pages.maintenance.mechanic",
      }),
      planner: intl.formatMessage({
        id: "pages.maintenance.maintenancePlanner",
      }),
      date_of_inspection: intl.formatMessage({
        id: "pages.maintenance.dayOfInspection",
      }),
    },
    Cleaning: {
      router: "/cleaning",
      inspector: intl.formatMessage({
        id: "pages.cleaning.cleaner",
      }),
      planner: intl.formatMessage({
        id: "pages.cleaning.cleaningPlanner",
      }),
      date_of_inspection: intl.formatMessage({
        id: "pages.cleaning.dayOfInspection",
      }),
    },
  };
  return titles;
};

const InspectionViewer = ({ intl, inspectionId, jobType }) => {

  const { orderByPosition } = Utils;
  const dispatch = useDispatch();
  const history = useHistory();
  const inspectionState = useSelector(state => state.inspection);
  const {
    costTypes,
    notification,
    location,
    isFetchingInspectionData,
  } = inspectionState;
  const [inspection, setInspection] = useState({});

  const [viewSum, setViewSum] = useState(false);
  const getTitles = getTitlesByJobType(intl);
  const [inspectionStatus, setInspectionStatus] = useState(
    INSPECTION_STATUS.OPEN,
  );

  useEffect(() => {
    dispatch(inspectionActions.receiveInspection());
    dispatch(inspectionActions.receiveLocation());
    dispatch(inspectionActions.getInspection(inspectionId));
  }, [dispatch, inspectionId]);
  const orderUnits = useCallback((location, dataUnits) => {
    let { units } = location;
    units = orderByPosition(units);
    let trees = [];
    // lop tree units
    const makeTree = unitItem => {
      if (trees.length === units.length) {
        return;
      }

      let subUnits = filter(units, item => item.parent === unitItem._id);
      forEach(subUnits, subUnit => {
        let itemFilter = find(dataUnits, item => item._id === subUnit._id);
        if (itemFilter) {
          itemFilter.inspectionitems = orderByPosition(
            itemFilter.inspectionitems,
          );
          trees.push(itemFilter);
        }
        makeTree(subUnit);
      });
    };
    let unitParents = filter(units, item => !item.parent);
    // lop parent units location
    forEach(unitParents, unit => {
      let itemFilter = find(dataUnits, item => item._id === unit._id);
      if (itemFilter) {
        itemFilter.inspectionitems = orderByPosition(
          itemFilter.inspectionitems,
        );
        trees.push(itemFilter);
      }
      makeTree(unit);
    });
    return trees;
  }, [orderByPosition]);
  useEffect(() => {
    // not reset inspection when redux change
    if (
      location &&
      location._id &&
      inspectionState.inspection &&
      inspectionState.inspection._id &&
      (!inspection || inspectionState.inspection._id !== inspection._id)
    ) {
      // setInspectionStatus(inspectionState.inspection.status);
      if (inspectionState.inspection && inspectionState.inspection.units) {
        inspectionState.inspection.units = orderUnits(
          location,
          inspectionState.inspection.units,
        );
      }
      setInspection(inspectionState.inspection);
    }
  }, [inspectionState, inspection, orderUnits, location]);

  if (notification && notification.message) {
    setTimeout(() => {
      dispatch(inspectionActions.resetNotification());
    }, TIME_HIDDEN_NOTIFICATION);
  }

  // render value for select data
  const locations =
    inspection && inspection.location
      ? [
          {
            label: Utils.getLocationIdentifer(inspection.location),
            value: inspection.location._id,
          },
        ]
      : [];

  const inspectors =
    inspection && inspection.inspector
      ? [
          {
            label: `${inspection.inspector.firstName} ${inspection.inspector.lastName}`,
            value: inspection.inspector._id,
          },
        ]
      : [];

  const planners =
    inspection && inspection.planner
      ? [
          {
            label: `${inspection.planner.firstName} ${inspection.planner.lastName}`,
            value: inspection.planner._id,
          },
        ]
      : [];

  const unitsTree =
    inspection && inspection.units
      ? map(inspection.units, unitItem => ({
          label: unitItem.name,
          value: unitItem.id,
        }))
      : [];

  const UnitBreadcrumb = unit => {
    let { location } = inspectionState;
    location = location || {};
    const isActive = unit ? !!unit.parent : false;
    return (
      <>
        {unit && unit.parent
          ? UnitBreadcrumb(
              find(location.units, item => item._id === unit.parent),
            )
          : null}
        {unit ? (
          <BreadcrumbItem active={isActive}>{unit.name}</BreadcrumbItem>
        ) : null}
      </>
    );
  };
  const _renderButtonsOnViewSummary = () => (
    <>
      <Button
        size="sm"
        color="outline-link"
        className="mr-2"
        type="button"
        onClick={() => setViewSum(false)}
      >
        <FormattedMessage id="components.button.back" />
      </Button>
      <Button
        size="sm"
        color="success"
        type="button"
        className="ml-2"
        onClick={() => handleDownloadFileReport()}
      >
        <FormattedMessage id="components.button.report" />
      </Button>
    </>
  );
  const handleDownloadFileReport = () => {
    if (inspection._id)
      dispatch(
        inspectionActions.submitDownloadFileReport(inspection.identifier),
      );
  };
  const onHandleViewSummary = () => {
    setViewSum(true);
  };
  const _renderButtonsOnReady = () => (
    <>
      <Button
        size="sm"
        color="outline-link"
        className="mr-2"
        type="button"
        onClick={() => setInspectionStatus(INSPECTION_STATUS.OPEN)}
      >
        <FormattedMessage id="components.button.back" />
      </Button>
      <Button
        size="sm"
        color="secondary"
        type="button"
        onClick={onHandleViewSummary}
      >
        <FormattedMessage id="components.button.viewSummary" />
      </Button>
      <Button
        size="sm"
        color="success"
        type="button"
        className="ml-2"
        onClick={() => handleDownloadFileReport()}
      >
        <FormattedMessage id="components.button.report" />
      </Button>
    </>
  );
  const _renderButtonsOnOpen = () => {
    return (
      <>
        <Button
          size="sm"
          color="outline-link"
          className="mr-2"
          onClick={() => history.push(getTitles[jobType].router)}
        >
          <FormattedMessage id="components.button.cancel" />
        </Button>
        <Button
          size="sm"
          color="secondary"
          type="button"
          onClick={() => setInspectionStatus(INSPECTION_STATUS.READY)}
        >
          <FormattedMessage id="components.button.viewDetail" />
        </Button>
        <Button
          size="sm"
          color="success"
          type="button"
          className="ml-2"
          onClick={() => handleDownloadFileReport()}
        >
          <FormattedMessage id="components.button.report" />
        </Button>
      </>
    );
  };
  return (
    <Fragment>
      <PageTitle
        heading={intl.formatMessage({
          id: "components.formTitle.inspectionDetails",
        })}
        icon="page-title-custom-icon nav-icon-inspections"
      />
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardHeader>
              <div className="btn-actions-pane-left">
                <span className="inspection-id">{inspection.identifier}</span>
              </div>
              <div className="btn-actions-pane-right">
                {inspectionStatus === INSPECTION_STATUS.READY
                  ? viewSum
                    ? _renderButtonsOnViewSummary()
                    : _renderButtonsOnReady()
                  : _renderButtonsOnOpen()}
              </div>
            </CardHeader>
            <CardBody>
              {notification && notification.message ? (
                <Alert
                  color={notification.type === "success" ? "success" : "danger"}
                  isOpen={!!notification.message}
                >
                  {Utils.showNotify(intl, notification)}
                </Alert>
              ) : null}
              {viewSum ? (
                <ViewSummary
                  intl={intl}
                  inspection={inspection}
                  UnitBreadcrumb={UnitBreadcrumb}
                  orderByPosition={orderByPosition}
                />
              ) : (
                <Col md="10" className="mx-auto">
                  {inspectionStatus === INSPECTION_STATUS.OPEN ? (
                    <>
                      <Row form>
                        <Col md={jobType === "Inspection" ? 6 : 12}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.location" />
                            </Label>
                            <Select
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.locationIdentifier",
                              })}
                              value={locations[0] ? locations[0] : {}}
                              isDisabled
                              options={locations}
                            />
                          </FormGroup>
                        </Col>
                        {jobType === "Inspection" && (
                          <Col md={6}>
                            <FormGroup className="">
                              <Label for="">
                                <FormattedMessage id="pages.inspection.type" />
                              </Label>
                              <Select
                                placeholder={intl.formatMessage({
                                  id:
                                    "components.input.placeholder.inspectionType",
                                })}
                                value={
                                  inspection.type
                                    ? find(
                                        optionTypeInspection,
                                        item => item.value === inspection.type,
                                      )
                                    : {}
                                }
                                isDisabled
                                options={optionTypeInspection}
                                onChange={value => {}}
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                      <Row form>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.unitAndSubUnit" />
                            </Label>
                            <Select
                              placeholder="Units"
                              value={unitsTree}
                              isDisabled
                              isMulti
                              options={unitsTree}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              {getTitles[jobType].inspector}
                              {/* <FormattedMessage id="pages.inspection.inspector" /> */}
                            </Label>
                            <Select
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.employeeFullName",
                              })}
                              isDisabled
                              value={inspectors[0] ? inspectors[0] : {}}
                              options={inspectors}
                              menuPlacement="top"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              {getTitles[jobType].planner}
                              {/* <FormattedMessage id="pages.inspection.inspectionPlanner" /> */}
                            </Label>
                            <Select
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.employeeFullName",
                              })}
                              isDisabled
                              value={planners[0] ? planners[0] : {}}
                              options={planners}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              {getTitles[jobType].date_of_inspection}
                              {/* <FormattedMessage id="pages.inspection.dayOfInspection" /> */}
                            </Label>
                            <InputGroup className="z-index-1">
                              <DatePicker
                                showPopperArrow={false}
                                selected={
                                  inspection.dateInspection
                                    ? new Date(inspection.dateInspection)
                                    : new Date()
                                }
                                disabled
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                              />
                              <InputGroupAddon addonType="append">
                                <div className="input-group-text">
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                </div>
                              </InputGroupAddon>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <hr />
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.internalWork" />
                            </Label>
                            <TextareaAutosize
                              className="form-control"
                              minRows={3}
                              maxRows={6}
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.typeInstructionsDesc",
                              })}
                              defaultValue={inspection.instructions || ""}
                              disabled
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="" className="mt-3">
                              {intl.formatMessage({
                                id: "pages.inspection.followUpAction",
                              })}
                            </Label>
                            <TextareaAutosize
                              className="form-control"
                              minRows={3}
                              maxRows={6}
                              maxLength={250}
                              placeholder={intl.formatMessage({
                                id: "pages.inspection.followUpAction",
                              })}
                              value={inspection.actions || ""}
                              onChange={e => {}}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <CardBody className="p-0" id="list-inspection-review">
                            <ViewUnit
                              intl={intl}
                              inspection={inspection}
                              UnitBreadcrumb={UnitBreadcrumb}
                              inspectionStatus={inspectionStatus}
                              costTypes={costTypes}
                            />
                          </CardBody>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                </Col>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {isFetchingInspectionData ? <LoadingIndicator /> : null}
    </Fragment>
  );
};
export default memo(injectIntl(InspectionViewer));
