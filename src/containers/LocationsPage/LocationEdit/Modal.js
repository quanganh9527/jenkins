/**
 *
 * Modal Show contact person, grouping
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

import { FormattedMessage } from "react-intl";

function ContactDetailModal({ isOpen, onToggleOpen, contactDetail, isGroup = false, intl }) {
  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader>{`${contactDetail.name}'s detail `}</ModalHeader>
      <ModalBody>
        {contactDetail.type === "grouping" ? (
          <>
            <FormGroup>
              <Input type="text" disabled defaultValue={contactDetail.website || ''} />
            </FormGroup>
            <FormGroup>
              <Input type="text" disabled defaultValue={contactDetail.email || ''} />
            </FormGroup>
          </>
        ) : (
            <>
              <FormGroup>
                <Input type="text" disabled defaultValue={contactDetail.gender || ''} />
              </FormGroup>
              <FormGroup>
                <Input type="text" disabled defaultValue={contactDetail.language || ''} />
              </FormGroup>
              <FormGroup>
                <Input type="text" disabled defaultValue={contactDetail.email || ''} />
              </FormGroup>
            </>
          )}
        <FormGroup>
          <Input type="text" disabled defaultValue={contactDetail.phoneNumber1 || ''} />
        </FormGroup>
        <FormGroup>
          <Input type="text" disabled defaultValue={contactDetail.phoneNumber2 || ''} />
        </FormGroup>

        <FormGroup>
          <Button color="link" onClick={onToggleOpen} type="button">
            <FormattedMessage id="components.button.cancel" />
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(ContactDetailModal);
