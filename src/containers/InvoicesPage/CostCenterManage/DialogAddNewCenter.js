import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, CustomInput, FormFeedback, Alert } from 'reactstrap';

import InputMask from "react-input-mask";
import useForm from "react-hook-form";
import { validationCostCenter } from "../validation";
import { useSelector, useDispatch } from "react-redux";
import { invoiceActions } from "../actions";
import { FormattedMessage, injectIntl } from "react-intl";
import Utils from "../../../utilities/utils";

function DialogAddNewCenter({ intl, onToggleOpen, isOpen }) {
  const closeBtn = <button className="close" onClick={onToggleOpen}>&times;</button>;
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [costCenter, setCostCenter] = useState({
    costIdentifier: "PRP-",
    name: "",
    active: true,
  });

  const invoiceState = useSelector(state => state.invoice);
  let { selectedCostCenter, notificationCostCenter } = invoiceState;
  let isEdit = selectedCostCenter && selectedCostCenter._id ? true : false

  const {
    handleSubmit,
    register,
    errors,
    setValue,
    triggerValidation,
    reset,
    formState: { dirty }
  } = useForm({
    validationSchema: validationCostCenter(intl)
  });

  useEffect(() => {
    register({ name: "costIdentifier" });
  }, [register]);

  useEffect(() => {
    if (isEdit) {
      setIsSubmitting(!dirty);
    }
  }, [isEdit, dirty]);


  useEffect(() => {
    if (selectedCostCenter) {
      reset({
        costIdentifier: selectedCostCenter.costIdentifier || "PRP-",
      });
      setCostCenter({
        costIdentifier: selectedCostCenter.costIdentifier || "PRP-",
        name: selectedCostCenter.name || "",
        active: isEdit ? selectedCostCenter.active : true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCostCenter, isEdit]);

  const handleTriggerValidation = (name, value) => {
    if (Object.keys(errors).length) {
      triggerValidation({ name, value });
    }
  }

  const onSubmit = (centerData) => {
    setIsSubmitting(true);
    if (!isEdit) {
      dispatch(invoiceActions.submitCreateCostCenter(centerData));
    } else {
      dispatch(invoiceActions.submitUpdateCostCenter(selectedCostCenter._id, centerData));
    }
    setIsSubmitting(false);
  }

  const isShowNotification = notificationCostCenter && notificationCostCenter.message && notificationCostCenter.position === "modal";

  return (
    <Modal isOpen={isOpen} toggle={onToggleOpen} >
      <ModalHeader toggle={onToggleOpen} close={closeBtn}>
        {isEdit ? <FormattedMessage id="components.formTitle.updateCostCenter" /> : <FormattedMessage id="components.formTitle.newCostCenter" />}
      </ModalHeader>
      <ModalBody>
        {isShowNotification ? (
          <Alert
            color={notificationCostCenter.type === "success" ? "success" : "danger"}
            isOpen={!!notificationCostCenter.message}
          >
            {Utils.showNotify(intl, notificationCostCenter)}
          </Alert>
        ) : null}
        <FormGroup>
          <InputMask
            mask="PRP-999999"
            className="form-control"
            placeholder="Cost center identifier"
            name="costIdentifier"
            value={costCenter.costIdentifier}
            alwaysShowMask={true}
            onChange={({ target }) => {
              setValue('costIdentifier', target.value);
              setCostCenter({ ...costCenter, [target.name]: target.value });
              handleTriggerValidation("costIdentifier", target.value);
            }}
          />
          {errors.costIdentifier && errors.costIdentifier.message && (
            <FormFeedback style={{ display: "block" }}>
              {errors.costIdentifier.message}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            placeholder={intl.formatMessage({ id: "components.input.placeholder.costCenterName" })}
            name="name"
            innerRef={register}
            defaultValue={costCenter.name}
            onChange={({ target }) => {
              setCostCenter({ ...costCenter, [target.name]: target.value });
            }}
          />
          {errors.name && errors.name.message && (
            <FormFeedback style={{ display: "block" }}>
              {errors.name.message}
            </FormFeedback>
          )}
        </FormGroup>
        <CustomInput
          type="checkbox"
          id="ckbActive"
          label={intl.formatMessage({ id: "components.checkBox.active" })}
          name="active"
          checked={costCenter.active}
          innerRef={register}
          onChange={({ target }) => {
            setValue('active', target.checked);
            setCostCenter({ ...costCenter, [target.name]: target.checked });
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="link" onClick={onToggleOpen}><FormattedMessage id="components.button.cancel" /></Button>
        <Button color="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><FormattedMessage id="components.button.save" /></Button>
      </ModalFooter>
    </Modal>
  );
}

export default injectIntl(DialogAddNewCenter);
