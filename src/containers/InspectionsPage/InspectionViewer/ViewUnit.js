import React, { useState, memo } from "react";
import {
  Col,
  ButtonGroup,
  Button,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem,
  Breadcrumb,
  Collapse,
  // FormFeedback,
  Alert,
} from "reactstrap";
import NumericInput from "react-numeric-input";
import NumberFormat from "react-number-format";
import { map, find, includes } from "lodash";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import "react-dropdown-tree-select/dist/styles.css";
import Carousel, { Modal, ModalGateway } from "react-images";
// import "./styles.scss";
import * as styles from "../InspectionEdit/styles";
import {
  EmoticonHappyOutlineIcon,
  EmoticonNeutralOutlineIcon,
  EmoticonSadOutlineIcon,
  MinusIcon,
} from "../../Icons";

import { INSPECTION_STATUS, INSPECTION_ITEM_STATUS } from "../constants";

import { FormattedMessage } from "react-intl";

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

function ViewUnit({
  intl,
  inspection,
  UnitBreadcrumb,
  inspectionStatus,
  costTypes,
}) {
  const [unitsCollapse, setUnitsCollapse] = useState(1);
  const [modalIsOpenImages, setmodalIsOpenImages] = useState(false);
  const [modalSourceImages, setModalSourceImages] = useState([]);
  const addModalSourceImages = (images) => {
    setModalSourceImages(
      map(images, (file) => {
        let previewImage = !file.data ? file : "";
        return {
          src: previewImage,
        };
      }),
    );
  };
  const toggleModalImages = () => {
    setmodalIsOpenImages(!modalIsOpenImages);
  };
  const onHandleCollapseUnit = (indexConllapseUnit, focusError) => {
    if (focusError) {
      setUnitsCollapse(indexConllapseUnit);
      return;
    }
    if (unitsCollapse && unitsCollapse === indexConllapseUnit) {
      setUnitsCollapse(undefined);
    } else {
      setUnitsCollapse(indexConllapseUnit);
    }
  };

  return (
    <div>
      {map(
        inspection && inspection.units ? inspection.units : [],
        (unit, idxUnit) => {
          return (
            <React.Fragment key={idxUnit}>
              <Breadcrumb
                className="mt-3 mb-0 eeac-units-breadcrumb"
                onClick={() => onHandleCollapseUnit(idxUnit + 1)}
              >
                {UnitBreadcrumb(unit)}
              </Breadcrumb>
              <Collapse
                isOpen={unitsCollapse === idxUnit + 1}
                data-parent="#exampleAccordion"
              >
                <ListGroup name={`item-unit-${idxUnit + 1}`}>
                  {map(unit.inspectionitems, (inspectionItem, idxPoint) => {
                    return (
                      <ListGroupItem
                        className="border-0 pl-0 pr-0 pb-0 pt-0 inspection-point-item"
                        key={`unit-${idxUnit}-${idxPoint}`}
                      >
                        {inspectionStatus === INSPECTION_STATUS.OPEN && (
                          <div className="d-flex justify-content-between align-items-center">
                            <Label for="" className="font-weight-600 mb-0">
                              {inspectionItem.description}
                            </Label>
                          </div>
                        )}
                        {inspectionStatus === INSPECTION_STATUS.READY && (
                          <FormGroup className="mb-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <Label for="" className="font-weight-600 mb-0">
                                {inspectionItem.description}
                              </Label>

                              <div>
                                <div>
                                  <Label for="" className="mr-2"></Label>
                                  <ButtonGroup size="sm">
                                    <Button
                                      className={`btn-icon btn-icon-only bd-r-50 btn-condition happy`}
                                      color="light"
                                      onClick={() => {}}
                                      active={
                                        inspectionItem.status ===
                                        INSPECTION_ITEM_STATUS.GREEN
                                      }
                                    >
                                      <EmoticonHappyOutlineIcon className="btn-icon-wrapper emoticon-happy-icon" />
                                    </Button>
                                    <Button
                                      className={`btn-icon btn-icon-only bd-r-50 btn-condition neutral`}
                                      color="light"
                                      onClick={() => {}}
                                      active={
                                        inspectionItem.status ===
                                        INSPECTION_ITEM_STATUS.YELLOW
                                      }
                                    >
                                      <EmoticonNeutralOutlineIcon className="btn-icon-wrapper emoticon-neutral-icon" />
                                    </Button>
                                    <Button
                                      className="btn-icon btn-icon-only bd-r-50 btn-condition sad"
                                      color="light"
                                      onClick={() => {}}
                                      active={
                                        inspectionItem.status ===
                                        INSPECTION_ITEM_STATUS.RED
                                      }
                                    >
                                      <EmoticonSadOutlineIcon className="btn-icon-wrapper emoticon-sad-icon" />
                                    </Button>
                                  </ButtonGroup>
                                </div>
                              </div>
                            </div>
                            {includes(
                              [
                                INSPECTION_ITEM_STATUS.YELLOW,
                                INSPECTION_ITEM_STATUS.RED,
                              ],
                              inspectionItem.status,
                            ) &&
                              (!inspectionItem.images ||
                                inspectionItem.images.length < 1 ||
                                inspectionItem.images.length > 8 ||
                                !inspectionItem.findings) && (
                                <Alert
                                  className="mt-1"
                                  color="danger"
                                  isOpen={true}
                                >
                                  {intl.formatMessage({
                                    id:
                                      "components.errors.findingsImages.require",
                                  })}
                                </Alert>
                              )}
                            <TextareaAutosize
                              className={`${
                                !inspectionItem.findings &&
                                includes(
                                  [
                                    INSPECTION_ITEM_STATUS.YELLOW,
                                    INSPECTION_ITEM_STATUS.RED,
                                  ],
                                  inspectionItem.status,
                                )
                                  ? "is-invalid "
                                  : ""
                              } form-control mt-1 inputs-findings`}
                              minRows={3}
                              maxRows={6}
                              style={styles.textArea}
                              value={inspectionItem.findings || ""}
                              disabled
                              onChange={() => {}}
                            />
                            {/* {isSubmitting && !inspectionItem.findings && includes([INSPECTION_ITEM_STATUS.YELLOW, INSPECTION_ITEM_STATUS.RED], inspectionItem.status) && (
                                                          <FormFeedback className="d-block">Description is required.</FormFeedback>
                                                        )} */}

                            {/* Photos */}
                            <div>
                              <aside style={styles.thumbsContainer}>
                                {map(
                                  inspectionItem.images,
                                  (file, idxImage) => {
                                    let previewImage = !file.data ? file : "";
                                    return (
                                      <div
                                        style={styles.thumb}
                                        key={`unit-${idxUnit}-${idxImage}`}
                                      >
                                        <div style={styles.thumbInner}>
                                          <img
                                            src={previewImage}
                                            style={styles.img}
                                            alt=""
                                            onClick={() => {
                                              addModalSourceImages(
                                                inspectionItem.images,
                                              );
                                              toggleModalImages(
                                                inspectionItem.images,
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                              </aside>
                            </div>

                            {/* Cost to bill */}
                            {map(inspectionItem.bills, (billItem, idxBill) => {
                              return (
                                <div
                                  key={`unit-${idxUnit}-${idxBill}`}
                                  className="mt-2"
                                >
                                  <Label>
                                    <FormattedMessage id="pages.inspection.costsToBill" />
                                  </Label>
                                  <div className="d-flex align-items-start">
                                    <Button
                                      color=""
                                      className="text-left m-0 p-0 mr-3 mt-1"
                                      onClick={() => {}}
                                    >
                                      <MinusIcon />
                                    </Button>
                                    <div className="flex-grow-1">
                                      <FormGroup>
                                        <Input
                                          type="text"
                                          placeholder={intl.formatMessage({
                                            id:
                                              "components.input.placeholder.expenditureDesc",
                                          })}
                                          value={billItem.description || ""}
                                          onChange={({ target }) => {}}
                                          disabled
                                        />
                                      </FormGroup>
                                      <FormGroup row className="mt-2 mb-1">
                                        <Col>
                                          <FormGroup>
                                            <Select
                                              className={`${
                                                !billItem.costtype
                                                  ? "is-invalid"
                                                  : ""
                                              } select-cost-type`}
                                              value={
                                                billItem.costtype
                                                  ? find(
                                                      costTypes,
                                                      (itemCostType) =>
                                                        itemCostType._id ===
                                                        billItem.costtype,
                                                    )
                                                  : {}
                                              }
                                              getOptionLabel={(opt) => opt.name}
                                              getOptionValue={(opt) => opt._id}
                                              onChange={(val) => {}}
                                              options={costTypes}
                                              placeholder={intl.formatMessage({
                                                id:
                                                  "components.input.placeholder.costType",
                                              })}
                                              isDisabled
                                            />
                                          </FormGroup>
                                        </Col>
                                        <Col>
                                          <FormGroup>
                                            <NumberFormat
                                              fixedDecimalScale={true}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              className={`${
                                                !billItem.price
                                                  ? "is-invalid "
                                                  : ""
                                              } form-control`}
                                              decimalScale={2}
                                              inputMode="numeric"
                                              allowNegative={false}
                                              allowLeadingZeros={false}
                                              // isAllowed={values => {
                                              //   const { formattedValue, floatValue } = values;
                                              //   return formattedValue === "" || floatValue <= 10000;
                                              // }}
                                              value={
                                                billItem.price || undefined
                                              }
                                              onValueChange={(values) => {}}
                                              placeholder="€"
                                              prefix="€ "
                                              disabled
                                            />
                                          </FormGroup>
                                        </Col>
                                        <span className="my-2">X</span>
                                        <Col>
                                          <FormGroup>
                                            <NumericInput
                                              type="number"
                                              min={1}
                                              max={100}
                                              className="form-control"
                                              placeholder={intl.formatMessage({
                                                id:
                                                  "components.input.placeholder.unitQuantity",
                                              })}
                                              value={billItem.quantity || 1}
                                              onChange={(value) => {}}
                                              disabled
                                            />
                                          </FormGroup>
                                        </Col>
                                        <span className="my-2">=</span>
                                        <Col>
                                          <NumberFormat
                                            fixedDecimalScale={true}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            displayType="text"
                                            className="form-control border-0"
                                            decimalScale={2}
                                            placeholder={intl.formatMessage({
                                              id:
                                                "components.input.placeholder.totalPrice",
                                            })}
                                            inputMode="numeric"
                                            allowNegative={false}
                                            allowLeadingZeros={false}
                                            value={
                                              billItem.price &&
                                              billItem.quantity
                                                ? parseFloat(billItem.price) *
                                                  billItem.quantity
                                                : ""
                                            }
                                            prefix="€ "
                                            disabled
                                          />
                                        </Col>
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </FormGroup>
                        )}
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </Collapse>
            </React.Fragment>
          );
        },
      )}
      <ModalGateway>
        {modalIsOpenImages ? (
          <Modal onClose={toggleModalImages}>
            <Carousel views={modalSourceImages} />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
}

export default memo(ViewUnit);
