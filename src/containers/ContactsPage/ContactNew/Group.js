import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  FormFeedback,
  Alert,
} from "reactstrap";
import Select from "react-select";

import { find, forEach, filter } from "lodash";
import useForm from "react-hook-form";
import Dot from "dot-object";
import { validationGrouping, regexpNL, regexpG } from "../validation";
import { useSelector, useDispatch } from "react-redux";
import { contactActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";

import { DEFAULT_PROVINCE } from "../../LocationsPage/constants";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

const GroupNew = forwardRef((props, ref) => {
  const { intl, FormattedMessage } = props;

  // init dispatch
  const dispatch = useDispatch();
  const inputElRegionAddress1 = useRef(null);
  const inputElCountryAddress1 = useRef(null);

  const contactState = useSelector(state => state.contact);
  let { groupings, notification, countries, errorsGrouping } = contactState;
  const loadingStateProvider = useSelector(state => state.loadingProvider);

  const [groupingIdSelected, setGroupingIdSelected] = useState("");
  const [postalCodeAddress2, setPostalCodeAddress2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentId, setparentId] = useState("");

  // select region, country
  const [regionSelectedAddress1, setRegionSelectedAddress1] = useState("");
  const [countrySelectedAddress1, setCountrySelectedAddress1] = useState("");

  const [regionSelectedAddress2, setRegionSelectedAddress2] = useState("");
  const [countrySelectedAddress2, setCountrySelectedAddress2] = useState("");
  const [forceFocus, setForceFocus] = useState(false);

  const {
    register,
    errors,
    setValue,
    getValues,
    reset,
    triggerValidation,
    clearError,
    setError,
  } = useForm({
    validationSchema: validationGrouping(
      intl,
      postalCodeAddress2 ? true : false,
      countrySelectedAddress1,
      countrySelectedAddress2,
      countries,
    ),
    submitFocusError: true,
  });
  // custom validation
  register({ name: "address1.region" });
  register({ name: "address1.country" });

  register({ name: "address2.region" });
  register({ name: "address2.country" });

  const handleFocusInput = useCallback((errorsDataConvert = {}) => {
    forEach(errorsDataConvert, (errorItem, key) => {
      if (key.includes("message")) {
        key = key.split(".message")[0];
      }
      // get form data to handle focus error
      const formGeneral = document.forms["form-grouping-general"];
      const formAddress1 = document.forms["form-grouping-address1"];
      const formAddress2 = document.forms["form-grouping-address2"];
      if (formGeneral && formGeneral[key]) {
        formGeneral[key].focus();
        return false;
      }
      if (formAddress1 && formAddress1[key]) {
        if (formAddress1["address1.region"] && key === "address1.region") {
          inputElRegionAddress1.current.focus();
        } else if (
          formAddress1["address1.country"] &&
          key === "address1.country"
        ) {
          inputElCountryAddress1.current.focus();
        } else {
          formAddress1[key].focus();
        }
        return false;
      }
      if (formAddress2 && formAddress2[key]) {
        formAddress2[key].focus();
        return false;
      }
    });
  }, []);

  useEffect(() => {
    if (errorsGrouping && Object.keys(errorsGrouping).length > 0) {
      let errorsDataConvert = Dot.dot(errorsGrouping);
      handleFocusInput(errorsDataConvert);
      dispatch(contactActions.resetErrorsFormGrouping());
    }
  }, [errorsGrouping, dispatch, handleFocusInput]);

  useImperativeHandle(ref, () => ({
    handleSetIdGroupingSelected(groupingId) {
      setGroupingIdSelected(groupingId);
    },
    handleResetDataGrouping(groupData = {}) {
      // handle reset form for init or edit group page
      setGroupingIdSelected(groupData._id || "");
      setPostalCodeAddress2(
        groupData.address2 ? groupData.address2.postCode : "",
      ); // for validation if postcode not empty

      if (groupData.parentId && groupData.parentId._id) {
        setparentId(groupData.parentId._id);
      } else {
        setparentId("");
      }
      let { address1, address2 } = groupData;
      address1 = address1 || {};
      address2 = address2 || {};

      setRegionSelectedAddress1(address1.region || "");
      setCountrySelectedAddress1(address1.country || "");

      setRegionSelectedAddress2(address2.region || "");
      setCountrySelectedAddress2(address2.country || "");

      reset({
        name: groupData.name || "",
        website: groupData.website || "",
        email: groupData.email || "",
        phoneNumber1: groupData.phoneNumber1 || "",
        phoneNumber2: groupData.phoneNumber2 || "",

        "address1.street": address1.street || "",
        "address1.number": address1.number || "",
        "address1.suffix": address1.suffix || "",
        "address1.postalCode": address1.postalCode || "",
        "address1.city": address1.city || "",
        "address1.region": address1.region || "",
        "address1.country": address1.country || "",

        "address2.street": address2.street || "",
        "address2.number": address2.number || "",
        "address2.suffix": address2.suffix || "",
        "address2.postalCode": address2.postalCode || "",
        "address2.city": address2.city || "",
        "address2.region": address2.region || "",
        "address2.country": address2.country || "",
      });
    },

    async handleSubmitForm(isActive) {
      // prevent try to submit when submitting
      if (loadingStateProvider.isSubmittingStatusProvider) return;
      const isValidate = await triggerValidation();
      if (isValidate) {
        let dataGroup = Object.assign(getValues(), { active: isActive });
        Dot.object(dataGroup); // convert string dot to object
        if (parentId) {
          dataGroup.parentId = parentId;
        } else {
          delete dataGroup.parentId;
        }

        // handle address 2
        forEach(dataGroup.address2, (item, key) => {
          if (
            !dataGroup.address2[key] &&
            (key === "region" || key === "country")
          ) {
            dataGroup.address2[key] = null;
          }
        });
        // Display loading icon request
        dispatch(loadingProviderActions.setStatusLoadingProvider());
        if (groupingIdSelected) {
          hanldeUpdateGrouping(groupingIdSelected, dataGroup);
        } else {
          hanldeCreateGrouping(dataGroup);
        }
      } else {
        setForceFocus(true);
      }
    },
  }));
  const hanldeCreateGrouping = dataGroup => {
    setIsSubmitting(true);
    dispatch(contactActions.submitCreateGrouping(dataGroup));
    setIsSubmitting(false);
  };
  const hanldeUpdateGrouping = (groupingId, dataGroup) => {
    setIsSubmitting(true);
    let { address1, address2 } = props.grouping;
    address1 = address1 || {};
    address2 = address2 || {};
    dataGroup.address1.id = address1._id || "";
    dataGroup.address2.id = address2._id || "";
    dispatch(contactActions.submitUpdateGrouping(groupingId, dataGroup));
    setIsSubmitting(false);
  };
  const handleTriggerValidation = (name, value) => {
    // console.log('handle triger: ', name, value, getValues());
    if (Object.keys(errors).length) {
      triggerValidation({ name, value });
    }
  };
  // trigger focus validation
  useEffect(() => {
    if (Object.keys(errors).length && forceFocus) {
      let errorsDataConvert = Dot.dot(errors);
      handleFocusInput(errorsDataConvert);
      setForceFocus(false);
    }
  }, [errors, forceFocus, setForceFocus, handleFocusInput]);
  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(contactActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  });
  // get regions by country selected & auto hide default region when regions >=2
  // Address 1
  let regionsDataAddress1 =
    countrySelectedAddress1 && countries && countries.length
      ? find(
          countries,
          optionCountry => optionCountry._id === countrySelectedAddress1,
        ).regions
      : [];
  if (regionsDataAddress1 && regionsDataAddress1.length >= 2) {
    regionsDataAddress1 = filter(
      regionsDataAddress1,
      item => item.name !== DEFAULT_PROVINCE,
    );
  }
  // Address 2
  let regionsDataAddress2 =
    countrySelectedAddress2 && countries && countries.length
      ? find(
          countries,
          optionCountry => optionCountry._id === countrySelectedAddress2,
        ).regions
      : [];
  if (regionsDataAddress2 && regionsDataAddress2.length >= 2) {
    regionsDataAddress2 = filter(
      regionsDataAddress2,
      item => item.name !== DEFAULT_PROVINCE,
    );
  }

  return (
    <Container fluid>
      {notification && notification.message && !notification.display ? (
        <Alert
          color={notification.type === "success" ? "success" : "danger"}
          isOpen={!!notification.message}
        >
          {Utils.showNotify(intl, notification)}
        </Alert>
      ) : null}
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <FormattedMessage id="components.formTitle.general" />
            </CardHeader>
            <CardBody>
              <Form name="form-grouping-general">
                <FormGroup>
                  <Input
                    type="text"
                    name="name"
                    disabled={isSubmitting}
                    innerRef={register}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.name",
                    })}
                    invalid={!!errors.name}
                    onChange={({ target }) => {
                      handleTriggerValidation("name", target.value);
                      props.handleChangeGroupingName(target.value);
                    }}
                  />
                  {errors.name && errors.name.message && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.name.message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="website"
                    disabled={isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.websiteAddress",
                    })}
                    innerRef={register}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="email"
                    disabled={isSubmitting}
                    innerRef={register}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.emailAddress",
                    })}
                    onChange={({ target }) =>
                      handleTriggerValidation("email", target.value)
                    }
                    invalid={!!errors.email}
                  />

                  {errors.email && errors.email.message && (
                    <FormFeedback>{errors.email.message}</FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="phoneNumber1"
                    disabled={isSubmitting}
                    innerRef={register}
                    placeholder={
                      intl.formatMessage({
                        id: "components.input.placeholder.phoneNumber",
                      }) + " 1"
                    }
                    onChange={({ target }) =>
                      handleTriggerValidation("phoneNumber1", target.value)
                    }
                    invalid={!!errors.phoneNumber1}
                  />
                  {errors.phoneNumber1 && errors.phoneNumber1.message && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.phoneNumber1.message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="phoneNumber2"
                    disabled={isSubmitting}
                    innerRef={register}
                    placeholder={
                      intl.formatMessage({
                        id: "components.input.placeholder.phoneNumber",
                      }) + " 2"
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Select
                    value={find(
                      groupings,
                      optionGrouping => optionGrouping._id === parentId,
                    )}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    name="groupParent"
                    options={groupings}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.groupingName",
                    })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    isClearable={true}
                    onChange={val => {
                      if (val) {
                        setparentId(val._id);
                      } else {
                        setparentId("");
                      }
                    }}
                  />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <Card className="mt-3">
            <CardHeader>
              <FormattedMessage id="components.formTitle.address" /> 1
            </CardHeader>
            <CardBody>
              <Form name="form-grouping-address1">
                <FormGroup>
                  <Select
                    value={find(
                      countries,
                      item => item._id === countrySelectedAddress1,
                    )}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    name="address1.country"
                    ref={inputElCountryAddress1}
                    innerRef={register}
                    options={countries}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.country",
                    })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    onChange={async val => {
                      setCountrySelectedAddress1(val._id);
                      setValue("address1.country", val._id.toString());
                      handleTriggerValidation(
                        "address1.country",
                        val._id.toString(),
                      );
                      setRegionSelectedAddress1("");
                      setValue("address1.region", "");
                      // trigger validation postcode format when country change to display message
                      if (
                        val &&
                        errors["address1.postalCode"] &&
                        errors["address1.postalCode"].message
                      ) {
                        let country1 = find(
                          countries,
                          item => item._id === val._id,
                        );
                        // regexpNL : regexpG
                        if (country1) {
                          if (!getValues()["address1.postalCode"]) {
                            setError(
                              "address1.postalCode",
                              "notMatch",
                              intl.formatMessage({
                                id:
                                  "components.errors.address.postalCode.require",
                              }),
                            );
                          } else if (
                            !country1.code.includes("nl") &&
                            !regexpG.test(getValues()["address1.postalCode"])
                          ) {
                            setError(
                              "address1.postalCode",
                              "notMatch",
                              intl.formatMessage({
                                id:
                                  "components.errors.address.postalCode.matchDE",
                              }),
                            );
                          } else if (
                            country1.code.includes("nl") &&
                            !regexpNL.test(getValues()["address1.postalCode"])
                          ) {
                            setError(
                              "address1.postalCode",
                              "notMatch",
                              intl.formatMessage({
                                id:
                                  "components.errors.address.postalCode.matchNL",
                              }),
                            );
                          } else {
                            clearError(["address1.postalCode"]);
                          }
                        }
                      }
                    }}
                  />
                  {errors["address1.country"] &&
                    errors["address1.country"].message && (
                      <FormFeedback className="d-block">
                        {errors["address1.country"].message}
                      </FormFeedback>
                    )}
                </FormGroup>
                <FormGroup>
                  <Select
                    value={find(
                      regionsDataAddress1 || [],
                      item => item._id === regionSelectedAddress1,
                    )}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    name="address1.region"
                    options={regionsDataAddress1 || []}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.region",
                    })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    ref={inputElRegionAddress1}
                    innerRef={register}
                    invalid={!!errors["address1.region"]}
                    onChange={val => {
                      setRegionSelectedAddress1(val._id);
                      setValue("address1.region", val._id.toString());
                      handleTriggerValidation(
                        "address1.region",
                        val._id.toString(),
                      );
                    }}
                  />
                  {errors["address1.region"] &&
                    errors["address1.region"].message && (
                      <FormFeedback className="d-block">
                        {errors["address1.region"].message}
                      </FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                  <Input
                    type="text"
                    name="address1.street"
                    innerRef={register}
                    disabled={isSubmitting}
                    invalid={!!errors["address1.street"]}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.street",
                    })}
                    onChange={({ target }) =>
                      handleTriggerValidation("address1.street", target.value)
                    }
                  />
                  {errors["address1.street"] &&
                    errors["address1.street"].message && (
                      <FormFeedback>
                        {errors["address1.street"].message}
                      </FormFeedback>
                    )}
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <Input
                      type="number"
                      name="address1.number"
                      innerRef={register}
                      disabled={isSubmitting}
                      invalid={!!errors["address1.number"]}
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.number",
                      })}
                      onChange={({ target }) =>
                        handleTriggerValidation("address1.number", target.value)
                      }
                    />
                    {errors["address1.number"] &&
                      errors["address1.number"].message && (
                        <FormFeedback>
                          {errors["address1.number"].message}
                        </FormFeedback>
                      )}
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      name="address1.suffix"
                      innerRef={register}
                      disabled={isSubmitting}
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.suffix",
                      })}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address1.postalCode"
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.postalCode",
                    })}
                    innerRef={register}
                    disabled={isSubmitting}
                    invalid={!!errors["address1.postalCode"]}
                    onChange={({ target }) =>
                      handleTriggerValidation(
                        "address1.postalCode",
                        target.value,
                      )
                    }
                  />
                  {errors["address1.postalCode"] &&
                    errors["address1.postalCode"].message && (
                      <FormFeedback>
                        {errors["address1.postalCode"].message}
                      </FormFeedback>
                    )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address1.city"
                    innerRef={register}
                    disabled={isSubmitting}
                    invalid={!!errors["address1.city"]}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.city",
                    })}
                    onChange={({ target }) =>
                      handleTriggerValidation("address1.city", target.value)
                    }
                  />
                  {errors["address1.city"] &&
                    errors["address1.city"].message && (
                      <FormFeedback>
                        {errors["address1.city"].message}
                      </FormFeedback>
                    )}
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card className="mt-3">
            <CardHeader>
              <FormattedMessage id="components.formTitle.address" /> 2
            </CardHeader>
            <CardBody>
              <Form name="form-grouping-address2">
                <FormGroup>
                  <Select
                    value={find(
                      countries,
                      item => item._id === countrySelectedAddress2,
                    )}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    name="address2.country"
                    options={countries}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.country",
                    })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    isClearable={true}
                    onChange={val => {
                      if (val) {
                        setCountrySelectedAddress2(val._id);
                        setValue("address2.country", val._id.toString());
                        setRegionSelectedAddress2("");
                        setValue("address2.region", "");
                        // trigger validation postcode format when country change to display message
                        if (
                          val &&
                          errors["address2.postalCode"] &&
                          errors["address2.postalCode"].message
                        ) {
                          let country2 = find(
                            countries,
                            item => item._id === val._id,
                          );
                          if (country2) {
                            if (!getValues()["address2.postalCode"]) {
                              setError(
                                "address2.postalCode",
                                "notMatch",
                                intl.formatMessage({
                                  id:
                                    "components.errors.address.postalCode.require",
                                }),
                              );
                            } else if (
                              !country2.code.includes("nl") &&
                              !regexpG.test(getValues()["address2.postalCode"])
                            ) {
                              setError(
                                "address2.postalCode",
                                "notMatch",
                                intl.formatMessage({
                                  id:
                                    "components.errors.address.postalCode.matchDE",
                                }),
                              );
                            } else if (
                              country2.code.includes("nl") &&
                              !regexpNL.test(getValues()["address2.postalCode"])
                            ) {
                              setError(
                                "address2.postalCode",
                                "notMatch",
                                intl.formatMessage({
                                  id:
                                    "components.errors.address.postalCode.matchNL",
                                }),
                              );
                            } else {
                              clearError(["address2.postalCode"]);
                            }
                          }
                        }
                      } else {
                        setCountrySelectedAddress2("");
                        setValue("address2.country", "");
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Select
                    value={find(
                      regionsDataAddress2 || [],
                      item => item._id === regionSelectedAddress2,
                    )}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    name="address2.region"
                    options={regionsDataAddress2 || []}
                    // options={regions}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.region",
                    })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    isClearable={true}
                    onChange={val => {
                      if (val) {
                        setRegionSelectedAddress2(val._id);
                        setValue("address2.region", val._id.toString());
                      } else {
                        setRegionSelectedAddress2("");
                        setValue("address2.region", "");
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address2.street"
                    innerRef={register}
                    disabled={isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.street",
                    })}
                  />
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <Input
                      type="number"
                      name="address2.number"
                      innerRef={register}
                      disabled={isSubmitting}
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.number",
                      })}
                    />
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      name="address2.suffix"
                      innerRef={register}
                      disabled={isSubmitting}
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.suffix",
                      })}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address2.postalCode"
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.postalCode",
                    })}
                    innerRef={register}
                    disabled={isSubmitting}
                    invalid={!!errors["address2.postalCode"]}
                    onChange={({ target }) => {
                      triggerValidation("address2.country");
                      handleTriggerValidation(
                        "address2.postalCode",
                        target.value,
                      );
                      setPostalCodeAddress2(target.value);
                    }}
                  />
                  {errors["address2.postalCode"] &&
                    errors["address2.postalCode"].message && (
                      <FormFeedback>
                        {errors["address2.postalCode"].message}
                      </FormFeedback>
                    )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address2.city"
                    disabled={isSubmitting}
                    innerRef={register}
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.city",
                    })}
                  />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});

export default GroupNew;
