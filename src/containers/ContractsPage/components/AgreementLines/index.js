import React, { useState, useCallback } from "react";
import moment from "moment";
import __ from "lodash";
import {
  Col,
  Row,
  Button,
  FormGroup,
  Input,
  ButtonGroup,
  FormFeedback,
  Alert,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import Select from "react-select";

import { CurrencyEurIcon, MinusIcon } from "containers/Icons";
import { checkSameGenearalCostLine } from "../../validation";
import { agreementTypeOptions } from "../../constants";
import { _unitTree } from "../../utils";
import DropdownTreeSelect from "react-dropdown-tree-select";
import DialogConfirmRemoveAgg from "./DialogConfirmRemoveAgg";
// Style
import "react-dropdown-tree-select/dist/styles.css";

import CostLines from "./Costlines";
const AgreementLines = (props) => {
  const {
    intl,
    status,
    treeUnit,
    agreementLines,
    setAgreementLines,
    isSubmitted,
    startDateContract,
  } = props;
  // Local state
  const defaultSlectDate =
    startDateContract &&
    moment(startDateContract).isValid() &&
    moment(moment(startDateContract).toISOString()).valueOf() >
      moment(new Date().toISOString()).valueOf()
      ? startDateContract
      : new Date();
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [indexAgreementWillRemove, setIndexAgreementWillRemove] = useState(
    null,
  );
  // Function
  const filterOption = React.useCallback((option, searchText) => {
    const label = option.data.label.toLowerCase();
    const text = searchText.toLowerCase();
    if (label.includes(text)) {
      return true;
    } else {
      return false;
    }
  }, []);

  // Handle form
  const handleAddNewAgreement = useCallback(() => {
    setAgreementLines([
      ...agreementLines,
      {
        costLineGenerals: [],
        type: "Accommodation",
        units: [], // Array Object
        treeData: treeUnit || [], // Current tree of Agreement
        nodesToggle: [], // Cureent node toggle of Agreement
      },
    ]);
  }, [agreementLines, setAgreementLines, treeUnit]);
  const hanldeChangeAgreement = useCallback(
    (indexAgreement, key, value) => {
      let data = [...agreementLines];
      data[indexAgreement][key] = value;
      setAgreementLines(data);
    },
    [agreementLines, setAgreementLines],
  );
  const handleRemoveNewAgreement = useCallback(
    (indexAgreement) => {
      //Will remove
      let data = [...agreementLines];
      // const { _id } = data[indexAgreement];
      data.splice(indexAgreement, 1);
      // if (_id) {
      //   data[indexAgreement]["deleted"] = true;
      // } else {
      //   data.splice(indexAgreement, 1);
      // }
      setAgreementLines(data);
    },
    [agreementLines, setAgreementLines],
  );
  const handleChangeTypeAgreement = useCallback(
    (indexAgreement, val) => {
      let data = [...agreementLines];
      data[indexAgreement]["type"] = val;
      data[indexAgreement]["units"] = [];
      data[indexAgreement]["treeData"] = treeUnit || [];
      data[indexAgreement]["nodesToggle"] = [];
      setAgreementLines(data);
    },
    [agreementLines, setAgreementLines, treeUnit],
  );

  const handleAddNewCostLine = useCallback(
    (indexAgrement) => {
      let data = [...agreementLines];
      data[indexAgrement].costLineGenerals = [
        ...data[indexAgrement].costLineGenerals,
        {
          type: "Periodic",
          period: "Monthly",
          startDate: defaultSlectDate,
          invoiceDate: defaultSlectDate,
        },
      ];

      setAgreementLines(data);
    },
    [agreementLines, defaultSlectDate, setAgreementLines],
  );

  //TODO: Handle drowdown unit

  const onnChangeUnit = useCallback(
    (indexAgreement, currentNode, selectedNodes) => {
      console.log("onnChangeUnit", currentNode);

      const treeData = __.cloneDeep(agreementLines[indexAgreement].treeData);
      const nodesSelected = __.cloneDeep(
        agreementLines[indexAgreement].units || [],
      );
      const data = _unitTree.onChangeNodeTree(
        treeData,
        nodesSelected,
        currentNode,
        selectedNodes,
      );
      // TODO: Update tree units & update units of agreement line
      let newData = [...agreementLines];
      newData[indexAgreement]["units"] = data.nodesSelected;
      newData[indexAgreement]["treeData"] = data.treeData;
      setAgreementLines(newData);
    },
    [agreementLines, setAgreementLines],
  );
  const onActionClickCheckboxUnitTree = useCallback(
    (indexAgreement, node, action) => {
      const treeData = __.cloneDeep(agreementLines[indexAgreement].treeData);
      const nodesSelected = __.cloneDeep(
        agreementLines[indexAgreement].units || [],
      );
      const nodesToggle = __.cloneDeep(
        agreementLines[indexAgreement].nodesToggle || [],
      );
      const data = _unitTree.onActionClickCheckboxTree(
        treeData,
        nodesSelected,
        nodesToggle,
        node,
        action,
      );
      // TODO: Update tree units & update units of agreement line
      let newData = [...agreementLines];
      newData[indexAgreement]["units"] = data.nodesSelected;
      newData[indexAgreement]["treeData"] = data.treeData;
      setAgreementLines(newData);
    },
    [agreementLines, setAgreementLines],
  );
  const onNodeToggleUnitTree = useCallback(
    (indexAgreement, currentNode) => {
      const treeData = __.cloneDeep(agreementLines[indexAgreement].treeData);
      const nodesToggle = __.cloneDeep(
        agreementLines[indexAgreement].nodesToggle || [],
      );
      const data = _unitTree.onNodeToggleTree(
        treeData,
        nodesToggle,
        currentNode,
      );
      // TODO: Update tree units & update units of agreement line
      let newData = [...agreementLines];
      newData[indexAgreement]["nodesToggle"] = data.nodesToggle;
      newData[indexAgreement]["treeData"] = data.treeData;
      setAgreementLines(newData);
    },
    [agreementLines, setAgreementLines],
  );

  // Handle Confirm modal
  const onSubmitRemoveAgreement = useCallback(() => {
    handleRemoveNewAgreement(indexAgreementWillRemove);
    setIsOpenConfirm(false);
  }, [handleRemoveNewAgreement, indexAgreementWillRemove]);
  const onCancelConfirm = useCallback(() => {
    setIsOpenConfirm(false);
    setIndexAgreementWillRemove(null);
  }, []);
  // Custom render
  const errorDuplicatedUnits =
    isSubmitted && __.find(agreementLines, (item) => item["duplicatedUnits"]);
  console.log("Status of contract agremeent: ", status);

  return (
    <React.Fragment>
      <div className="d-flex ml-3">
        <h5 className="my-auto">
          {" "}
          <FormattedMessage id="pages.contracts.agreementLines" />
        </h5>
        {__.includes([0, 99], status) && (
          <Button
            color=""
            className=" btn-icon btn-icon-only"
            onClick={handleAddNewAgreement}
            size="lg"
          >
            <i className="eeac-icon eeac-icon-plus"></i>
          </Button>
        )}
      </div>
      {isSubmitted && __.isEmpty(agreementLines) && (
        <Alert color="danger">
          <FormattedMessage id="pages.contracts.errors.agreementLine.require" />
        </Alert>
      )}
      {errorDuplicatedUnits && (
        <Alert color="danger">
          <FormattedMessage id="pages.contracts.errors.agreementLine.duplicateUnits" />
        </Alert>
      )}
      {__.map(agreementLines, (agreement, indexAgreement) => {
        const { _id: agreementId, costLineGenerals } = agreement;
        const errorDuplicatedUnitsAgreement =
          isSubmitted && agreement["duplicatedUnits"];
        const sameCostLine = isSubmitted && agreement["sameCostLine"];
        let haveSameCostLine = false;
        if (sameCostLine) {
          const { isInValid: inValidCostLine } = checkSameGenearalCostLine(
            costLineGenerals,
          );
          console.log("inValidCostLine: ", inValidCostLine);

          if (inValidCostLine) haveSameCostLine = inValidCostLine;
        }
        // if (agreementId && deleted) return null; // Hidden when Remove exited agreement

        return (
          <div
            key={indexAgreement}
            className={
              errorDuplicatedUnitsAgreement ||
              (sameCostLine && haveSameCostLine)
                ? "border border-danger border-dotted my-2 py-2"
                : ""
            }
          >
            <div className="d-flex bd-highlight">
              <div className="w-100 bd-highlight">
                <FormGroup row className="align-items-center pl-3 pr-3 ">
                  <Col sm={12}>
                    <Select
                      className={`${
                        isSubmitted && !agreement.type ? "is-invalid" : ""
                      } w-100 input-selection`}
                      value={
                        agreement.type
                          ? __.find(
                              agreementTypeOptions(intl),
                              (item) => item.value === agreement.type,
                            )
                          : null
                      }
                      onChange={({ value }) =>
                        handleChangeTypeAgreement(indexAgreement, value)
                      }
                      options={agreementTypeOptions(intl)}
                      placeholder={
                        <FormattedMessage id="pages.contracts.agreementType" />
                      }
                      isDisabled={__.includes([99, 100], status) && agreementId} // _id create new when status 99
                      isClearable={
                        !__.includes([99, 100], status) || !agreementId
                      }
                      isSearchable
                      filterOption={filterOption}
                      noOptionsMessage={() => (
                        <FormattedMessage id="components.select.noOption" />
                      )}
                      styles={{
                        container: (base, state) => {
                          return {
                            ...base,
                            zIndex: state.isFocused ? "999" : "1",
                          };
                        },
                      }}
                    />
                    {isSubmitted && !agreement.type && (
                      <FormFeedback className="d-block">
                        {intl.formatMessage({
                          id:
                            "pages.contracts.errors.agreementLine.type.require",
                        })}
                      </FormFeedback>
                    )}
                  </Col>
                </FormGroup>
              </div>
              {(__.includes([0], status) ||
                (!agreementId && __.includes([99], status))) && (
                <div className="flex-shrink-1 bd-highlight">
                  <ButtonGroup size="sm">
                    <Button
                      className="btn-icon btn-icon-only bd-r-50 btn-condition"
                      color="light"
                      onClick={() => handleAddNewCostLine(indexAgreement)}
                    >
                      <CurrencyEurIcon className="btn-icon-wrapper currency-eur-icon" />
                    </Button>
                    <Button
                      color="light"
                      className="btn-icon btn-icon-only bd-r-50 btn-condition"
                      onClick={() => {
                        setIsOpenConfirm(true);
                        setIndexAgreementWillRemove(indexAgreement);
                      }}
                    >
                      <MinusIcon />
                    </Button>
                  </ButtonGroup>
                </div>
              )}
            </div>

            <FormGroup row className="align-items-center pl-3 pr-3 ">
              <Col sm={12} className="">
                <FormattedMessage id="pages.contracts.agreementDesc">
                  {(placeholder) => (
                    <Input
                      type="text"
                      className={`${
                        isSubmitted && !agreement.description
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder={placeholder}
                      disabled={__.includes([99, 100], status) && agreementId} // Case add new when 99
                      value={agreement.description || ""}
                      onChange={({ target }) =>
                        hanldeChangeAgreement(
                          indexAgreement,
                          "description",
                          target.value,
                        )
                      }
                      maxLength={250}
                    />
                  )}
                </FormattedMessage>
                {isSubmitted && !agreement.description && (
                  <FormFeedback className="d-block">
                    {intl.formatMessage({
                      id:
                        "pages.contracts.errors.agreementLine.description.require",
                    })}
                  </FormFeedback>
                )}
              </Col>
            </FormGroup>
            {agreement.type === "Accommodation" && (
              <FormGroup row className="align-items-center pl-3 pr-3 ">
                <Col sm={12} className="">
                  <FormGroup>
                    <DropdownTreeSelect
                      className={`${
                        isSubmitted && __.isEmpty(agreement.units)
                          ? "is-invalid"
                          : ""
                      }  input-selection`}
                      data={agreement.treeData || []}
                      mode="hierarchical"
                      texts={{
                        placeholder:
                          agreement.units && agreement.units.length > 0
                            ? " "
                            : intl.formatMessage({
                                id: "pages.contracts.unitsOrSubUnits",
                              }),
                      }}
                      onChange={(currentNode, selectedNodes) =>
                        onnChangeUnit(
                          indexAgreement,
                          currentNode,
                          selectedNodes,
                        )
                      }
                      onAction={(node, action) =>
                        onActionClickCheckboxUnitTree(
                          indexAgreement,
                          node,
                          action,
                        )
                      }
                      onNodeToggle={(currentNode) =>
                        onNodeToggleUnitTree(indexAgreement, currentNode)
                      }
                      disabled={__.includes([99, 100], status) && agreementId} // Case 99 add new
                    />
                    {isSubmitted && __.isEmpty(agreement.units) && (
                      <FormFeedback className="d-block">
                        {intl.formatMessage({
                          id:
                            "pages.contracts.errors.agreementLine.unitsOrSubunits.require",
                        })}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </FormGroup>
            )}
            {sameCostLine && haveSameCostLine && (
              <Alert color="danger" className="mx-3">
                <FormattedMessage id="pages.contracts.errors.costLine.duplicate" />
              </Alert>
            )}
            <CostLines
              {...props}
              agreement={agreement}
              indexAgreement={indexAgreement}
            />
            <Row>
              <Col md={12}>
                <hr />
              </Col>
            </Row>
          </div>
        );
      })}
      <DialogConfirmRemoveAgg
        isOpen={isOpenConfirm}
        handleSubmit={onSubmitRemoveAgreement}
        cancel={onCancelConfirm}
      />
    </React.Fragment>
  );
};

export default AgreementLines;
