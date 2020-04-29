import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  Button,
  FormFeedback,
  Alert,
  Form,
} from "reactstrap";
import Select from "react-select";
import update from "react-addons-update";

import { find, forEach, filter } from "lodash";
import useForm from "react-hook-form";
import Dot from "dot-object";
import { validationPerson, regexpNL, regexpG } from "../validation";
import { useSelector, useDispatch } from "react-redux";
// import MaskedInput from "react-text-mask";
import { DEFAULT_PROVINCE } from "../../LocationsPage/constants";
/// #####
import { contactActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";
import ContactDetailModal from "./Modal";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

const optionGender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];
const languages = [
  { value: "EN", label: "English" },
  { value: "NL", label: "Dutch" },
];

const PersonCreate = forwardRef(({ intl, FormattedMessage }, ref) => {
  // init dispatch
  const dispatch = useDispatch();

  const [gender, setGender] = useState("Male");
  const [language, setLanguage] = useState("EN");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupsOfPerson, setGroupsOfPerson] = useState([]);

  const [postalCodeAddress2, setPostalCodeAddress2] = useState("");
  // select region, country
  const [regionSelectedAddress1, setRegionSelectedAddress1] = useState("");
  const [countrySelectedAddress1, setCountrySelectedAddress1] = useState("");

  const [regionSelectedAddress2, setRegionSelectedAddress2] = useState("");
  const [countrySelectedAddress2, setCountrySelectedAddress2] = useState("");
  const contactState = useSelector(state => state.contact);
  const loadingStateProvider = useSelector(state => state.loadingProvider);
  let { groupings, notification, countries } = contactState;

  const {
    register,
    errors,
    setValue,
    getValues,
    reset,
    triggerValidation,
    clearError,
    setError
  } = useForm({
    validationSchema: validationPerson(intl, postalCodeAddress2 ? true : false, countrySelectedAddress1, countrySelectedAddress2, countries),
  });

  useEffect(() => {
    register({ name: "gender" });
    register({ name: "language" });
    register({ name: "address1.id" });
    register({ name: "address1.region" });
    register({ name: "address1.country" });

    register({ name: "address2.id" });
    register({ name: "address2.region" });
    register({ name: "address2.country" });
  }, [register]);

  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openMoal, setOpenMoal] = useState(false);
  const [contactDetail, setContactDetail] = useState({});
  const [forceFocus, setForceFocus] = useState(false);
  const inputElRegionAddress1 = useRef(null);
  const inputElCountryAddress1 = useRef(null);

  const onToggleOpenModal = () => {
    setOpenMoal(!openMoal);
    setContactDetail({});
  };
  const onHandleContactDetail = (contactId = {}) => {
    let contact = find(groupings, item => item._id === contactId);
    setOpenMoal(true);
    setContactDetail(contact);
  };



  const handleTriggerValidation = (name, value) => {
    if (Object.keys(errors).length) {
      triggerValidation({ name, value });
    }
  };

  const hanldeCreatePerson = data => {
    setIsSubmitting(true);
    dispatch(contactActions.submitCreatePerson(data));
    setIsSubmitting(false);
  };
  const hanldeUpdatePerson = (personId, data) => {
    setIsSubmitting(true);
    dispatch(contactActions.submitUpdatePerson(personId, data));
    setIsSubmitting(false);
  };

  useImperativeHandle(ref, () => ({
    handleResetData(personData = {}) {
      // handle reset form for init or edit group page
      setSelectedPersonId(personData._id || "");
      setPostalCodeAddress2(
        personData.address2 ? personData.address2.postCode : "",
      ); // for validation if postcode not empty

      let { address1, address2 } = personData;
      address1 = address1 || {};
      address2 = address2 || {};

      setGender(personData.gender || "Male");
      setLanguage(personData.language || "EN");

      setRegionSelectedAddress1(address1.region || "");
      setCountrySelectedAddress1(address1.country || "");

      setRegionSelectedAddress2(address2.region || "");
      setCountrySelectedAddress2(address2.country || "");

      let groupingData = [];
      forEach(personData.persongroupings, (item, index) => {
        let group = find(groupings, val => val._id === item.grouping);
        item.name = group ? group.name : group;
        groupingData.push(item);
      });
      setGroupsOfPerson(groupingData);

      reset({
        firstName: personData.firstName || "",
        lastName: personData.lastName || "",
        gender: personData.gender || "Male",
        language: personData.language || "EN",
        email: personData.email || "",
        phoneNumber1: personData.phoneNumber1 || "",
        phoneNumber2: personData.phoneNumber2 || "",
        "address1.id": address1.id || "",
        "address1.street": address1.street || "",
        "address1.number": address1.number || "",
        "address1.suffix": address1.suffix || "",
        "address1.postalCode": address1.postalCode || "",
        "address1.city": address1.city || "",
        "address1.region": address1.region || "",
        "address1.country": address1.country || "",

        "address2.id": address2.id || "",
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
        let groupingData = [];
        let persongroupings = [];
        forEach(groupsOfPerson, (item, key) => {
          if (!item.delete) {
            groupingData.push({ _id: item.grouping });
          }
          persongroupings.push({
            id: item._id,
            grouping: item.grouping || false,
            roleFunction: item.roleFunction || "",
            person: selectedPersonId,
            delete: item.delete || false,
          });
        });

        let dataPerson = Object.assign(getValues(), {
          active: isActive,
          gender: gender,
          language: language,
          groupings: groupingData,
          persongroupings: persongroupings,
        });
        Dot.object(dataPerson);

        // handle address 2
        forEach(dataPerson.address2, (item, key) => {
          if (!dataPerson.address2[key]) {
            delete dataPerson.address2[key];
          }
        });
        
        // Display loading icon request
        dispatch(loadingProviderActions.setStatusLoadingProvider());
        if (selectedPersonId) {
          hanldeUpdatePerson(selectedPersonId, dataPerson);
        } else {
          hanldeCreatePerson(dataPerson);
        }
      } else {
        setForceFocus(true);
      }
    },
  }));

  const onHandleAddGroup = () => {
    let group = {
      grouping: selectedGroup._id,
      name: selectedGroup.name,
      person: selectedPersonId,
      roleFunction: selectedGroup.roleFunction,
    };
    setGroupsOfPerson([group, ...groupsOfPerson]);
    setSelectedGroup("");
  };

  const handleFocusInput = useCallback((errorsDataConvert = {}) => {
    forEach(errorsDataConvert, (errorItem, key) => {
      if (key.includes("message")) {
        key = key.split(".message")[0];
      }
      // get form data to handle foucs error
      const formGeneral = document.forms["form-person-general"];
      const formAddress1 = document.forms["form-person-address1"];
      const formAddress2 = document.forms["form-person-address2"];
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

  // const NLPostalCodeMask = [/\d/, /\d/, /\d/, /[A-Z]/i, /[A-Z]/i];
  // const DEPostalCodeMask = [/\d/, /\d/, /\d/, /\d/, /\d/];
  // let postalCodeMask1 = NLPostalCodeMask;
  // let postalCodeMask2 = NLPostalCodeMask;
  // if (countrySelectedAddress1) {
  //   const { name } = find(
  //     countries,
  //     item => item._id === countrySelectedAddress1,
  //   );
  //   if (name.includes("Netherlands")) {
  //     postalCodeMask1 = NLPostalCodeMask;
  //   } else {
  //     postalCodeMask1 = DEPostalCodeMask;
  //   }
  // }
  // if (countrySelectedAddress2) {
  //   const { name } = find(
  //     countries,
  //     item => item._id === countrySelectedAddress2,
  //   );
  //   if (name.includes("Netherlands")) {
  //     postalCodeMask2 = NLPostalCodeMask;
  //   } else {
  //     postalCodeMask2 = DEPostalCodeMask;
  //   }
  // }

  // get regions by country selected & auto hide default region when regions >=2
  // Address 1
  let regionsDataAddress1 = countrySelectedAddress1 && countries && countries.length
    ? find(
      countries,
      optionCountry =>
        optionCountry._id === countrySelectedAddress1,
    ).regions
    : [];
  if (regionsDataAddress1 && regionsDataAddress1.length >= 2) {
    regionsDataAddress1 = filter(regionsDataAddress1, item => item.name !== DEFAULT_PROVINCE);
  }
  // Address 2
  let regionsDataAddress2 = countrySelectedAddress2 && countries && countries.length
    ? find(
      countries,
      optionCountry =>
        optionCountry._id === countrySelectedAddress2,
    ).regions
    : [];
  if (regionsDataAddress2 && regionsDataAddress2.length >= 2) {
    regionsDataAddress2 = filter(regionsDataAddress2, item => item.name !== DEFAULT_PROVINCE);
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
        <Col md="5">
          <Card>
            <CardHeader><FormattedMessage id="components.formTitle.general" /></CardHeader>
            <Form name="form-person-general">
              <CardBody>
                <FormGroup>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.firstName" })}
                    innerRef={register}
                    invalid={!!errors.firstName}
                    onChange={({ target }) =>
                      handleTriggerValidation("firstName", target.value)
                    }
                  />
                  {errors.firstName && errors.firstName.message && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.firstName.message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.lastName" })}
                    innerRef={register}
                    invalid={!!errors.lastName}
                    onChange={({ target }) =>
                      handleTriggerValidation("lastName", target.value)
                    }
                  />
                  {errors.lastName && errors.lastName.message && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.lastName.message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Select
                    name="gender"
                    options={optionGender}
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.gender" })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    value={find(optionGender, item => item.value === gender)}
                    onChange={val => {
                      setGender(val.value);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Select
                    name="language"
                    options={languages}
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.language" })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    value={find(languages, item => item.value === language)}
                    onChange={val => {
                      setLanguage(val.value);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="email"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.emailAddress" })}
                    innerRef={register}
                    invalid={!!errors.email}
                    onChange={({ target }) =>
                      handleTriggerValidation("email", target.value)
                    }
                  />
                  {errors.email && errors.email.message && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.email.message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="phoneNumber1"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.phoneNumber" }) + " 1"}
                    innerRef={register}
                    invalid={!!errors.phoneNumber1}
                    onChange={({ target }) =>
                      handleTriggerValidation("phoneNumber1", target.value)
                    }
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
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.phoneNumber" }) + " 2"}
                    innerRef={register}
                  />
                </FormGroup>
              </CardBody>
            </Form>
          </Card>
        </Col>
        <Col md="7">
          <Card>
            <CardHeader><FormattedMessage id="components.formTitle.partOfGroupings" /></CardHeader>
            <CardBody>
              {/* Item group */}
              {groupsOfPerson.map((group, index) => {
                if (!group.delete) {
                  return (
                    <FormGroup row key={group.grouping}>
                      <Col md="5">
                        <div
                          className="widget-heading font-weight-bold grouping-name-link ml-2"
                        >
                          <span className="text-name" onClick={() =>
                            onHandleContactDetail(group.grouping)
                          }>{group.name}</span>
                        </div>
                      </Col>
                      <Col md="7">
                        <FormGroup inline className="d-flex">
                          <Input
                            type="text"
                            placeholder={intl.formatMessage({ id: "components.input.placeholder.typeARoleDesc" })}
                            value={group.roleFunction || ''}
                            onChange={({ target }) => {
                              let groups = update(groupsOfPerson, {
                                [index]: {
                                  roleFunction: { $set: target.value || "" },
                                },
                              });
                              setGroupsOfPerson(groups);
                            }}
                          />
                          <Button
                            color=""
                            className="btn-icon btn-icon-only"
                            type="button"
                            onClick={() => {
                              let groups = update(groupsOfPerson, {
                                [index]: {
                                  delete: { $set: true },
                                },
                              });
                              setGroupsOfPerson(groups);
                            }}
                          >
                            <i className="eeac-icon eeac-icon-minus"></i>
                          </Button>
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  );
                }
                return false;
              })}

              {/* Add group */}
              <FormGroup row>
                <Col md="10">
                  <FormGroup inline className="d-flex mb-0">
                    <Select
                      value={selectedGroup}
                      options={groupings}
                      getOptionLabel={opt => opt.name}
                      getOptionValue={opt => opt._id}
                      placeholder={intl.formatMessage({ id: "components.input.placeholder.groupingName" })}
                      noOptionsMessage={() => (
                        intl.formatMessage({ id: "components.select.noOption"})
                      )}
                      className="flex-grow-1 mr-2"
                      menuPlacement="top"
                      onChange={val => {
                        setSelectedGroup(val);
                      }}
                    />
                    <Button
                      color=""
                      className="btn-icon btn-icon-only"
                      type="button"
                      onClick={onHandleAddGroup}
                      disabled={
                        !selectedGroup ||
                        (selectedGroup &&
                          find(
                            groupsOfPerson,
                            item => item.grouping === selectedGroup._id,
                          ))
                      }
                    >
                      <i className="eeac-icon eeac-icon-plus"></i>
                    </Button>
                  </FormGroup>
                </Col>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <Card className="mt-3">
            <CardHeader><FormattedMessage id="components.formTitle.address" /> 1</CardHeader>
            <Form name="form-person-address1">
              <CardBody>
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
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.country" })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    onChange={async val => {
                      setCountrySelectedAddress1(val._id);
                      setValue("address1.country", val._id.toString());
                      setRegionSelectedAddress1("");
                      setValue("address1.region", "");
                      handleTriggerValidation('address1.country', val._id.toString());

                      // trigger validation postcode format when country change to display message
                      if (val && errors["address1.postalCode"] && errors["address1.postalCode"].message) {
                        let country1 = find(countries, item => item._id === val._id);
                        // regexpNL : regexpG
                        if (country1) {
                          if (!getValues()['address1.postalCode']) {
                            setError("address1.postalCode", "notMatch", intl.formatMessage({ id: "components.errors.address.postalCode.require" }))
                          } else if (!country1.code.includes('nl') && !regexpG.test(getValues()['address1.postalCode'])) {
                            setError("address1.postalCode", "notMatch", intl.formatMessage({ id: "components.errors.address.postalCode.matchDE" }))
                          } else if (country1.code.includes('nl') && !regexpNL.test(getValues()['address1.postalCode'])) {
                            setError("address1.postalCode", "notMatch", intl.formatMessage({ id: "components.errors.address.postalCode.matchNL" }))
                          } else {
                            clearError(["address1.postalCode"]);
                          }
                        }
                      }
                    }}
                  />
                  {errors["address1.country"] && errors["address1.country"].message && (
                    <FormFeedback className="d-block">
                      {errors["address1.country"].message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Select
                    value={regionSelectedAddress1 ? find(
                      regionsDataAddress1 || [],
                      item => item._id === regionSelectedAddress1,
                    ) : null}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    name="address1.region"
                    options={regionsDataAddress1 || []}
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.region" })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    ref={inputElRegionAddress1}
                    innerRef={register}
                    invalid={!!errors["address1.region"]}
                    onChange={val => {
                      setRegionSelectedAddress1(val._id);
                      setValue("address1.region", val._id.toString());
                      handleTriggerValidation('address1.region', val._id.toString());
                    }}
                  />
                  {errors["address1.region"] && errors["address1.region"].message && (
                    <FormFeedback className="d-block">
                      {errors["address1.region"].message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address1.street"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.street" })}
                    innerRef={register}
                    invalid={!!errors["address1.street"]}
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
                      placeholder={intl.formatMessage({ id: "components.input.placeholder.number" })}
                      innerRef={register}
                      invalid={!!errors["address1.number"]}
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
                      placeholder={intl.formatMessage({ id: "components.input.placeholder.suffix" })}
                      innerRef={register}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address1.postalCode"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.postalCode" })}
                    innerRef={register}
                    disabled={isSubmitting}
                    invalid={!!errors["address1.postalCode"]}
                    onChange={({ target }) => handleTriggerValidation('address1.postalCode', target.value)}
                  />
                  {errors["address1.postalCode"] && errors["address1.postalCode"].message && (
                    <FormFeedback>
                      {errors["address1.postalCode"].message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address1.city"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.city" })}
                    innerRef={register}
                    invalid={!!errors["address1.city"]}
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
              </CardBody>
            </Form>
          </Card>
        </Col>
        <Col md="6">
          <Card className="mt-3">
            <CardHeader><FormattedMessage id="components.formTitle.address" /> 2</CardHeader>
            <Form name="form-person-address2">
              <CardBody>
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
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.country" })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    isClearable={true}
                    onChange={val => {
                      if (val) {
                        setCountrySelectedAddress2(val._id);
                        setRegionSelectedAddress2("");
                        setValue("address2.region", "");
                        setValue("address2.country", val._id.toString());

                        // trigger validation postcode format when country change to display message
                        if (val && errors["address2.postalCode"] && errors["address2.postalCode"].message) {
                          let country2 = find(countries, item => item._id === val._id);
                          if (country2) {
                            if (!getValues()['address2.postalCode']) {
                              setError("address2.postalCode", "notMatch", intl.formatMessage({ id: "components.errors.address.postalCode.require" }))
                            } else if (!country2.code.includes('nl') && !regexpG.test(getValues()['address2.postalCode'])) {
                              setError("address2.postalCode", "notMatch", intl.formatMessage({ id: "components.errors.address.postalCode.matchDE" }))
                            } else if (country2.code.includes('nl') && !regexpNL.test(getValues()['address2.postalCode'])) {
                              setError("address2.postalCode", "notMatch", intl.formatMessage({ id: "components.errors.address.postalCode.matchNL" }))
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
                    value={regionSelectedAddress2 ? find(
                      regionsDataAddress2 || [],
                      item => item._id === regionSelectedAddress2,
                    ) : null}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    name="address2.region"
                    options={regionsDataAddress2 || []}
                    // options={regions}
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.region" })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    isClearable={true}
                    onChange={val => {
                      if (val) {
                        setRegionSelectedAddress2(val._id);
                        setValue("address2.region", val._id.toString());
                      } else {
                        setRegionSelectedAddress2('');
                        setValue("address2.region", '');
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Input
                    type="text"
                    name="address2.street"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.street" })}
                    innerRef={register}
                  />
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <Input
                      type="number"
                      name="address2.number"
                      placeholder={intl.formatMessage({ id: "components.input.placeholder.number" })}
                      innerRef={register}
                    />
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      name="address2.suffix"
                      placeholder={intl.formatMessage({ id: "components.input.placeholder.suffix" })}
                      innerRef={register}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address2.postalCode"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.postalCode" })}
                    innerRef={register}
                    disabled={isSubmitting}
                    invalid={!!errors["address2.postalCode"]}
                    onChange={({ target }) => {
                      triggerValidation("address2.country");
                      handleTriggerValidation('address2.postalCode', target.value); setPostalCodeAddress2(target.value);
                    }}
                  />
                  {errors["address2.postalCode"] && errors["address2.postalCode"].message && (
                    <FormFeedback>
                      {errors["address2.postalCode"].message}
                    </FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address2.city"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.city" })}
                    innerRef={register}
                  />
                </FormGroup>
              </CardBody>
            </Form>
          </Card>
        </Col>
      </Row>
      <ContactDetailModal
        isOpen={openMoal}
        onToggleOpen={onToggleOpenModal}
        contactDetail={contactDetail}
      />
    </Container>
  );
});

export default PersonCreate;
