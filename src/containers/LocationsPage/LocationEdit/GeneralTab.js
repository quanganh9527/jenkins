import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { find, map, filter } from "lodash";
import update from "react-addons-update";
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
  Button,
  FormFeedback,
  CustomInput,
} from "reactstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import MaskedInput from "react-text-mask";

import "./styles.scss";

import ContactDetailModal from "./Modal";

// ### validation
import {
  postalCodeNlValidation,
  postalCodeDEValidation,
  postalCodeRequired,
} from "./validation";

import { DEFAULT_PROVINCE } from "../constants";

const customFilterOption = (option, rawInput) => {
  const words = rawInput.split(" ");
  return words.reduce(
    (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
    true,
  );
};

const GeneralTab = forwardRef((props, ref) => {
  let {
    locationIdSelected,
    countries,
    register,
    costCenters,
    errors,
    isSubmitting,
    setValue,
    triggerValidation,
    descriptions,
    setDescriptions,
    // formState,
    intl,
    clearError,
    getValues,
    setError,
    unregister,
    // Form select handle focus
    // CostCenter
    isAllowGenerateCostCenter,
    setIsGenerateCostCenter,
  } = props;

  const inputElRegion = useRef(null);
  const inputElCountry = useRef(null);
  const inputElCostCenter = useRef(null);

  const [openMoal, setOpenMoal] = useState(false);
  const [contactDetail, setContactDetail] = useState({});

  const [regionSelected, setRegionSelected] = useState("");
  const [countrySelected, setCountrySelected] = useState("");
  const [costCenterSelected, setCostCenterSelected] = useState("");

  const [forceRerender, setForceRerender] = useState(true); // Check when user change navigation to update data form

  useEffect(() => {
    if (forceRerender) {
      setForceRerender(false);
    }
  }, [setForceRerender, forceRerender, setRegionSelected, setCountrySelected]);

  // Ref child component
  useImperativeHandle(ref, () => ({
    handleResetFormData(location) {
      setRegionSelected(location.region ? location.region._id : "");
      setCountrySelected(location.country ? location.country._id : "");
      setCostCenterSelected(location.costcenter ? location.costcenter._id : "");
    },
    handleFocusError(errorKey) {
      if (errorKey === "countrySelect") {
        inputElCountry.current.focus();
        return false;
      }
      if (errorKey === "regionSelect") {
        inputElRegion.current.focus();
        return false;
      }
      if (errorKey === "costcenterSelect") {
        inputElCostCenter.current.focus();
        return false;
      }
    },
  }));

  const onToggleOpenModal = () => {
    setOpenMoal(!openMoal);
    setContactDetail({});
  };

  const onHandleLocationOf = () => {
    setDescriptions([{ key: "", value: "" }, ...descriptions]);
  };

  const onHandleRemoveLocationOf = index => {
    const newLocationOfs = descriptions.filter((val, ind) => ind !== index);
    setDescriptions([...newLocationOfs]);
  };
  let postalCodeMask = false;
  const registerPostCode = () => {
    register({ name: "postalCode" }, postalCodeRequired(intl));
    const NLPostalCodeMask = [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\s|[A-Z]/i,
      /[A-Z]/i,
      /[A-Z]/i,
    ];
    const DEPostalCodeMask = [/\d/, /\d/, /\d/, /\d/, /\d/];
    if (countrySelected && countries && countries.length) {
      const { code } = find(
        countries,
        optionCountry => optionCountry._id === countrySelected,
      );
      switch (code) {
        case "nl":
          postalCodeMask = NLPostalCodeMask;
          register({ name: "postalCode" }, postalCodeNlValidation(intl));
          break;
        case "de":
          postalCodeMask = DEPostalCodeMask;
          register({ name: "postalCode" }, postalCodeDEValidation(intl));
          break;
        default:
          postalCodeMask = false;
          register({ name: "postalCode" }, postalCodeRequired(intl));
          break;
      }
    } else {
      postalCodeMask = false;
      register({ name: "postalCode" }, postalCodeRequired(intl));
    }
  };
  React.useEffect(() => {
    registerPostCode();
  });
  // Trigger when uncheck generate costcenter
  useEffect(() => {
    if(isAllowGenerateCostCenter && costCenterSelected){
      setCostCenterSelected("");
    }
  },[isAllowGenerateCostCenter, costCenterSelected]);
  const { postalCode, street, number, city = "" } = getValues();

  // get regions by country selected & auto hide default region when regions >=2
  let regionsByCountry =
    countrySelected && countries && countries.length
      ? find(countries, optionCountry => optionCountry._id === countrySelected)
          .regions
      : [];
  if (regionsByCountry && regionsByCountry.length >= 2) {
    regionsByCountry = filter(
      regionsByCountry,
      item => item.name !== DEFAULT_PROVINCE,
    );
  }
  return (
    <Form>
      <Container fluid>
        <Row>
          <Col md="4">
            <Card className="main-card mb-3">
              <CardHeader>
                {intl.formatMessage({ id: "components.formTitle.address" })}
              </CardHeader>
              <CardBody>
                <Form name="form-location-general">
                  <FormGroup>
                    <Select
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.country",
                      })}
                      noOptionsMessage={() => (
                        intl.formatMessage({ id: "components.select.noOption"})
                      )}
                      className="flex-grow-1 mr-2"
                      name="country"
                      value={find(
                        countries,
                        optionCountry => optionCountry._id === countrySelected,
                      )}
                      options={countries}
                      innerRef={register}
                      ref={inputElCountry}
                      getOptionLabel={opt => opt.name}
                      getOptionValue={opt => opt._id}
                      menuPlacement="bottom"
                      onChange={async val => {
                        setCountrySelected(val._id);
                        setValue("country", val._id);
                        setValue("countrySelect", val._id);
                        unregister("postalCode");
                        setValue("postalCode", "");
                        setRegionSelected(null);
                        setValue("region", null);
                        setValue("regionSelect", null);
                        // registerPostCode();
                        if (Object.keys(errors).length) {
                          triggerValidation();
                        }
                        return () => unregister("postalCode");
                      }}
                    />
                    {errors.countrySelect && errors.countrySelect.message && (
                      <FormFeedback style={{ display: "block" }}>
                        {errors.countrySelect.message}
                      </FormFeedback>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Select
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.region",
                      })}
                      noOptionsMessage={() => (
                        intl.formatMessage({ id: "components.select.noOption"})
                      )}
                      className="flex-grow-1 mr-2"
                      name="region"
                      value={
                        regionSelected
                          ? find(
                              regionsByCountry || [],
                              optionRegion =>
                                optionRegion._id === regionSelected,
                            )
                          : null
                      }
                      options={regionsByCountry || []}
                      getOptionLabel={opt => opt.name}
                      getOptionValue={opt => opt._id}
                      menuPlacement="bottom"
                      innerRef={register}
                      invalid={!!errors.regionSelect}
                      ref={inputElRegion}
                      onChange={val => {
                        setRegionSelected(val._id);
                        setValue("region", val._id);
                        setValue("regionSelect", val._id);
                        if (Object.keys(errors).length) {
                          triggerValidation();
                        }
                      }}
                    />
                    {errors.regionSelect && errors.regionSelect.message && (
                      <FormFeedback style={{ display: "block" }}>
                        {errors.regionSelect.message}
                      </FormFeedback>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Input
                      type="text"
                      name="street"
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.street",
                      })}
                      disabled={isSubmitting}
                      innerRef={register}
                      invalid={!!errors.street}
                      onChange={event => {
                        const val = event.target.value;
                        if (val) {
                          !!errors.street && clearError("street");
                        } else {
                          setError(
                            "street",
                            "required",
                            intl.formatMessage({
                              id: "components.errors.address.street.require",
                            }),
                          );
                        }
                        setValue("street", event.target.value);
                      }}
                      value={street || ""}
                    />
                    {errors.street && errors.street.message && (
                      <FormFeedback>{errors.street.message}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup row>
                    <Col>
                      <Input
                        type="number"
                        name="number"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.number",
                        })}
                        disabled={isSubmitting}
                        innerRef={register}
                        invalid={!!errors.number}
                        onChange={event => {
                          const val = event.target.value;
                          if (val) {
                            !!errors.number && clearError("number");
                          } else {
                            setError(
                              "number",
                              "required",
                              intl.formatMessage({
                                id: "components.errors.address.number.require",
                              }),
                            );
                          }
                          setValue("number", event.target.value);
                        }}
                        value={number || ""}
                      />
                      {errors.number && errors.number.message && (
                        <FormFeedback>{errors.number.message}</FormFeedback>
                      )}
                    </Col>
                    <Col>
                      <Input
                        type="text"
                        name="suffix"
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.suffix",
                        })}
                        disabled={isSubmitting}
                        innerRef={register}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    {/* <Input
                    type="text"
                    name="postalCode"
                    placeholder={intl.formatMessage({ id: "components.input.placeholder.postalCode" })}
                    disabled={isSubmitting}
                    innerRef={register}
                    invalid={!!errors.postalCode}
                    value={postalCode || ""}
                    render={(ref, props) => {
                      return (
                        <Input
                          innerRef={ref}
                          {...props}
                        // ref={register(
                        //   { name: "postalCode", type: "custom" },
                        //   { required: true },
                        // )}
                        />
                      );
                    }}
                    onChange={async event => {
                      if (!!errors.postalCode) {
                        clearError("postalCode");
                      }
                      setValue("postalCode", event.target.value);
                    }}
                  /> */}
                    <MaskedInput
                      mask={postalCodeMask}
                      className="form-control"
                      pipe={conformedValue => {
                        return conformedValue.toUpperCase();
                      }}
                      guide={false}
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.postalCode",
                      })}
                      name="postalCode"
                      invalid={!!errors.postalCode}
                      disabled={isSubmitting}
                      value={postalCode || ""}
                      render={(ref, props) => {
                        return (
                          <Input
                            innerRef={ref}
                            {...props}
                            name="postalCode"
                            value={postalCode || ""}
                            // ref={register(
                            //   { name: "postalCode", type: "custom" },
                            //   { required: true },
                            // )}
                          />
                        );
                      }}
                      onChange={async event => {
                        registerPostCode();
                        if (!!errors.postalCode) {
                          clearError("postalCode");
                        }
                        setValue("postalCode", event.target.value);
                      }}
                    />
                    {errors.postalCode && errors.postalCode.message && (
                      <FormFeedback>{errors.postalCode.message}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="text"
                      name="city"
                      placeholder={intl.formatMessage({
                        id: "components.input.placeholder.city",
                      })}
                      disabled={isSubmitting}
                      innerRef={register}
                      invalid={!!errors.city}
                      onChange={event => {
                        const val = event.target.value;
                        if (val) {
                          !!errors.city && clearError("city");
                        } else {
                          setError(
                            "city",
                            "required",
                            intl.formatMessage({
                              id: "components.errors.address.city.require",
                            }),
                          );
                        }
                        setValue("city", event.target.value);
                      }}
                      value={city}
                    />
                    {errors.city && errors.city.message && (
                      <FormFeedback>{errors.city.message}</FormFeedback>
                    )}
                  </FormGroup>
                  {/* <FormGroup>
                  <Select
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.region",
                    })}
                    className="flex-grow-1 mr-2"
                    name="region"
                    value={find(
                      regions,
                      optionRegion => optionRegion._id === regionSelected,
                    )}
                    options={regions}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    menuPlacement="bottom"
                    innerRef={register}
                    invalid={!!errors.regionSelect}
                    ref={inputElRegion}
                    onChange={val => {
                      setRegionSelected(val._id);
                      setValue("region", val._id);
                      setValue("regionSelect", val._id);
                      if (Object.keys(errors).length) {
                        triggerValidation();
                      }
                    }}
                  />
                  {errors.regionSelect && errors.regionSelect.message && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.regionSelect.message}
                    </FormFeedback>
                  )}
                </FormGroup> */}
                  {/* <FormGroup>
                  <Select
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.country",
                    })}
                    className="flex-grow-1 mr-2"
                    name="country"
                    value={find(
                      countries,
                      optionCountry => optionCountry._id === countrySelected,
                    )}
                    options={countries}
                    innerRef={register}
                    ref={inputElCountry}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    menuPlacement="bottom"
                    onChange={val => {
                      setCountrySelected(val._id);
                      setValue("country", val._id);
                      setValue("countrySelect", val._id);
                      if (Object.keys(errors).length) {
                        triggerValidation();
                      }
                    }}
                  />
                  {errors.countrySelect && errors.countrySelect.message && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.countrySelect.message}
                    </FormFeedback>
                  )}
                </FormGroup> */}
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <Card>
              <CardHeader>
                {intl.formatMessage({
                  id: "components.formTitle.locationOnMap",
                })}
              </CardHeader>
              <CardBody>Coming soon......</CardBody>
            </Card>
          </Col>
        </Row>

        {/* NEW - Cost center identifier */}
        <Row>
          <Col md="4">
            <Card className="main-card mb-3">
              <CardBody>
                {!locationIdSelected && (
                  <FormGroup>
                    <CustomInput
                      type="checkbox"
                      id="customcheckbox-costcenter"
                      label={intl.formatMessage({
                        id: "pages.location.generateCostCenter",
                      })}
                      className="mb-2"
                      value={isAllowGenerateCostCenter}
                      onChange={() => {
                        setCostCenterSelected("");
                        setIsGenerateCostCenter();
                      }}
                    />
                  </FormGroup>
                )}
                <FormGroup>
                  <Select
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.costCenterIdentifier",
                    })}
                    noOptionsMessage={() => (
                      intl.formatMessage({ id: "components.select.noOption"})
                    )}
                    className="flex-grow-1 mr-2"
                    name="costcenter"
                    value={
                      isAllowGenerateCostCenter || !costCenterSelected
                        ? null
                        : find(
                            costCenters,
                            optionItem => optionItem._id === costCenterSelected,
                          )
                    }
                    options={costCenters}
                    innerRef={register}
                    ref={inputElCostCenter}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt._id}
                    menuPlacement="bottom"
                    isDisabled={isAllowGenerateCostCenter}
                    onChange={val => {
                      setCostCenterSelected(val._id);
                      setValue("costcenter", val._id);
                      setValue("costcenterSelect", val._id);
                      if (Object.keys(errors).length) {
                        triggerValidation();
                      }
                    }}
                    filterOption={customFilterOption}
                  />
                  {errors.costcenterSelect &&
                    errors.costcenterSelect.message && (
                      <FormFeedback style={{ display: "block" }}>
                        {errors.costcenterSelect.message}
                      </FormFeedback>
                    )}
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Card>
              <CardHeader>
                {intl.formatMessage({ id: "components.formTitle.locationOf" })}
              </CardHeader>
              <CardBody>
                {map(descriptions, (description, index) => {
                  return (
                    <FormGroup row key={index}>
                      <Col lg={4}>
                        <FormGroup inline className="d-flex">
                          <Input
                            type="text"
                            name="key"
                            value={description.key}
                            placeholder={intl.formatMessage({
                              id:
                                "components.input.placeholder.locationOf.typeDesc",
                            })}
                            className="mr-2"
                            onChange={({ target }) => {
                              let dataDescriptions = update(descriptions, {
                                [index]: { key: { $set: target.value || "" } },
                              });
                              setDescriptions(dataDescriptions);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={8}>
                        <FormGroup inline className="d-flex">
                          <Input
                            type="text"
                            name="value"
                            placeholder={intl.formatMessage({
                              id:
                                "components.input.placeholder.locationOf.whereDesc",
                            })}
                            value={description.value}
                            className="mr-2"
                            onChange={({ target }) => {
                              let dataDescriptions = update(descriptions, {
                                [index]: {
                                  value: { $set: target.value || "" },
                                },
                              });
                              setDescriptions(dataDescriptions);
                            }}
                          />
                          <Button
                            color="primary"
                            className="btn-icon btn-icon-only"
                            type="button"
                            onClick={() => onHandleRemoveLocationOf(index)}
                          >
                            <FontAwesomeIcon icon={faMinus} size="1x" />
                          </Button>
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  );
                })}

                <FormGroup row>
                  <Col lg={4}>
                    <FormGroup inline className="d-flex">
                      <Button
                        color="primary"
                        className="btn-icon btn-icon-only"
                        type="button"
                        onClick={onHandleLocationOf}
                      >
                        <FontAwesomeIcon icon={faPlus} size="1x" />
                      </Button>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ContactDetailModal
          isOpen={openMoal}
          onToggleOpen={onToggleOpenModal}
          contactDetail={contactDetail}
          intl={intl}
        />
      </Container>
    </Form>
  );
});

export default GeneralTab;
