import React, { memo } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormGroup,
} from 'reactstrap';
import { FormattedMessage } from "react-intl";

function DialogConfirm({ isOpen, handleSubmit, isSubmitting, identifier, cancel }) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader><FormattedMessage id="components.dialog.invoiceDetail" /></ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label><FormattedMessage id="components.dialog.invoiceDetail.confirmDesc" /> {identifier}</Label>
        </FormGroup>

        <FormGroup>
          <Button color="primary" onClick={handleSubmit} disabled={isSubmitting} type="button">
            <FormattedMessage id="components.button.save" />
          </Button>
          <Button color="link" onClick={cancel} type="button"><FormattedMessage id="components.button.cancel" /></Button>

        </FormGroup>
      </ModalBody>
    </Modal>

  );

}

export default memo(DialogConfirm);
