import React, { memo } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
} from "reactstrap";
import moment from 'moment';

import { FormattedMessage } from "react-intl";

function ConfirmComplete({ isOpen, onToggleOpen, onSendConfirmComplete }) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader><FormattedMessage id="pages.cleaning.dialog.completeCleaning" /></ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label><FormattedMessage id="pages.cleaning.dialog.completeCleaning.des" /> {moment().format('DD/MM/YYYY')}</Label>
        </FormGroup>
        <FormGroup>
          <Button color="link" onClick={onToggleOpen} type="button">
            <FormattedMessage id="components.button.cancel" />
          </Button>
          <Button color="primary" onClick={() => onSendConfirmComplete()} type="button">
            <FormattedMessage id="components.button.yes" />
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(ConfirmComplete);
