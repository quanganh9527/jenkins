import React, { memo, useState, useEffect } from "react";
import Select from "react-select";
import NumberFormat from "react-number-format";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  CardTitle,
  Container,
  Button,
  ListGroupItem,
  Breadcrumb,
  ListGroup,
  Collapse,
  FormFeedback,
} from "reactstrap";
import { useSelector } from "react-redux";
import { forEach, filter, map, find, cloneDeep } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import ContactDetailModal from "../../LocationsPage/LocationEdit/Modal";
import { INSPECTION_ITEM_STATUS } from "../constants";
import { FormattedMessage } from "react-intl";

function ViewSummaryCleaning({
  intl,
  inspection,
  handleSetInspectionSummary,
  debtorContact,
  contacts,
  setDebtorContact,
  setContacts,
  UnitBreadcrumb,
  isSubmitting,
  inputDebtor,
  inputContacts,
  orderByPosition,
}) {
  const [unitsCollapse, setUnitsCollapse] = useState(1);
  const [selectedContact, setSelectedContact] = useState({});
  const [openMoal, setOpenMoal] = useState(false);
  const [contactDetail, setContactDetail] = useState({});

  const [totalGreen, setTotalGreen] = useState(0);
  const [totalYellow, setTotalYellow] = useState(0);
  const [totalRed, setTotalRed] = useState(0);
  const inspectionStateSummary = useSelector((state) => state.inspection);

  const { persons, groupings, debtorContacts } = inspectionStateSummary;
  const debtorContactsList = map(cloneDeep(debtorContacts), (itemDebtor) => {
    if (itemDebtor.grouping && itemDebtor.grouping._id) {
      itemDebtor.accountView = `${itemDebtor.accountView} - ${itemDebtor.grouping.name}`;
    } else if (itemDebtor.person && itemDebtor.person._id) {
      itemDebtor.accountView = `${itemDebtor.accountView} - ${
        itemDebtor.person.firstName || ""
      } ${itemDebtor.person.lastName || ""} `;
    }
    return itemDebtor;
  });
  useEffect(() => {
    let totalGreen = 0,
      totalYellow = 0,
      totalRed = 0;
    forEach(inspection.units, (unitItem) => {
      let itemGreens = filter(
        unitItem.inspectionitems,
        (item) => item.status === INSPECTION_ITEM_STATUS.GREEN,
      );
      let itemYellow = filter(
        unitItem.inspectionitems,
        (item) => item.status === INSPECTION_ITEM_STATUS.YELLOW,
      );
      let itemRed = filter(
        unitItem.inspectionitems,
        (item) => item.status === INSPECTION_ITEM_STATUS.RED,
      );
      totalGreen += itemGreens && itemGreens[0] ? itemGreens.length : 0;
      totalYellow += itemYellow && itemYellow[0] ? itemYellow.length : 0;
      totalRed += itemRed && itemRed[0] ? itemRed.length : 0;
    });
    setTotalGreen(totalGreen);
    setTotalYellow(totalYellow);
    setTotalRed(totalRed);
  }, [setTotalGreen, setTotalYellow, setTotalRed, inspection]);
  forEach(persons, (item) => {
    item.name = `${item.firstName} ${item.lastName}`;
    item.type = "person";
  });
  forEach(groupings, (item) => {
    item.type = "grouping";
  });

  const onHandleAddContact = () => {
    if (!selectedContact) {
      return;
    }
    if (selectedContact.id) {
      delete selectedContact.id;
    }
    setContacts([selectedContact, ...contacts]);
    setSelectedContact("");
  };
  const onHandleRemoveContact = (contact, index) => {
    let newContacts = contacts || [];
    if (contact.id && newContacts[index]) {
      newContacts[index].delete = true;
    } else {
      newContacts = contacts.filter((val) => val._id !== contact._id);
    }
    setContacts([...newContacts]);
  };
  const onHandleContactDetail = (contactData = {}) => {
    setOpenMoal(true);
    setContactDetail(contactData);
  };

  const onToggleOpenModal = () => {
    setOpenMoal(!openMoal);
    setContactDetail({});
  };
  const onHandleCollapseUnit = (indexConllapseUnit) => {
    if (unitsCollapse && unitsCollapse === indexConllapseUnit) {
      setUnitsCollapse(undefined);
    } else {
      setUnitsCollapse(indexConllapseUnit);
    }
  };
  const personsFilter = filter(
    persons,
    (item) =>
      !contacts ||
      contacts.length < 1 ||
      find(contacts, (contactItem) => contactItem._id !== item._id),
  );
  const groupingsFilter = filter(
    groupings,
    (item) =>
      !contacts ||
      contacts.length < 1 ||
      find(contacts, (contactItem) => contactItem._id !== item._id),
  );
  return (
    <Container>
      <Row>
        <Col>
          <CardTitle>
            <FormattedMessage id="pages.inspection.resultSummary" />
          </CardTitle>
          <Row>
            <Col md={6} className="mx-auto">
              <FormGroup row className="align-items-center">
                <Col md={3}>
                  <Label>
                    <FormattedMessage id="pages.inspection.greenResults" />:{" "}
                  </Label>
                </Col>
                <Col md={9}>
                  <Input
                    type="text"
                    placeholder="Total green results"
                    value={totalGreen}
                    disabled
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="align-items-center">
                <Col md={3}>
                  <Label>
                    <FormattedMessage id="pages.inspection.yellowResults" />:{" "}
                  </Label>
                </Col>
                <Col md={9}>
                  <Input
                    type="text"
                    placeholder="Total yellow results"
                    value={totalYellow}
                    disabled
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="align-items-center">
                <Col md={3}>
                  <Label>
                    <FormattedMessage id="pages.inspection.redResults" />:{" "}
                  </Label>
                </Col>
                <Col md={9}>
                  <Input
                    type="text"
                    placeholder="Total red results"
                    disabled
                    value={totalRed}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <CardTitle>
            <FormattedMessage id="pages.inspection.costsToBill" />
          </CardTitle>
          {!inspection ||
          !inspection.units ||
          inspection.units.length < 1 ||
          !find(inspection.units, (unit) =>
            find(
              unit.inspectionitems,
              (itemInspection) =>
                itemInspection.bills && itemInspection.bills.length > 0,
            ),
          ) ? (
            <p>
              {intl.formatMessage({ id: "pages.inspection.noExpenditures" })}
            </p>
          ) : (
            map(
              inspection && inspection.units ? inspection.units : [],
              (unit, idxUnit) => {
                if (
                  !find(
                    unit.inspectionitems,
                    (itemInspection) =>
                      itemInspection.bills && itemInspection.bills.length > 0,
                  )
                ) {
                  return null;
                }
                return (
                  <React.Fragment key={idxUnit}>
                    <Breadcrumb
                      className="mt-3 mb-0 eeac-units-breadcrumb"
                      onClick={() => onHandleCollapseUnit(idxUnit + 1)}
                    >
                      {UnitBreadcrumb(unit)}
                      {/* <BreadcrumbItem active>{unit.name}</BreadcrumbItem> */}
                    </Breadcrumb>
                    <Collapse
                      isOpen={unitsCollapse === idxUnit + 1}
                      data-parent="#exampleAccordion"
                    >
                      <ListGroup>
                        {map(
                          orderByPosition(unit.inspectionitems),
                          (inspectionItem, idxPoint) => {
                            return map(
                              inspectionItem.bills,
                              (billItem, idxBill) => {
                                return (
                                  <ListGroupItem
                                    key={`unit-${idxPoint}-${idxBill}`}
                                    className="border-0  pb-0 pt-0 inspection-point-item"
                                  >
                                    <FormGroup row>
                                      <Col md={9}>
                                        <Input
                                          type="text"
                                          placeholder="Cost line description"
                                          disabled
                                          value={billItem.description}
                                        />
                                      </Col>
                                      <Col md={3}>
                                        <NumberFormat
                                          fixedDecimalScale={true}
                                          thousandSeparator="."
                                          decimalSeparator=","
                                          className="form-control"
                                          decimalScale={2}
                                          inputMode="numeric"
                                          allowNegative={false}
                                          allowLeadingZeros={false}
                                          value={
                                            billItem.price && billItem.quantity
                                              ? parseFloat(billItem.price) *
                                                billItem.quantity
                                              : ""
                                          }
                                          prefix="€ "
                                          disabled
                                        />
                                      </Col>
                                    </FormGroup>
                                  </ListGroupItem>
                                );
                              },
                            );
                          },
                        )}
                      </ListGroup>
                    </Collapse>
                  </React.Fragment>
                );
              },
            )
          )}
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <CardTitle>
            <FormattedMessage id="pages.inspection.sendInvoiceTo" />
          </CardTitle>
          <FormGroup row>
            <Col>
              <Select
                value={
                  debtorContact
                    ? find(
                        debtorContactsList,
                        (item) => item._id === debtorContact,
                      )
                    : {}
                }
                onChange={(val) => {
                  setDebtorContact(val._id);
                }}
                options={debtorContactsList}
                getOptionLabel={(opt) => opt.accountView}
                getOptionValue={(opt) => opt._id}
                placeholder={intl.formatMessage({
                  id: "components.input.placeholder.contactName",
                })}
                noOptionsMessage={() =>
                  intl.formatMessage({ id: "components.select.noOption" })
                }
                className={`${
                  isSubmitting && !debtorContact ? "is-invalid" : ""
                }`}
                // autoFocus={isSubmitting && !debtorContact}
                ref={inputDebtor}
              />
              {isSubmitting && !debtorContact && (
                <FormFeedback className="d-block">
                  {intl.formatMessage({
                    id: "components.errors.invoiceContact.require",
                  })}
                </FormFeedback>
              )}
            </Col>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <CardTitle>
            <FormattedMessage id="pages.cleaning.sendCleaningTo" />
          </CardTitle>
          {map(contacts, (contact, index) => {
            return (
              <FormGroup row key={`${contact._id}-${index}`}>
                <Col>
                  <div className="d-flex">
                    <Button
                      color="primary"
                      className="btn-icon btn-icon-only"
                      type="button"
                      onClick={() => onHandleRemoveContact(contact, index)}
                    >
                      <FontAwesomeIcon icon={faMinus} size="1x" />
                    </Button>
                    <ListGroupItem className="border-0 position-relative p-0 my-auto pl-3">
                      <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                          <div className="widget-content-left">
                            <div
                              className="widget-heading font-weight-bold contact-name-link"
                              onClick={() => onHandleContactDetail(contact)}
                            >
                              {contact.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                  </div>
                </Col>
              </FormGroup>
            );
          })}
          <FormGroup row>
            <Col>
              <FormGroup inline className="d-flex">
                <Select
                  value={selectedContact}
                  placeholder={intl.formatMessage({
                    id: "components.input.placeholder.selectContactName",
                  })}
                  noOptionsMessage={() =>
                    intl.formatMessage({ id: "components.select.noOption" })
                  }
                  className="flex-grow-1 mr-2"
                  options={[
                    {
                      label: intl.formatMessage({
                        id: "components.select.people",
                      }),
                      options: personsFilter,
                    },
                    {
                      label: intl.formatMessage({
                        id: "components.select.groupings",
                      }),
                      options: groupingsFilter,
                    },
                  ]}
                  getOptionLabel={(opt) => opt.name}
                  getOptionValue={(opt) => opt._id}
                  menuPlacement="top"
                  ref={inputContacts}
                  onChange={(val) => setSelectedContact(val)}
                />
                <Button
                  color="primary"
                  className="btn-icon btn-icon-only"
                  type="button"
                  onClick={onHandleAddContact}
                  disabled={
                    !selectedContact ||
                    !selectedContact._id ||
                    (selectedContact &&
                      find(
                        contacts,
                        (item) => item._id === selectedContact._id,
                      ))
                  }
                >
                  <FontAwesomeIcon icon={faPlus} size="1x" />
                </Button>
              </FormGroup>
              {isSubmitting && (!contacts || contacts.length < 1) && (
                <FormFeedback className="d-block">
                  {intl.formatMessage({
                    id: "components.errors.contacts.require",
                  })}
                </FormFeedback>
              )}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <ContactDetailModal
        isOpen={openMoal}
        onToggleOpen={onToggleOpenModal}
        contactDetail={contactDetail}
      />
    </Container>
  );
}

export default memo(ViewSummaryCleaning);
