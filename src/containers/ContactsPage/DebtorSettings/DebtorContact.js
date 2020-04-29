import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Input,
  CustomInput,
  CardTitle,
  Label,
  Button,
  FormFeedback,
  Alert,
} from "reactstrap";
import Select from "react-select";
import InputMask from "react-input-mask";
// import NumericInput from "react-numeric-input";

import { useSelector, useDispatch } from "react-redux";
import { contactActions } from "../actions";
import { forEach, find } from "lodash";
import useForm from "react-hook-form";
import { validationDebtorContact } from "../validation";

// ###
import ModalConfirm from "./ModalConfirm";

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

function DebtorContact({ intl }) {
  // local
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedDebtorId, setSelectedDebtorId] = useState("");
  const [accountView, setAccountView] = useState("");
  const [selectedDebtor, setSelectedDebtor] = useState({});
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const dispatch = useDispatch();

  const contactState = useSelector((state) => state.contact);
  const {
    persons,
    groupings,
    debtorContacts,
    debtor,
    notification,
    isFetchingDebtorContact,
  } = contactState;

  forEach(persons, (item) => {
    item.name = `${item.firstName} ${item.lastName}`;
    item.type = "person";
  });
  forEach(groupings, (item) => {
    item.type = "grouping";
  });

  useEffect(() => {
    dispatch(contactActions.getDebtorContactList());
    dispatch(contactActions.getPersons());
    dispatch(contactActions.getGroupings());
  }, [dispatch]);

  const { handleSubmit, register, errors, setValue, reset, watch } = useForm({
    validationSchema: validationDebtorContact(intl),
  });

  const isDebtor = watch("isDebtor", false);

  useEffect(() => {
    register({ name: "accountView" });
  }, [register]);

  useEffect(() => {
    if (!selectedDebtorId) {
      setIsSubmitting(!isDebtor);
    }
    setIsDisable(!isDebtor);
  }, [selectedDebtorId, isDebtor]);

  useEffect(() => {
    reset({
      isDebtor: selectedDebtor.isDebtor || false,
      accountView: selectedDebtor.accountView || "",
      paymentTerm: selectedDebtor.paymentTerm || 30,
      reference: selectedDebtor.reference || "",
      isJob: selectedDebtor.isJobInvoice || false,
      isRent: selectedDebtor.isRentInvoice || false,
      isCustom: selectedDebtor.isCustomInvoice || false,
    });
  }, [reset, selectedDebtor]);

  const selectContact = (contact) => {
    setIsSubmitting(false);
    setSelectedContact(contact);
    let debtor =
      find(debtorContacts, (item) => item.contactIdentifier === contact._id) ||
      {};
    setSelectedDebtorId(debtor._id || "");
    setAccountView(debtor.accountView || "");
    setSelectedDebtor(debtor);
  };

  const onSubmit = (data) => {
    const debtorData = {
      contactIdentifier: selectedContact._id,
      isDebtor: data.isDebtor,
      accountView: data.accountView,
      paymentTerm: data.paymentTerm,
      reference: data.reference,
      isJobInvoice: data.isJob,
      isRentInvoice: data.isRent,
      isCustomInvoice: data.isCustom,
      [selectedContact.type]: selectedContact._id,
    };
    let debtorId = selectedDebtorId;

    if (debtor && debtor.contactIdentifier === selectedContact._id) {
      debtorId = debtor._id;
    }
    if (!debtorId) {
      onHandleCreate(debtorData);
    } else {
      onHandleUpdate(debtorId, debtorData);
    }
    setIsOpenConfirmModal(false);
  };
  const onHandleCreate = (data) => {
    dispatch(contactActions.submitCreateDebtorCotact(data));
  };
  const onHandleUpdate = (id, data) => {
    dispatch(contactActions.submitUpdateDebtorCotact(id, data));
  };
  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(contactActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  });

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody className="mt-4">
              <FormGroup row>
                <Col md={4} className="mx-auto">
                  <Select
                    value={selectedContact}
                    options={[
                      {
                        label: "People",
                        options: persons,
                      },
                      {
                        label: "Groupings",
                        options: groupings,
                      },
                    ]}
                    isDisabled={isFetchingDebtorContact}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt._id}
                    onChange={(val) => selectContact(val)}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.contactIdentifier",
                    })}
                    noOptionsMessage={() =>
                      intl.formatMessage({ id: "components.select.noOption" })
                    }
                  />
                </Col>
              </FormGroup>
              {selectedContact ? (
                <div>
                  <FormGroup row>
                    <Col md={4} className="mx-auto">
                      <CustomInput
                        type="checkbox"
                        label={intl.formatMessage({
                          id: "components.checkBox.isDebtorContact",
                        })}
                        id="isDebtorContact"
                        name="isDebtor"
                        innerRef={register}
                      />
                    </Col>
                  </FormGroup>

                  <Row>
                    <Col md={6} className="mx-auto">
                      {notification &&
                      notification.message &&
                      !notification.display ? (
                        <Alert
                          color={
                            notification.type === "success"
                              ? "success"
                              : "danger"
                          }
                          isOpen={!!notification.message}
                        >
                          {Utils.showNotify(intl, notification)}
                        </Alert>
                      ) : null}
                      <CardTitle className="mt-4">
                        <FormattedMessage id="pages.debtorContact.invoicingSettings" />
                      </CardTitle>

                      <FormGroup row className="align-items-center">
                        <Col md={6}>
                          <Label>
                            <FormattedMessage id="pages.debtorContact.accountView" />
                            :
                          </Label>
                        </Col>
                        <Col md={6}>
                          <InputMask
                            className="form-control"
                            mask="CON-99999"
                            maskChar={null}
                            name="accountView"
                            value={accountView}
                            disabled={isDisable}
                            onChange={({ target }) => {
                              setValue("accountView", target.value);
                              setAccountView(target.value);
                            }}
                          />
                          {errors.accountView && errors.accountView.message && (
                            <FormFeedback style={{ display: "block" }}>
                              {errors.accountView.message}
                            </FormFeedback>
                          )}
                        </Col>
                      </FormGroup>

                      <FormGroup row className="align-items-center">
                        <Col md={6}>
                          <Label>
                            <FormattedMessage id="pages.debtorContact.paymentTerm" />
                            :
                          </Label>
                        </Col>
                        <Col md={6}>
                          <Input
                            type="number"
                            className="form-control"
                            min={0}
                            defaultValue={30}
                            name="paymentTerm"
                            disabled={isDisable}
                            innerRef={register}
                            onChange={({ target }) => {
                              // setValue('paymentTerm', target.value || 0);
                            }}
                          />
                          {errors.paymentTerm && errors.paymentTerm.message && (
                            <FormFeedback style={{ display: "block" }}>
                              {errors.paymentTerm.message}
                            </FormFeedback>
                          )}
                        </Col>
                      </FormGroup>

                      <FormGroup row className="align-items-center">
                        <Col md={6}>
                          <Label>
                            <FormattedMessage id="pages.debtorContact.invoiceReference" />
                            :
                          </Label>
                        </Col>
                        <Col md={6}>
                          <Input
                            type="text"
                            placeholder={intl.formatMessage({
                              id:
                                "components.checkBox.createCollectiveInvoices",
                            })}
                            name="reference"
                            innerRef={register}
                            disabled={isDisable}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup row className="align-items-center">
                        <Col md={6}>
                          <Label>
                            <FormattedMessage id="pages.debtorContact.jobInvoices" />
                            :
                          </Label>
                        </Col>
                        <Col md={6}>
                          <CustomInput
                            type="checkbox"
                            label={intl.formatMessage({
                              id:
                                "components.checkBox.createCollectiveInvoices",
                            })}
                            id="jobInvoice"
                            name="isJob"
                            innerRef={register}
                            disabled={isDisable}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup row className="align-items-center">
                        <Col md={6}>
                          <Label>
                            <FormattedMessage id="pages.debtorContact.rentInvoices" />
                            :
                          </Label>
                        </Col>
                        <Col md={6}>
                          <CustomInput
                            type="checkbox"
                            label={intl.formatMessage({
                              id:
                                "components.checkBox.createCollectiveInvoices",
                            })}
                            id="rentInvoice"
                            name="isRent"
                            innerRef={register}
                            disabled={isDisable}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup row className="align-items-center">
                        <Col md={6}>
                          <Label>
                            <FormattedMessage id="pages.debtorContact.customInvoices" />
                            :
                          </Label>
                        </Col>
                        <Col md={6}>
                          <CustomInput
                            type="checkbox"
                            label={intl.formatMessage({
                              id:
                                "components.checkBox.createCollectiveInvoices",
                            })}
                            id="customInvoice"
                            name="isCustom"
                            innerRef={register}
                            disabled={isDisable}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup className="d-flex justify-content-end mt-5">
                        <Button
                          className="btn-shadow mr-3"
                          color="success"
                          size="lg"
                          disabled={isSubmitting}
                          onClick={handleSubmit(() =>
                            setIsOpenConfirmModal(true),
                          )}
                        >
                          <FormattedMessage id="components.button.save" />
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <ModalConfirm
        isOpen={isOpenConfirmModal}
        onToggleOpen={() => setIsOpenConfirmModal(!isOpenConfirmModal)}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
}

export default injectIntl(DebtorContact);
