import React, { memo } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormGroup,
} from "reactstrap";
import { FormattedMessage } from "react-intl";

function DialogConfirmOverrideDate({ isOpen, data, handleSubmit, cancel }) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader>{data.title}</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>{data.description}</Label>
        </FormGroup>

        <FormGroup>
          <Button color="primary" onClick={handleSubmit} type="button">
            <FormattedMessage id="components.button.yes" />
          </Button>
          <Button color="link" onClick={cancel} type="button">
            <FormattedMessage id="components.button.no" />
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(DialogConfirmOverrideDate);
