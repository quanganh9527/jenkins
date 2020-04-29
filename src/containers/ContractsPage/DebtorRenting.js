import React, { useRef, useEffect, useCallback, useState } from "react";
import moment from "moment";
import __ from "lodash";
import { Col, Container, Card, Row, Button, Alert } from "reactstrap";
import { injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import PageLayout from "components/PageLayout";
import PageTitle from "components/PageTitle";
import TablePagination from "components/TablePagination";

import TableFilters from "./components/TableFilters";

import { debtorRentingContractsColumns } from "./constants";
import * as selector from "./selector";
import * as actions from "./actions";
import { TIME_HIDDEN_NOTIFICATION } from "constants/alert.constants";
import Utils from "utilities/utils";
const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const DebtorRenting = (props) => {
  const { intl } = props;
  const refTableNode = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const noitification = useSelector(selector.getNotification());
  const debtorRentingContracts = useSelector(
    selector.makeSelectDebtorRentingContracts(),
  );
  const countDebtorRentingContract = useSelector(
    selector.makeSelectCountDebtorRentingContracts(),
  );
  const isFetchingDebtorRenting = useSelector(
    selector.makeSelectStatusDebtorRentingContracts(),
  );
  const [active, setActive] = useState(true);
  const [customer, setCustomer] = useState({});
  const [location, setLocation] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEnDate] = useState(null);
  const [filterParams, setFilterParams] = useState({ active: true });

  const filterData = useCallback(
    (page, sizePerPage, params, type) => {

      const currentIndex = (page - 1) * sizePerPage;
      dispatch(
        actions.getDebtorRentingContracts(
          Object.assign(params, {
            _start: currentIndex > 0 ? currentIndex : 0,
            _limit: sizePerPage,
            _sort: "updatedAt:DESC",
          }),
        ),
      );
      if (type !== "pagination") {

        //TODO Fetch count & reset pagination page
        dispatch(actions.fetchCountDebtorRentingContracts(params));
        if (
          refTableNode &&
          refTableNode.current &&
          refTableNode.current.paginationContext
        ) {
          // reset pagination
          refTableNode.current.paginationContext.currSizePerPage = 10;
          refTableNode.current.paginationContext.currPage = 1;
        }
      }
    },
    [dispatch],
  );
  useEffect(() => {
    //Load init data table
    filterData(1, 10, filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);
  const onHandleResetFilters = useCallback(() => {
    setLocation({});
    setCustomer({});
    setStartDate(null);
    setEnDate(null);
    setActive(true);
    setFilterParams({ active: true });
    filterData(1, 10, { active: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onChangeStatusActive = useCallback(
    (status) => {
      setActive(status);
      let _params = { ...filterParams };
      _params["active"] = status;
      setFilterParams(_params);
      filterData(1, 10, _params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );
  const onChangeLocationSelect = useCallback(
    (location) => {
      setLocation(location);
      let _params = { ...filterParams };
      if (!__.isEmpty(location) && location._id) {
        _params["location"] = location._id;
      } else {
        delete _params["location"];
      }
      setFilterParams(_params);
      filterData(1, 10, _params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );
  const onChangeCustomerSelect = useCallback(
    (customer) => {
      setCustomer(customer);
      let _params = { ...filterParams };
      if (!__.isEmpty(customer) && customer._id) {
        if (customer.type === "person") {
          _params["person"] = customer._id;
        } else {
          _params["grouping"] = customer._id;
        }
      } else {
        delete _params["person"];
        delete _params["grouping"];
      }
      setFilterParams(_params);
      filterData(1, 10, _params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );
  const handleChangeStartDate = useCallback(
    (date) => {
      console.log("date: ", date);

      setStartDate(date);
      let _params = { ...filterParams };
      if (date && moment(date).isValid()) {
        _params["startDate_gte"] = moment(date).startOf("date").toISOString();
      } else {
        delete _params["startDate_gte"];
      }
      setFilterParams(_params);
      filterData(1, 10, _params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );
  const handleChangeEndDate = useCallback(
    (date) => {
      setEnDate(date);
      let _params = { ...filterParams };
      if (date && moment(date).isValid()) {
        _params["startDate_lte"] = moment(date).endOf("date").toISOString();;
      } else {
        delete _params["startDate_lte"];
      }
      setFilterParams(_params);
      filterData(1, 10, _params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );
  const onPaginationChange = useCallback((page, sizePerPage) => {
    filterData(page, sizePerPage, filterParams, "pagination");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);
  const onRowEventClick = useCallback(
    (e, row, rowIndex) => {
      history.push(`/contracts/debtor-renting-contracts/${row._id}`);
    },
    [history],
  );
  const onAddDebtorContract = React.useCallback(() => {
    history.push("/contracts/debtor-renting-contracts/create");
  }, [history]);
  useEffect(() => {
    if (noitification && noitification.message) {
      setTimeout(() => {
        dispatch(actions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  }, [dispatch, noitification]);
  return (
    <PageLayout>
      <PageTitle
        heading={intl.formatMessage({
          id: "components.pageTitle.debtorRentingContracts",
        })}
        icon="page-title-custom-icon nav-icon-inspections"
      />

      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="main-card p-4">
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
              <TableFilters
                {...props}
                active={active}
                onChangeStatusActive={onChangeStatusActive}
                location={location}
                onChangeLocationSelect={onChangeLocationSelect}
                customer={customer}
                onChangeCustomerSelect={onChangeCustomerSelect}
                startDate={startDate}
                endDate={endDate}
                handleChangeStartDate={handleChangeStartDate}
                handleChangeEndDate={handleChangeEndDate}
                onHandleResetFilters={onHandleResetFilters}
              />
              <Row className="justify-content-center">
                <Col sm={11}>
                  <div className="mb-4">
                    <Button
                      className="btn-shadow mr-3"
                      color="success"
                      size="lg"
                      onClick={onAddDebtorContract}
                    >
                      {intl.formatMessage({
                        id: "pages.contracts.button.addDebtorRentingContact",
                      })}
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TablePagination
                    refTableNode={refTableNode}
                    intl={intl}
                    data={debtorRentingContracts || []}
                    columns={debtorRentingContractsColumns(intl)}
                    defaultSorted={defaultSorted}
                    loading={isFetchingDebtorRenting}
                    totalSize={countDebtorRentingContract}
                    onPaginationChange={onPaginationChange}
                    onRowEventClick={onRowEventClick}
                    // resetFilter={onHandleResetFilters}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </PageLayout>
  );
};

export default React.memo(injectIntl(DebtorRenting));
