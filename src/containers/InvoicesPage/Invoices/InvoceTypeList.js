import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  FormGroup,
  CardBody,
  InputGroup,
  InputGroupAddon,
  Label,
  Alert,
  Button,
  CardHeader,
} from "reactstrap";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import overlayFactory from "react-bootstrap-table2-overlay";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { invoiceActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";

import _ from "lodash";
import useForm from "react-hook-form";
import DialogConfirm from "./DialogConfirm";

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";
import { nlFormat } from "utilities/currency";

const defaultSorted = [
  {
    dataField: "identifier",
    order: "asc",
  },
];
const typeOptions = [
  { label: "Custom", value: "Custom" },
  { label: "Rent", value: "Rent" },
  { label: "Job", value: "Job" },
];

function InvoiceList({ intl, onToggleOpen, onToggleOpenConfirm }) {
  const columns = [
    {
      dataField: "id",
      text: intl.formatMessage({
        id: "pages.invoice.table.column.potentialInvoice",
      }),
    },
    {
      dataField: "identifier",
      text: intl.formatMessage({
        id: "pages.location.table.column.locationIdentifier",
      }),
      hidden: "true",
    },
    {
      dataField: "gross",
      text: intl.formatMessage({ id: "pages.invoice.table.column.gross" }),
    },
    {
      dataField: "net",
      text: intl.formatMessage({ id: "pages.invoice.table.column.net" }),
    },
    {
      dataField: "vat",
      text: intl.formatMessage({ id: "pages.invoice.table.column.vat" }),
    },
    {
      dataField: "locationIdentifier",
      text: intl.formatMessage({ id: "pages.invoice.table.column.location" }),
    },
  ];

  const dispatch = useDispatch();
  const invoiceState = useSelector((state) => state.invoice);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);

  const {
    reviewInvoices,
    notification,
    isFetchingReviewInvoice,
  } = invoiceState;
  console.log("InvoiceList -> reviewInvoices", reviewInvoices);
  const [toDate, setToDate] = useState(new Date());
  const [searchTypeKeyword, setSearchTypeKeyword] = useState({
    label: "Job",
    value: "Job",
  });
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isSubmitting] = useState(false);
  let [stateApprove, setStateApprove] = useState(true);
  let [selected, setSelected] = useState();
  let [select] = useState();
  // let [isOpenReloadModal, setIsOpenReloadModal] = useState(false);
  const [searchData, setSearchData] = useState({
    to: "",
    type: "",
  });
  let [identifier, setIdentifier] = useState("");
  let [min] = useState(0);
  let [listChoose, setListChoose] = useState([]);
  const getIdentifier = () => {
    min = _.map(reviewInvoices, (item) => {
      return item.identifier;
    });
    min = Math.min(...min);
    _.forEach(listChoose, (item) => {
      if (!_.isEmpty(item)) {
        identifier = identifier.concat(" ").concat(min.toString());
        min += 1;
      }
    });
    setIdentifier(identifier);
    setIsOpenConfirmModal(true);
  };
  const cancel = () => {
    identifier = "";
    setIdentifier(identifier);
    setIsOpenConfirmModal(!isOpenConfirmModal);
  };
  const handleChange = (searchTypeKeyword) => {
    setSearchTypeKeyword(searchTypeKeyword);
    handleChangeSearch("type", searchTypeKeyword.label);
  };
  const handleChangeToDate = (date) => {
    setToDate(date);
    handleChangeSearch("to", moment(date).format("DD/MM/YYYY"));
    if (!toDate) {
      setToDate(date);
      // searchData.to=toDate;
    }
  };
  const handleChangeSearch = (key, value = "") => {
    if (value === searchData[key]) {
      return;
    }
    setSearchData({
      ...searchData,
      [key]: value,
    });
  };
  useEffect(() => {
    delete searchData.contactId;
    delete searchData.location;
    delete searchData.costLine;
    if (!searchData.to || !moment(searchData.to, "DD/MM/YYYY").isValid()) {
      delete searchData.to;
    }
    dispatch(invoiceActions.getReviewInvoices(searchData));
  }, [searchData, dispatch]);
  const { handleSubmit } = useForm({});
  const handleSubmitInvoice = () => {
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    selected = [];
    setSelected(selected);
    let invoices = _.map(listChoose, (item) => {
      let getReviewInvoice = _.filter(reviewInvoices, (invoice) => {
        return invoice.identifier === item.identifier;
      });
      return {
        paymentTermDays: getReviewInvoice[0].paymentTermDays,
        type: searchTypeKeyword.value,
        billedTo: getReviewInvoice[0].debtor,
        costLines: _.map(getReviewInvoice[0].costLines, (costLine) => {
          return { _id: costLine };
        }),
      };
    });
    delete searchData.contactId;
    delete searchData.location;
    delete searchData.costLine;
    resetData();
    selected = undefined;
    setSelected(selected);
    setSearchData(searchData);
    setIsOpenConfirmModal(false);
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(invoiceActions.submitCreateInvoice(invoices, searchData));
    // setIsOpenReloadModal(true);
    // initData()
  };
  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(invoiceActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  });
  const initData = () => {
    let index = 0;
    let displayInvoices = _.map(reviewInvoices, (item) => {
      index += 1;
      return {
        id: index,
        identifier: item.identifier,
        gross: nlFormat(item.gross),
        net: nlFormat(item.net),
        vat: nlFormat(item.vat),
        locationIdentifier: item.locationIdentifier,
      };
    });
    return { displayInvoices };
  };
  const resetData = () => {
    setListChoose([]);
    setStateApprove(true);
    setIdentifier("");
  };
  const clickRow = (row) => {
    searchData.type = searchTypeKeyword.label;
    dispatch(invoiceActions.setSelectedReviewInvoice(row));
    setSelected([]);
    resetData();
  };
  let { displayInvoices } = initData();
  return (
    (select = () => {
      const selectRow = {
        mode: "checkbox",
        headerColumnStyle: { width: "30px" },
        selectColumnPosition: "right",
        selected: selected,
        onSelect: (row, isSelect, rowIndex, e) => {
          setSelected(undefined);
          if (isSelect) {
            listChoose.push(row);
          } else {
            listChoose = _.filter(listChoose, (item) => {
              return item.identifier !== row.identifier;
            });
          }
          setListChoose(listChoose);
          if (listChoose.length > 0) {
            setStateApprove(false);
          } else {
            setStateApprove(true);
          }
        },
        onSelectAll: (isSelect, rows, e) => {
          setSelected(undefined);
          if (isSelect) {
            Object.assign(listChoose, rows);
          } else {
            listChoose = [];
          }
          setListChoose(listChoose);
          if (listChoose.length > 0) {
            setStateApprove(false);
          } else {
            setStateApprove(true);
          }
        },
      };
      return selectRow;
    }),
    (
      <Container fluid>
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
              <CardHeader className="w-100">
                <div className="w-100 d-flex justify-content-between">
                  <p className="my-auto">
                    <FormattedMessage id="components.formTitle.filters" />
                  </p>
                  <div className="ml-auto">
                    <Button
                      color="success"
                      type="button"
                      className="ml-2"
                      onClick={handleSubmit(getIdentifier)}
                      disabled={stateApprove}
                    >
                      <FormattedMessage id="components.button.approve" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Label sm={2}>
                    <FormattedMessage id="pages.inspection.date" />:{" "}
                  </Label>
                  <Label md={4}>
                    <Col>
                      <InputGroup className="z-index-7">
                        <DatePicker
                          className="form-control"
                          selected={toDate}
                          onChange={handleChangeToDate}
                          // startDate={toDate}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="To date"
                          isClearable
                        />
                        <InputGroupAddon addonType="append">
                          <div className="input-group-text">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </div>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Label>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>
                    <FormattedMessage id="pages.inspection.type" />:{" "}
                  </Label>
                  <Label md={4}>
                    <Col>
                      <Select
                        md={4}
                        id="select-type"
                        labelKey="type"
                        options={typeOptions}
                        placeholder="Invoice type"
                        noOptionsMessage={() =>
                          intl.formatMessage({
                            id: "components.select.noOption",
                          })
                        }
                        defaultValue={{ label: "Job", value: "Job" }}
                        // value={searchTypeKeyword}
                        onChange={(value) => handleChange(value)}
                      />
                    </Col>
                  </Label>
                </FormGroup>
              </CardBody>
            </Card>
            <Card className="main-card mb-3">
              <CardBody>
                <div className="table-responsive">
                  <BootstrapTable
                    hover
                    remote
                    bootstrap4
                    keyField="id"
                    data={displayInvoices}
                    columns={columns}
                    selectRow={select()}
                    defaultSorted={defaultSorted}
                    headerClasses="thead-red"
                    loading={isFetchingReviewInvoice}
                    overlay={
                      isFetchingReviewInvoice &&
                      overlayFactory({
                        spinner: true,
                        styles: {
                          overlay: (base) => ({
                            ...base,
                            background: "rgba(255,255,255,0.7)",
                          }),
                        },
                      })
                    }
                    noDataIndication={() => (
                      <div>
                        {intl.formatMessage({
                          id: "components.table.title.noResult",
                        })}
                      </div>
                    )}
                    rowEvents={{
                      onClick: (e, row, rowIndex) => {
                        clickRow(row);
                        onToggleOpen();
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <DialogConfirm
          identifier={identifier}
          isOpen={isOpenConfirmModal}
          handleSubmit={handleSubmit(handleSubmitInvoice)}
          isSubmitting={isSubmitting}
          cancel={cancel}
        />
        {/* <DialogReloadData
        isOpen={isOpenReloadModal}
        okDialogReloadData={okDialogReloadData}
      /> */}
      </Container>
    )
  );
}

export default injectIntl(InvoiceList);
