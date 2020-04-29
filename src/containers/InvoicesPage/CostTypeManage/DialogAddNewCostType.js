import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  CustomInput,
  FormFeedback,
  Alert,
} from "reactstrap";

import useForm from "react-hook-form";
import Select from "react-select";
import { validationCostType } from "../validation";
import { useSelector, useDispatch } from "react-redux";
import { invoiceActions } from "../actions";
import { find, filter } from "lodash";
import Utils from "../../../utilities/utils";

import { FormattedMessage, injectIntl } from "react-intl";

function DialogAddNewCostType({ intl, onToggleOpen, isOpen }) {
  const closeBtn = (
    <button className="close" onClick={onToggleOpen}>
      &times;
    </button>
  );
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vatTypeOptions, setVatTypeOptions] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [costType, setCostType] = useState({
    name: "",
    country: "",
    vattype: "",
    ledgerAccount: "",
    active: true,
  });

  const invoiceState = useSelector((state) => state.invoice);
  let {
    selectedCostType,
    ledgerAccounts,
    vatTypes,
    countries,
    notification,
  } = invoiceState;
  let isEdit = selectedCostType && selectedCostType._id ? true : false;

  const {
    handleSubmit,
    register,
    errors,
    setValue,
    triggerValidation,
  } = useForm({
    validationSchema: validationCostType(intl),
  });

  useEffect(() => {
    register({ name: "country" });
    register({ name: "vattype" });
    register({ name: "ledgerAccount" });
  }, [register]);

  useEffect(() => {
    if (selectedCostType) {
      const country = isEdit
        ? selectedCostType.country
        : find(countries, (item) => item.code === "nl");

      setValue("country", country ? country._id : "");
      setValue(
        "vattype",
        selectedCostType.vattype ? selectedCostType.vattype._id : "",
      );
      setValue(
        "ledgerAccount",
        selectedCostType.ledgerAccount
          ? selectedCostType.ledgerAccount._id
          : "",
      );
      setCostType({
        name: selectedCostType.name || "",
        country: country,
        vattype: selectedCostType.vattype,
        ledgerAccount: selectedCostType.ledgerAccount,
        active: isEdit ? selectedCostType.active : true,
      });
      setSelectedCountryId(country ? country._id : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCostType, isEdit, countries, setSelectedCountryId]);

  useEffect(() => {
    // Select VAT type by country
    if (selectedCountryId) {
      const vatTypeByCountry = filter(
        vatTypes,
        (item) => item.country && item.country._id === selectedCountryId,
      );
      setVatTypeOptions(vatTypeByCountry);
    }
  }, [selectedCountryId, setVatTypeOptions, vatTypes]);

  const handleChangeCountry = (country) => {
    if (selectedCountryId === country._id) {
      return;
    }
    // Select country and reset vattype
    setValue("vattype", "");
    setValue("country", country._id);
    setCostType({ ...costType, country: country, vattype: "" });
    setSelectedCountryId(country._id);
    handleTriggerValidation("country", country._id);
  };

  const handleTriggerValidation = (name, value) => {
    if (Object.keys(errors).length) {
      triggerValidation({ name, value });
    }
  };

  const onSubmit = (typeData) => {
    setIsSubmitting(true);
    if (!isEdit) {
      dispatch(invoiceActions.submitCreateCostType(typeData));
    } else {
      dispatch(
        invoiceActions.submitUpdateCostType(selectedCostType._id, typeData),
      );
    }
    setIsSubmitting(false);
  };

  const isShowNotification =
    notification &&
    notification.message &&
    notification.position === "modal" &&
    notification.page === "costtype";

  return (
    <Modal isOpen={isOpen} toggle={onToggleOpen}>
      <ModalHeader toggle={onToggleOpen} close={closeBtn}>
        {isEdit ? (
          <FormattedMessage id="components.formTitle.updateCostType" />
        ) : (
          <FormattedMessage id="components.formTitle.newCostType" />
        )}
      </ModalHeader>
      <ModalBody>
        {isShowNotification ? (
          <Alert
            color={notification.type === "success" ? "success" : "danger"}
            isOpen={!!notification.message}
          >
            {Utils.showNotify(intl, notification)}
          </Alert>
        ) : null}
        <FormGroup>
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "components.input.placeholder.costTypeName",
            })}
            name="name"
            innerRef={register}
            defaultValue={costType.name}
            onChange={({ target }) => {
              setCostType({ ...costType, [target.name]: target.value });
            }}
          />
          {errors.name && errors.name.message && (
            <FormFeedback style={{ display: "block" }}>
              {errors.name.message}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Select
            value={costType.country}
            options={countries || []}
            getOptionLabel={(opt) => opt.name}
            getOptionValue={(opt) => opt._id}
            placeholder={intl.formatMessage({
              id: "components.input.placeholder.country",
            })}
            noOptionsMessage={() =>
              intl.formatMessage({ id: "components.select.noOption" })
            }
            onChange={(val) => {
              handleChangeCountry(val);
            }}
          />
          {errors.country && errors.country.message && (
            <FormFeedback style={{ display: "block" }}>
              {errors.country.message}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Select
            value={costType.vattype}
            options={vatTypeOptions}
            getOptionLabel={(opt) => opt.name}
            getOptionValue={(opt) => opt._id}
            placeholder={intl.formatMessage({
              id: "components.input.placeholder.vatType",
            })}
            noOptionsMessage={() =>
              intl.formatMessage({ id: "components.select.noOption" })
            }
            onChange={(val) => {
              setValue("vattype", val._id);
              setCostType({ ...costType, vattype: val });
              handleTriggerValidation("vattype", val._id);
            }}
          />
          {errors.vattype && errors.vattype.message && (
            <FormFeedback style={{ display: "block" }}>
              {errors.vattype.message}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Select
            value={costType.ledgerAccount}
            options={ledgerAccounts || []}
            getOptionLabel={(opt) => opt.code + "-" + opt.name}
            getOptionValue={(opt) => opt._id}
            placeholder={intl.formatMessage({
              id: "components.input.placeholder.ledgerAccount",
            })}
            noOptionsMessage={() =>
              intl.formatMessage({ id: "components.select.noOption" })
            }
            onChange={(val) => {
              setValue("ledgerAccount", val._id);
              setCostType({ ...costType, ledgerAccount: val });
              handleTriggerValidation("ledgerAccount", val._id);
            }}
          />
          {errors.ledgerAccount && errors.ledgerAccount.message && (
            <FormFeedback style={{ display: "block" }}>
              {errors.ledgerAccount.message}
            </FormFeedback>
          )}
        </FormGroup>
        <CustomInput
          type="checkbox"
          id="ckbActive"
          label={intl.formatMessage({ id: "components.checkBox.active" })}
          name="active"
          checked={costType.active}
          innerRef={register}
          onChange={({ target }) => {
            setCostType({ ...costType, [target.name]: target.checked });
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="link" onClick={onToggleOpen}>
          <FormattedMessage id="components.button.cancel" />
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <FormattedMessage id="components.button.save" />
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default injectIntl(DialogAddNewCostType);
