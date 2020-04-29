import React, { memo } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
} from "reactstrap";
import { FormattedMessage } from "react-intl";


function ModalConfirm({ isOpen, onToggleOpen, handleSubmit, isSubmitting }) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader><FormattedMessage id="components.dialog.confirmCreate" /></ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label><FormattedMessage id="components.dialog.confirmCreateCostLine.desc" /></Label>
        </FormGroup>

        <FormGroup>
          <Button color="primary" onClick={handleSubmit} disabled={isSubmitting} type="button">
            <FormattedMessage id="components.button.yes" />
          </Button>
          <Button color="link" onClick={onToggleOpen} type="button">
            <FormattedMessage id="components.button.no" />
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(ModalConfirm);
