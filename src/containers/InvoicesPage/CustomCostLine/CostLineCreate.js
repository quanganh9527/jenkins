import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Form,
  Button,
  FormGroup,
  Input,
  FormFeedback,
  Alert,
} from "reactstrap";
import update from "react-addons-update";

import { MinusIcon } from "../../Icons";

import { map, filter, forEach, reduce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { invoiceActions } from "../actions";
import { contactActions } from "../../ContactsPage/actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";
import ModalConfirm from "./ModalConfirm";

import Select from "react-select";
import NumberFormat from "react-number-format";
// import NumericInput from "react-numeric-input";

// ###
import useForm from "react-hook-form";
import { RHFInput } from "react-hook-form-input";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

import ReactSelectLazy from "components/ReactSelectLazy";
// Service
import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";

const CostLineCreate = forwardRef((props, ref) => {
  const { intl } = props;
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDertor, setSelectedDertor] = useState("");
  const [costTypeOptions, setCostTypeOptions] = useState([]);
  const [defaultCostLine] = useState({
    description: "",
    price: 0,
    quantity: 1,
    total: 0,
    costtype: "",
    type: "Custom",
    status: "Open",
  });

  const invoiceState = useSelector((state) => state.invoice);
  const contactState = useSelector((state) => state.contact);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);

  let { costLines, costTypes = [], notification } = invoiceState;
  let { debtorContacts = [] } = contactState;

  const {
    register,
    unregister,
    setValue,
    triggerValidation,
    errors,
    reset,
  } = useForm();

  useEffect(() => {
    dispatch(invoiceActions.getCostTypes());
    dispatch(contactActions.getDebtorContactList());
  }, [dispatch]);

  useEffect(() => {
    //reset cost lines
    if (!selectedLocation && !selectedDertor) {
      dispatch(invoiceActions.setCustomCostLine([{}]));
      setIsSubmitting(false);
    }
  }, [
    selectedDertor,
    selectedLocation,
    dispatch,
    setIsSubmitting,
    defaultCostLine,
  ]);

  useImperativeHandle(ref, () => ({
    async handleSubmitForm() {
      if (!costLines.length || !selectedLocation || !selectedDertor) {
        return;
      }

      //init data cost type
      const data = reduce(
        costLines,
        (result, cost, costIndex) => {
          if (!cost.delete) {
            setValue(`costtype${costIndex}`, cost.costtype);
            cost = {
              ...defaultCostLine,
              ...cost,
              debtorContact: selectedDertor._id,
              location: selectedLocation._id,
            };
            result.push(cost);
          }
          return result;
        },
        [],
      );

      const isValidate = await triggerValidation();
      if (isValidate) {
        dispatch(invoiceActions.setCustomCostLine(data));
        onToggleOpen();
      }
    },
  }));

  const onToggleOpen = () => {
    setIsOpenConfirmModal(!isOpenConfirmModal);
  };

  const handleCreateCostLines = () => {
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    setIsSubmitting(true);

    //get costtype id of list costline
    const costLinesData = map(costLines, (item) => ({
      ...item,
      costtype: item.costtype._id,
    }));
    //reset data form list cost line
    reset({});
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(invoiceActions.updateCostLineMul(costLinesData));
    setIsSubmitting(false);
    setIsOpenConfirmModal(false);
  };

  const selectLocation = (location) => {
    if (selectedLocation._id === location._id) {
      return;
    }
    const costTypeList = filter(
      costTypes,
      (item) => item.country && item.country._id === location.country,
    );
    //reset cost type of cost lines
    forEach(costLines, (item, index) => {
      item.costtype = "";
      setValue(`costtype${index}`, "");
    });
    setCostTypeOptions(costTypeList);
    setSelectedLocation(location);
  };

  const handleTriggerValidation = (name, value) => {
    if (Object.keys(errors).length) {
      triggerValidation({ name, value });
    }
  };

  const onHandleAddCost = () => {
    dispatch(invoiceActions.setCustomCostLine([...costLines, {}]));
  };

  const onHandleRemoveCost = (costIndex) => {
    costLines.splice(costIndex, 1);
    dispatch(invoiceActions.setCustomCostLine(costLines));
    unregister(`description${costIndex}`);
    unregister(`costtype${costIndex}`);
    unregister(`price${costIndex}`);
    unregister(`quantity${costIndex}`);
  };

  const updateFiledCost = (key, index, value) => {
    const newData = update(costLines, {
      [index]: {
        [key]: { $set: value },
      },
    });
    dispatch(invoiceActions.setCustomCostLine(newData));
  };

  const initData = () => {
    let debtorData = map(debtorContacts, (item) => {
      let type = item.grouping ? "grouping" : "person";
      return {
        _id: item._id,
        name: item[type]
          ? item[type].name || `${item[type].firstName} ${item[type].lastName}`
          : "",
      };
    });
    return { debtorData };
  };

  let { debtorData } = initData();

  // auto hidden notification after 5s
  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(invoiceActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  }, [notification, dispatch]);

  const isShowNotification =
    notification &&
    notification.message &&
    !notification.position &&
    notification.page === "costline";

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          {isShowNotification ? (
            <Alert
              color={notification.type === "success" ? "success" : "danger"}
              isOpen={!!notification.message}
            >
              {Utils.showNotify(intl, notification)}
            </Alert>
          ) : null}
          <Card className="main-card p-4">
            <Row className="justify-content-center">
              <Col md={8}>
                <CardBody>
                  <FormGroup row>
                    <Col md={6}>
                      <FormGroup>
                        <Select
                          value={selectedDertor}
                          getOptionLabel={(opt) => opt.name}
                          getOptionValue={(opt) => opt._id}
                          name="debtor"
                          options={debtorData}
                          placeholder={intl.formatMessage({
                            id:
                              "components.input.placeholder.contactIdentifier",
                          })}
                          noOptionsMessage={() =>
                            intl.formatMessage({
                              id: "components.select.noOption",
                            })
                          }
                          onChange={(val) => {
                            if (selectedDertor._id === val._id) {
                              return;
                            }
                            setSelectedDertor(val);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <ReactSelectLazy
                          intl={intl}
                          value={selectedLocation}
                          placeholder={intl.formatMessage({
                            id:
                              "components.input.placeholder.locationIdentifier",
                          })}
                          noOptionsMessage={() =>
                            intl.formatMessage({
                              id: "components.select.noOption",
                            })
                          }
                          onChange={(val) => {
                            selectLocation(val);
                          }}
                          defaultOptions={[]}
                          fetchDataAsync={fetchDataLocationAsync}
                        />
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Col>
            </Row>
            {selectedLocation && selectedDertor ? (
              <Form name="form-cost-line">
                <div>
                  <Row className="justify-content-center">
                    {map(costLines, (cost, costIndex) => {
                      return (
                        <Col md={11} key={cost._id || costIndex}>
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <FormGroup>
                                <Input
                                  type="text"
                                  value={cost.description || ""}
                                  placeholder={intl.formatMessage({
                                    id:
                                      "components.input.placeholder.costLineDes",
                                  })}
                                  name={`description${costIndex}`}
                                  innerRef={register({
                                    required: intl.formatMessage({
                                      id:
                                        "components.errors.description.require",
                                    }),
                                  })}
                                  onChange={(e) => {
                                    handleTriggerValidation(
                                      `description${costIndex}`,
                                      e.target.value,
                                    );
                                    updateFiledCost(
                                      "description",
                                      costIndex,
                                      e.target.value,
                                    );
                                  }}
                                />
                                {errors[`description${costIndex}`] &&
                                  errors[`description${costIndex}`].message && (
                                    <FormFeedback className="d-block">
                                      {
                                        errors[`description${costIndex}`]
                                          .message
                                      }
                                    </FormFeedback>
                                  )}
                              </FormGroup>
                              <FormGroup row className="mt-2 mb-1">
                                <Col>
                                  <FormGroup>
                                    <RHFInput
                                      as={
                                        <Select
                                          placeholder={intl.formatMessage({
                                            id:
                                              "components.input.placeholder.costType",
                                          })}
                                          noOptionsMessage={() =>
                                            intl.formatMessage({
                                              id: "components.select.noOption",
                                            })
                                          }
                                          getOptionLabel={(opt) => opt.name}
                                          getOptionValue={(opt) => opt._id}
                                          options={costTypeOptions}
                                        />
                                      }
                                      rules={{
                                        required: intl.formatMessage({
                                          id:
                                            "components.errors.costType.require",
                                        }),
                                      }}
                                      name={`costtype${costIndex}`}
                                      register={register}
                                      setValue={setValue}
                                      mode="onChange"
                                      value={cost.costtype}
                                      onChangeEvent={(val) => {
                                        handleTriggerValidation(
                                          `costtype${costIndex}`,
                                          val[0],
                                        );
                                        updateFiledCost(
                                          "costtype",
                                          costIndex,
                                          val[0],
                                        );
                                        return val[0];
                                      }}
                                    />
                                    {errors[`costtype${costIndex}`] &&
                                      errors[`costtype${costIndex}`]
                                        .message && (
                                        <FormFeedback className="d-block">
                                          {
                                            errors[`costtype${costIndex}`]
                                              .message
                                          }
                                        </FormFeedback>
                                      )}
                                  </FormGroup>
                                </Col>
                                <Col>
                                  <FormGroup>
                                    <NumberFormat
                                      fixedDecimalScale={true}
                                      thousandSeparator="."
                                      decimalSeparator=","
                                      className="form-control"
                                      decimalScale={2}
                                      inputMode="numeric"
                                      name={`price${costIndex}`}
                                      getInputRef={register({
                                        required: intl.formatMessage({
                                          id: "components.errors.price.require",
                                        }),
                                      })}
                                      allowNegative={false}
                                      allowLeadingZeros={false}
                                      placeholder={intl.formatMessage({
                                        id:
                                          "components.input.placeholder.unitPrice",
                                      })}
                                      prefix="€ "
                                      value={cost.price || ""}
                                      isAllowed={(values) => {
                                        const {
                                          formattedValue,
                                          floatValue,
                                        } = values;
                                        return (
                                          formattedValue === "" ||
                                          floatValue <= 10000
                                        );
                                      }}
                                      onValueChange={(values) => {
                                        const { floatValue } = values;
                                        handleTriggerValidation(
                                          `price${costIndex}`,
                                          floatValue,
                                        );
                                        updateFiledCost(
                                          "price",
                                          costIndex,
                                          floatValue,
                                        );
                                      }}
                                    />
                                    {errors[`price${costIndex}`] &&
                                      errors[`price${costIndex}`].message && (
                                        <FormFeedback className="d-block">
                                          {errors[`price${costIndex}`].message}
                                        </FormFeedback>
                                      )}
                                  </FormGroup>
                                </Col>
                                <span className="margin-top-10">X</span>
                                <Col>
                                  <FormGroup>
                                    <Input
                                      type="number"
                                      placeholder={intl.formatMessage({
                                        id:
                                          "components.input.placeholder.unitQuantity",
                                      })}
                                      onKeyDown={(e) => {
                                        const validateInterger = [
                                          69,
                                          190,
                                          110,
                                          189,
                                          109,
                                          187,
                                          107,
                                        ];
                                        if (
                                          validateInterger.indexOf(e.keyCode) >
                                          -1
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      min={1}
                                      value={cost.quantity || 1}
                                      name={`quantity${costIndex}`}
                                      innerRef={register({
                                        required: intl.formatMessage({
                                          id:
                                            "components.errors.quantity.require",
                                        }),
                                      })}
                                      onChange={(e) => {
                                        handleTriggerValidation(
                                          `quantity${costIndex}`,
                                          e.target.value,
                                        );
                                        updateFiledCost(
                                          "quantity",
                                          costIndex,
                                          e.target.value,
                                        );
                                      }}
                                    />
                                    {errors[`quantity${costIndex}`] &&
                                      errors[`quantity${costIndex}`]
                                        .message && (
                                        <FormFeedback className="d-block">
                                          {
                                            errors[`quantity${costIndex}`]
                                              .message
                                          }
                                        </FormFeedback>
                                      )}
                                  </FormGroup>
                                </Col>
                                <span className="margin-top-10">=</span>
                                <Col>
                                  <NumberFormat
                                    displayType="text"
                                    fixedDecimalScale={true}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    className="form-control border-0"
                                    placeholder={intl.formatMessage({
                                      id:
                                        "components.input.placeholder.totalPrice",
                                    })}
                                    decimalScale={2}
                                    inputMode="numeric"
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    prefix="€ "
                                    value={
                                      cost.price
                                        ? parseFloat(cost.price) *
                                          (cost.quantity || 1)
                                        : ""
                                    }
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      updateFiledCost(
                                        "total",
                                        costIndex,
                                        value,
                                      );
                                    }}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                            <Button
                              color=""
                              className="text-left m-0 p-0 mr-3 mt-1"
                              onClick={() => {
                                onHandleRemoveCost(costIndex);
                              }}
                            >
                              <MinusIcon />
                            </Button>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                  <Row className="justify-content-center">
                    <Col md={11}>
                      <Button
                        color=""
                        className="btn-icon btn-icon-only text-left m-0 p-0 mr-3 mt-1"
                        type="button"
                        onClick={onHandleAddCost}
                      >
                        <i className="eeac-icon eeac-icon-plus"></i>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            ) : null}
          </Card>
        </Col>
      </Row>

      <ModalConfirm
        isOpen={isOpenConfirmModal}
        onToggleOpen={onToggleOpen}
        handleSubmit={handleCreateCostLines}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
});

export default CostLineCreate;
