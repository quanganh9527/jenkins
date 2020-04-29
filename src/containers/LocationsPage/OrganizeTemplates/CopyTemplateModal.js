/**
 *
 * Modal Reset Password
 *
 */
import React, { memo, useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  FormGroup,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { xor } from "lodash";
import { FormattedMessage } from "react-intl";

import { locationActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";

import { useSelector, useDispatch } from "react-redux";
import CopyFrom from "./CopyFrom";
import CopyTo from "./CopyTo";

function CopyTemplateModal({
  intl,
  isOpen,
  onToggleOpen,
  selectedLocation,
  selectedUnitId,
  fetchDataAsync,
}) {
  const dispatch = useDispatch();

  const [unitIdsFrom, setUnitIdsFrom] = useState([]);
  const [unitIdsTo, setUnitIdsTo] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationReducer = useSelector((state) => state.location);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);

  const { isCopyTemlateSubmitting } = locationReducer;

  const toggleCheckUnitFrom = (unitId) => {
    let newArray = xor(unitIdsFrom, [unitId]);
    setUnitIdsFrom(newArray);
  };

  const toggleCheckUnitTo = (unitId) => {
    let newArray = xor(unitIdsTo, [unitId]);
    setUnitIdsTo(newArray);
  };

  const onHandleCopy = () => {
    // prevent try to press when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    setIsSubmitting(true);
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(
      locationActions.copyInspectionTemplate(
        unitIdsFrom,
        unitIdsTo,
        selectedUnitId,
      ),
    );
    // setTimeout(() => {
    //   onToggleOpen();
    // }, 500)
  };
  /**
   * Hidden Modal when done copy template
   */
  useEffect(() => {
    if (
      isSubmitting &&
      !isCopyTemlateSubmitting &&
      !loadingStateProvider.isSubmittingStatusProvider
    ) {
      setIsSubmitting(false);
      onToggleOpen();
    }
  }, [
    isCopyTemlateSubmitting,
    isSubmitting,
    onToggleOpen,
    loadingStateProvider,
  ]);
  return (
    <Modal isOpen={isOpen} backdrop={true} id="modal-copy-template">
      {/* <ModalHeader>
        Copy inspection template
      </ModalHeader> */}
      <ModalBody>
        <Row>
          <Col md={6}>
            <CopyFrom
              intl={intl}
              selectedLocation={selectedLocation}
              toggleCheckUnit={toggleCheckUnitFrom}
              unitIds={unitIdsFrom}
              setUnitIdsFrom={setUnitIdsFrom}
              fetchDataAsync={fetchDataAsync}
            />
          </Col>
          <Col md={6}>
            <CopyTo
              selectedLocation={selectedLocation}
              toggleCheckUnit={toggleCheckUnitTo}
              unitIds={unitIdsTo}
            />
          </Col>
        </Row>

        <FormGroup className="mt-3 mb-0 text-right">
          <Button color="link" onClick={onToggleOpen} type="button">
            <FormattedMessage id="components.button.cancel" />
          </Button>
          <Button
            color="primary"
            type="button"
            onClick={onHandleCopy}
            disabled={!unitIdsFrom.length || !unitIdsTo.length || isSubmitting}
          >
            {isSubmitting ? (
              <Spinner color="light" size="sm" />
            ) : (
              <FormattedMessage id="components.button.copy" />
            )}
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(CopyTemplateModal);
