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
  UncontrolledTooltip,
  Button,
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

import {
  ROLE_INSPECTION_CAN_VIEW,
  ROLE_INSPECTION_VIEWER,
  ROLE_INSPECTION_PLANNER,
  INSPECTION_STATUS,
} from "../constants";

import { employeeActions } from "../../EmployeesPage/actions";
import TablePagination from "components/TablePagination";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import { checkIsRoleJustViewer } from "../utils";
import Utils from "../../../utilities/utils";
import ReactSelectLazy from "components/ReactSelectLazy";
// Service
import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";

const FORMAT_DATE = "DD/MM/YYYY";
const JOB_TYPE_INSPECTION = "Inspection";

const defaultSorted = [
  {
    dataField: "name",
    order: "desc",
  },
];

const typeOptions = [
  { value: "Begin", label: "Begin" },
  { value: "End", label: "End" },
  { value: "Periodic", label: "Periodic" },
];

const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Ready", label: "Ready" },
  { value: "Completed", label: "Completed" },
  { value: "Closed", label: "Closed" },
];
const ROLE_INSPECTOR = "inspector";
function InspectionList({ intl, jobType }) {
  const columns = [
    {
      dataField: "inspectionIdentifer",
      text: intl.formatMessage({
        id: "pages.inspection.table.column.inspectionIdentifier",
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
      dataField: "type",
      text: intl.formatMessage({ id: "pages.inspection.type" }),
      sort: true,
    },
    {
      dataField: "inspector",
      text: intl.formatMessage({ id: "pages.inspection.inspector" }),
      sort: true,
    },
  ];

  const history = useHistory();
  const dispatch = useDispatch();

  const inspectionState = useSelector((state) => state.inspection);
  const employeeState = useSelector((state) => state.employee);

  const {
    notification,
    inspections,
    isFetchingInspection,
    totalOfInspections,
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
  const userCanViewAll = find(
    user.roles,
    (roleItem) =>
      roleItem._id &&
      find(ROLE_INSPECTION_CAN_VIEW, (item) => item === roleItem.type),
  );

  const userCanViewer = find(
    user.roles,
    (roleItem) =>
      roleItem._id &&
      find(ROLE_INSPECTION_VIEWER, (item) => item === roleItem.type),
  );

  const userCanEdit = find(
    user.roles,
    (roleItem) =>
      roleItem._id &&
      find(ROLE_INSPECTION_PLANNER, (item) => item === roleItem.type),
  );

  const isPlannerUser = !userCanViewAll && !userCanViewer;

  const [locationSelected, setLocationSelected] = useState(null);
  const [filterParams, setFilterParams] = useState({
    from: "",
    to: "",
    status: "",
    type: "",
    planner: isPlannerUser ? user._id : "",
    location: "",
  });

  useEffect(() => {
    dispatch(employeeActions.getUsers({ roles: ROLE_INSPECTOR }));
  }, [dispatch]);

  const onPaginationChange = useCallback(
    (page, sizePerPage, filterParams = {}, type) => {
      const checkRoles = (filter) => {
        const strRoles = user.roles.map((role) => role.type);
        if (
          strRoles.indexOf("inspection_reviewer_all_inspections") < 0 &&
          strRoles.indexOf("root") < 0
        ) {
          if (strRoles.indexOf("inspection_planner") > -1) {
            filter["planner"] = user._id;
          }
          if (strRoles.indexOf("inspector") > -1) {
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
      filter = checkRoles(filter);
      dispatch(
        inspectionActions.getAllInspection({
          ...filter,
          _start: currentIndex > 0 ? currentIndex : 0,
          _limit: sizePerPage,
        }),
      );

      if (type !== "pagination") {
        //reset pagination
        dispatch(
          inspectionActions.fetchCountInspections({
            ...filter,
            jobType: JOB_TYPE_INSPECTION,
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
      history.push(`/inspections/${row._id}/summary`);
    } else {
      history.push(`/inspections/${row._id}`);
    }
  };

  // auto hidden notification after 5s
  if (notification && notification.message) {
    setTimeout(() => {
      dispatch(inspectionActions.resetNotification());
    }, TIME_HIDDEN_NOTIFICATION);
  }

  const initData = () => {
    let inspectionData = map(inspections, (item) => {
      let { inspector, location } = item;
      location = location || {};
      inspector = inspector || {};
      return {
        _id: item._id,
        id: item._id,
        inspectionIdentifer: item.identifier,
        locationName: Utils.getLocationIdentifer(location),
        status: item.status,
        type: item.type,
        dateInspection: item.dateInspection,
        inspector: `${inspector.firstName || ""} ${inspector.lastName || ""}`,
      };
    });

    let employeeData = [];
    forEach(employees, (item) => {
      const { roles } = item;
      if (find(roles || [], (roleItem) => roleItem.type === ROLE_INSPECTOR)) {
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
            {notification && notification.message && !notification.page ? (
              <Alert
                color={notification.type === "success" ? "success" : "danger"}
                isOpen={!!notification.message}
              >
                {Utils.showNotify(intl, notification)}
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
                          id: "components.input.placeholder.inspectionStatus",
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

                  <FormGroup row>
                    <Label sm={3}>
                      <FormattedMessage id="pages.inspection.type" />:{" "}
                    </Label>
                    <Col sm={9}>
                      <Select
                        options={typeOptions}
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.inspectionType",
                        })}
                        noOptionsMessage={() =>
                          intl.formatMessage({
                            id: "components.select.noOption",
                          })
                        }
                        value={
                          find(
                            typeOptions,
                            (item) => item.value === filterParams.type,
                          ) || ""
                        }
                        onChange={(val) => {
                          handleChangeFilterParams(
                            "type",
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
                        <FormattedMessage id="pages.inspection.inspector" />:{" "}
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
                      <FormattedMessage id="pages.inspection.inspection" />:{" "}
                    </Label>
                    <Col sm={9}>
                      <DelayInput
                        type="text"
                        className="form-control"
                        delayTimeout={500}
                        placeholder={intl.formatMessage({
                          id:
                            "pages.inspection.table.column.inspectionIdentifier",
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
                  keyField="id"
                  refTableNode={refTableNode}
                  intl={intl}
                  data={inspectionData}
                  columns={columns}
                  defaultSorted={defaultSorted}
                  loading={isFetchingInspection}
                  totalSize={totalOfInspections}
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

export default injectIntl(InspectionList);
