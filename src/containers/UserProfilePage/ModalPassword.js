/**
 *
 * Modal Update/Reset Password
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
} from "reactstrap";
import useForm from "react-hook-form";

import ButtonLoading from "../../components/ButtonLoading";
import { useDispatch } from "react-redux";
import { updateUserPassword } from "./actions";

import { validationUpdatePassword } from "./validation";

import { FormattedMessage, injectIntl } from "react-intl";

function UpdatePasswordModal({intl, isOpen, onToggleOpen }) {
  // global
  const dispatch = useDispatch();

  // local state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form
  const { register, handleSubmit, errors } = useForm({
    validationSchema: validationUpdatePassword(intl),
  });

  const onSubmit = data => {
    setIsSubmitting(true);
    dispatch(
      updateUserPassword(data.newPassword, setIsSubmitting, onToggleOpen),
    );
  };

  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader><FormattedMessage id="components.dialog.updatePassword" /></ModalHeader>
      <ModalBody>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Input
              type="password"
              name="newPassword"
              placeholder={intl.formatMessage({id: "components.input.placeholder.newPassword"})}
              innerRef={register}
              invalid={!!errors.newPassword}
              disabled={isSubmitting}
            />
            {errors.newPassword && errors.newPassword.message && (
              <FormFeedback>{errors.newPassword.message}</FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="newPasswordConfirm"
              placeholder={intl.formatMessage({id: "components.input.placeholder.confirmPassword"})}
              innerRef={register}
              invalid={!!errors.newPasswordConfirm}
              disabled={isSubmitting}
            />
            {errors.newPasswordConfirm && errors.newPasswordConfirm.message && (
              <FormFeedback>{errors.newPasswordConfirm.message}</FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Button
              color="link"
              onClick={onToggleOpen}
              type="button"
              disabled={isSubmitting}
            >
              <FormattedMessage id="components.button.cancel" />
            </Button>
            <ButtonLoading
              color="primary"
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              text={<FormattedMessage id="components.button.save" />}
            />
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default memo(injectIntl(UpdatePasswordModal));
