import React, { useEffect, useState, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  FormGroup,
  CardBody,
  CustomInput,
  Alert,
  Label,
} from "reactstrap";
import { DelayInput } from "react-delay-input";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useSelector, useDispatch } from "react-redux";
import { locationActions } from "../actions";
import { GET_LOCATION_ALL } from "../constants";
import { map, get, set, omitBy, reduce, includes } from "lodash";

// import Select from "react-select";
import { FormattedMessage, injectIntl } from "react-intl";
import TablePagination from "../../../components/TablePagination";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

function LocationList({ intl }) {
  //config table
  const columns = [
    {
      dataField: "locationIdentifer",
      text: intl.formatMessage({
        id: "pages.location.table.column.locationIdentifier",
      }),
      sort: true,
    },
    {
      dataField: "region",
      text: intl.formatMessage({ id: "pages.location.table.column.region" }),
      sort: true,
    },
    {
      dataField: "country",
      text: intl.formatMessage({ id: "pages.location.table.column.country" }),
      sort: true,
    },
  ];

  const defaultFilter = {
    active: true,
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const locationReducer = useSelector((state) => state.location);
  const {
    locations,
    notification,
    totalLocation,
    isFetching,
    locationAll,
  } = locationReducer;
  // const [regionsByCountry, setRegionsByCountry] = useState([]);
  const [filterParams, setFilterParams] = useState(defaultFilter);
  const refTableNode = useRef(null);
  const [locationDataSearch, setLocationDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [isLoadingSearch, setIsLoadingSearch]  = useState(false);

  useEffect(() => {
    dispatch(locationActions.getLocations({}, GET_LOCATION_ALL));
    dispatch(locationActions.getCountries());
  }, [dispatch]);

  const onFilter = useCallback(
    (currentIndex, sizePerPage, filter = {}, type) => {
      //set data call api pagination
      dispatch(
        locationActions.getLocations({
          ...filter,
          _start: currentIndex > 0 ? currentIndex : 0,
          _limit: sizePerPage,
        }),
      );
      if (type !== "pagination") {
        dispatch(locationActions.fetchCountLocation(filter));
      }
    },
    [dispatch],
  );

  const onPaginationChange = (page, sizePerPage, filter, type) => {
    const currentIndex = (page - 1) * sizePerPage;

    if (filter.search) {
      setIsLoadingSearch(true);
      setTimeout(() => {
        setIsLoadingSearch(false);
        onSearch(currentIndex, sizePerPage, filter, type);
      }, 300);
    } else {
      onFilter(currentIndex, sizePerPage, filter);
    }
    if (type !== "pagination") {
      //reset pagination
      set(refTableNode, "current.paginationContext.currSizePerPage", 10);
      set(refTableNode, "current.paginationContext.currPage", 1);
    }
  };

  const onSearch = (currentIndex, sizePerPage, filter) => {
    let locationData = reduce(
      locationAll,
      (result, location) => {
        let columnsTable = [
          Utils.getLocationIdentifer(location),
          get(location, "country.name", ""),
          get(location, "region.name", ""),
        ];
        let searchStr = columnsTable.join(" ");
        if (
          includes(searchStr.toLowerCase(), filter.search.toLowerCase()) &&
          location.active === filter.active
        ) {
          result.push({
            ...location,
            locationIdentifer: columnsTable[0],
            country: columnsTable[1],
            region: columnsTable[2],
          });
        }
        return result;
      },
      [],
    );
    setTotalSearch(locationData.length);
    locationData = locationData.slice(currentIndex, currentIndex + sizePerPage);
    setLocationDataSearch(locationData);
  };

  useEffect(() => {
    // Load init data table
    onFilter(0, 10, { active: true });
  }, [onFilter]);

  //Funtional
  const onRowEventClick = (e, row, rowIndex) => {
    dispatch(locationActions.resetLocation());
    dispatch(locationActions.resetNotification());
    history.push(`/locations/${row._id}`);
  };

  const handleChangeFilterParams = (key, value) => {
    if (value[key] === filterParams[key]) {
      return;
    }
    let filter = {
      ...filterParams,
      ...value,
    };
    filter = omitBy(filter, (item) => item === "");
    setFilterParams(filter);
    onPaginationChange(1, 10, filter);
  };

  //Func render component
  const initData = () => {
    let locationData = map(locations, (location) => {
      return (location = {
        ...location,
        locationIdentifer: Utils.getLocationIdentifer(location),
        country: get(location, "country.name", ""),
        region: get(location, "region.name", ""),
      });
    });
    return { locationData };
  };

  const { locationData } = initData();
  // auto hidden notification after 5s
  if (notification && notification.message) {
    setTimeout(() => {
      dispatch(locationActions.resetNotification());
    }, TIME_HIDDEN_NOTIFICATION);
  }

  return (
    <Container fluid>
      {notification && notification.message ? (
        <Alert
          color={notification.type === "success" ? "success" : "danger"}
          isOpen={!!notification.message}
        >
          {Utils.showNotify(intl, notification)}
        </Alert>
      ) : null}

      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody>
              <Row className="justify-content-center">
                <Col sm={11}>
                  <CardBody>
                    {/* <FormGroup row>
                      <Label sm={2}>
                        <FormattedMessage id="pages.location.table.column.country" />
                        :
                      </Label>
                      <Col md={10}>
                        <Select
                          getOptionLabel={(opt) => opt.name}
                          getOptionValue={(opt) => opt._id}
                          options={countries}
                          placeholder={intl.formatMessage({
                            id: "pages.location.table.column.country",
                          })}
                          noOptionsMessage={() =>
                            intl.formatMessage({
                              id: "components.select.noOption",
                            })
                          }
                          value={
                            find(
                              countries,
                              (item) => item._id === filterParams.country,
                            ) || ""
                          }
                          onChange={(val) => {
                            handleChangeCountry(val ? val._id : "");
                          }}
                          isClearable
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={2}>
                        <FormattedMessage id="pages.location.table.column.region" />
                        :
                      </Label>
                      <Col md={10}>
                        <Select
                          getOptionLabel={(opt) => opt.name}
                          getOptionValue={(opt) => opt._id}
                          options={regionsByCountry}
                          placeholder={intl.formatMessage({
                            id: "pages.location.table.column.region",
                          })}
                          noOptionsMessage={() =>
                            intl.formatMessage({
                              id: "components.select.noOption",
                            })
                          }
                          value={
                            find(
                              regionsByCountry,
                              (item) => item._id === filterParams.region,
                            ) || ""
                          }
                          onChange={(val) => {
                            handleChangeFilterParams("region", {
                              region: val ? val._id : "",
                            });
                          }}
                          isClearable
                        />
                      </Col>
                    </FormGroup> */}

                    <FormGroup row>
                      <Label sm={2}>
                        <FormattedMessage id="components.formTitle.search" />:
                      </Label>
                      <Col md={10}>
                        <DelayInput
                          type="text"
                          className="form-control"
                          delayTimeout={500}
                          value={filterParams.search || ""}
                          disabled={!locationAll}
                          onChange={(e) => {
                            handleChangeFilterParams("search", {
                              search: e.target.value.trim(),
                            });
                          }}
                        />
                      </Col>
                    </FormGroup>
                  </CardBody>
                </Col>
              </Row>
              <FormGroup row>
                <Col sm={{ size: 10 }}>
                  <FormGroup check>
                    <CustomInput
                      type="checkbox"
                      id="exampleCustomCheckbox"
                      label={
                        <FormattedMessage id="components.checkBox.showOnlyActive" />
                      }
                      checked={filterParams.active}
                      onChange={(e) => {
                        handleChangeFilterParams("active", {
                          active: e.target.checked,
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
              </FormGroup>
              <TablePagination
                refTableNode={refTableNode}
                intl={intl}
                data={filterParams.search ? locationDataSearch : locationData}
                columns={columns}
                // defaultSorted={defaultSorted}
                loading={isLoadingSearch || isFetching}
                totalSize={filterParams.search ? totalSearch : totalLocation}
                onPaginationChange={onPaginationChange}
                onRowEventClick={onRowEventClick}
                filterParams={filterParams}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default injectIntl(LocationList);
