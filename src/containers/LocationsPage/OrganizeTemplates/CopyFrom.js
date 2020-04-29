/**
 *
 * Modal Reset Password
 *
 */
import React, { memo, useState } from "react";
import {
  Button,
  CardBody,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
  Collapse,
  CustomInput,
  FormGroup,
} from "reactstrap";
import { map, isEmpty, filter, orderBy } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage } from "react-intl";
import ReactSelectLazy from "components/ReactSelectLazy";
function CopyFrom({
  intl,
  selectedLocation,
  toggleCheckUnit,
  unitIds,
  setUnitIdsFrom,
  fetchDataAsync,
}) {
  const [accordion, setAccordion] = useState([false, false, false]);
  const [accordion2, setAccordion2] = useState([false, false, false]);
  const [locationFrom, setLocationFrom] = useState(selectedLocation);

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

  return (
    <Card className="form-copy-from">
      <div className="title-form">
        <h5 className="mt-3 ml-3">
          <FormattedMessage id="pages.inspectionTemplate.copyFrom" />
        </h5>
      </div>
      <CardBody className="px-0">
        <FormGroup className="px-3">
          <ReactSelectLazy
            intl={intl}
            value={locationFrom}
            placeholder={
              <FormattedMessage id="components.input.placeholder.locationIdentifier" />
            }
            noOptionsMessage={() => (
              <FormattedMessage id="components.select.noOption" />
            )}
            onChange={(val) => {
              if (val._id !== locationFrom._id) {
                val.units = orderBy(
                  val.units,
                  [(item) => item.position || 0],
                  ["asc"],
                );
                setLocationFrom(val);
                setUnitIdsFrom([]);
              }
            }}
            defaultOptions={[]}
            fetchDataAsync={fetchDataAsync}
          />
        </FormGroup>
        <div className="accordion-wrapper border-0">
          {!isEmpty(locationFrom)
            ? map(
                filter(locationFrom.units, (item) => !item.parent),
                (unitParent, parentId) => {
                  return (
                    <Card key={"unitParent" + parentId} className="border-0">
                      <CardHeader
                        className="border-0 pb-1 pt-1 pr-0"
                        id="headingFromOne"
                      >
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
                                        toggleAccordion(parentId);
                                      }}
                                      aria-expanded={accordion[parentId]}
                                      aria-controls="collapseFromOne"
                                    >
                                      <FontAwesomeIcon
                                        icon={
                                          accordion[parentId]
                                            ? faChevronDown
                                            : faChevronUp
                                        }
                                        className="mr-4"
                                      />
                                      <div className="font-weight-muli-bold">
                                        {unitParent.name}
                                      </div>
                                    </Button>
                                  </div>
                                </div>

                                <div className="widget-content-right">
                                  <CustomInput
                                    type="checkbox"
                                    id={`unitFrom${unitParent._id}`}
                                    label="&nbsp;"
                                    checked={unitIds.includes(unitParent._id)}
                                    onChange={(val) =>
                                      toggleCheckUnit(unitParent._id)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </ListGroupItem>
                        </ListGroup>
                      </CardHeader>

                      <Collapse
                        isOpen={accordion[parentId]}
                        id="collapseFromOne"
                        className="border-0"
                      >
                        <CardBody className="pb-0 pt-0 pr-0">
                          <ListGroup
                            className="todo-list-wrapper"
                            id="accordionFrom2"
                          >
                            {map(
                              filter(
                                locationFrom.units,
                                (item) =>
                                  item.parent === unitParent._id && item.status,
                              ),
                              (unitItem, unitIndex) => {
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
                                              // color={
                                              //   accordion2[unitIndex] ? "link" : ""
                                              // }
                                              color=""
                                              className="text-left m-0 p-0 d-flex align-items-center"
                                              onClick={() => {
                                                toggleAccordion2(unitIndex);
                                              }}
                                              aria-expanded={
                                                accordion2[unitIndex]
                                              }
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
                                            id={`unitFrom${unitItem._id}`}
                                            label="&nbsp;"
                                            checked={unitIds.includes(
                                              unitItem._id,
                                            )}
                                            onChange={(val) =>
                                              toggleCheckUnit(unitItem._id)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <Collapse
                                      isOpen={accordion2[unitIndex]}
                                      data-parent="#accordion2"
                                      aria-labelledby="headingOne"
                                      id={"collapseChildFrom" + unitIndex}
                                      className="border-0"
                                    >
                                      <ListGroup>
                                        {map(
                                          filter(
                                            locationFrom.units,
                                            (item) =>
                                              item.parent === unitItem._id &&
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
                                                        id={`unitFrom${childUnit._id}`}
                                                        label="&nbsp;"
                                                        checked={unitIds.includes(
                                                          childUnit._id,
                                                        )}
                                                        onChange={(val) =>
                                                          toggleCheckUnit(
                                                            childUnit._id,
                                                          )
                                                        }
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
                  );
                },
              )
            : null}
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(CopyFrom);
