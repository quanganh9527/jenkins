import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  // Container,
  Card,
  FormGroup,
  CardBody,
  CardTitle,
  CustomInput,
  Alert
} from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import BootstrapTable from 'react-bootstrap-table-next';
// import './styles.scss';

import { useSelector, useDispatch } from "react-redux";
import { invoiceActions } from "../actions";
import _ from "lodash"

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";


const defaultSorted = [
  // {
  //   dataField: 'name',
  //   order: 'desc'
  // }
];

function CostCenterList({ onToggleOpen, intl }) {

  const columns = [
    {
      dataField: 'name',
      text: intl.formatMessage({ id: "pages.costType.table.column.costType" }),
      sort: true,
    },
    {
      dataField: "ledgerAccountName",
      text: intl.formatMessage({ id: "pages.costType.table.column.ledgerAccount" }),
      sort: true,
    },
    {
      dataField: 'vatTypeName',
      text: intl.formatMessage({ id: "pages.costType.table.column.vatType" }),
      sort: true,
    },
    {
      dataField: 'countryName',
      text: intl.formatMessage({ id: "pages.costType.table.column.country" }),
      sort: true,
    },
  ];

  const dispatch = useDispatch();
  const [showActiveType, setShowActiveType] = useState(true);
  const [searchTypeKeyword, setSearchTypeKeyword] = useState("");
  const invoiceState = useSelector(state => state.invoice);
  const { costTypes, notification } = invoiceState;

  useEffect(() => {
    dispatch(invoiceActions.getCostTypes());
  }, [dispatch]);

  //Func render component
  const initData = () => {
    let costTypeData = _.map(costTypes, type => {
      return {
        ...type,
        ledgerAccountName: _.get(type.ledgerAccount, "code", "") + "-" + _.get(type.ledgerAccount, "name", ""),
        vatTypeName: _.get(type.vattype, "name", ""),
        countryName: _.get(type.country, "name", "")
      }
    });
    return { costTypeData };
  }

  const { costTypeData } = initData();

  const handleSearchCostType = () => {
    if (costTypeData && costTypeData.length) {
      return _.filter(costTypeData, type => {
        return type.active === showActiveType &&
          (!searchTypeKeyword || _.includes(type.name.toLowerCase(), searchTypeKeyword.toLowerCase()));
      });
    }
    return [];
  }

  const costTypeDisplay = handleSearchCostType();

  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(invoiceActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  })
  const isShowNotification = notification && notification.message && !notification.position && notification.page === "costtype";
  return (
    <Row>
      <Col md="12">
      {isShowNotification ? (
          <Alert
            color={notification.type === "success" ? "success" : "danger"}
            isOpen={!!notification.message}
          >
            {Utils.showNotify(intl, notification)}
          </Alert>
        ) : null}
        <Card className="main-card mb-3">
          <CardBody>
            <CardTitle><FormattedMessage id="components.formTitle.filter" /></CardTitle>
            <FormGroup>
              <Typeahead
                id="typeID2"
                labelKey="name"
                options={costTypeData || []}
                placeholder={intl.formatMessage({ id: "components.input.placeholder.filterCostType" })}
                onChange={val => val[0] && setSearchTypeKeyword(val[0].name)}
                onInputChange={val => setSearchTypeKeyword(val)}
              />
            </FormGroup>
            <FormGroup>
              <CustomInput
                type="checkbox"
                id="ckbShowOnlyActve"
                label={intl.formatMessage({ id: "components.checkBox.showOnlyActive" })}
                checked={showActiveType}
                value={showActiveType}
                onChange={() => setShowActiveType(!showActiveType)}
              />
            </FormGroup>
          </CardBody>
        </Card>
      </Col>
      <Col md="12">
        <Card className="main-card mb-3">
          <CardBody>
            <div className="table-responsive">
              <BootstrapTable
                hover
                bootstrap4
                keyField="id"
                data={costTypeDisplay}
                columns={columns}
                headerClasses="thead-red"
                defaultSorted={defaultSorted}
                rowEvents={{
                  onClick: (e, row, rowIndex) => {
                    dispatch(invoiceActions.setSelectedCostType(row));
                    onToggleOpen();
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default injectIntl(CostCenterList);