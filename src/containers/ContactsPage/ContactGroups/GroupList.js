import React, { useEffect, useState, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";

import {
  Row,
  Col,
  // Container,
  Card,
  FormGroup,
  CardBody,
  CardTitle,
  CustomInput,
  Alert,
} from "reactstrap";
import { DelayInput } from "react-delay-input";
import { useSelector, useDispatch } from "react-redux";
import { contactActions } from "../actions";
import { GET_GROUPING_ALL } from "../constants";
import _ from "lodash";
import TablePagination from "../../../components/TablePagination";

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

/*
    Demo data
*/

const defaultSorted = [
  // {
  //   dataField: "name",
  //   order: "desc",
  // },
];

function GroupList({ intl }) {
  const columns = [
    {
      dataField: "name",
      text: intl.formatMessage({ id: "pages.contact.table.column.name" }),
      sort: true,
    },
    {
      dataField: "email",
      text: intl.formatMessage({
        id: "pages.contact.table.column.emailAddress",
      }),
      sort: true,
    },
    {
      dataField: "phoneNumber1",
      text:
        intl.formatMessage({ id: "pages.contact.table.column.phoneNumber" }) +
        " 1",
      sort: true,
    },
    {
      dataField: "phoneNumber2",
      text:
        intl.formatMessage({ id: "pages.contact.table.column.phoneNumber" }) +
        " 2",
      sort: true,
    },
    {
      dataField: "groupingParent",
      text: intl.formatMessage({ id: "pages.contact.table.column.grouping" }),
      sort: true,
    },
  ];

  const dispatch = useDispatch();
  const history = useHistory();

  const [filterParams, setFilterParams] = useState({
    active: true,
  });
  const refTableNode = useRef(null);
  const [groupingDataSearch, setGroupingDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [isLoadingSearch, setIsLoadingSearch]  = useState(false);

  const contactReducer = useSelector((state) => state.contact);
  const {
    groupings,
    notification,
    isFetchingGrouping,
    totalOfGrouping,
    groupingAll,
  } = contactReducer;

  useEffect(() => {
    dispatch(contactActions.getGroupings({}, GET_GROUPING_ALL));
  }, [dispatch]);

  const onFilter = useCallback(
    (currentIndex, sizePerPage, filter = {}, type) => {
      //set data call api pagination
      dispatch(
        contactActions.getGroupings({
          ...filter,
          _start: currentIndex > 0 ? currentIndex : 0,
          _limit: sizePerPage,
        }),
      );
      if (type !== "pagination") {
        dispatch(contactActions.fetchCountGrouping(filter));
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
    let groupingData = _.reduce(
      groupingAll,
      (result, group) => {
        let columnsTable = [
          group.name,
          group.email,
          group.phoneNumber1,
          group.phoneNumber2,
          _.get(group, "parentId.name", ""),
        ];
        let searchStr = columnsTable.join(" ");
        if (
          _.includes(searchStr.toLowerCase(), filter.search.toLowerCase()) &&
          group.active === filter.active
        ) {
          result.push({
            ...group,
            groupingParent: columnsTable[4],
          });
        }
        return result;
      },
      [],
    );
    setTotalSearch(groupingData.length);
    groupingData = groupingData.slice(currentIndex, currentIndex + sizePerPage);
    setGroupingDataSearch(groupingData);
  };

  useEffect(() => {
    onFilter(0, 10, filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFilter]);

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
    history.push(`/contacts/group/${row._id}`);
  };

  const initData = () => {
    let groupingData = _.map(groupings, (group) => {
      return {
        ...group,
        groupingParent: _.get(group, "parentId.name", ""),
      };
    });
    return { groupingData };
  };

  const { groupingData } = initData();

  // auto hidden notification after 5s
  if (notification && notification.message) {
    setTimeout(() => {
      dispatch(contactActions.resetNotification());
    }, TIME_HIDDEN_NOTIFICATION);
  }

  return (
    <Row>
      <Col md="12">
        {notification && notification.message ? (
          <Alert
            color={notification.type === "success" ? "success" : "danger"}
            isOpen={!!notification.message}
          >
            {Utils.showNotify(intl, notification)}
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
                disabled={!groupingAll}
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
              data={filterParams.search ? groupingDataSearch : groupingData}
              columns={columns}
              defaultSorted={defaultSorted}
              loading={isLoadingSearch || isFetchingGrouping}
              totalSize={filterParams.search ? totalSearch : totalOfGrouping}
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

export default injectIntl(GroupList);
