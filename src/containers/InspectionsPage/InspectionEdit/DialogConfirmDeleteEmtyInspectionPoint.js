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

function DialogConfirmDeleteEmtyInspectionPoint({ isOpen, handleSubmit, cancel, locationsNoPoint, warnMessageKey }) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader><FormattedMessage id="components.dialog.confirmDeleteInspectionPoint" /></ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label><b>{locationsNoPoint}</b> <FormattedMessage id={warnMessageKey || "components.dialog.confirmDeleteInspectionPoint.desc"} />
          </Label>
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

export default memo(DialogConfirmDeleteEmtyInspectionPoint);
