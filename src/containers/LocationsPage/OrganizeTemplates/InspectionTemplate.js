import React, { useState, useEffect } from "react";
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
  CardTitle,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { locationActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";
import { map, filter, isEmpty, get, maxBy } from "lodash";
import { FormattedMessage, injectIntl } from "react-intl";
// ###
import CopyTemplateModal from "./CopyTemplateModal";
import Utils from "../../../utilities/utils";

import ReactSelectLazy from "components/ReactSelectLazy";
// Service
import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";

function InspectionTemplate({ intl }) {
  const { orderByPosition } = Utils;
  const dispatch = useDispatch();

  const [accordion, setAccordion] = useState([]);
  const [accordion2, setAccordion2] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [inspectionInput, setInspectionInput] = useState("");
  const [isOpenCopyTemplateModal, setIsOpenCopyTemplateModal] = useState(false);

  const locationReducer = useSelector((state) => state.location);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);

  const {
    unit,
    unitSelectedTemaplate,
    isAddInspectionSubmitting,
    fetchingUnitPoint,
  } = locationReducer;
  const selectedUnit = selectedLocation._id ? unitSelectedTemaplate : {};
  const selectedUnitId = selectedUnit._id || "";
  const setSelectedUnit = (unitData) => {
    dispatch(locationActions.addSelectedUnit(unitData));
  };

  useEffect(() => {
    if (selectedUnitId && unit && unit._id === selectedUnitId) {
      setSelectedUnit(unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, selectedUnitId]);

  const onHandleCopyTemplate = () => {
    setIsOpenCopyTemplateModal(!isOpenCopyTemplateModal);
  };

  const selectLocation = (location) => {

    if (location._id === selectedLocation._id) {
      return;
    }
    location.locationIdentifer = location.label;
    location.units = orderByPosition(location.units);

    setSelectedLocation(location);

    dispatch(locationActions.resetUnitStatusRequest()); // Reset all fetching status
    //reset form unit
    setSelectedUnit({});
    setAccordion([]);
    setAccordion2([]);
    
  };

  const toggleAccordion = (tab) => {
    accordion[tab] = accordion[tab] || false;
    const newAccor = accordion.map((x, index) => (tab === index ? !x : x));
    setAccordion(newAccor);
  };

  const toggleAccordion2 = (tab) => {
    accordion2[tab] = accordion2[tab] || false;
    const newAccor = accordion2.map((x, index) => (tab === index ? !x : x));
    setAccordion2(newAccor);
  };
  /**
   * Get inspection points by unit selected
   * @param {*} unitId ObjectId
   */
  const getUnit = (unitId) => {
    // Add status request get unit points
    dispatch(locationActions.getUnitStatusRequest({ [unitId]: true }));
    dispatch(locationActions.getUnit(unitId));
  };

  const removeInspection = (itemId) => {
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(locationActions.removePointUnit(itemId));
  };

  const removeAllInspection = (unitId) => {
    if (!selectedUnit.inspectiontemplates.length) {
      return;
    }
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(locationActions.removeAllInspectionByUnitId(unitId));
  };

  const addInspection = (unitId) => {
    if (isAddInspectionSubmitting || !inspectionInput.trim()) {
      return;
    }
    const { inspectiontemplates } = selectedUnit;
    const position =
      get(maxBy(inspectiontemplates, "position"), "position", 0) + 1;
    const newItem = {
      unitInspection: unitId,
      itemDescription: inspectionInput.trim(),
      position: position,
    };
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(locationActions.addInspection(newItem));
    setInspectionInput("");
  };
  const handleChange = (event) => {
    setInspectionInput(event.target.value);
  };

  return (
    <Container fluid>
      <Card className="main-card mb-3">
        <CardBody>
          <Row>
            <Col md="4">
              <div className="mb-3">
                <ReactSelectLazy
                  intl={intl}
                  value={selectedLocation}
                  placeholder={
                    <FormattedMessage id="components.input.placeholder.locationIdentifier" />
                  }
                  noOptionsMessage={() =>
                    intl.formatMessage({ id: "components.select.noOption" })
                  }
                  onChange={(val) => {
                    selectLocation(val);
                  }}
                  defaultOptions={[]}
                  fetchDataAsync={fetchDataLocationAsync}
                />
              </div>
              <div id="accordion" className="accordion-wrapper mb-3 border-0">
                {!isEmpty(selectedLocation)
                  ? map(
                      filter(selectedLocation.units, (item) => !item.parent),
                      (unitParent, parentIndex) => {
                        if (accordion[parentIndex] === undefined)
                          accordion[parentIndex] = true;
                        if (!unitParent.inspections)
                          unitParent.inspections = [];
                        return (
                          <Card
                            key={"unitParent" + parentIndex}
                            className="border-0"
                          >
                            <CardHeader
                              className="border-0 pb-1 pt-1 pr-0"
                              id="headingOne"
                            >
                              <ListGroup className="todo-list-wrapper flex-grow-1">
                                <ListGroupItem className="border-0 p-0">
                                  <div className="widget-content p-0">
                                    <div className="widget-content-wrapper">
                                      <div className="widget-content-left">
                                        <div className="widget-heading">
                                          <Button
                                            block
                                            color={
                                              unitParent._id === selectedUnitId
                                                ? "link"
                                                : ""
                                            }
                                            className="text-left m-0 p-0 d-flex align-items-center text-decoration-none btn-select-unit"
                                            aria-expanded={
                                              accordion[parentIndex]
                                            }
                                            aria-controls="collapseOne"
                                          >
                                            <FontAwesomeIcon
                                              icon={
                                                accordion[parentIndex]
                                                  ? faChevronDown
                                                  : faChevronUp
                                              }
                                              onClick={() => {
                                                toggleAccordion(parentIndex);
                                              }}
                                              className="mr-4 icon"
                                            />
                                            <div
                                              className="font-weight-muli-bold name-unit"
                                              onClick={() => {
                                                setSelectedUnit(unitParent);
                                                getUnit(unitParent._id);
                                              }}
                                            >
                                              {unitParent.name}
                                            </div>
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </ListGroupItem>
                              </ListGroup>
                            </CardHeader>

                            <Collapse
                              isOpen={accordion[parentIndex]}
                              data-parent="#accordion"
                              id="collapseOne"
                              aria-labelledby="headingOne"
                              className="border-0"
                            >
                              <CardBody className="pb-0 pt-0 pr-0">
                                <ListGroup
                                  className="todo-list-wrapper"
                                  id="accordion2"
                                >
                                  {map(
                                    filter(
                                      selectedLocation.units,
                                      (item) =>
                                        item.parent === unitParent._id &&
                                        item.status,
                                    ),
                                    (unitItem, unitIndex) => {
                                      if (accordion2[unitIndex] === undefined)
                                        accordion2[unitIndex] = true;
                                      if (!unitItem.inspections)
                                        unitItem.inspections = [];
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
                                                    color={
                                                      unitItem._id ===
                                                      selectedUnitId
                                                        ? "link"
                                                        : ""
                                                    }
                                                    className="text-left m-0 p-0 d-flex align-items-center text-decoration-none btn-select-unit"
                                                    aria-expanded={
                                                      accordion2[unitIndex]
                                                    }
                                                    aria-controls={
                                                      "collapseChild" +
                                                      unitIndex
                                                    }
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={
                                                        accordion2[unitIndex]
                                                          ? faChevronDown
                                                          : faChevronUp
                                                      }
                                                      className="mr-4 icon"
                                                      onClick={() => {
                                                        toggleAccordion2(
                                                          unitIndex,
                                                        );
                                                      }}
                                                    />
                                                    <div
                                                      className="font-weight-muli-bold name-unit"
                                                      onClick={() => {
                                                        setSelectedUnit(
                                                          unitItem,
                                                        );
                                                        getUnit(unitItem._id);
                                                      }}
                                                    >
                                                      {unitItem.name}
                                                    </div>
                                                  </Button>
                                                </div>
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
                                                  (item) =>
                                                    item.parent ===
                                                      unitItem._id &&
                                                    item.status,
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
                                                          className={`widget-content-wrapper pt-2 pb-2 pl-3 pr-0 btn-select-unit ${
                                                            childUnit._id ===
                                                              selectedUnitId &&
                                                            "active"
                                                          }`}
                                                        >
                                                          <div className="widget-content-left">
                                                            <div
                                                              className="widget-heading name-unit"
                                                              onClick={() => {
                                                                setSelectedUnit(
                                                                  childUnit,
                                                                );
                                                                getUnit(
                                                                  childUnit._id,
                                                                );
                                                              }}
                                                            >
                                                              {childUnit.name}
                                                            </div>
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
                        );
                      },
                    )
                  : null}
              </div>
            </Col>
            {!isEmpty(selectedUnit) ? (
              <Col md="8">
                <FormGroup
                  row
                  className="d-flex align-items-center justify-content-end mb-0 pr-3"
                >
                  <Button
                    color="primary"
                    type="button"
                    onClick={onHandleCopyTemplate}
                  >
                    <FormattedMessage id="components.button.copyTemplate" />
                  </Button>
                  <Button
                    color="secondary"
                    type="button"
                    className="ml-3"
                    onClick={() => removeAllInspection(selectedUnit._id)}
                  >
                    <FormattedMessage id="components.button.clearAll" />
                  </Button>
                </FormGroup>

                <Card className="main-card mb-3 border-0 shadow-none mt-4">
                  <CardTitle className="border-0 ">
                    <FormattedMessage id="pages.inspectionTemplate.inspectionPointsFor" />{" "}
                    {selectedUnit.name}
                  </CardTitle>
                  <CardBody className="p-0">
                    {fetchingUnitPoint[selectedUnit._id] ? (
                      <div className="w-100 text-center mt-5">
                        <div
                          className="spinner-border text-light"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <ListGroup>
                        {selectedUnit.inspectiontemplates
                          ? map(
                              orderByPosition(selectedUnit.inspectiontemplates),
                              (item, i) => {
                                return (
                                  <ListGroupItem
                                    key={"inspection" + i}
                                    className="border-0 pl-0 pr-0"
                                  >
                                    <div className="d-flex align-items-center">
                                      <Button
                                        color=""
                                        className="text-left m-0 p-0"
                                        onClick={() =>
                                          removeInspection(item._id)
                                        }
                                      >
                                        <i className="eeac-icon eeac-icon-close"></i>
                                      </Button>
                                      <p className="m-0 p-0 ml-3">
                                        {item.itemDescription || ""}
                                      </p>
                                    </div>
                                  </ListGroupItem>
                                );
                              },
                            )
                          : null}
                        <ListGroupItem className="border-0 pl-0 pr-0">
                          <div className="d-flex align-items-center">
                            <Button
                              color=""
                              className="text-left m-0 p-0 mr-3"
                              onClick={() => addInspection(selectedUnit._id)}
                            >
                              <i className="eeac-icon eeac-icon-plus"></i>
                            </Button>
                            <Input
                              maxLength={250}
                              type="text"
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.newInspectionPoint",
                              })}
                              value={inspectionInput}
                              onChange={handleChange}
                              onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                  addInspection(selectedUnit._id);
                                }
                              }}
                            />
                          </div>
                        </ListGroupItem>
                      </ListGroup>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ) : null}
          </Row>
        </CardBody>
      </Card>
      {isOpenCopyTemplateModal ? (
        <CopyTemplateModal
          isOpen={isOpenCopyTemplateModal}
          onToggleOpen={onHandleCopyTemplate}
          selectedLocation={selectedLocation}
          selectedUnitId={selectedUnitId}
          fetchDataAsync={fetchDataLocationAsync}
        />
      ) : null}
    </Container>
  );
}

export default injectIntl(InspectionTemplate);
