/**
 *
 * Modal Update/Reset Password
 *
 */
import React, { memo } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
} from "reactstrap";

function ContactDetailModal({ isOpen, onToggleOpen, contactDetail, isGroup = false }) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader>{`${contactDetail.name}'s detail `}</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Input type="text" disabled defaultValue={contactDetail.website || ''} />
        </FormGroup>
        <FormGroup>
          <Input type="text" disabled defaultValue={contactDetail.email || ''} />
        </FormGroup>

        <FormGroup>
          <Input type="text" disabled defaultValue={contactDetail.phoneNumber1 || ''} />
        </FormGroup>
        <FormGroup>
          <Input type="text" disabled defaultValue={contactDetail.phoneNumber2 || ''} />
        </FormGroup>

        <FormGroup>
          <Button color="link" onClick={onToggleOpen} type="button">
            Cancel
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(ContactDetailModal);
