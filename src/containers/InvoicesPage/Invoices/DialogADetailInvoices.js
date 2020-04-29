import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
  Col,
  Row,
  Label,
} from "reactstrap";
import useForm from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
// import update from 'react-addons-update';
import { invoiceActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";

import _ from "lodash";
import DialogConfirm from "./DialogConfirm";
import DialogConfirmNoneData from "./DialogConfirmNoneData";
import NumberFormat from "react-number-format";
import Switch from "react-switch";
import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";

function DialogADetailInvoices({ onToggleOpen, isOpen, intl }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const invoiceState = useSelector((state) => state.invoice);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenConfirmModalNoneBill, setIsOpenConfirmModalNoneBill] = useState(
    false,
  );

  const {
    notification,
    reviewInvoices,
    receiveParamsInvoices,
    selectedReviewInvoice,
    detailInvoices,
  } = invoiceState;
  let [invoice, setInvoice] = useState([]);
  let [identifier, setIdentifier] = useState("");
  let [state] = useState(true);
  let [stateAprrove, setStateAprrove] = useState(true);
  let [costLineParams, setCostLineParams] = useState([]);
  let [statePostpone, setStatePostpone] = useState(false);
  let [checklist, setChecklist] = useState([]);
  useEffect(() => {
    let min = _.map(reviewInvoices, (item) => {
      return item.identifier;
    });
    identifier = Math.min(...min);
    invoice = _.filter(reviewInvoices, (invoice) => {
      return invoice.identifier === selectedReviewInvoice.identifier;
    })[0];
    setInvoice(invoice);
    receiveParamsInvoices["contactId"] = invoice.debtor;
    receiveParamsInvoices["location"] = invoice.location;
    receiveParamsInvoices["country"] = invoice.country;
    setIdentifier(identifier);
    dispatch(invoiceActions.getDetailInvoice(receiveParamsInvoices));
  }, [receiveParamsInvoices, dispatch]);
  const { handleSubmit } = useForm({});
  const removeCostline = (costLine, checked) => {
    if (checked) {
      costLineParams = _.filter(costLineParams, (cost) => cost !== costLine);
      setCostLineParams(costLineParams);
      receiveParamsInvoices["costLine"] = costLineParams;
    } else {
      costLineParams.push(costLine);
      setCostLineParams(costLineParams);
      receiveParamsInvoices["costLine"] = costLineParams;
    }
  };
  const handleSubmitInvoice = () => {
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    identifier = "";
    setIdentifier(identifier);
    stateAprrove = false;
    setStateAprrove(stateAprrove);
    isOpen = false;
    let invoices = _.filter(reviewInvoices, (item) => {
      return item.identifier === selectedReviewInvoice.identifier;
    });
    let costLines = _.filter(invoices[0].costLines, (costLine) => {
      return !costLineParams.includes(costLine);
    });
    let newInvoice = {
      paymentTermDays: invoices[0].paymentTermDays,
      type: receiveParamsInvoices.type,
      billedTo: invoices[0].debtor,
      costLines: _.map(costLines, (costLine) => {
        return { _id: costLine };
      }),
    };
    delete receiveParamsInvoices.contactId;
    delete receiveParamsInvoices.location;
    delete receiveParamsInvoices.costLine;
    setIsOpenConfirmModal(false);
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(
      invoiceActions.submitCreateInvoice([newInvoice], receiveParamsInvoices),
    );

    return onToggleOpen();
  };
  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(invoiceActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  });
  const cancel = () => {
    identifier = "";
    setIdentifier(identifier);
    setIsOpenConfirmModal(!isOpenConfirmModal);
    delete receiveParamsInvoices.costLine;
    dispatch(invoiceActions.getDetailInvoice(receiveParamsInvoices));
    isOpen = false;
    return onToggleOpen();
  };
  const cancelDialog = () => {
    setIsOpenConfirmModal(!isOpenConfirmModal);
    // delete receiveParamsInvoices.costLine
    // dispatch(invoiceActions.getDetailInvoice(receiveParamsInvoices));
  };
  const cancelDialogNoneBill = () => {
    setIsOpenConfirmModalNoneBill(false);
    delete receiveParamsInvoices.costLine;
    dispatch(invoiceActions.getDetailInvoice(receiveParamsInvoices));
  };
  const handleChangeDebtorStatus = (debtor, checked) => {
    if (checked) {
      setChecklist(
        _.filter(checklist, (itemCheck) => itemCheck !== debtor.costLines),
      );
    } else {
      checklist.push(debtor.costLines);
      checklist = _.uniq(checklist);
      setChecklist(checklist);
    }
    removeCostline(debtor.costLines, checked);
  };
  return (
    <Modal isOpen={isOpen} size="lg" backdrop={true}>
      <ModalHeader toggle={cancel}>
        <FormattedMessage id="components.dialog.invoiceDetail" />
      </ModalHeader>

      <ModalBody>
        <FormGroup row>
          <FormGroup row className="z-index-6">
            <Col md={4} className="ml-3 mr-2">
              <Input
                key="contactName"
                type="text"
                placeholder={intl.formatMessage({
                  id: "components.input.placeholder.contactName",
                })}
                name="name"
                value={
                  Array.from(
                    new Set(
                      _.map(detailInvoices, (debtor) => {
                        return debtor.debtorName;
                      }),
                    ),
                  )[0]
                }
                disabled
              />
            </Col>
            <Col md={4} className="mr-3">
              <Input
                // /Location identifier
                type="text"
                placeholder=""
                name="name"
                value={
                  !invoice.collective
                    ? Array.from(
                        new Set(
                          _.map(detailInvoices, (debtor) => {
                            return debtor.locationIdentifier;
                          }),
                        ),
                      )
                    : ""
                }
                disabled
              />
            </Col>
            <Col className="mx-auto">
              <Button color="link" onClick={cancel}>
                <FormattedMessage id="components.button.cancel" />
              </Button>
              <Button
                color="success"
                type="button"
                onClick={handleSubmit(() => {
                  costLineParams.length > 0 &&
                  costLineParams.length === detailInvoices.length
                    ? setIsOpenConfirmModalNoneBill(true)
                    : setIsOpenConfirmModal(true);
                })}
                disabled={!stateAprrove}
              >
                <FormattedMessage id="components.button.approve" />
              </Button>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md={12}>
              <hr />
            </Col>
          </FormGroup>
          {_.map(detailInvoices, (debtor, idx) => {
            // debtor.enable= true;
            if (!invoice.collective)
              return (
                <FormGroup key={debtor.costLines} disabled={state}>
                  <FormGroup row>
                    <Col md={11} className="ml-3">
                      <Input
                        bsSize="m"
                        key="description"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.costLineDes",
                        })}
                        name="description"
                        defaultValue={debtor.description}
                        disabled
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mx-auto">
                    <Col>
                      <Input
                        key="cost"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.costType",
                        })}
                        name="cost"
                        defaultValue={debtor.costType}
                        disabled
                      />
                    </Col>
                    <Col>
                      <NumberFormat
                        fixedDecimalScale={true}
                        thousandSeparator="."
                        decimalSeparator=","
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.unitPrice",
                        })}
                        decimalScale={2}
                        inputMode="numeric"
                        allowNegative={false}
                        allowLeadingZeros={false}
                        value={debtor.price || 0}
                        prefix="€ "
                        disabled
                      />
                    </Col>
                    <label className="mt-2">X</label>
                    <Col>
                      <Input
                        key="quantity"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.unitQuantity",
                        })}
                        name="quantity"
                        defaultValue={debtor.quantity}
                        disabled={true}
                      />
                    </Col>
                    <label className="mt-2">=</label>
                    <Col>
                      <NumberFormat
                        fixedDecimalScale={true}
                        thousandSeparator="."
                        decimalSeparator=","
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.totalPrice",
                        })}
                        decimalScale={2}
                        inputMode="numeric"
                        allowNegative={false}
                        allowLeadingZeros={false}
                        value={debtor.total || 0}
                        prefix="€ "
                        disabled
                      />
                    </Col>
                    <Col>
                      <Row>
                        <Switch
                          id={debtor.costLines}
                          checked={
                            _.find(
                              checklist,
                              (itemCheck) => itemCheck === debtor.costLines,
                            ) === undefined
                              ? true
                              : false
                          }
                          onChange={(check) => {
                            handleChangeDebtorStatus(debtor, check);
                          }}
                          uncheckedIcon={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                fontSize: 15,
                                color: "orange",
                                paddingRight: 2,
                              }}
                            >
                              <FormattedMessage id="components.button.off" />
                            </div>
                          }
                          checkedIcon={
                            <svg
                              viewBox="0 0 10 10"
                              height="100%"
                              width="100%"
                              fill="aqua"
                            >
                              <circle r={3} cx={5} cy={5} />
                            </svg>
                          }
                        />
                        <Label
                          className="ml-1 mt-1"
                          type="text"
                          disabled={statePostpone}
                          // onClick={checked => {
                          //   handleChange(debtor.costLines, checked);
                          // state = false
                          // }}
                        >
                          Postpone{" "}
                        </Label>
                      </Row>
                    </Col>
                  </FormGroup>
                </FormGroup>
              );
            else
              return (
                <FormGroup key={debtor.costLines} disabled={state}>
                  <FormGroup row>
                    <Col md={7} className="ml-3">
                      <Input
                        key="description"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.costLineDes",
                        })}
                        name="description"
                        defaultValue={debtor.description}
                        disabled={true}
                      />
                    </Col>
                    <Col md={4} className="ml-2">
                      <Input
                        key="location"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.location",
                        })}
                        name="location"
                        defaultValue={debtor.locationIdentifier}
                        disabled={true}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className="ml-3">
                      <Input
                        key="cost"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.costType",
                        })}
                        name="cost"
                        defaultValue={debtor.costType}
                        disabled
                      />
                    </Col>
                    <Col>
                      <NumberFormat
                        thousandSeparator={true}
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.unitPrice",
                        })}
                        decimalScale={2}
                        inputMode="numeric"
                        allowNegative={false}
                        allowLeadingZeros={false}
                        value={debtor.price || 0}
                        prefix="€ "
                        disabled
                      />
                      {/* <Input
                      key="price"
                      type="text"
                      placeholder="Unit price"
                      name="price"
                      defaultValue={'€ ' + debtor.price}
                    /> */}
                    </Col>
                    <label className="mt-2">X</label>
                    <Col className="mr-1">
                      {/* <Input
                      key="quantity"
                      type="text"
                      placeholder="Unit quantity"
                      name="quantity"
                      defaultValue={debtor.quantity}
                    /> */}
                      <NumberFormat
                        thousandSeparator={true}
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.unitQuantity",
                        })}
                        decimalScale={2}
                        inputMode="numeric"
                        allowNegative={false}
                        allowLeadingZeros={false}
                        value={debtor.quantity || 0}
                        disabled
                      />
                    </Col>

                    <label className="mt-2">=</label>
                    <Col className="mr-1">
                      <NumberFormat
                        thousandSeparator={true}
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.totalPrice",
                        })}
                        decimalScale={2}
                        inputMode="numeric"
                        allowNegative={false}
                        allowLeadingZeros={false}
                        value={debtor.total || 0}
                        prefix="€ "
                        disabled
                      />
                      {/* <Input
                      key="total"
                      type="text"
                      placeholder="Total price"
                      name="total"
                      defaultValue={'€ ' + debtor.total}
                    /> */}
                    </Col>
                    <Col>
                      <Row>
                        <Switch
                          id={debtor.costLines}
                          checked={
                            _.find(
                              checklist,
                              (itemCheck) => itemCheck === debtor.costLines,
                            ) === undefined
                              ? true
                              : false
                          }
                          onChange={(check) => {
                            handleChangeDebtorStatus(debtor, check);
                          }}
                          uncheckedIcon={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                fontSize: 15,
                                color: "orange",
                                paddingRight: 2,
                              }}
                            >
                              <FormattedMessage id="components.button.off" />
                            </div>
                          }
                          checkedIcon={
                            <svg
                              viewBox="0 0 10 10"
                              height="100%"
                              width="100%"
                              fill="aqua"
                            >
                              <circle r={3} cx={5} cy={5} />
                            </svg>
                          }
                        />
                        <Label type="text" className="ml-1 mt-1">
                          <FormattedMessage id="components.button.postpone" />{" "}
                        </Label>
                      </Row>
                    </Col>
                  </FormGroup>
                </FormGroup>
              );
          })}
        </FormGroup>
      </ModalBody>
      <DialogConfirm
        identifier={identifier}
        isOpen={isOpenConfirmModal}
        onToggleOpen={() => setIsOpenConfirmModal(!isOpenConfirmModal)}
        handleSubmit={handleSubmit(handleSubmitInvoice)}
        isSubmitting={isSubmitting}
        cancel={cancelDialog}
      />
      <DialogConfirmNoneData
        isOpen={isOpenConfirmModalNoneBill}
        cancel={cancelDialogNoneBill}
      />
      {/* <DialogReloadData
        isOpen={isOpenReloadModal}
        okDialogReloadData={okDialogReloadData}
      /> */}
    </Modal>
  );
}
export default injectIntl(DialogADetailInvoices);
