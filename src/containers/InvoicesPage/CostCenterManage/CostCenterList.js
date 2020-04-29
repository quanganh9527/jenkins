import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  FormGroup,
  CardBody,
  CardTitle,
  CustomInput,
  Alert,
} from "reactstrap";
import { DelayInput } from "react-delay-input";
import { useSelector, useDispatch } from "react-redux";
import { invoiceActions } from "../actions";
import _ from "lodash";

import { FormattedMessage, injectIntl } from "react-intl";
import TablePagination from "../../../components/TablePagination";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import {
  COST_CENTER_RECEIVE_MESSAGE_INVOICE,
  GET_COST_CENTER_ALL,
} from "../constants";
import Utils from "../../../utilities/utils";

const defaultSorted = [
  // {
  //   dataField: 'costIdentifier',
  //   order: 'desc'
  // }
];

function CostCenterList({ onToggleOpen, intl }) {
  const columns = [
    {
      dataField: "costIdentifier",
      text: intl.formatMessage({
        id: "pages.costCenter.table.column.identifier",
      }),
      sort: true,
    },
    {
      dataField: "name",
      text: intl.formatMessage({ id: "pages.costCenter.table.column.name" }),
      sort: true,
    },
  ];
  const dispatch = useDispatch();
  const refTableNode = useRef(null);
  const [filterParams, setFilterParams] = useState({
    active: true,
  });
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const invoiceState = useSelector((state) => state.invoice);
  const {
    costCenters,
    notificationCostCenter,
    isFetchingCostCenter,
    totalOfCostcenter,
    costCenterAll,
  } = invoiceState;

  useEffect(() => {
    dispatch(invoiceActions.getCostCenters({}, GET_COST_CENTER_ALL));
  }, [dispatch]);

  const onFilter = useCallback(
    (currentIndex, sizePerPage, filter = {}, type) => {
      //set data call api pagination
      dispatch(
        invoiceActions.getCostCenters({
          ...filter,
          _start: currentIndex > 0 ? currentIndex : 0,
          _limit: sizePerPage,
        }),
      );
      if (type !== "pagination") {
        dispatch(invoiceActions.fetchCountCostCenters(filter));
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
      _.set(refTableNode, "current.paginationContext.currSizePerPage", 10);
      _.set(refTableNode, "current.paginationContext.currPage", 1);
    }
  };

  const onSearch = (currentIndex, sizePerPage, filter) => {
    let costCenterData = _.reduce(
      costCenterAll,
      (result, costCenter) => {
        let columnsTable = [costCenter.costIdentifier, costCenter.name];
        let searchStr = columnsTable.join(" ");
        if (
          _.includes(searchStr.toLowerCase(), filter.search.toLowerCase()) &&
          costCenter.active === filter.active
        ) {
          result.push(costCenter);
        }
        return result;
      },
      [],
    );
    setTotalSearch(costCenterData.length);
    costCenterData = costCenterData.slice(
      currentIndex,
      currentIndex + sizePerPage,
    );
    setDataSearch(costCenterData);
  };

  useEffect(() => {
    //Init data
    onFilter(0, 10, filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFilter]);

  useEffect(() => {
    if (notificationCostCenter && notificationCostCenter.type === "success") {
      //Call api when create/update data
      let filter = {
        active: true,
      };
      setFilterParams(filter);
      onFilter(0, 10, filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFilter, notificationCostCenter]);

  //Funtional
  const handleChangeFilterParams = (key, value) => {
    if (value[key] === filterParams[key]) {
      return;
    }
    let filter = {
      ...filterParams,
      ...value,
    };
    filter = _.omitBy(filter, (item) => item === "");
    setFilterParams(filter);
    onPaginationChange(1, 10, filter);
  };

  const onRowEventClick = (e, row, rowIndex) => {
    dispatch(invoiceActions.setSelectedCostCenter(row));
    onToggleOpen();
  };

  //auto hidden notification
  useEffect(() => {
    if (notificationCostCenter && notificationCostCenter.message) {
      setTimeout(() => {
        dispatch(
          invoiceActions.resetNotification(COST_CENTER_RECEIVE_MESSAGE_INVOICE),
        );
      }, TIME_HIDDEN_NOTIFICATION);
    }
  });

  const isShowNotification =
    notificationCostCenter &&
    notificationCostCenter.message &&
    !notificationCostCenter.position &&
    notificationCostCenter.page === "costcenter";

  return (
    <Row>
      <Col md="12">
        {isShowNotification ? (
          <Alert
            color={
              notificationCostCenter.type === "success" ? "success" : "danger"
            }
            isOpen={!!notificationCostCenter.message}
          >
            {Utils.showNotify(intl, notificationCostCenter)}
          </Alert>
        ) : null}
        <Card className="main-card mb-3">
          <CardBody>
            <CardTitle>
              <FormattedMessage id="components.formTitle.search" />
            </CardTitle>
            <FormGroup>
              <DelayInput
                type="text"
                className="form-control"
                delayTimeout={500}
                value={filterParams.search || ""}
                disabled={!costCenterAll}
                onChange={(e) => {
                  handleChangeFilterParams("search", {
                    search: e.target.value.trim(),
                  });
                }}
              />
            </FormGroup>
            <FormGroup>
              <CustomInput
                type="checkbox"
                id="ckbShowOnlyActve"
                label={intl.formatMessage({
                  id: "components.checkBox.showOnlyActive",
                })}
                checked={filterParams.active}
                onChange={(e) => {
                  handleChangeFilterParams("active", {
                    active: e.target.checked,
                  });
                }}
              />
            </FormGroup>
          </CardBody>
        </Card>
      </Col>
      <Col md="12">
        <Card className="main-card mb-3">
          <CardBody>
            <TablePagination
              refTableNode={refTableNode}
              intl={intl}
              data={filterParams.search ? dataSearch : costCenters}
              columns={columns}
              defaultSorted={defaultSorted}
              loading={isLoadingSearch || isFetchingCostCenter}
              totalSize={filterParams.search ? totalSearch : totalOfCostcenter}
              onPaginationChange={onPaginationChange}
              onRowEventClick={onRowEventClick}
              filterParams={filterParams}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default injectIntl(CostCenterList);
