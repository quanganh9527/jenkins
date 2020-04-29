/**
 *
 * Modal Reset Password
 *
 */
import React, { memo, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  CardBody,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
  Collapse,
  CustomInput,
} from "reactstrap";
import { map, isEmpty, filter } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

function CopyTemplateModal({ isOpen, onToggleOpen, selectedLocation, onCopyTemplate }) {

  const [accordion, setAccordion] = useState([true, false, false]);
  const [accordion2, setAccordion2] = useState([false, false, false]);
  const [locationIndex] = useState(0);
  const [unitId, setUnitIdSelected] = useState('');

  const toggleAccordion = tab => {
    const newAccor = accordion.map((x, index) => (tab === index ? !x : false));
    setAccordion(newAccor);
  };

  const toggleAccordion2 = tab => {
    const newAccor = accordion2.map((x, index) => (tab === index ? !x : false));
    setAccordion2(newAccor);
  };

  const toggleCheckUnit = (isChecked, unitId) => {
    if (isChecked) {
      setUnitIdSelected(unitId);
    } else {
      setUnitIdSelected('');
    }
  };

  const onHandleCopy = () => {
    if (!unitId) {
      return;
    }
    setTimeout(() => {
      onCopyTemplate(unitId);
    }, 500)
  };

  return (
    <Modal isOpen={isOpen} backdrop={true}>
      <ModalHeader>Copy inspection template</ModalHeader>
      <ModalBody>
        <div id="accordion" className="accordion-wrapper mb-3 border-0">
          {!isEmpty(selectedLocation) ? (
            <Card key={"location" + locationIndex} className="border-0">
              <CardHeader className="border-0 pb-1 pt-1 pr-0" id="headingOne">
                <ListGroup className="todo-list-wrapper flex-grow-1">
                  <ListGroupItem className="border-0 p-0">
                    <div className="widget-content p-0">
                      <div className="widget-content-wrapper">
                        <div className="widget-content-left">
                          <div className="widget-heading">
                            <Button
                              block
                              // color={accordion[locationIndex] ? "link" : ""}
                              color=""
                              className="text-left m-0 p-0 d-flex align-items-center"
                              onClick={() => {
                                toggleAccordion(locationIndex);
                              }}
                              aria-expanded={accordion[locationIndex]}
                              aria-controls="collapseOne"
                            >
                              <FontAwesomeIcon
                                icon={
                                  accordion[locationIndex]
                                    ? faChevronDown
                                    : faChevronUp
                                }
                                className="mr-4"
                              />
                              <div className="font-weight-muli-bold">
                                {selectedLocation.locationIdentifer}
                              </div>
                            </Button>
                          </div>
                        </div>

                        <div className="widget-content-right">
                          {/* <CustomInput
                            type="checkbox"
                            id="exampleCustomCheckbox1"
                            label="&nbsp;"
                          /> */}
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </CardHeader>

              <Collapse
                isOpen={accordion[locationIndex]}
                data-parent="#accordion"
                id="collapseOne"
                aria-labelledby="headingOne"
                className="border-0"
              >
                <CardBody className="pb-0 pt-0 pr-0">
                  <ListGroup className="todo-list-wrapper" id="accordion2">
                    {map(
                      filter(selectedLocation.units, item => !item.parent),
                      (unitItem, unitIndex) => {
                        if (!unitItem.inspections) unitItem.inspections = [];
                        return (
                          <ListGroupItem
                            key={"unit" + unitIndex}
                            className="border-0 pb-0 pt-0 pr-0"
                          >
                            <div className="widget-content p-0">
                              <div className="widget-content-wrapper pt-1 pb-1">
                                <div className="widget-content-left">
                                  <div className="widget-heading">
                                    <Button
                                      block
                                      // color={
                                      //   accordion2[unitIndex] ? "link" : ""
                                      // }
                                      color=""
                                      className="text-left m-0 p-0 d-flex align-items-center"
                                      onClick={() => {
                                        toggleAccordion2(unitIndex);
                                      }}
                                      aria-expanded={accordion2[unitIndex]}
                                      aria-controls={
                                        "collapseChild" + unitIndex
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={
                                          accordion2[unitIndex]
                                            ? faChevronDown
                                            : faChevronUp
                                        }
                                        className="mr-4"
                                      />
                                      <div className="font-weight-muli-bold">
                                        {unitItem.name}
                                      </div>
                                    </Button>
                                  </div>
                                </div>

                                <div className="widget-content-right">
                                  <CustomInput
                                    type="checkbox"
                                    id={unitItem.name + unitIndex}
                                    label="&nbsp;"
                                    checked={unitItem._id === unitId}
                                    onChange={val => toggleCheckUnit(val.target.checked, unitItem._id)}
                                  />
                                </div>
                              </div>
                            </div>
                            <Collapse
                              isOpen={accordion2[unitIndex]}
                              data-parent="#accordion2"
                              aria-labelledby="headingOne"
                              id={"collapseChild" + unitIndex}
                              className="border-0"
                            >
                              <ListGroup>
                                {map(
                                  filter(
                                    selectedLocation.units,
                                    item => item.parent === unitItem._id,
                                  ),
                                  (childUnit, index) => {
                                    if (!childUnit.inspections)
                                      childUnit.inspections = [];
                                    return (
                                      <ListGroupItem
                                        key={"subunit" + index}
                                        className="border-0 pb-0 pt-0 pr-0"
                                      >
                                        <div className="widget-content p-0">
                                          <div
                                            className={`widget-content-wrapper pt-2 pb-2 pl-3 pr-0 sub-unit-child`}
                                          >
                                            <div className="widget-content-left">
                                              <div className="widget-heading">
                                                {childUnit.name}
                                              </div>
                                            </div>

                                            <div className="widget-content-right">
                                              <CustomInput
                                                type="checkbox"
                                                id={`${childUnit.name}-${index}`}
                                                label="&nbsp;"
                                                checked={childUnit._id === unitId}
                                                onChange={val => toggleCheckUnit(val.target.checked, childUnit._id)}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </ListGroupItem>
                                    );
                                  },
                                )}
                              </ListGroup>
                            </Collapse>
                          </ListGroupItem>
                        );
                      },
                    )}
                  </ListGroup>
                </CardBody>
              </Collapse>
            </Card>
          ) : null}
        </div>

        <FormGroup className="mt-3">
          <Button color="link" onClick={onToggleOpen} type="button">
            Cancel
          </Button>
          <Button color="primary" type="button" onClick={onHandleCopy}>
            Copy
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default memo(CopyTemplateModal);
