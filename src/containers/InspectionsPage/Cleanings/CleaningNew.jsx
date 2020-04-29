import React, { Fragment, useState, useEffect, useRef } from "react";
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
  ListGroup,
  ListGroupItem,
  FormFeedback,
  Collapse,
  Alert,
} from "reactstrap";
import Select from "react-select";
import update from "react-addons-update";

import { useSelector, useDispatch } from "react-redux";
import DropdownTreeSelect from "react-dropdown-tree-select";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextareaAutosize from "react-textarea-autosize";
import "react-dropdown-tree-select/dist/styles.css";
// import 'react-widgets/dist/css/react-widgets.css';
import DatePicker from "react-datepicker";
import moment from "moment";

import PageTitle from "../../../components/PageTitle";

import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import useForm from "react-hook-form";
import {
  forEach,
  find,
  map,
  filter,
  cloneDeep,
  uniqBy,
  uniq,
  findIndex,
  sortBy,
} from "lodash";
import { validationInspectionCleaning } from "./validation";

import { inspectionActions } from "../action";
import { loadingProviderActions } from "../../LoadingProvider/actions";

import DialogConfirmDeleteEmtyInspectionPoint from "../InspectionEdit/DialogConfirmDeleteEmtyInspectionPoint";

import { FormattedMessage, injectIntl } from "react-intl";
import { RECEIVE_MESSAGE_CLEANING } from "../constants";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

import ReactSelectLazy from "components/ReactSelectLazy";
import {
  UnitBreadcrumb,
  funcMakeTreeUnitLocations,
} from "../InspectionShared";
import { fetchDataLocationAsync } from "containers/LocationsPage/ultis";
const ROLE_INSPECTOR = "cleaner";

function CleaningNew({ intl, jobType }) {
  const { orderByPosition } = Utils;
  const dispatch = useDispatch();
  const inputElLocation = useRef(null);
  const inputElInspector = useRef(null);

  useEffect(() => {
    dispatch(inspectionActions.submitOpenInspectionTemplate(ROLE_INSPECTOR));
  }, [dispatch, jobType]);

  const inspectionState = useSelector((state) => state.inspection);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);

  const { inspectors, notificationCleaning } = inspectionState;

  // auto hidden notificationCleaning after 5s
  if (notificationCleaning && notificationCleaning.message) {
    setTimeout(() => {
      dispatch(inspectionActions.resetNotification(RECEIVE_MESSAGE_CLEANING));
    }, TIME_HIDDEN_NOTIFICATION);
  }

  forEach(
    inspectors,
    (item) => (item.name = `${item.firstName} ${item.lastName}`),
  );

  const [startDate, setStartDate] = useState(new Date());

  const [accordion, setAccordion] = useState([true, false, false]);
  const [nodesToggle, setNodesToggle] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState({});
  const [inspectorSelected, setInspectorSelected] = useState("");

  const [treeUnits, setTreeUnits] = useState([]);
  const [instructions, setInstructions] = useState("");

  const [units, setUnitsSelected] = useState([]);

  const [formInputPoint, setFormInputPoint] = useState({});

  const [
    isOpenDialogDeleteEmptyInspectionPoint,
    setIsOpenDialogDeleteEmptyInspectionPoint,
  ] = useState(false);
  const [nameLocationsNoPoint, setNameLocationsNoPoint] = useState("");
  const {
    handleSubmit,
    register,
    errors,
    setValue,
    clearError,
    reset,
    triggerValidation,
    formState,
    setError,
  } = useForm({
    validationSchema: validationInspectionCleaning(intl),
  });
  // custom validation
  register({ name: "instructions" });

  register({ name: "location" });
  register({ name: "inspector" });
  register({ name: "dateInspection" });
  register({ name: "units" });
  setValue("dateInspection", moment(startDate).toISOString());
  // const [showNavigate, setShowNavigate] = useState(false);

  // handle focus input
  useEffect(() => {
    if (formState.isSubmitted && !formState.isValid) {
      if (errors && Object.keys(errors).length >= 1) {
        if (errors["location"] && inputElLocation.current) {
          inputElLocation.current.focus();
        } else if (errors["inspector"] && inputElInspector.current) {
          inputElInspector.current.focus();
        }
      }
    }
  });
  const toggleAccordion = (tab) => {
    const newAccor = accordion.map((x, index) => (tab === index ? !x : false));
    setAccordion(newAccor);
  };
  const handleChangeLocation = (val) => {
    setValue("location", val._id);
    val.locationIdentifer = Utils.getLocationIdentifer(val);
    setSelectedLocation(val);
    handleTriggerValidation("location", val._id);
    let locationChanged = val;
    locationChanged.units = orderByPosition(locationChanged.units);
    // reset tree data
    setUnitsSelected([]);
    setFormInputPoint({});
    setTreeUnits([]);
    setAccordion([]);
    setNodesToggle([]);

    if (locationChanged) {
      const treeUnits = funcMakeTreeUnitLocations(locationChanged);
      setNodesToggle([]);
      setTreeUnits(treeUnits);
    }
  };

  const handleChangeDate = async (date) => {
    setStartDate(date);
    setValue("dateInspection", moment(date).toISOString());
    if (date && errors.dateInspection && errors.dateInspection.message) {
      clearError("dateInspection");
    } else if (formState.isSubmitted && !date) {
      setError(
        "dateInspection",
        "notMatch",
        intl.formatMessage({ id: "components.errors.dateCleaning.require" }),
      );
    }
  };

  const handleTriggerSelectAll = (treeUnitsClone) => {
    let checked = true;
    treeUnitsClone = cloneDeep(treeUnitsClone);
    treeUnitsClone = filter(
      treeUnitsClone,
      (item) => item.value !== "selectAll",
    );
    forEach(treeUnitsClone, (item) => {
      if (
        item.children &&
        item.children.length > 0 &&
        find(item.children, (childrenNode) => !childrenNode.checked)
      ) {
        checked = false;
        return false;
      }
      if (item.children && item.children.length > 0) {
        checked = handleTriggerSelectAll(item.children);
        return;
      }
    });
    if (find(treeUnitsClone, (item) => !item.checked)) {
      checked = false;
      return false;
    }
    return checked;
  };

  const onAction = (node, action) => {
    // handle selected all unit
    let { unitValue, selectedAll } = action;
    let treeUnitsClone = cloneDeep(treeUnits);
    let unitsClone = cloneDeep(units);
    const makeUnitTreeActionSelect = (nodeData) => {
      nodeData.checked = selectedAll;
      if (selectedAll) {
        unitsClone.push({
          id: nodeData.value,
          name: nodeData.label,
          points: [],
          sorted: nodeData.sorted,
          parent: nodeData.parent,
        });
      } else {
        // remove units
        let indexCurrentUnits = findIndex(
          unitsClone,
          (itemUnit) => itemUnit.id === nodeData.value,
        );
        if (indexCurrentUnits > -1) {
          unitsClone.splice(indexCurrentUnits, 1);
        }
      }
      if (nodeData.actions && nodeData.actions[0]) {
        nodeData.actions[0].text = selectedAll ? "Deselect all" : "Select all";
        nodeData.actions[0].selectedAll = !selectedAll;
      }
      if (nodeData && nodeData.children && nodeData.children.length > 0) {
        forEach(nodeData.children, (item) => makeUnitTreeActionSelect(item));
      }
    };
    if (unitValue) {
      const loopFindTreeNode = (currentNodes) => {
        forEach(currentNodes, (item, idx) => {
          if (find(nodesToggle, (nodeItem) => nodeItem === item.value)) {
            item.expanded = true;
          } else {
            item.expanded = false;
          }
          if (item.value === unitValue) {
            makeUnitTreeActionSelect(item);
            return;
          } else if (item.children && item.children.length > 0) {
            loopFindTreeNode(item.children);
          }
        });
      };
      loopFindTreeNode(treeUnitsClone);
    }

    unitsClone = uniqBy(unitsClone, (item) => item.id);
    setAccordion(map(unitsClone, (item, idx) => true));
    unitsClone = sortBy(unitsClone, (item) => item.sorted);
    handleSetUnitsOrder(unitsClone || []);
    if (
      treeUnitsClone &&
      treeUnitsClone[0] &&
      treeUnitsClone[0].value === "selectAll"
    ) {
      treeUnitsClone[0].checked = handleTriggerSelectAll(treeUnitsClone);
    }
    setTreeUnits(treeUnitsClone);
  };

  const handleExpandedTree = (currentNodesToggle) => {
    let treeUnitsClone = cloneDeep(treeUnits);
    forEach(treeUnitsClone, (item) => {
      if (find(currentNodesToggle, (nodeItem) => nodeItem === item.value)) {
        item.expanded = true;
      } else {
        item.expanded = false;
      }
      forEach(item.children, (childItem) => {
        if (
          find(currentNodesToggle, (nodeItem) => nodeItem === childItem.value)
        ) {
          childItem.expanded = true;
        } else {
          childItem.expanded = false;
        }
      });
    });
    setTreeUnits(treeUnitsClone);
    setNodesToggle(currentNodesToggle);
  };
  const onNodeToggle = (currentNode) => {
    let currentNodesToggle = cloneDeep(nodesToggle);
    if (currentNode.expanded) {
      currentNodesToggle.push(currentNode.value);
      currentNodesToggle = uniq(currentNodesToggle);
    } else {
      currentNodesToggle = filter(
        currentNodesToggle,
        (item) => item !== currentNode.value,
      );
    }
    handleExpandedTree(currentNodesToggle);
  };

  const handleToggleAllUnit = (checked) => {
    let treeUnitsClone = cloneDeep(treeUnits);
    let unitsClone = [];
    const makeTreeCheckedUnit = (currentNode) => {
      if (currentNode.children && currentNode.children.length > 0) {
        forEach(currentNode.children, (item, idx) => {
          item.checked = checked;
          if (checked) {
            unitsClone.push({
              id: item.value,
              name: item.label,
              points: [],
              sorted: item.sorted,
              parent: item.parent,
            });
          }
          if (item.actions && item.actions[0]) {
            item.actions[0].text = checked ? "Deselect all" : "Select all";
            item.actions[0].selectedAll = !checked;
          }
          makeTreeCheckedUnit(item);
        });
      }
    };
    forEach(treeUnitsClone, (item, idx) => {
      item.checked = checked;
      if (checked) {
        unitsClone.push({
          id: item.value,
          name: item.label,
          points: [],
          sorted: item.sorted,
          parent: item.parent,
        });
      }
      if (item.actions && item.actions[0]) {
        item.actions[0].text = checked ? "Deselect all" : "Select all";
        item.actions[0].selectedAll = !checked;
      }
      makeTreeCheckedUnit(item);
    });

    unitsClone = uniqBy(unitsClone, (item) => item.id);
    setAccordion(map(unitsClone, (item, idx) => true));
    unitsClone = sortBy(unitsClone, (item) => item.sorted);
    handleSetUnitsOrder(unitsClone || []);
    if (
      treeUnitsClone &&
      treeUnitsClone[0] &&
      treeUnitsClone[0].value === "selectAll"
    ) {
      treeUnitsClone[0].checked = handleTriggerSelectAll(treeUnitsClone);
    }
    setTreeUnits(treeUnitsClone);
  };

  const onChangeUnit = (currentNode, selectedNodes) => {
    setValue("units", selectedNodes);
    handleTriggerValidation("units", selectedNodes);
    if (currentNode.value === "selectAll") {
      handleToggleAllUnit(currentNode.checked);
      return;
    }

    let unitsClone = cloneDeep(units);
    let treeUnitsClone = cloneDeep(treeUnits);

    const loopFindTreeNode = (currentNodes) => {
      forEach(currentNodes, (item, idx) => {
        if (item.value === currentNode.value) {
          // makeUnitTreeActionSelect(item);
          if (currentNode.checked) {
            item.checked = true;
            unitsClone.push({
              id: item.value,
              name: item.label,
              points: [],
              sorted: item.sorted,
              parent: item.parent,
            });
          } else {
            item.checked = false;
            // remove units
            let indexCurrentUnits = findIndex(
              unitsClone,
              (itemUnit) => itemUnit.id === item.value,
            );
            if (indexCurrentUnits > -1) {
              unitsClone.splice(indexCurrentUnits, 1);
            }
          }
          if (item.actions && item.actions[0]) {
            let checkSelectedAll =
              currentNode.checked &&
              !find(item.children, (childItem) => !childItem.checked);
            item.actions[0].text = checkSelectedAll
              ? "Deselect all"
              : "Select all";
            item.actions[0].selectedAll = !checkSelectedAll;
          }
          return;
        } else if (item.children && item.children.length > 0) {
          if (
            find(
              item.children,
              (childItem) => childItem.value === currentNode.value,
            )
          ) {
            let checkSelectedAll =
              currentNode.checked &&
              !find(
                filter(
                  item.children,
                  (childItem) => childItem.value !== currentNode.value,
                ),
                (childItem) => !childItem.checked,
              );
            item.actions[0].text = checkSelectedAll
              ? "Deselect all"
              : "Select all";
            item.actions[0].selectedAll = !checkSelectedAll;
          }
          loopFindTreeNode(item.children);
        }
      });
    };
    loopFindTreeNode(treeUnitsClone);

    unitsClone = uniqBy(unitsClone, (item) => item.id);
    setAccordion(map(unitsClone, (item, idx) => true));
    unitsClone = sortBy(unitsClone, (item) => item.sorted);
    handleSetUnitsOrder(unitsClone || []);
    if (
      treeUnitsClone &&
      treeUnitsClone[0] &&
      treeUnitsClone[0].value === "selectAll"
    ) {
      treeUnitsClone[0].checked = handleTriggerSelectAll(treeUnitsClone);
    }
    setTreeUnits(treeUnitsClone);
  };
  // handle points process

  const setValueKeyInput = (key, value = "") => {
    let newForm = cloneDeep(formInputPoint);
    newForm[key] = value;
    setFormInputPoint(newForm);
  };

  const handleAddNewPoint = (description = "", indexUnit) => {
    let unitNode = units[indexUnit];
    if (unitNode) {
      unitNode.points = [...unitNode.points, { description }];
      let dataUnit = update(units, {
        [indexUnit]: {
          points: { $set: unitNode.points },
        },
      });
      setUnitsSelected(dataUnit);
    }
  };

  const handleChangePointValue = (description, indexOfPoint, idxUnit) => {
    let unitNode = units[idxUnit];
    if (unitNode) {
      unitNode.points = update(unitNode.points, {
        [indexOfPoint]: {
          description: { $set: description },
        },
      });
      let dataUnit = update(units, {
        [idxUnit]: {
          points: { $set: unitNode.points },
        },
      });
      setUnitsSelected(dataUnit);
    }
  };

  const handleRemovePoint = (indexOfPoint, idxUnit) => {
    let unitNode = units[idxUnit];
    if (unitNode) {
      unitNode.points = update(unitNode.points, {
        $splice: [[indexOfPoint, 1]],
      });
      let dataUnit = update(units, {
        [idxUnit]: {
          points: { $set: unitNode.points },
        },
      });
      setUnitsSelected(dataUnit);
    }
  };

  const handleKeyPressInputPoint = (target, { keyName = "", idxUnit }) => {
    if (target.charCode === 13 && formInputPoint[keyName]) {
      handleAddNewPoint(formInputPoint[keyName], idxUnit);
      setValueKeyInput(keyName);
    }
  };

  const handleTriggerValidation = (name, value) => {
    // console.log('handle triger: ', name, value, getValues());
    if (Object.keys(errors).length) {
      triggerValidation({ name, value });
    }
  };
  const handleSubmitInspection = (values) => {
    // prevent try to press when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    if (!units || units.length < 0) {
      // Unit & Sub-unit is required
      return;
    }
    values.status = "Open";
    // remove checkbox default
    values.units = filter(units, (item) => item.id !== "selectAll");

    if (isOpenDialogDeleteEmptyInspectionPoint) {
      values.units = values.units.filter((u) => u.points.length > 0);
    }

    // Make sure Location has at least one Point
    let $units = values.units;
    let existedLocationsNoPoint = $units.filter((u) => u.points.length === 0);

    if (values.units.length > 0 && existedLocationsNoPoint.length > 0) {
      setNameLocationsNoPoint(
        existedLocationsNoPoint.map((locat) => locat.name).join(", "),
      );
      setIsOpenDialogDeleteEmptyInspectionPoint(true);
    } else if (values.units.length === 0) {
      setIsOpenDialogDeleteEmptyInspectionPoint(false);

      setUnitsSelected([]);

      unCheckAllUnits(treeUnits);

      setTreeUnits(treeUnits);
      // Validate the Units/Sub-Unit again!
      setValue("units", []);
      handleTriggerValidation("units", []);
      return;
    } else {
      // values.points = points;
      forEach(values.units, (unit) => {
        forEach(unit.points, (point, index) => {
          point.position = index + 1;
        });
      });
      // Display loading icon request
      dispatch(loadingProviderActions.setStatusLoadingProvider());
      dispatch(inspectionActions.submitOpenNewCleaning(values));
    }
  };
  const resetInspectionForm = () => {
    setSelectedLocation({});
    setInspectorSelected("");
    setTreeUnits([]);
    setInstructions("");
    setFormInputPoint({});
    setStartDate(new Date());
    setUnitsSelected([]);
    reset({
      instructions: "",
      location: "",
      inspector: "",
      dateInspection: moment(new Date()).format("YYYY/MM/DD"),
      units: [],
    });
    clearError();
  };

  const closeDialogDeleteEmtyInspectionPoint = () => {
    setIsOpenDialogDeleteEmptyInspectionPoint(false);
  };

  const handleSetUnitsOrder = (dataUnits) => {
    setUnitsSelected(orderUnits(dataUnits));
  };

  const orderUnits = (dataUnits) => {
    let { units } = selectedLocation;
    units = orderByPosition(units);
    let unitParents = filter(units, (item) => !item.parent);
    let trees = [];
    // lop tree units
    const makeTree = (unitItem) => {
      if (trees.length === units.length) {
        return;
      }

      let subUnits = filter(units, (item) => item.parent === unitItem.id);
      forEach(subUnits, (subUnit) => {
        let itemFilter = find(dataUnits, (item) => item.id === subUnit.id);
        if (itemFilter) {
          trees.push(itemFilter);
        }
        makeTree(subUnit);
      });
    };
    // lop parent units location
    forEach(unitParents, (unit) => {
      let itemFilter = find(dataUnits, (item) => item.id === unit.id);
      if (itemFilter) {
        trees.push(itemFilter);
      }
      makeTree(unit);
    });
    return trees;
  };

  function unCheckAllUnits(nodes) {
    if (nodes.length > 0) {
      nodes.map((node) => {
        node.checked = false;
        if (node.children) {
          node.children.map((child) => (child.checked = false));
          unCheckAllUnits(node.children);
        }
        return node;
      });
    }
    return nodes;
  }
  return (
    <Fragment>
      <PageTitle
        heading={<FormattedMessage id="components.pageTitle.newCleaning" />}
        icon="page-title-custom-icon nav-icon-inspections"
      />
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardHeader className="w-100">
              <div className="w-100 d-flex justify-content-between">
                <p className="my-auto">
                  <FormattedMessage id="components.formTitle.openNewCleaning" />
                </p>
                <div className="ml-auto">
                  <Button
                    type="button"
                    color="outline-link"
                    onClick={() => resetInspectionForm()}
                  >
                    <FormattedMessage id="components.button.cancel" />
                  </Button>
                  <Button
                    color="success"
                    type="button"
                    className="ml-2"
                    onClick={handleSubmit(handleSubmitInspection)}
                  >
                    <FormattedMessage id="components.button.open" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {notificationCleaning &&
              notificationCleaning.message &&
              notificationCleaning.page ? (
                <Alert
                  color={
                    notificationCleaning.type === "success"
                      ? "success"
                      : "danger"
                  }
                  isOpen={!!notificationCleaning.message}
                >
                  {Utils.showNotify(intl, notificationCleaning)}
                </Alert>
              ) : null}
              <Col md="10" className="mx-auto">
                <Row form>
                  <Col md={12} className="">
                    <FormGroup>
                      <Label for="">
                        <FormattedMessage id="pages.inspection.location" />
                      </Label>
                      <ReactSelectLazy
                        refProp={inputElLocation}
                        intl={intl}
                        value={selectedLocation || null}
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.locationIdentifier",
                        })}
                        noOptionsMessage={() =>
                          intl.formatMessage({
                            id: "components.select.noOption",
                          })
                        }
                        onChange={(val) => handleChangeLocation(val)}
                        defaultOptions={[]}
                        fetchDataAsync={fetchDataLocationAsync}
                      />
                      {errors.location && errors.location.message && (
                        <FormFeedback className="d-block">
                          {errors.location.message}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="">
                        <FormattedMessage id="pages.inspection.unitAndSubUnit" />
                      </Label>
                      <DropdownTreeSelect
                        invalid={!!errors.units}
                        data={treeUnits}
                        mode="hierarchical"
                        onChange={onChangeUnit}
                        onAction={onAction}
                        onNodeToggle={onNodeToggle}
                        // ref={inputElUnits}
                        texts={{
                          placeholder:
                            units && units.length > 0
                              ? " "
                              : intl.formatMessage({
                                  id: "components.input.placeholder.select",
                                }),
                        }}
                      />

                      {formState.isSubmitted && (!units || units.length < 1) && (
                        <FormFeedback className="d-block">
                          {intl.formatMessage({
                            id: "pages.maintenance.errors.units.require",
                          })}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6} className="z-index-7">
                    <FormGroup>
                      <Label for="">
                        <FormattedMessage id="pages.cleaning.cleaner" />
                      </Label>
                      <Select
                        placeholder={intl.formatMessage({
                          id: "components.input.placeholder.employeeFullName",
                        })}
                        noOptionsMessage={() =>
                          intl.formatMessage({
                            id: "components.select.noOption",
                          })
                        }
                        options={inspectors}
                        value={
                          inspectorSelected
                            ? find(
                                inspectors,
                                (optionItem) =>
                                  optionItem._id === inspectorSelected,
                              )
                            : null
                        }
                        name="inspector"
                        getOptionLabel={(opt) => opt.name}
                        getOptionValue={(opt) => opt._id}
                        innerRef={register}
                        ref={inputElInspector}
                        onChange={(val) => {
                          setValue("inspector", val._id);
                          setInspectorSelected(val._id);
                          handleTriggerValidation("inspector", val._id);
                        }}
                      />
                      {errors.inspector && errors.inspector.message && (
                        <FormFeedback className="d-block">
                          {errors.inspector.message}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6} className="z-index-7">
                    <FormGroup>
                      <Label for="">
                        <FormattedMessage id="pages.cleaning.dayOfInspection" />
                      </Label>
                      <InputGroup>
                        <DatePicker
                          selected={startDate}
                          onChange={handleChangeDate}
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                        />
                        <InputGroupAddon addonType="append">
                          <div className="input-group-text">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </div>
                        </InputGroupAddon>
                      </InputGroup>
                      {errors.dateInspection &&
                        errors.dateInspection.message && (
                          <FormFeedback className="d-block">
                            {errors.dateInspection.message}
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <hr />
                  </Col>
                  <Col md={12} className="z-index-6">
                    <FormGroup>
                      <Label for="">
                        <FormattedMessage id="pages.inspection.internalWork" />
                      </Label>
                      <TextareaAutosize
                        className="form-control z-index-6"
                        minRows={3}
                        maxRows={6}
                        maxLength={250}
                        placeholder={intl.formatMessage({
                          id:
                            "components.input.placeholder.typeInstructionsDescCleaning",
                        })}
                        name="instructions"
                        value={instructions}
                        onChange={({ target }) => {
                          setValue("instructions", target.value);
                          setInstructions(target.value);
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="">
                        <FormattedMessage id="pages.cleaning.inspectionPoints" />
                      </Label>

                      {map(units, (unitItem, idx) => {
                        if (unitItem.id === "selectAll") {
                          return null;
                        }
                        const { id } = unitItem;
                        return (
                          <Card key={`unit-${idx}`}>
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
                                            // color={accordion[locationIndex] ? "link" : ""}
                                            color=""
                                            className="text-left m-0 p-0 d-flex align-items-center"
                                            onClick={() => {
                                              toggleAccordion(idx);
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
                                            <div className="font-weight-muli-bold breadcrumb-unit">
                                              <UnitBreadcrumb
                                                location={selectedLocation}
                                                unit={unitItem}
                                              />
                                            </div>
                                          </Button>
                                        </div>
                                      </div>

                                      <div className="widget-content-right"></div>
                                    </div>
                                  </div>
                                </ListGroupItem>
                              </ListGroup>
                            </CardHeader>
                            <Collapse
                              isOpen={accordion[idx]}
                              data-parent="#accordion"
                              id="collapseOne"
                              aria-labelledby="headingOne"
                              className="border-0"
                            >
                              <CardBody className="pb-0 pt-0">
                                <ListGroup>
                                  {/* <Label for="" className="font-weight-bold">{unitItem.name}</Label> */}
                                  {map(unitItem.points, (item, index) => {
                                    return (
                                      <ListGroupItem
                                        key={`point-${index}`}
                                        className="border-0 pl-0 pr-0"
                                      >
                                        <div className="d-flex align-items-center">
                                          <Button
                                            color=""
                                            className="text-left m-0 p-0"
                                            onClick={() =>
                                              handleRemovePoint(index, idx)
                                            }
                                          >
                                            <i className="eeac-icon eeac-icon-close"></i>
                                          </Button>
                                          <Input
                                            maxLength={250}
                                            type="text"
                                            placeholder={intl.formatMessage({
                                              id:
                                                "components.input.placeholder.description",
                                            })}
                                            className=" ml-3"
                                            value={item.description}
                                            onChange={({ target }) =>
                                              handleChangePointValue(
                                                target.value,
                                                index,
                                                idx,
                                              )
                                            }
                                          />
                                        </div>
                                      </ListGroupItem>
                                    );
                                  })}
                                  <ListGroupItem className="border-0 pl-0 pr-0">
                                    <div className="d-flex align-items-center">
                                      <Button
                                        color=""
                                        className="text-left m-0 p-0 mr-3"
                                        onClick={() => {
                                          if (
                                            formInputPoint[
                                              `point-item-root-${id}`
                                            ]
                                          ) {
                                            handleAddNewPoint(
                                              formInputPoint[
                                                `point-item-root-${id}`
                                              ],
                                              idx,
                                            );
                                            setValueKeyInput(
                                              `point-item-root-${id}`,
                                            );
                                          }
                                        }}
                                      >
                                        <i className="eeac-icon eeac-icon-plus"></i>
                                      </Button>
                                      <Input
                                        maxLength={250}
                                        type="text"
                                        placeholder={intl.formatMessage({
                                          id:
                                            "components.input.placeholder.description",
                                        })}
                                        value={
                                          formInputPoint[
                                            `point-item-root-${id}`
                                          ] || ""
                                        }
                                        onChange={({ target }) =>
                                          setValueKeyInput(
                                            `point-item-root-${id}`,
                                            target.value,
                                          )
                                        }
                                        onKeyPress={(event) =>
                                          handleKeyPressInputPoint(event, {
                                            keyName: `point-item-root-${id}`,
                                            idxUnit: idx,
                                          })
                                        }
                                      />
                                    </div>
                                  </ListGroupItem>
                                </ListGroup>
                              </CardBody>
                            </Collapse>
                          </Card>
                        );
                      })}
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <DialogConfirmDeleteEmtyInspectionPoint
        isOpen={isOpenDialogDeleteEmptyInspectionPoint}
        cancel={closeDialogDeleteEmtyInspectionPoint}
        locationsNoPoint={nameLocationsNoPoint}
        handleSubmit={handleSubmit(handleSubmitInspection)}
        warnMessageKey="components.dialog.confirmDeleteCleaningPoint.desc"
      />
    </Fragment>
  );
}

export default injectIntl(CleaningNew);
