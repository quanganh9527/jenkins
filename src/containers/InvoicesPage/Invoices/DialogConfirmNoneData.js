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

function DialogConfirmNoneData({ isOpen, handleSubmit, isSubmitting,identifier,cancel}) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader><FormattedMessage id="components.dialog.invoiceDetail" /></ModalHeader>
      <ModalBody>
        <FormGroup>
        <Label><FormattedMessage id="components.dialog.invoiceDetail.noneDataDesc" /> </Label>
        </FormGroup>

        <FormGroup>
          <Button color="link" onClick={cancel} type="button"><FormattedMessage id="components.button.cancel" /></Button>
          
        </FormGroup>
      </ModalBody>
    </Modal>

  );

}

export default memo(DialogConfirmNoneData);
