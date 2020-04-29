import React from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import NumericInput from "react-numeric-input";

import { FormattedMessage, injectIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  CustomInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// ### icons
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

// constants
const frequencyTypes = ["Daily", "Weekly", "Monthly", "Yearly"];
const inspectionDayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const InspectionSchedule = (props) => {
  const {
    setIsShowSchedule,
    prevFormValues,
    setIsOpenDialogDeleteEmptyInspectionPoint,
  } = props;
  console.log("InspectionSchedule -> prevFormValues", prevFormValues);

  const [active, setActive] = React.useState(true);
  const [showDialog, setShowDialog] = React.useState(false);
  const [freqNumber, setFreqNumber] = React.useState(1);
  const [frequencyType, setFrequencyType] = React.useState(frequencyTypes[0]);
  const [inspectionDay, setInspectionDay] = React.useState(1);
  const [dayOfWeek, setDayOfWeek] = React.useState(inspectionDayOfWeek[0]);
  const [startFrom, setStartFrom] = React.useState(new Date());
  const [offset, setOffset] = React.useState(1);

  const isDailyChecked = frequencyType === frequencyTypes[0];

  const onCreate = React.useCallback(() => {
    console.log("InspectionSchedule -> onCreate");
    setShowDialog(false);
  }, []);

  return (
    <Row>
      <Col md="12">
        <Card className="main-card mb-3">
          <CardHeader className="w-100">
            <div className="w-100 d-flex justify-content-between">
              <p className="my-auto"></p>
              <div className="ml-auto">
                <Button
                  // disabled={isNewInspectionSubmitting}
                  type="button"
                  color="outline-link"
                  onClick={() => {
                    setIsShowSchedule(false);
                    setIsOpenDialogDeleteEmptyInspectionPoint(false);
                  }}
                >
                  <FormattedMessage id="components.button.cancel" />
                </Button>
                <Button
                  // disabled={isNewInspectionSubmitting}
                  color="success"
                  type="button"
                  className="ml-2"
                  onClick={() => setShowDialog(true)}
                >
                  <FormattedMessage id="components.button.create" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={10} className="mx-auto">
                <FormGroup row>
                  <Col sm={10}>
                    <CustomInput
                      type="checkbox"
                      id="ckbShowDisabled"
                      label={
                        <FormattedMessage id="components.checkBox.active" />
                      }
                      checked={active}
                      onChange={() => setActive(true)}
                    />
                  </Col>
                </FormGroup>

                {/* Frequency */}
                <FormGroup row>
                  <Label sm={3}>
                    <FormattedMessage id="pages.inspectionScheduler.label.freequency" />
                    :{" "}
                  </Label>
                  <Col sm={9}>
                    <NumericInput
                      className="form-control"
                      min={1}
                      value={freqNumber}
                      onChange={(val) => setFreqNumber(val)}
                      strict
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col sm={3}></Col>
                  <Col sm={9}>
                    <FormGroup check className="lh-17 my-3">
                      <Label check>
                        <Input
                          type="radio"
                          name="freequency"
                          checked={frequencyType === frequencyTypes[0]}
                          value={frequencyTypes[0]}
                          onChange={(e) => setFrequencyType(e.target.value)}
                        />{" "}
                        <FormattedMessage id="pages.inspectionScheduler.radio.daily" />
                      </Label>
                    </FormGroup>
                    <FormGroup check className="lh-17 my-3">
                      <Label check>
                        <Input
                          type="radio"
                          name="freequency"
                          checked={frequencyType === frequencyTypes[1]}
                          value={frequencyTypes[1]}
                          onChange={(e) => setFrequencyType(e.target.value)}
                        />{" "}
                        <FormattedMessage id="pages.inspectionScheduler.radio.weekly" />
                      </Label>
                    </FormGroup>
                    <FormGroup check className="lh-17 my-3">
                      <Label check>
                        <Input
                          type="radio"
                          name="freequency"
                          checked={frequencyType === frequencyTypes[2]}
                          value={frequencyTypes[2]}
                          onChange={(e) => setFrequencyType(e.target.value)}
                        />{" "}
                        <FormattedMessage id="pages.inspectionScheduler.radio.monthly" />
                      </Label>
                    </FormGroup>
                    <FormGroup check className="lh-17 my-3">
                      <Label check>
                        <Input
                          type="radio"
                          name="freequency"
                          checked={frequencyType === frequencyTypes[3]}
                          value={frequencyTypes[3]}
                          onChange={(e) => setFrequencyType(e.target.value)}
                        />{" "}
                        <FormattedMessage id="pages.inspectionScheduler.radio.yearly" />
                      </Label>
                    </FormGroup>
                  </Col>
                </FormGroup>
                {/* End of Frequency */}

                {/* Inspection day */}
                <FormGroup row>
                  <Label sm={3}>
                    <FormattedMessage id="pages.inspectionScheduler.label.inspectionDay" />
                    :{" "}
                  </Label>
                  <Col sm={9}>
                    <NumericInput
                      className="form-control"
                      min={1}
                      value={inspectionDay}
                      onChange={(val) => setInspectionDay(val)}
                      strict
                      disabled={isDailyChecked}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col sm={3}></Col>
                  <Col sm={9}>
                    <FormGroup tag="fieldset" disabled={isDailyChecked}>
                      <Row>
                        <Col md={6}>
                          <FormGroup check className="lh-17 my-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="inspectionDay"
                                checked={dayOfWeek === inspectionDayOfWeek[0]}
                                value={inspectionDayOfWeek[0]}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                              />{" "}
                              <FormattedMessage id="pages.inspectionScheduler.radio.monday" />
                            </Label>
                          </FormGroup>
                          <FormGroup check className="lh-17 my-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="inspectionDay"
                                checked={dayOfWeek === inspectionDayOfWeek[1]}
                                value={inspectionDayOfWeek[1]}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                              />{" "}
                              <FormattedMessage id="pages.inspectionScheduler.radio.tuesday" />
                            </Label>
                          </FormGroup>
                          <FormGroup check className="lh-17 my-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="inspectionDay"
                                checked={dayOfWeek === inspectionDayOfWeek[2]}
                                value={inspectionDayOfWeek[2]}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                              />{" "}
                              <FormattedMessage id="pages.inspectionScheduler.radio.wednesday" />
                            </Label>
                          </FormGroup>
                          <FormGroup check className="lh-17 my-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="inspectionDay"
                                checked={dayOfWeek === inspectionDayOfWeek[3]}
                                value={inspectionDayOfWeek[3]}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                              />{" "}
                              <FormattedMessage id="pages.inspectionScheduler.radio.thursday" />
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup check className="lh-17 my-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="inspectionDay"
                                checked={dayOfWeek === inspectionDayOfWeek[4]}
                                value={inspectionDayOfWeek[4]}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                              />{" "}
                              <FormattedMessage id="pages.inspectionScheduler.radio.friday" />
                            </Label>
                          </FormGroup>
                          <FormGroup check className="lh-17 my-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="inspectionDay"
                                checked={dayOfWeek === inspectionDayOfWeek[5]}
                                value={inspectionDayOfWeek[5]}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                              />{" "}
                              <FormattedMessage id="pages.inspectionScheduler.radio.saturday" />
                            </Label>
                          </FormGroup>
                          <FormGroup check className="lh-17 my-3">
                            <Label check>
                              <Input
                                type="radio"
                                name="inspectionDay"
                                checked={dayOfWeek === inspectionDayOfWeek[6]}
                                value={inspectionDayOfWeek[6]}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                              />{" "}
                              <FormattedMessage id="pages.inspectionScheduler.radio.sunday" />
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                </FormGroup>
                {/* End of Inspection day */}

                {/* Start from */}
                <FormGroup row>
                  <Label sm={3}>
                    <FormattedMessage id="pages.inspectionScheduler.table.startFrom" />
                    :{" "}
                  </Label>
                  <Col sm={9}>
                    <Row>
                      <Col>
                        <InputGroup className="z-index-1">
                          <DatePicker
                            withPortal
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            selected={startFrom}
                            onChange={(date) => setStartFrom(date)}
                          />
                          <InputGroupAddon addonType="append">
                            <div className="input-group-text">
                              <FontAwesomeIcon icon={faCalendarAlt} />
                            </div>
                          </InputGroupAddon>
                        </InputGroup>
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>
                {/* End of Start from */}

                {/* Generation offset */}
                <FormGroup row>
                  <Label sm={3}>
                    <FormattedMessage id="pages.inspectionScheduler.label.generationOffset" />
                    :{" "}
                  </Label>
                  <Col sm={9}>
                    <NumericInput
                      className="form-control"
                      min={0}
                      value={offset}
                      onChange={(val) => setOffset(val)}
                      strict
                    />
                  </Col>
                </FormGroup>
                {/* End of Generation offset */}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Modal isOpen={showDialog}>
        <ModalHeader>
          <FormattedMessage id="components.dialog.confirm" />
        </ModalHeader>
        <ModalBody>
          Are you sure you want to create this inspection scheduler?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onCreate}>
            <FormattedMessage id="components.button.yes" />
          </Button>{" "}
          <Button color="secondary" onClick={() => setShowDialog(false)}>
            <FormattedMessage id="components.button.no" />
          </Button>
        </ModalFooter>
      </Modal>
    </Row>
  );
};

export default React.memo(InspectionSchedule);
