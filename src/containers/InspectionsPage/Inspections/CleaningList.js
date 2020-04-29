import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  FormGroup,
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  Label,
  Alert,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import { DelayInput } from "react-delay-input";
import { FormattedMessage, injectIntl } from "react-intl";

import Select from "react-select";
import { map, find, cloneDeep, forEach, isEmpty, filter, set } from "lodash";
import moment from "moment";
import {
  faCalendarAlt,
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { inspectionActions } from "../action";

import { useUserState } from "../../../containers/LoginPage/context";
import TablePagination from "components/TablePagination";
import {
  ROLE_CLEANING_CAN_VIEW,
  ROLE_CLEANING_VIEWER,
  ROLE_CLEANING_PLANNER,
  RECEIVE_MESSAGE_CLEANING,
  INSPECTION_STATUS,
} from "../constants";
import { employeeActions } from "../../EmployeesPage/actions";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import { checkIsRoleJustViewer } from "../utils";
import Utils from "../../../utilities/utils";

import ReactSelectLazy from "components/ReactSelectLazy";
// Service
import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";

const ROLE_CLEANER = "cleaner";
const FORMAT_DATE = "DD/MM/YYYY";
const JOB_TYPE_CLEANING = "Cleaning";

const defaultSorted = [
  {
    dataField: "name",
    order: "desc",
  },
];

const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Ready", label: "Ready" },
  { value: "Completed", label: "Completed" },
  { value: "Closed", label: "Closed" },
];

function CleaningList({ intl, jobType }) {
  const columns = [
    {
      dataField: "identifier",
      text: intl.formatMessage({
        id: "pages.cleaning.table.column.cleaningIdentifier",
      }),
      sort: true,
      // style: {
      //   width: "30%",
      // },
      // headerStyle: {
      //   width: "30%",
      // },
    },
    {
      dataField: "dateInspection",
      text: intl.formatMessage({
        id: "pages.inspection.table.column.plannedDate",
      }),
      sort: true,
      formatter: (date) => moment(date).format(FORMAT_DATE),
    },
    {
      dataField: "locationName",
      text: intl.formatMessage({
        id: "pages.inspection.table.column.locationName",
      }),
      sort: true,
    },
    {
      dataField: "status",
      text: intl.formatMessage({ id: "pages.inspection.status" }),
      sort: true,
    },
    {
      dataField: "inspector",
      text: intl.formatMessage({ id: "pages.cleaning.cleaner" }),
      sort: true,
    },
  ];

  const history = useHistory();
  const dispatch = useDispatch();

  const inspectionState = useSelector((state) => state.inspection);
  const employeeState = useSelector((state) => state.employee);

  const {
    notificationCleaning,
    cleanings,
    totalOfCleanings,
    isFetchingCleaning,
  } = inspectionState;
  const employees = employeeState.users || [];

  // local
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const refTableNode = useRef(null);

  const userState = useUserState();
  let { user } = userState;
  user = user || {};
  const isViewer = checkIsRoleJustViewer(user, jobType);

  let userCanViewAll = find(
    user.roles,
    (roleItem) =>
      roleItem._id &&
      find(ROLE_CLEANING_CAN_VIEW, (item) => item === roleItem.type),
  );

  const userCanViewer = find(
    user.roles,
    (roleItem) =>
      roleItem._id &&
      find(ROLE_CLEANING_VIEWER, (item) => item === roleItem.type),
  );
  const userCanEdit = find(
    user.roles,
    (roleItem) =>
      roleItem._id &&
      find(ROLE_CLEANING_PLANNER, (item) => item === roleItem.type),
  );
  const isPlannerUser = !userCanViewAll && !userCanViewer;

  const [locationSelected, setLocationSelected] = useState(null);
  const [filterParams, setFilterParams] = useState({
    from: "",
    to: "",
    status: "",
    planner: isPlannerUser ? user._id : "",
    location: "",
  });

  useEffect(() => {
    dispatch(employeeActions.getUsers({ roles: ROLE_CLEANER }));
  }, [dispatch]);

  const onPaginationChange = useCallback(
    (page, sizePerPage, filterParams = {}, type) => {
      const checkRoles = (filter) => {
        const strRoles = user.roles.map((role) => role.type);
        if (
          strRoles.indexOf("cleaning_reviewer") < 0 &&
          strRoles.indexOf("root") < 0
        ) {
          if (strRoles.indexOf("cleaning_planner") > -1) {
            filter["planner"] = user._id;
          }
          if (strRoles.indexOf("cleaner") > -1) {
            filter["inspector"] = user._id;
          }
        }
        return filter;
      };

      const currentIndex = (page - 1) * sizePerPage;

      //setup filter data call api
      let filter = cloneDeep(filterParams);
      if (!filter.from || !moment(filter.from, FORMAT_DATE).isValid()) {
        delete filter.from;
      }
      if (!filter.to || !moment(filter.to, FORMAT_DATE).isValid()) {
        delete filter.to;
      }

      if (filter.identifier) {
        filter.identifier_contains = filter.identifier;
        delete filter.identifier;
      }

      if (!filter.status) {
        if (isViewer) {
          filter.status_in = [
            INSPECTION_STATUS.COMPLETED,
            INSPECTION_STATUS.CLOSED,
          ];
        }
      }

      dispatch(
        inspectionActions.getAllCleaning({
          ...filter,
          _start: currentIndex > 0 ? currentIndex : 0,
          _limit: sizePerPage,
        }),
      );

      if (type !== "pagination") {
        //reset pagination
        filter = checkRoles(filter);
        dispatch(
          inspectionActions.fetchCountCleaning({
            ...filter,
            jobType: JOB_TYPE_CLEANING,
          }),
        );
        set(refTableNode, "current.paginationContext.currSizePerPage", 10);
        set(refTableNode, "current.paginationContext.currPage", 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  useEffect(() => {
    //Load init data table
    onPaginationChange(1, 10, filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPaginationChange]);

  const handleChangeStartDate = (date) => {
    setStartDate(date);
    handleChangeFilterParams("from", moment(date).format(FORMAT_DATE));
  };

  const handleChangeEndDate = (date) => {
    setEndDate(date);
    handleChangeFilterParams("to", moment(date).format(FORMAT_DATE));
  };

  const handleChangeFilterParams = (key, value = "") => {
    if (value === filterParams[key]) {
      return;
    }
    let filter = {
      ...filterParams,
      [key]: value,
    };
    setFilterParams(filter);
    onPaginationChange(1, 10, filter);
  };

  const handleResetFilterParams = () => {
    if (isEmpty(filterParams)) {
      return;
    }
    setStartDate(null);
    setEndDate(null);
    setLocationSelected(null);
    setFilterParams({});
    onPaginationChange(1, 10, {});
  };

  const onRowEventClick = (e, row, rowIndex) => {
    if (!userCanViewAll && !userCanViewer && !userCanEdit) return;
    // clear old inspection data detail
    dispatch(inspectionActions.receiveInspection());

    if (
      [INSPECTION_STATUS.COMPLETED, INSPECTION_STATUS.CLOSED].includes(
        row.status,
      )
    ) {
      history.push(`/cleaning/${row._id}/summary`);
    } else {
      history.push(`/cleaning/${row._id}`);
    }
  };

  // auto hidden notificationCleaning after 5s
  if (notificationCleaning && notificationCleaning.message) {
    setTimeout(() => {
      dispatch(inspectionActions.resetNotification(RECEIVE_MESSAGE_CLEANING));
    }, TIME_HIDDEN_NOTIFICATION);
  }

  const initData = () => {
    let inspectionData = map(cleanings, (item) => {
      let { inspector, location } = item;
      location = location || {};
      inspector = inspector || {};
      return {
        _id: item._id,
        id: item.id,
        identifier: item.identifier,
        locationName: Utils.getLocationIdentifer(location),
        status: item.status,
        dateInspection: item.dateInspection,
        inspector: `${inspector.firstName || ""} ${inspector.lastName || ""}`,
      };
    });

    let employeeData = [];
    forEach(employees, (item) => {
      const { roles } = item;
      if (find(roles || [], (roleItem) => roleItem.type === ROLE_CLEANER)) {
        employeeData.push({
          _id: item._id,
          fullName: `${item.firstName || ""} ${item.lastName || ""}`,
        });
      }
    });

    return { inspectionData, employeeData };
  };

  const { inspectionData, employeeData } = initData();

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card className="main-card p-4">
            {notificationCleaning &&
            notificationCleaning.message &&
            !notificationCleaning.page ? (
              <Alert
                color={
                  notificationCleaning.type === "success" ? "success" : "danger"
                }
                isOpen={!!notificationCleaning.message}
              >
                {Utils.showNotify(intl, notificationCleaning)}
              </Alert>
            ) : null}
            <Row className="justify-content-center">
              <Col sm={10}>
                <CardTitle className="d-flex align-items-center mb-0">
                  <FormattedMessage id="components.formTitle.filters" />
                  <Button
                    color="link"
                    type="button"
                    // outline
                    onClick={handleResetFilterParams}
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
                    <FormattedMessage id="pages.inspection.clearAllFilters" />
                  </UncontrolledTooltip>
                </CardTitle>
                <CardBody>
                  <FormGroup row>
                    <Label sm={3}>
                      <FormattedMessage id="pages.inspection.dateRange" />:{" "}
                    </Label>
                    <Col md={4} className="pr-0">
                      <InputGroup className="z-index-7">
                        <DatePicker
                          className="form-control"
                          selected={startDate}
                          onChange={handleChangeStartDate}
                          selectsStart
                          endDate={endDate}
                          startDate={startDate}
                          maxDate={endDate}
                          dateFormat="dd/MM/yyyy"
                          isClearable
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
                    </Col>
                    <Col md={4} className="offset-md-1 pl-0">
                      <InputGroup className="z-index-7">
                        <DatePicker
                          className="form-control"
                          selected={endDate}
                          onChange={handleChangeEndDate}
                          selectsEnd
                          endDate={endDate}
                          startDate={startDate}
                          minDate={startDate}
                          dateFormat="dd/MM/yyyy"
                          isClearable
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
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={3}>
                      <FormattedMessage id="pages.inspection.location" />:{" "}
                    </Label>
                    <Col sm={9}>
                      <ReactSelectLazy
                        intl={intl}
                        value={locationSelected}
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.locationIdentifier",
                        })}
                        noOptionsMessage={() =>
                          intl.formatMessage({
                            id: "components.select.noOption",
                          })
                        }
                        onChange={(val) => {
                          setLocationSelected(val || null);
                          handleChangeFilterParams(
                            "location",
                            val ? val._id : "",
                          );
                        }}
                        defaultOptions={[]}
                        fetchDataAsync={fetchDataLocationAsync}
                        isClearable={true}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={3}>
                      <FormattedMessage id="pages.inspection.status" />:{" "}
                    </Label>
                    <Col sm={9}>
                      <Select
                        options={
                          isViewer
                            ? filter(
                                statusOptions,
                                (item) =>
                                  item.value === INSPECTION_STATUS.COMPLETED ||
                                  item.value === INSPECTION_STATUS.CLOSED,
                              )
                            : statusOptions
                        }
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.cleaningStatus",
                        })}
                        noOptionsMessage={() =>
                          intl.formatMessage({
                            id: "components.select.noOption",
                          })
                        }
                        value={
                          find(
                            statusOptions,
                            (item) => item.value === filterParams.status,
                          ) || ""
                        }
                        onChange={(val) => {
                          handleChangeFilterParams(
                            "status",
                            val ? val.value : "",
                          );
                        }}
                        isClearable
                      />
                    </Col>
                  </FormGroup>
                  {!isPlannerUser && (
                    <FormGroup row>
                      <Label sm={3}>
                        <FormattedMessage id="pages.cleaning.cleaner" />:{" "}
                      </Label>
                      <Col sm={9}>
                        <Select
                          getOptionLabel={(opt) => opt.fullName}
                          getOptionValue={(opt) => opt._id}
                          options={employeeData}
                          placeholder={intl.formatMessage({
                            id: "components.input.placeholder.employeeFullName",
                          })}
                          noOptionsMessage={() =>
                            intl.formatMessage({
                              id: "components.select.noOption",
                            })
                          }
                          value={
                            find(
                              employeeData,
                              (item) => item._id === filterParams.inspector,
                            ) || ""
                          }
                          onChange={(val) => {
                            handleChangeFilterParams(
                              "inspector",
                              val ? val._id : "",
                            );
                          }}
                          isClearable
                        />
                      </Col>
                    </FormGroup>
                  )}
                  <FormGroup row>
                    <Label sm={3}>
                      <FormattedMessage id="pages.cleaning.cleaning" />:{" "}
                    </Label>
                    <Col sm={9}>
                      <DelayInput
                        type="text"
                        className="form-control"
                        delayTimeout={500}
                        placeholder={intl.formatMessage({
                          id: "pages.cleaning.table.column.cleaningIdentifier",
                        })}
                        value={filterParams.identifier || ""}
                        onChange={(e) => {
                          handleChangeFilterParams(
                            "identifier",
                            e.target.value,
                          );
                        }}
                      />
                    </Col>
                  </FormGroup>
                </CardBody>
              </Col>
            </Row>

            <Row>
              <Col>
                <TablePagination
                  refTableNode={refTableNode}
                  intl={intl}
                  data={inspectionData}
                  columns={columns}
                  defaultSorted={defaultSorted}
                  loading={isFetchingCleaning}
                  totalSize={totalOfCleanings}
                  onPaginationChange={onPaginationChange}
                  onRowEventClick={onRowEventClick}
                  filterParams={filterParams}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default injectIntl(CleaningList);
