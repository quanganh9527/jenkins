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
import { GET_PERSON_ALL } from "../constants";
import _ from "lodash";
import TablePagination from "../../../components/TablePagination";
import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

const defaultSorted = [
  // {
  //   dataField: "name",
  //   order: "desc",
  // },
];

function PeopleList({ intl }) {
  const columns = [
    {
      dataField: "fullName",
      text: intl.formatMessage({ id: "pages.contact.table.column.personName" }),
      sort: true,
    },
    {
      dataField: "groupingName",
      text: intl.formatMessage({
        id: "pages.contact.table.column.groupingName",
      }),
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
  ];

  const dispatch = useDispatch();
  const history = useHistory();

  const [filterParams, setFilterParams] = useState({
    active: true,
  });
  const refTableNode = useRef(null);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [isLoadingSearch, setIsLoadingSearch]  = useState(false);

  const contactReducer = useSelector((state) => state.contact);
  const {
    persons,
    notification,
    isFetchingPeople,
    totalOfPeople,
    personAll,
  } = contactReducer;

  useEffect(() => {
    dispatch(contactActions.getPersons({}, GET_PERSON_ALL));
  }, [dispatch]);

  const onFilter = useCallback(
    (currentIndex, sizePerPage, filter = {}, type) => {
      //set data call api pagination
      dispatch(
        contactActions.getPersons({
          ...filter,
          _start: currentIndex > 0 ? currentIndex : 0,
          _limit: sizePerPage,
        }),
      );
      if (type !== "pagination") {
        dispatch(contactActions.fetchCountPeople(filter));
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
    let personData = _.reduce(
      personAll,
      (result, person) => {
        let columnsTable = [
          person.firstName + " " + person.lastName,
          _.map(person.groupings, item => item.name).join(", ").trim(),
          person.email,
          person.phoneNumber1,
          person.phoneNumber2,
        ];
        let searchStr = columnsTable.join(" ");
        if (
          _.includes(searchStr.toLowerCase(), filter.search.toLowerCase()) &&
          person.active === filter.active
        ) {
          result.push({
            ...person,
            fullName: columnsTable[0],
            groupingName: columnsTable[1],
          });
        }
        return result;
      },
      [],
    );
    setTotalSearch(personData.length);
    personData = personData.slice(currentIndex, currentIndex + sizePerPage);
    setDataSearch(personData);
  };

  useEffect(() => {
    onFilter(0, 10, filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFilter]);

  //Functional
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
    history.push(`/contacts/people/${row._id}`);
  };

  // const handleSearchPerson = () => {
  //   function checkSearchSubGroup() {
  //     let arraySearchGroup = [];
  //     if (searchGroupingKeyword) {
  //       const groupParent = groupingData.find(
  //         (item) => item.name === searchGroupingKeyword,
  //       );
  //       groupParent && arraySearchGroup.push(groupParent._id);

  //       if (showSubGroup && groupParent) {
  //         groupingData.forEach((item) => {
  //           if (item.parentId && item.parentId._id === groupParent._id) {
  //             arraySearchGroup.push(item._id);
  //           }
  //         });
  //       }
  //     }
  //     return arraySearchGroup;
  //   }

  //   let arraySearchGroup = checkSearchSubGroup();

  //   if (personData && personData.length >= 1) {
  //     return _.filter(personData, (person) => {
  //       return (
  //         person.active === showActivePerson &&
  //         (!searchKeyword ||
  //           _.includes(
  //             person.fullName.toLowerCase(),
  //             searchKeyword.toLowerCase(),
  //           )) &&
  //         (!searchGroupingKeyword ||
  //           !_.isEmpty(_.intersection(arraySearchGroup, person.groupingId)))
  //       );
  //     });
  //   }
  //   return [];
  // };

  //Function render component

  const initData = () => {
    let personData = _.map(persons, (person) => {
      return {
        ...person,
        fullName: person.firstName + " " + person.lastName,
        groupingName: _.map(person.groupings, item => item.name).join(", "),
      };
    });
    return { personData };
  };
  const { personData } = initData();

  // const personDisplay = handleSearchPerson();
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
              {/* <Typeahead
                id="typeID3"
                labelKey="name"
                options={groupingData}
                placeholder={intl.formatMessage({
                  id: "components.input.placeholder.filterGroupingName",
                })}
                value={searchKeyword}
                onInputChange={(val) => setSearchGroupingKeyword(val)}
                onChange={(val) =>
                  val[0] && setSearchGroupingKeyword(val[0].name)
                }
              /> */}
            </FormGroup>
            <FormGroup>
              <DelayInput
                type="text"
                className="form-control"
                delayTimeout={500}
                value={filterParams.search || ""}
                disabled={!personAll}
                onChange={(e) => {
                  handleChangeFilterParams("search", {
                    search: e.target.value.trim(),
                  });
                }}
              />
            </FormGroup>
            <FormGroup>
              {/* <CustomInput
                type="checkbox"
                id="ckbShowSubGroup"
                label={intl.formatMessage({
                  id: "components.checkBox.includeSubGroups",
                })}
                checked={filterParams.showSubGroup}
                onChange={(e) => {
                  handleChangeFilterParams("showSubGroup", {
                    showSubGroup: e.target.checked,
                  });
                }}
              /> */}
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
              data={filterParams.search ? dataSearch : personData}
              columns={columns}
              defaultSorted={defaultSorted}
              loading={isLoadingSearch || isFetchingPeople}
              totalSize={filterParams.search ? totalSearch : totalOfPeople}
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

export default injectIntl(PeopleList);
