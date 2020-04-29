/**
 *
 * Modal Reset Password
 *
 */
import React, { memo, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  FormFeedback,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import useForm from "react-hook-form";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ButtonLoading from "../../../components/ButtonLoading";
// import GeneratePassword from 'generate-password';
import generatePassword from "../../../utilities/generatePassword";
import { validationResetPassword } from "./validation";
import { employeeActions } from "../actions";

import { FormattedMessage, injectIntl } from "react-intl";

function ResetPasswordModal({ isOpen, onToggleOpen, userId, dispatch, intl }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratePassword, setIsGeneratePassword] = useState(false);
  const [inputPasswordType, setInputPasswordType] = useState("password");

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    triggerValidation,
  } = useForm({
    validationSchema: validationResetPassword(intl),
  });

  const onHandleGeneratePassword = () => {
    setIsGeneratePassword(true);
    setTimeout(() => {
      setValue("resetPassword", generatePassword());
      triggerValidation();
      setIsGeneratePassword(false);
    }, 1000);
  };
  const onHandleShowPassword = () => {
    if (inputPasswordType === "password") {
      setInputPasswordType("text");
    } else {
      setInputPasswordType("password");
    }
  };

  const onSubmit = data => {
    console.log("TCL: onSubmit -> data", data);
    // TODO
    setIsSubmitting(true);
    dispatch(
      employeeActions.updatePasswordAccountSubmit(userId, data.resetPassword),
    );
    setTimeout(() => {
      setIsSubmitting(false);
      onToggleOpen();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader><FormattedMessage id="components.button.resetPassword" /></ModalHeader>
      <ModalBody>
        <Form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <Button
                  className="btn-icon btn-icon-only"
                  color="info"
                  onClick={onHandleShowPassword}
                  type="button"
                >
                  <FontAwesomeIcon
                    icon={inputPasswordType === "text" ? faEye : faEyeSlash}
                  />
                </Button>
              </InputGroupAddon>
              <Input
                type={inputPasswordType}
                name="resetPassword"
                placeholder={intl.formatMessage({id: 'components.input.placeholder.newPassword'})}
                innerRef={register}
                invalid={!!errors.resetPassword}
                disabled={isSubmitting || isGeneratePassword}
              />
              <InputGroupAddon addonType="append">
                <ButtonLoading
                  color="secondary"
                  type="button"
                  disabled={isSubmitting}
                  onClick={onHandleGeneratePassword}
                  isLoading={isGeneratePassword}
                  text={intl.formatMessage({id: 'components.button.generate'})}
                />
              </InputGroupAddon>
              {errors.resetPassword && errors.resetPassword.message && (
                <FormFeedback>{errors.resetPassword.message}</FormFeedback>
              )}
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Button
              color="link"
              onClick={onToggleOpen}
              type="button"
              disabled={isSubmitting || isGeneratePassword}
            >
              <FormattedMessage id="components.button.cancel" />
            </Button>
            <ButtonLoading
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              disabled={isGeneratePassword || isSubmitting}
              text={intl.formatMessage({id: 'components.button.reset'})}
            />
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default memo(injectIntl(ResetPasswordModal));
