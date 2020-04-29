import React, { useState } from "react";
import {
  map,
  filter,
  cloneDeep,
  find,
  findIndex,
  sumBy,
  forEach,
  xor,
  maxBy,
  get,
} from "lodash";
import update from "react-addons-update";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Button,
  ListGroup,
  ListGroupItem,
  FormGroup,
  Input,
} from "reactstrap";
import NumericInput from "react-numeric-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import uuid from "uuid";
import "./styles.scss";

function UnitsAndSubUnitsTab({ units, setUnits, location, orderByPosition, intl }) {
  const [accordion, setAccordion] = useState([false, false, false]);
  // const [units, setUnits] = useState([]);
  const [formInput, setFormInput] = useState({});
  const [selectedUnitIdRemove, setUnitIdRemove] = useState("");
  const [selectedUnit, setSelectedUnit] = useState({});
  const [unitEdit, setUnitEdit] = useState({});
  const [nodesToggle, setNodesToggle] = useState([]);

  const toggleAccordion = (tab) => {
    accordion[tab] = accordion[tab] || false;
    const newAccor = accordion.map((x, index) => (tab === index ? !x : x));
    setAccordion(newAccor);
  };

  const setValueKeyInput = (key, value = "") => {
    let newForm = cloneDeep(formInput);
    newForm[key] = value;
    setFormInput(newForm);
  };
  
  const handleAddUnit = (name = "", maxOccupants = 0, parentId) => {
    if (!name.trim()) return;
    //get max position of list unit
    let maxPosition = get(
      maxBy(
        filter(units, (item) => {
          if (parentId) {
            return item.parent === parentId;
          }
          return !item.parent;
        }),
        "position",
      ),
      "position",
      0,
    );
    let newUnit = {
      _id: uuid(), // fake id to update or delete make tree
      name: name.trim(),
      maxOccupants: maxOccupants,
      position: maxPosition + 1,
      parent: parentId || null,
    };
    let unitsData = [...units, newUnit];
    setUnits(unitsData);
  };

  const handleChangeOccupantsUnit = (unitId, valueAsNumber) => {
    let indexOfUnit = findIndex(units, (item) => item._id === unitId);
    if (indexOfUnit > -1) {
      let unitSelectedEdit = units[indexOfUnit];
      let dataUnit = update(units, {
        [indexOfUnit]: {
          maxOccupants: { $set: parseInt(valueAsNumber) },
        },
      });
      const updateOccupantUnitParent = (parentId) => {
        let parentUnitEditIndex = findIndex(
          dataUnit,
          (item) => item._id === parentId,
        );
        if (parentUnitEditIndex > -1) {
          dataUnit = update(dataUnit, {
            [parentUnitEditIndex]: {
              maxOccupants: {
                $set: parseInt(
                  sumBy(
                    filter(
                      dataUnit,
                      (item) => item.parent === parentId && !item.hidden,
                    ),
                    (item) => item.maxOccupants,
                  ),
                ),
              },
            },
          });
          if (units[parentUnitEditIndex] && units[parentUnitEditIndex].parent) {
            updateOccupantUnitParent(units[parentUnitEditIndex].parent);
          }
        }
      };
      // auto update parent maxOccupants
      if (unitSelectedEdit.parent) {
        updateOccupantUnitParent(unitSelectedEdit.parent);
      }
      setUnits(dataUnit);
    }
  };

  const hanndleChangeValueUnit = (unitId, value) => {
    let indexOfUnit = findIndex(units, (item) => item._id === unitId);
    if (indexOfUnit > -1) {
      let dataUnit = update(units, {
        [indexOfUnit]: {
          name: { $set: value },
        },
      });
      setUnits(dataUnit);
    }
  };

  // Handle add unit when press enter
  const handleKeyPressInput = (
    target,
    { keyName = "", maxOccupants = 0, parentId },
  ) => {
    if (
      target.charCode === 13 &&
      formInput[keyName] &&
      formInput[keyName].trim()
    ) {
      handleAddUnit(formInput[keyName], maxOccupants, parentId);
      setValueKeyInput(keyName);
    }
  };

  const handleKeyPressInputClose = (target) => {
    if (target.charCode === 13) {
      setUnitEdit({});
    }
  };

  const handleCheckRemoveUnit = (unitId) => {
    let removed = false;
    let subUnitWithInspection = find(
      units,
      (unitItem) => unitItem.parent === unitId && unitItem.count,
    );
    if (!subUnitWithInspection) {
      removed = true;
    }
    return removed;
  };

  const toggleAccordionSubUnit = (unitId) => {
    let newArray = xor(nodesToggle, [unitId]);
    setNodesToggle(newArray);
  };

  /**
   
    remove node
    none node id || (count === 0 && none child) -> action remove node and deep child node
      else
        node count ===1 -> inactive node and child all node 
        else { none relateion inspection
              none child count == 1 && none child status false {
                action remove node and deep child node
              } else {
                  inactive node and child all node
              }
        }

   */
  const handleRemoveNodeUnit = (unitNode) => {
    let unitsClone = cloneDeep(units);
    unitNode = cloneDeep(unitNode);
    const removeNodeAndChild = (node) => {
      if (node.id) {
        let findIndexUnit = findIndex(
          unitsClone,
          (unitItem) => unitItem._id === node._id,
        );
        if (findIndexUnit > -1) {
          unitsClone[findIndexUnit].delete = true;
          if (node.count !== 1) {
            unitsClone[findIndexUnit].hidden = true;
          }
        }
      } else {
        unitsClone = filter(unitsClone, (item) => item._id !== node._id);
      }
      if (find(unitsClone, (item) => item.parent === node._id)) {
        forEach(
          filter(unitsClone, (item) => item.parent === node._id),
          (item) => removeNodeAndChild(item),
        );
      } else {
        return;
      }
    };

    /**
     * Handle when click checkbox of tree dropdown
     * @param node Node of tree select
     * @param delete Status of unit/sub to delete when
     * @param status Status of hidden GUI when remove
     * @param id ID of unit/sub-unit exited system: Remove status or delete
     * @param count values [0,1] unit/sub-unit have related to inspection. 1: Just update status hidden, don't allow remove
     */
    const inActiveNodeAndChild = (node) => {
      if (node.id) {
        let findIndexUnit = findIndex(
          unitsClone,
          (unitItem) => unitItem._id === node._id,
        );
        if (findIndexUnit > -1) {
          unitsClone[findIndexUnit].delete = true;
          unitsClone[findIndexUnit].status = false;
        }
      } else {
        unitsClone = filter(unitsClone, (item) => item._id !== node._id);
      }
      if (find(unitsClone, (item) => item.parent === node._id)) {
        forEach(
          filter(unitsClone, (item) => item.parent === node._id),
          (item) => inActiveNodeAndChild(item),
        );
      } else {
        return;
      }
    };
    if (
      !unitNode.id ||
      (unitNode.count === 0 &&
        !find(unitsClone, (item) => item.parent === unitNode._id))
    ) {
      removeNodeAndChild(unitNode);
    } else {
      if (unitNode.count === 1) {
        inActiveNodeAndChild(unitNode);
      } else {
        if (
          !find(
            unitsClone,
            (item) =>
              item.parent === unitNode._id &&
              (item.count === 1 || !item.status),
          )
        ) {
          removeNodeAndChild(unitNode);
        } else {
          inActiveNodeAndChild(unitNode);
        }
      }
    }
    setSelectedUnit({});

    const updateOccupantUnitParent = (unitId) => {
      let parentUnitEditIndex = findIndex(
        unitsClone,
        (item) => item._id === unitId,
      );
      if (parentUnitEditIndex > -1) {
        unitsClone = update(unitsClone, {
          [parentUnitEditIndex]: {
            maxOccupants: {
              $set: parseInt(
                sumBy(
                  filter(
                    unitsClone,
                    (item) => item.parent === unitId && !item.hidden,
                  ),
                  (item) => item.maxOccupants,
                ),
              ),
            },
          },
        });
      }
      // if (parentUnitEditIndex.parent) {
      //   updateOccupantUnitParent(parentUnitEditIndex.parent);
      // }
    };

    if (unitNode.parent) {
      updateOccupantUnitParent(unitNode.parent);
    }

    setUnits(unitsClone);
  };

  const _renderSubUnit = (
    unitItem,
    idx,
    lastedNode = false,
    openCollaspe = false,
  ) => {
    return (
      <Collapse
        isOpen={openCollaspe}
        // data-parent="#accordion"
        // id="collapseOne"
        aria-labelledby="headingOne"
        className="border-0"
      >
        <CardBody className="pb-0 pt-0 pr-0">
          <ListGroup className="todo-list-wrapper">
            {map(
              orderByPosition(
                filter(
                  units,
                  (item) => item.parent === unitItem._id && !item.hidden,
                ),
              ),
              (childUnit, index) => {
                return (
                  <ListGroupItem
                    key={`parent-${idx}-sub-${index}`}
                    className={`border-0 pb-0 pt-0 pr-0 ${
                      childUnit.id && !childUnit.status
                        ? "inactive-sub-unit"
                        : ""
                    }`}
                  >
                    <div className="widget-content p-0">
                      <div
                        className={`widget-content-wrapper pt-1 pb-1 pl-3 pr-0 sub-unit-child ${
                          selectedUnit &&
                          selectedUnit._id === childUnit._id &&
                          "active"
                        }`}
                        onClick={() => setSelectedUnit(childUnit)}
                      >
                        {!lastedNode ? (
                          <div className="widget-heading">
                            <Button
                              block
                              color={
                                find(
                                  nodesToggle,
                                  (nodeItem) => nodeItem === childUnit._id,
                                )
                                  ? "link"
                                  : ""
                              }
                              className="text-left m-0 p-0 d-flex align-items-center"
                              onClick={() => {
                                toggleAccordionSubUnit(childUnit._id);
                                setUnitIdRemove("");
                                setSelectedUnit(childUnit);
                              }}
                              aria-expanded={
                                find(
                                  nodesToggle,
                                  (nodeItem) => nodeItem === childUnit._id,
                                )
                                  ? true
                                  : false
                              }
                              aria-controls="collapseOne"
                            >
                              <FontAwesomeIcon
                                icon={
                                  find(
                                    nodesToggle,
                                    (nodeItem) => nodeItem === childUnit._id,
                                  )
                                    ? faChevronDown
                                    : faChevronUp
                                }
                                className="mr-4"
                              />
                              {unitEdit && unitEdit._id === childUnit._id ? (
                                <Input
                                  autoFocus
                                  onBlur={() => setUnitEdit({})}
                                  onKeyPress={(target) =>
                                    handleKeyPressInputClose(target)
                                  }
                                  value={childUnit.name}
                                  onChange={({ target }) =>
                                    hanndleChangeValueUnit(
                                      childUnit._id,
                                      target.value,
                                    )
                                  }
                                />
                              ) : (
                                <div className="font-weight-muli-bold">
                                  {childUnit.name}
                                </div>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="widget-content-left">
                            {unitEdit && unitEdit._id === childUnit._id ? (
                              <Input
                                autoFocus
                                onBlur={() => setUnitEdit({})}
                                onKeyPress={(target) =>
                                  handleKeyPressInputClose(target)
                                }
                                value={childUnit.name}
                                onChange={({ target }) =>
                                  hanndleChangeValueUnit(
                                    childUnit._id,
                                    target.value,
                                  )
                                }
                              />
                            ) : (
                              <div className="widget-heading">
                                {childUnit.name}
                              </div>
                            )}
                          </div>
                        )}
                        {childUnit.id && !childUnit.status ? null : unitEdit &&
                          unitEdit._id ===
                            childUnit._id ? null : selectedUnitIdRemove &&
                          selectedUnitIdRemove === childUnit._id ? (
                          <div className="widget-content-right widget-content-actions">
                            <Button
                              className="border-0 p-2 btn-transition"
                              outline
                              color=""
                              onClick={() => setUnitIdRemove("")}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="border-0 p-2 btn-transition"
                              outline
                              autoFocus
                              color="red"
                              onClick={() => handleRemoveNodeUnit(childUnit)}
                            >
                              {!childUnit.id ||
                              (handleCheckRemoveUnit(childUnit.id || "") &&
                                !childUnit.count) ? (
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  color="red"
                                  className="btn-icon-remove"
                                />
                              ) : (
                                <span className="color-inactive">Inactive</span>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="widget-content-right widget-content-actions">
                            <Button
                              className="border-0 p-2 btn-transition"
                              outline
                              color=""
                              onClick={() => setUnitEdit(childUnit)}
                            >
                              <i className="eeac-icon eeac-icon-pencil"></i>
                            </Button>
                            <Button
                              className="border-0 p-2 btn-transition"
                              outline
                              color=""
                              onClick={() => setUnitIdRemove(childUnit._id)}
                            >
                              <i className="eeac-icon eeac-icon-close"></i>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {!lastedNode &&
                      _renderSubUnit(
                        childUnit,
                        index,
                        true,
                        find(
                          nodesToggle,
                          (nodeItem) => nodeItem === childUnit._id,
                        )
                          ? true
                          : false,
                      )}
                  </ListGroupItem>
                );
              },
            )}

            {/* Button add sub */}
            {unitItem.id && !unitItem.status ? null : (
              <ListGroupItem className="border-0 pb-0 pt-0 pr-0">
                <FormGroup inline className="d-flex mb-2 mt-2">
                  <Button
                    color="link"
                    className="btn-icon btn-icon-only mr-2"
                    type="button"
                    onClick={() => {
                      if (
                        formInput[`sub-unit-${unitItem._id}`] &&
                        formInput[`sub-unit-${unitItem._id}`].trim()
                      ) {
                        handleAddUnit(
                          formInput[`sub-unit-${unitItem._id}`],
                          0,
                          unitItem._id,
                        );
                        setValueKeyInput(`sub-unit-${unitItem._id}`);
                      }
                    }}
                  >
                    <i className="eeac-icon eeac-icon-plus"></i>
                  </Button>
                  <Input
                    type="text"
                    value={formInput[`sub-unit-${unitItem._id}`] || ""}
                    onChange={({ target }) => {
                      setValueKeyInput(
                        `sub-unit-${unitItem._id}`,
                        target.value,
                      );
                    }}
                    onKeyPress={(event) =>
                      handleKeyPressInput(event, {
                        keyName: `sub-unit-${unitItem._id}`,
                        maxOccupants: 0,
                        parentId: unitItem._id,
                      })
                    }
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.newSubUnit",
                    })}
                  />
                </FormGroup>
              </ListGroupItem>
            )}
          </ListGroup>
        </CardBody>
      </Collapse>
    );
  };

  return (
    <Container fluid>
      <Card className="main-card mb-3">
        <CardHeader>
          <Container fluid>
            <Row>
              <Col md="5">
                {intl.formatMessage({
                  id: "components.formTitle.unitAndSubUnit",
                })}
              </Col>
              <Col md="7">
                {intl.formatMessage({ id: "components.formTitle.detailsOf" })}{" "}
                {selectedUnit && selectedUnit.name ? selectedUnit.name : ""}
              </Col>
            </Row>
          </Container>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="5">
              <div id="accordion" className="accordion-wrapper mb-3 border-0">
                {map(
                  orderByPosition(
                    filter(
                      units,
                      (item) =>
                        !item.parent &&
                        (!item.id ||
                          (item.id && !item.status) ||
                          (item.id && !item.delete)),
                    ),
                  ),
                  (unitItem, idx) => {
                    return (
                      <Card key={`parent-${idx}`}>
                        <CardHeader
                          className="border-0 pb-1 pt-1 pr-0"
                          id="headingOne"
                        >
                          <ListGroup className="todo-list-wrapper flex-grow-1">
                            <ListGroupItem
                              className={`border-0 p-0 ${
                                unitItem.id && !unitItem.status
                                  ? "inactive-unit"
                                  : ""
                              }`}
                            >
                              <div className="widget-content p-0">
                                <div className="widget-content-wrapper">
                                  <div className="widget-content-left">
                                    <div className="widget-heading">
                                      <Button
                                        block
                                        color={accordion[idx] ? "link" : ""}
                                        className="text-left m-0 p-0 d-flex align-items-center"
                                        onClick={() => {
                                          toggleAccordion(idx);
                                          setUnitIdRemove("");
                                          setSelectedUnit(unitItem);
                                        }}
                                        aria-expanded={accordion[idx]}
                                        aria-controls="collapseOne"
                                      >
                                        <FontAwesomeIcon
                                          icon={
                                            accordion[idx]
                                              ? faChevronDown
                                              : faChevronUp
                                          }
                                          className="mr-4"
                                        />
                                        {unitEdit &&
                                        unitEdit._id === unitItem._id ? (
                                          <Input
                                            autoFocus
                                            onBlur={() => setUnitEdit({})}
                                            onKeyPress={(target) =>
                                              handleKeyPressInputClose(target)
                                            }
                                            value={unitItem.name}
                                            onChange={({ target }) =>
                                              hanndleChangeValueUnit(
                                                unitItem._id,
                                                target.value,
                                              )
                                            }
                                          />
                                        ) : (
                                          <div className="font-weight-muli-bold">
                                            {unitItem.name}
                                          </div>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                  {// hieend when status false or update location level 1 location unit
                                  (unitItem.id && !unitItem.status) ||
                                  (location &&
                                    location._id) ? null : unitEdit &&
                                    unitEdit._id ===
                                      unitItem._id ? null : selectedUnitIdRemove &&
                                    selectedUnitIdRemove === unitItem._id ? (
                                    <div className="widget-content-right widget-content-actions d-flex">
                                      <Button
                                        className="border-0 p-2 btn-transition"
                                        outline
                                        color=""
                                        onClick={() => setUnitIdRemove("")}
                                      >
                                        {" "}
                                        Cancel
                                      </Button>
                                      <Button
                                        className="border-0 p-2 btn-transition"
                                        outline
                                        autoFocus
                                        color="red"
                                        // onClick={() => handleRemoveUnit(unitItem._id)}
                                        onClick={() =>
                                          handleRemoveNodeUnit(unitItem)
                                        }
                                      >
                                        {!unitItem.id ||
                                        (handleCheckRemoveUnit(
                                          unitItem.id || "",
                                        ) &&
                                          !unitItem.count) ? (
                                          <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            color="red"
                                            className="btn-icon-remove"
                                          />
                                        ) : (
                                          <span className="color-inactive">
                                            Inactive
                                          </span>
                                        )}
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="widget-content-right widget-content-actions">
                                      <Button
                                        className="border-0 p-2 btn-transition"
                                        outline
                                        color=""
                                        onClick={() => setUnitEdit(unitItem)}
                                      >
                                        <i className="eeac-icon eeac-icon-pencil"></i>
                                      </Button>
                                      <Button
                                        className="border-0 p-2 btn-transition"
                                        outline
                                        color=""
                                        onClick={() =>
                                          setUnitIdRemove(unitItem._id)
                                        }
                                      >
                                        <i className="eeac-icon eeac-icon-close"></i>
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </ListGroupItem>
                          </ListGroup>
                        </CardHeader>
                        {_renderSubUnit(
                          unitItem,
                          idx,
                          location && location._id ? false : true,
                          accordion[idx],
                        )}
                      </Card>
                    );
                  },
                )}
              </div>
              {location && location._id ? null : (
                <FormGroup inline className="d-flex mt-3">
                  <Button
                    color="link"
                    className="btn-icon btn-icon-only mr-2"
                    type="button"
                    onClick={() => {
                      if (formInput["root"] && formInput["root"].trim()) {
                        handleAddUnit(formInput["root"]);
                        setValueKeyInput("root");
                      }
                    }}
                  >
                    <i className="eeac-icon eeac-icon-plus"></i>
                  </Button>
                  <Input
                    type="text"
                    value={formInput["root"] || ""}
                    onChange={({ target }) => {
                      setValueKeyInput("root", target.value);
                    }}
                    onKeyPress={(event) =>
                      handleKeyPressInput(event, { keyName: "root" })
                    }
                    placeholder={intl.formatMessage({
                      id: "components.input.placeholder.newUnit",
                    })}
                  />
                </FormGroup>
              )}
            </Col>
            <Col md="7">
              {selectedUnit && selectedUnit._id && (
                <Card className="border-0 shadow-none">
                  <CardBody className="d-flex align-items-center">
                    <p className="mb-0 mr-4">
                      {intl.formatMessage({
                        id: "pages.location.maximumOccupants",
                      })}
                      :{" "}
                    </p>
                    <NumericInput
                      className="form-control"
                      disabled={
                        (!selectedUnit.parent && location._id) ||
                        (selectedUnit.id && !selectedUnit.status) ||
                        find(units, (item) => item.parent === selectedUnit._id)
                      }
                      min={0}
                      value={
                        !selectedUnit.parent && location._id
                          ? parseInt(
                              sumBy(
                                filter(
                                  units,
                                  (item) =>
                                    item.parent === selectedUnit._id &&
                                    !item.hidden,
                                ),
                                (item) => item.maxOccupants,
                              ),
                            )
                          : (
                              find(
                                units,
                                (item) => item._id === selectedUnit._id,
                              ) || {}
                            ).maxOccupants || 0
                      }
                      max={100}
                      onChange={(valueAsNumber) =>
                        handleChangeOccupantsUnit(
                          selectedUnit._id,
                          parseInt(valueAsNumber),
                        )
                      }
                    />
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
}

export default UnitsAndSubUnitsTab;
