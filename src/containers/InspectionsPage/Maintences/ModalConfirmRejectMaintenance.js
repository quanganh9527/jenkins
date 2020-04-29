import React, { memo, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import TextareaAutosize from "react-textarea-autosize";
import { useSelector, useDispatch } from "react-redux";
import { inspectionActions } from "../action";
import { loadingProviderActions } from "../../LoadingProvider/actions";
import useForm from "react-hook-form";
import { validationMaintenanceReject } from "./validation";
import { FormattedMessage, injectIntl } from "react-intl";

function ConfirmRejectMaintenance({ isOpen, onToggleOpen, inspection, intl }) {
  const dispatch = useDispatch();
  const loadingStateProvider = useSelector(state => state.loadingProvider);
  const { handleSubmit, register, errors, clearError, setValue } = useForm({
    validationSchema: validationMaintenanceReject(intl),
  });
  register({ name: "rejectMessage" });
  const [rejectMessage, setRejectMessage] = useState("");
  const onSubmitRejectInspection = values => {
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(
      inspectionActions.submitRejectMaintenance(
        inspection._id,
        values.rejectMessage,
      ),
    );
    onToggleOpen();
  };
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader>
        <FormattedMessage id="pages.maintenance.dialog.rejectMaintenance" />
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <TextareaAutosize
            className={`${
              !!errors.rejectMessage ? "is-invalid " : ""
            } form-control`}
            name="rejectMessage"
            minRows={3}
            maxRows={6}
            value={rejectMessage || ""}
            placeholder={intl.formatMessage({
              id: "pages.maintenance.dialog.rejectMaintenance.des",
            })}
            onChange={({ target }) => {
              setRejectMessage(target.value);
              setValue("rejectMessage", target.value);
            }}
            innerRef={register}
          />
          {errors.rejectMessage && errors.rejectMessage.message && (
            <FormFeedback className="d-block">
              {errors.rejectMessage.message}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Button
            color="link"
            onClick={() => {
              onToggleOpen();
              clearError();
            }}
            type="button"
          >
            <FormattedMessage id="components.button.cancel" />
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit(onSubmitRejectInspection)}
            type="button"
          >
            <FormattedMessage id="components.button.send" />
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(injectIntl(ConfirmRejectMaintenance));
