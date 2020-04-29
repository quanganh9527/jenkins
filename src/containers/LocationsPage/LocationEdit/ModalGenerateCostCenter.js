import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
  Input,
  FormFeedback,
} from "reactstrap";
import InputMask from "react-input-mask";
import useForm from "react-hook-form";
import * as Yup from "yup";
export const validationCostCenter = intl => {
  return Yup.object().shape(
    Object.assign({
      costIdentifier: Yup.string()
        .trim()
        .required(
          intl.formatMessage({
            id: "components.errors.costIdentifier.require",
          }),
        )
        .matches(
          /^PRP-\d{6}$/,
          intl.formatMessage({ id: "components.errors.costIdentifier.match" }),
        ),
    }),
  );
};
const ModalGenerateCostCenter = ({
  intl,
  isOpen,
  onToggleOpen,
  locationdentify,
  onSubmit
}) => {
  const closeBtn = (
    <button className="close" onClick={onToggleOpen}>
      &times;
    </button>
  );
  const {
    handleSubmit,
    triggerValidation,
    register,
    errors,
    setValue,
  } = useForm({
    validationSchema: validationCostCenter(intl),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [costCenter, setCostCenter] = useState({
    costIdentifier: "PRP-",
    name: locationdentify || "",
    active: true,
  });
  useEffect(() => {
    register({ name: "costIdentifier" });
  }, [register]);

  const handleTriggerValidation = (name, value) => {
    if (Object.keys(errors).length) {
      triggerValidation({ name, value });
    }
  };
  const onSubmitData = centerData => {
    setIsSubmitting(true);
    onSubmit(centerData);
    onToggleOpen();
    // call save data
    setIsSubmitting(false);
  };
  return (
    <Modal isOpen={isOpen} backdrop={true} id="modal-generate-costcenter">
      <ModalHeader toggle={onToggleOpen} close={closeBtn}>
        <FormattedMessage id="components.formTitle.newCostCenter" />
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <InputMask
            mask="PRP-999999"
            className="form-control"
            placeholder="Cost center identifier"
            name="costIdentifier"
            value={costCenter.costIdentifier || ""}
            alwaysShowMask={true}
            onChange={({ target }) => {
              setValue("costIdentifier", target.value);
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
            name="name"
            innerRef={register}
            defaultValue={locationdentify || ""}
            disabled
          />
        </FormGroup>
        <FormGroup className="mt-3 mb-0 text-right">
          <Button color="link" onClick={onToggleOpen} type="button">
            <FormattedMessage id="components.button.cancel" />
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit(onSubmitData)}
            disabled={isSubmitting}
          >
            <FormattedMessage id="components.button.save" />
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
};

export default ModalGenerateCostCenter;
