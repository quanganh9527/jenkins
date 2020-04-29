import React, {
  Fragment,
  useState,
  useEffect,
  memo,
  useRef,
  useCallback,
} from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  ListGroup,
  ListGroupItem,
  Breadcrumb,
  BreadcrumbItem,
  Collapse,
  FormFeedback,
  Alert,
  CustomInput,
} from "reactstrap";
import NumericInput from "react-numeric-input";
import NumberFormat from "react-number-format";
import update from "react-addons-update";
import { map, find, filter, cloneDeep, forEach, includes } from "lodash";
import { useHistory } from "react-router-dom";
import Select from "react-select";
// import DropdownTreeSelect from "react-dropdown-tree-select";
/**
 * Em Dinh: https://infodation.atlassian.net/browse/EEAC-597?oldIssueView=true
 */
import moment from "moment";
import * as inspectionServices from "services/inspection.service";
import * as reduxActions from "../action";
import _isEqual from "lodash/isEqual";
import { nlFormat } from "utilities/currency";
/**
 * Em Dinh End
 */

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextareaAutosize from "react-textarea-autosize";
import "react-dropdown-tree-select/dist/styles.css";
import DatePicker from "react-datepicker";
import Carousel, { Modal, ModalGateway } from "react-images";
import Uploader from "./Uploader";
import "./styles.scss";
import * as styles from "./styles";

import LoadingIndicator from "../../../components/LoadingIndicator";
// ###
import DialogCopyTemplate from "./DialogCopyTemplate";
import PageTitle from "../../../components/PageTitle";
import {
  EmoticonHappyOutlineIcon,
  EmoticonNeutralOutlineIcon,
  EmoticonSadOutlineIcon,
  CurrencyEurIcon,
  MinusIcon,
  CloseCircleOutline,
} from "../../Icons";
import ViewSummary from "./ViewSummary";
import ConfirmCompleteModal from "./ModalConfirmComplete";
import ModalConfirmReject from "./ModalConfirmReject";

import { useSelector, useDispatch } from "react-redux";
import { inspectionActions } from "../action";
import { loadingProviderActions } from "../../LoadingProvider/actions";
import {
  INSPECTION_STATUS,
  INSPECTION_ITEM_STATUS,
  BILL_TYPE,
  BILL_STATUS,
} from "../constants";
import {
  checkValidInspecion,
  allowEditInspection,
  allowReviewInspection,
} from "../utils";
import { useUserState } from "../../../containers/LoginPage/context";

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const optionTypeInspection = [
  { label: "Begin", value: "Begin" },
  { label: "End", value: "End" },
  { label: "Periodic", value: "Periodic" },
];

function DetailInspection({ intl, inspectionId }) {
  const { orderByPosition } = Utils;
  const dispatch = useDispatch();
  const history = useHistory();
  const inspectionState = useSelector((state) => state.inspection);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);
  // ######
  const inputDebtor = useRef(null);
  const inputContacts = useRef(null);
  const {
    costTypes,
    isSubmitted,
    notification,
    location,
    isFetchingInspectionData,
    inspectors,
  } = inspectionState;
  const [inspection, setInspection] = useState({});
  const [modalIsOpenImages, setmodalIsOpenImages] = useState(false);
  const [modalSourceImages, setModalSourceImages] = useState([]);
  const [limitFilesError, setLimitFilesError] = useState({});

  // redux state
  // auto hidden notification after 5s
  if (notification && notification.message) {
    setTimeout(() => {
      dispatch(inspectionActions.resetNotification());
    }, TIME_HIDDEN_NOTIFICATION);
  }

  //check roles edit inspection
  const userState = useUserState();
  let { user } = userState;
  user = user || {};
  const isEdit = allowEditInspection(user, "Inspection", inspection.status);
  const isReviewInspection = allowReviewInspection(
    user,
    "Inspection",
    inspection.status,
  );

  useEffect(() => {
    // reset inspection
    dispatch(inspectionActions.receiveInspection());
    dispatch(inspectionActions.receiveLocation());
    setInspection({});
    dispatch(
      inspectionActions.getInspection(
        inspectionId,
        inspectionServices.roleByJobType.inspection,
        user,
      ),
    );

    // dispatch(inspectionActions.getCostTypes());
  }, [dispatch, inspectionId, user]);

  // useEffect(() => {
  // dispatch(inspectionActions.getContacts({ active: true }));
  // dispatch(inspectionActions.getDebtorContacts());
  // }, [dispatch]);

  const orderUnits = useCallback(
    (location, dataUnits) => {
      let { units } = location;
      units = orderByPosition(units);
      let trees = [];
      // lop tree units
      const makeTree = (unitItem) => {
        if (trees.length === units.length) {
          return;
        }

        let subUnits = filter(units, (item) => item.parent === unitItem._id);
        forEach(subUnits, (subUnit) => {
          let itemFilter = find(dataUnits, (item) => item._id === subUnit._id);
          if (itemFilter) {
            itemFilter.inspectionitems = orderByPosition(
              itemFilter.inspectionitems,
            );
            trees.push(itemFilter);
          }
          makeTree(subUnit);
        });
      };
      let unitParents = filter(units, (item) => !item.parent);
      // lop parent units location
      forEach(unitParents, (unit) => {
        let itemFilter = find(dataUnits, (item) => item._id === unit._id);
        if (itemFilter) {
          itemFilter.inspectionitems = orderByPosition(
            itemFilter.inspectionitems,
          );
          trees.push(itemFilter);
        }
        makeTree(unit);
      });
      return trees;
    },
    [orderByPosition],
  );

  useEffect(() => {
    // not reset inspection when redux change
    if (
      location &&
      location._id &&
      inspectionState.inspection &&
      inspectionState.inspection._id &&
      (!inspection || inspectionState.inspection._id !== inspection._id)
    ) {
      // setInspectionStatus(inspectionState.inspection.status);
      if (inspectionState.inspection && inspectionState.inspection.units) {
        inspectionState.inspection.units = orderUnits(
          location,
          inspectionState.inspection.units,
        );
      }
      setInspection(inspectionState.inspection);
    }
  }, [inspectionState, inspection, orderUnits, location]);

  // local
  // const [startDate, setStartDate] = useState(new Date());
  const [toggleDialogCopyTemplate, setToggleDialogCopyTemplate] = useState(
    false,
  );

  const [viewSum, setViewSum] = useState(false);
  const [showCompletedDialog, setShowCompletedDialog] = useState(false);
  const [showConfirmRejectModal, setShowConfirmRejectModal] = useState(false);

  const [inspectionStatus, setInspectionStatus] = useState(
    INSPECTION_STATUS.OPEN,
  );

  const [unitsCollapse, setUnitsCollapse] = useState(1);

  const [debtorContact, setDebtorContact] = useState("");
  const [contactsInspection, setContactsInspection] = useState([]);

  // handle form submit validation check

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const onHandleToggleDialogCopyTemplate = () => {
    setToggleDialogCopyTemplate(!toggleDialogCopyTemplate);
  };

  const onCopyTemplate = () => {
    setToggleDialogCopyTemplate(!toggleDialogCopyTemplate);
  };

  const handleChangeFindings = (idxUnit, idxPoint, value) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems = update(
      inspectionClone.units[idxUnit].inspectionitems,
      {
        [idxPoint]: { findings: { $set: value } },
      },
    );
    setInspection(inspectionClone);
  };
  const onHandleConditionInspection = (
    idxUnit,
    idxPoint,
    value,
    inspectionItemId,
  ) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems = update(
      inspectionClone.units[idxUnit].inspectionitems,
      {
        [idxPoint]: { status: { $set: value } },
      },
    );
    setInspection(inspectionClone);
    setErrorMessageLimitFile(inspectionItemId, false);
  };

  // handle bill for inspeciton points
  const onHandleAddBill = (idxUnit, idxPoint) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills =
      inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills || [];
    inspectionClone.units[idxUnit].inspectionitems[
      idxPoint
    ].bills = update(
      inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills,
      { $push: [{ quantity: 1 }] },
    );
    setInspection(inspectionClone);
  };

  const onHandleChangeBillDescription = (idxUnit, idxPoint, idxBill, value) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills = update(
      inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills,
      {
        [idxBill]: { description: { $set: value } },
      },
    );
    setInspection(inspectionClone);
  };

  const onHandleChangeBillCostType = (idxUnit, idxPoint, idxBill, value) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills[
      idxBill
    ].costtype = value;
    setInspection(inspectionClone);
  };
  const onHandleChangeBillQuantity = (idxUnit, idxPoint, idxBill, value) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills[
      idxBill
    ].quantity = value;
    setInspection(inspectionClone);
  };
  const onHandleChangeBillPrice = (idxUnit, idxPoint, idxBill, value) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills[
      idxBill
    ].price = value;
    setInspection(inspectionClone);
  };

  const onHandleRemoveBill = (idxUnit, idxPoint, idxBill) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[
      idxPoint
    ].bills = update(
      inspectionClone.units[idxUnit].inspectionitems[idxPoint].bills,
      { $splice: [[idxBill, 1]] },
    );
    setInspection(inspectionClone);
  };

  // images
  const onHandleAddImages = (idxUnit, idxPoint, files) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[idxPoint].images =
      inspectionClone.units[idxUnit].inspectionitems[idxPoint].images || [];
    inspectionClone.units[idxUnit].inspectionitems[
      idxPoint
    ].images = update(
      inspectionClone.units[idxUnit].inspectionitems[idxPoint].images,
      { $push: files },
    );
    setInspection(inspectionClone);
  };
  const onHandleRemoveImages = (idxUnit, idxPoint, idxImage) => {
    let inspectionClone = cloneDeep(inspection);
    inspectionClone.units[idxUnit].inspectionitems[
      idxPoint
    ].images = update(
      inspectionClone.units[idxUnit].inspectionitems[idxPoint].images,
      { $splice: [[idxImage, 1]] },
    );
    setInspection(inspectionClone);
  };

  const handleSetInspectionSummary = (newInspection) => {
    setInspection(newInspection);
  };
  const onHandleViewSummary = () => {
    let isInvalid = false;
    let unitIndex = 0;
    let inspectionEntity = makeInspectionEntity("ViewSummary");
    const { inspectionItems } = inspectionEntity;
    setIsSubmitting(false);
    forEach(inspectionItems, (inspectionItem) => {
      if (!inspectionItem.status) {
        isInvalid = true;
        unitIndex = inspectionItem.unitIndex;
        return;
      }

      if (
        includes(
          [INSPECTION_ITEM_STATUS.YELLOW, INSPECTION_ITEM_STATUS.RED],
          inspectionItem.status,
        )
      ) {
        if (!inspectionItem.findings) {
          isInvalid = true;
          unitIndex = inspectionItem.unitIndex;
          return;
        }
        if (
          !inspectionItem.images ||
          inspectionItem.images.length < 1 ||
          inspectionItem.images.length > 8
        ) {
          isInvalid = true;
          unitIndex = inspectionItem.unitIndex;
          return;
        }
        if (!isInvalid) {
          if (
            inspectionItem.bills &&
            inspectionItem.bills.length > 0 &&
            find(
              inspectionItem.bills,
              (billItem) =>
                !billItem.costtype ||
                !billItem.quantity ||
                !billItem.price ||
                !billItem.description,
            )
          ) {
            isInvalid = true;
            unitIndex = inspectionItem.unitIndex;
            return;
          }
        }
      }
      if (!isInvalid) {
        if (
          inspectionItem.bills &&
          inspectionItem.bills.length > 0 &&
          find(
            inspectionItem.bills,
            (billItem) =>
              !billItem.costtype ||
              !billItem.quantity ||
              !billItem.price ||
              !billItem.description,
          )
        ) {
          isInvalid = true;
          unitIndex = inspectionItem.unitIndex;
          return;
        }
      }
    });
    if (!isInvalid) {
      setIsSubmitting(false);
      setIsValid(true);
      setViewSum(true);
    } else {
      setIsSubmitting(true);
      setIsValid(false);
      onHandleCollapseUnit(unitIndex + 1, true);
      setTimeout(() => {
        focusInputError();
      }, 500);
      // dispatch(inspectionActions.displayNotification('error', 'Invalid form input!'))
    }
  };
  const focusInputError = () => {
    let formReview = document.getElementById("list-inspection-review");
    if (formReview) {
      let elementsInvalid = formReview.getElementsByClassName("is-invalid");
      if (elementsInvalid.length) {
        let element = elementsInvalid[0];
        let classElement = elementsInvalid[0].getAttribute("class");
        if (includes(classElement, "select-cost-type")) {
          let inputsSelect = element.getElementsByTagName("input");
          inputsSelect.length && inputsSelect[0].focus();
        } else {
          element.focus();
        }
      }
    }
  };

  const setErrorMessageLimitFile = (itemId, status = false) => {
    if (!itemId) return;
    let setLimitFilesErrorClone = cloneDeep(limitFilesError);
    setLimitFilesErrorClone[itemId] = status;
    setLimitFilesError(setLimitFilesErrorClone);
  };
  // Handle validation data & open model confirm complete
  const onHandleCompleteInspection = () => {
    setIsSubmitting(false);
    if (
      !debtorContact ||
      !contactsInspection ||
      contactsInspection.length < 1
    ) {
      setIsSubmitting(true);
      setIsValid(false);
      if (!debtorContact && inputDebtor.current) {
        inputDebtor.current.focus();
      } else if (
        (!contactsInspection || contactsInspection.length < 1) &&
        inputContacts.current
      ) {
        inputContacts.current.focus();
      }
    } else {
      setShowCompletedDialog(true);
    }
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
      setTimeout(() => {
        forcusFirstPoint(indexConllapseUnit);
      }, 500);
    }
  };

  const forcusFirstPoint = (indexUnit) => {
    let unitElememts = document.getElementsByName(`item-unit-${indexUnit}`);
    if (unitElememts.length) {
      let inputsFindings = unitElememts[0].getElementsByClassName(
        "inputs-findings",
      );
      inputsFindings.length && inputsFindings[0].focus();
    }
  };

  const makeInspectionEntity = (type) => {
    let paramsData = {
      feedBack: inspection.feedBack,
      actions: inspection.actions,
      debtorContact,
      contacts: map(contactsInspection, (item) => ({
        id: item._id,
        type: item.type,
      })),
    };
    let inspectionItems = [];
    forEach(inspection.units, (unitItem, unitIndex) => {
      forEach(unitItem.inspectionitems, (inspectionItem) => {
        let bills = map(inspectionItem.bills, (billItem) => ({
          costtype: billItem.costtype || "",
          description: billItem.description || "",
          price: billItem.price,
          quantity: billItem.quantity,
          total: billItem.price * billItem.quantity,
          type: BILL_TYPE.JOB,
          status: BILL_STATUS.OPEN,
          id: billItem.id || null,
        }));

        inspectionItems.push(
          Object.assign(
            type === "ViewSummary" ? { unitIndex: unitIndex } : {},
            {
              inspection: inspection._id,
              id: inspectionItem._id,
              status: inspectionItem.status,
              findings: inspectionItem.findings,
              images: inspectionItem.images || [],
              bills: bills || [],
            },
          ),
        );
      });
    });
    paramsData.inspectionItems = inspectionItems;
    return paramsData;
  };
  // Save data to DB complete inspection
  const onSendConfirmComplete = () => {
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    let paramsData = makeInspectionEntity();
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(
      inspectionActions.submitcompletedInspection(inspection._id, paramsData),
    );
    setShowCompletedDialog(!showCompletedDialog);
  };
  const addModalSourceImages = (images) => {
    setModalSourceImages(
      map(images, (file) => {
        let previewImage = !file.data
          ? file
          : URL.createObjectURL(arrayBufferToBlob(file.data, file.type));
        return {
          src: previewImage,
        };
      }),
    );
  };
  const toggleModalImages = () => {
    setmodalIsOpenImages(!modalIsOpenImages);
  };

  const handleDownloadFileReport = () => {
    if (inspection._id)
      dispatch(
        inspectionActions.submitDownloadFileReport(inspection.identifier),
      );
  };

  const _renderButtonsOnViewSummary = () => (
    <>
      <Button
        size="sm"
        color="outline-link"
        className="mr-2"
        type="button"
        disabled={isSubmitted}
        onClick={() => setViewSum(false)}
      >
        <FormattedMessage id="components.button.back" />
      </Button>
      <Button
        size="sm"
        color="success"
        type="button"
        disabled={isSubmitted}
        onClick={() => onHandleCompleteInspection()}
      >
        <FormattedMessage id="components.button.complete" />
      </Button>
    </>
  );

  const _renderButtonsOnReady = () => (
    <>
      <Button
        size="sm"
        color="outline-link"
        className="mr-2"
        type="button"
        onClick={() => setInspectionStatus(INSPECTION_STATUS.OPEN)}
      >
        <FormattedMessage id="components.button.back" />
      </Button>
      {isReviewInspection && (
        <>
          <Button
            size="sm"
            color="primary"
            className="mr-2"
            type="button"
            disabled={isSubmitted}
            onClick={() => setShowConfirmRejectModal(true)}
          >
            <FormattedMessage id="components.button.reject" />
          </Button>
          <Button
            size="sm"
            color="secondary"
            type="button"
            onClick={onHandleViewSummary}
          >
            <FormattedMessage id="components.button.viewSummary" />
          </Button>
        </>
      )}
    </>
  );
  const _renderButtonsOnOpen = () => {
    return (
      <>
        {inspection.status === INSPECTION_STATUS.INPROGRESS && (
          <div className="d-flex align-items-center text-capitalize">
            <Button
              size="sm"
              color="outline-link"
              className="mr-2"
              onClick={() => history.push(`/inspections`)}
            >
              <FormattedMessage id="components.button.cancel" />
            </Button>
            <Button
              size="sm"
              color="success"
              type="button"
              className="ml-2"
              onClick={() =>
                onSaveWhenStatusIsOpen(inspectionServices.jobStatus.inProgress)
              }
              disabled={!isDirty}
            >
              <FormattedMessage id="components.button.save" />
            </Button>
          </div>
        )}
        {(inspection.status === INSPECTION_STATUS.COMPLETED ||
          inspection.status === INSPECTION_STATUS.CLOSED) && (
          <Button
            size="sm"
            color="success"
            type="button"
            className="mr-2"
            onClick={() => handleDownloadFileReport()}
          >
            <FormattedMessage id="components.button.report" />
          </Button>
        )}
        {inspection.status === INSPECTION_STATUS.READY && (
          <>
            <Button
              size="sm"
              color="outline-link"
              className="mr-2"
              onClick={() => history.push(`/inspections`)}
            >
              <FormattedMessage id="components.button.cancel" />
            </Button>
            {isReviewInspection && (
              <Button
                size="sm"
                color="success"
                type="button"
                onClick={() => setInspectionStatus(INSPECTION_STATUS.READY)}
              >
                <FormattedMessage id="components.button.review" />
              </Button>
            )}
          </>
        )}
        {inspection.status === INSPECTION_STATUS.OPEN && (
          <div className="d-flex align-items-center text-capitalize">
            <CustomInput
              type="checkbox"
              id="ckbShowOnlyActve"
              label={<FormattedMessage id="components.checkBox.active" />}
              checked={inspectionActive}
              disabled={!isEdit}
              onChange={() =>
                setFormValues((prev) => {
                  return { ...prev, inspectionActive: !prev.inspectionActive };
                })
              }
            />
            <Button
              size="sm"
              color="success"
              type="button"
              className="ml-2"
              // onClick={() => setInspectionStatus(INSPECTION_STATUS.READY)}
              // onClick={() => history.push(`/inspections`)}
              onClick={() =>
                onSaveWhenStatusIsOpen(inspectionServices.jobStatus.open)
              }
              disabled={!isDirty}
            >
              <FormattedMessage id="components.button.save" />
            </Button>
          </div>
        )}
      </>
    );
  };

  // render value for select data
  const locations =
    inspection && inspection.location
      ? [
          {
            label: Utils.getLocationIdentifer(inspection.location),
            value: inspection.location._id,
          },
        ]
      : [];

  /**
   * Em Dinh: https://infodation.atlassian.net/browse/EEAC-597?oldIssueView=true
   */
  const [isDirty, setIsDirty] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState({
    dateInspection: null,
    instructions: "",
    inspectionActive: true,
    currentInspector: null,
  });
  const [formValues, setFormValues] = React.useState({
    dateInspection: null,
    instructions: "",
    inspectionActive: true,
    currentInspector: null,
  });
  const {
    dateInspection,
    instructions,
    inspectionActive,
    currentInspector,
  } = formValues;
  React.useEffect(() => {
    if (
      inspectionState.inspection &&
      Object.keys(inspectionState.inspection).length
    ) {
      const { inspection } = inspectionState;
      setInitialValues({
        dateInspection: new Date(inspection.dateInspection),
        instructions: inspection.instructions || "",
        inspectionActive: inspection.active,
        currentInspector: {
          label: `${inspection.inspector.firstName} ${inspection.inspector.lastName}`,
          value: inspection.inspector._id,
        },
      });
      setFormValues({
        dateInspection: new Date(inspection.dateInspection),
        instructions: inspection.instructions || "",
        inspectionActive: inspection.active,
        currentInspector: {
          label: `${inspection.inspector.firstName} ${inspection.inspector.lastName}`,
          value: inspection.inspector._id,
        },
      });
    }
  }, [inspectionState]);

  React.useEffect(() => {
    setIsDirty(!_isEqual(initialValues, formValues));
  }, [formValues, initialValues]);

  const onChangeInspectorSelect = React.useCallback((selected) => {
    setFormValues((prev) => {
      return { ...prev, currentInspector: selected };
    });
  }, []);
  const onChangeDateOfJob = React.useCallback((date) => {
    if (!date) {
      setFormValues((prev) => {
        return { ...prev, dateInspection: new Date() };
      });
    } else {
      setFormValues((prev) => {
        return { ...prev, dateInspection: date };
      });
    }
  }, []);
  const onChangeInstructions = React.useCallback((text) => {
    setFormValues((prev) => {
      return { ...prev, instructions: text };
    });
  }, []);
  const onSaveWhenStatusIsOpen = React.useCallback(
    (inspectionStatus) => {
      const updatedData = {
        dateInspection: moment(dateInspection).toISOString(),
        instructions,
        inspector: currentInspector.value,
        active: inspectionActive,
      };

      dispatch(loadingProviderActions.setStatusLoadingProvider());
      dispatch(
        reduxActions.updateInspection(
          updatedData,
          inspection.id,
          inspectionServices.jobTypes.inspection,
          inspectionStatus,
        ),
      );
    },
    [
      currentInspector,
      dateInspection,
      instructions,
      dispatch,
      inspection,
      inspectionActive,
    ],
  );

  // End of Em Dinh
  // =============================

  const planners =
    inspection && inspection.planner
      ? [
          {
            label: `${inspection.planner.firstName} ${inspection.planner.lastName}`,
            value: inspection.planner._id,
          },
        ]
      : [];

  const unitsTree =
    inspection && inspection.units
      ? map(inspection.units, (unitItem) => ({
          label: unitItem.name,
          value: unitItem.id,
        }))
      : [];

  const UnitBreadcrumb = (unit) => {
    let { location } = inspectionState;
    location = location || {};
    const isActive = unit ? !!unit.parent : false;
    return (
      <>
        {unit && unit.parent
          ? UnitBreadcrumb(
              find(location.units, (item) => item._id === unit.parent),
            )
          : null}
        {unit ? (
          <BreadcrumbItem active={isActive}>{unit.name}</BreadcrumbItem>
        ) : null}
      </>
    );
  };
  const arrayBufferToBlob = (buffer, type) => {
    return new Blob([buffer], { type: type });
  };

  const isValidInspection = checkValidInspecion(inspection.units || []);
  return (
    <Fragment>
      <PageTitle
        heading={
          viewSum || inspectionStatus === INSPECTION_STATUS.READY
            ? Utils.getLocationIdentifer(inspection.location)
            : intl.formatMessage({
                id: "components.formTitle.inspectionDetails",
              })
        }
        icon="page-title-custom-icon nav-icon-inspections"
      />
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardHeader>
              <div className="btn-actions-pane-left">
                <span className="inspection-id">{inspection.identifier}</span>
              </div>
              <div className="btn-actions-pane-right">
                {inspectionStatus === INSPECTION_STATUS.READY
                  ? viewSum
                    ? _renderButtonsOnViewSummary()
                    : _renderButtonsOnReady()
                  : _renderButtonsOnOpen()}
              </div>
            </CardHeader>
            <CardBody>
              {!isValidInspection || !isValid ? (
                <Alert color={"danger"} isOpen={!isValidInspection || !isValid}>
                  {intl.formatMessage({
                    id: "components.errors.requireAllData",
                  })}
                </Alert>
              ) : null}

              {notification && notification.message ? (
                <Alert
                  color={notification.type === "success" ? "success" : "danger"}
                  isOpen={!!notification.message}
                >
                  {Utils.showNotify(intl, notification)}
                </Alert>
              ) : null}
              {/* <CardTitle>General Information</CardTitle> */}
              {viewSum ? (
                <ViewSummary
                  intl={intl}
                  inspection={inspection}
                  handleSetInspectionSummary={handleSetInspectionSummary}
                  debtorContact={debtorContact}
                  setDebtorContact={setDebtorContact}
                  contacts={contactsInspection}
                  setContacts={setContactsInspection}
                  UnitBreadcrumb={UnitBreadcrumb}
                  isSubmitting={isSubmitting}
                  inputDebtor={inputDebtor}
                  inputContacts={inputContacts}
                  orderByPosition={orderByPosition}
                />
              ) : (
                <Col md="10" className="mx-auto">
                  {inspectionStatus === INSPECTION_STATUS.OPEN ? (
                    <>
                      <Row form>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.location" />
                            </Label>
                            <Select
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.locationIdentifier",
                              })}
                              noOptionsMessage={() =>
                                intl.formatMessage({
                                  id: "components.select.noOption",
                                })
                              }
                              value={locations[0] ? locations[0] : {}}
                              isDisabled
                              options={locations}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="">
                            <Label for="">
                              <FormattedMessage id="pages.inspection.type" />
                            </Label>
                            <Select
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.inspectionType",
                              })}
                              noOptionsMessage={() =>
                                intl.formatMessage({
                                  id: "components.select.noOption",
                                })
                              }
                              value={
                                inspection.type
                                  ? find(
                                      optionTypeInspection,
                                      (item) => item.value === inspection.type,
                                    )
                                  : {}
                              }
                              isDisabled
                              options={optionTypeInspection}
                              onChange={(value) => {}}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.unitAndSubUnit" />
                            </Label>
                            <Select
                              placeholder="Units"
                              noOptionsMessage={() =>
                                intl.formatMessage({
                                  id: "components.select.noOption",
                                })
                              }
                              value={unitsTree}
                              isDisabled
                              isMulti
                              options={unitsTree}
                            />
                            {/* <DropdownTreeSelect
                                  data={optionUnits}
                                  mode='hierarchical'
                                  disabled
                                  className="z-index-2 dropdown-tree-disable"
                                  texts={
                                    { placeholder: " " }
                                  }

                                /> */}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.inspector" />
                            </Label>
                            <Select
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.employeeFullName",
                              })}
                              noOptionsMessage={() =>
                                intl.formatMessage({
                                  id: "components.select.noOption",
                                })
                              }
                              menuPlacement="top"
                              value={currentInspector}
                              options={
                                inspectors
                                  ? inspectors.map((inspector) => {
                                      return {
                                        label: `${inspector.firstName} ${inspector.lastName}`,
                                        value: inspector._id,
                                      };
                                    })
                                  : []
                              }
                              onChange={onChangeInspectorSelect}
                              isDisabled={inspection ? !isEdit : true}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.inspectionPlanner" />
                            </Label>
                            <Select
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.employeeFullName",
                              })}
                              noOptionsMessage={() =>
                                intl.formatMessage({
                                  id: "components.select.noOption",
                                })
                              }
                              isDisabled
                              value={planners[0] ? planners[0] : {}}
                              options={planners}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.dayOfInspection" />
                            </Label>
                            <InputGroup className="z-index-1">
                              <DatePicker
                                showPopperArrow={false}
                                // selected={
                                //   inspection.dateInspection
                                //     ? new Date(inspection.dateInspection)
                                //     : startDate
                                // }
                                // onChange={handleChange}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                selected={dateInspection}
                                onChange={onChangeDateOfJob}
                                disabled={inspection ? !isEdit : true}
                              />
                              <InputGroupAddon addonType="append">
                                <div className="input-group-text">
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                </div>
                              </InputGroupAddon>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <hr />
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="">
                              <FormattedMessage id="pages.inspection.internalWork" />
                            </Label>
                            <TextareaAutosize
                              className="form-control"
                              minRows={3}
                              maxRows={6}
                              maxLength={250}
                              placeholder={intl.formatMessage({
                                id:
                                  "components.input.placeholder.typeInstructionsDesc",
                              })}
                              value={instructions}
                              onChange={(event) =>
                                onChangeInstructions(event.target.value)
                              }
                              disabled={inspection ? !isEdit : true}
                            />
                            {inspection.status === INSPECTION_STATUS.READY && (
                              <>
                                <Label for="" className="mt-3">
                                  {intl.formatMessage({
                                    id: "pages.inspection.internalFeedback",
                                  })}
                                </Label>
                                <TextareaAutosize
                                  className="form-control"
                                  minRows={3}
                                  maxRows={6}
                                  placeholder={intl.formatMessage({
                                    id:
                                      "components.input.placeholder.internalFeedbackDesc",
                                  })}
                                  defaultValue={inspection.feedBack || ""}
                                  disabled
                                />
                              </>
                            )}
                            <Label for="" className="mt-3">
                              {intl.formatMessage({
                                id: "pages.inspection.followUpAction",
                              })}
                            </Label>
                            <TextareaAutosize
                              className="form-control"
                              minRows={3}
                              maxRows={6}
                              maxLength={250}
                              placeholder={intl.formatMessage({
                                id: "pages.inspection.followUpAction",
                              })}
                              value={inspection.actions || ""}
                              onChange={(e) => {
                                setInspection({
                                  ...inspection,
                                  actions: e.target.value,
                                });
                              }}
                              disabled={
                                inspection.status !== INSPECTION_STATUS.READY
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          {/* <Label for="">Inspection points</Label> */}

                          <CardBody className="p-0" id="list-inspection-review">
                            {map(
                              inspection && inspection.units
                                ? inspection.units
                                : [],
                              (unit, idxUnit) => {
                                return (
                                  <React.Fragment key={idxUnit}>
                                    <Breadcrumb
                                      className="mt-3 mb-0 eeac-units-breadcrumb"
                                      onClick={() =>
                                        onHandleCollapseUnit(idxUnit + 1)
                                      }
                                    >
                                      {UnitBreadcrumb(unit)}
                                    </Breadcrumb>
                                    <Collapse
                                      isOpen={unitsCollapse === idxUnit + 1}
                                      data-parent="#exampleAccordion"
                                    >
                                      <ListGroup
                                        name={`item-unit-${idxUnit + 1}`}
                                      >
                                        {map(
                                          unit.inspectionitems,
                                          (inspectionItem, idxPoint) => {
                                            return (
                                              <ListGroupItem
                                                className="border-0 pl-0 pr-0 pb-0 pt-0 inspection-point-item"
                                                key={`unit-${idxUnit}-${idxPoint}`}
                                              >
                                                {inspectionStatus ===
                                                  INSPECTION_STATUS.OPEN && (
                                                  <div className="d-flex justify-content-between align-items-center">
                                                    <Label
                                                      for=""
                                                      className="font-weight-600 mb-0"
                                                    >
                                                      {
                                                        inspectionItem.description
                                                      }
                                                    </Label>
                                                    {/* <Button color="" className="text-left m-0 p-0">
                                                      <i className="eeac-icon eeac-icon-close"></i>
                                                    </Button>
                                                    <p className="m-0 p-0 ml-3">{inspectionItem.description}</p> */}
                                                  </div>
                                                )}
                                                {inspectionStatus ===
                                                  INSPECTION_STATUS.READY && (
                                                  <FormGroup className="mb-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                      <Label
                                                        for=""
                                                        className="font-weight-600 mb-0"
                                                      >
                                                        {
                                                          inspectionItem.description
                                                        }
                                                      </Label>

                                                      <div>
                                                        <div>
                                                          <Label
                                                            for=""
                                                            className="mr-2"
                                                          ></Label>
                                                          <ButtonGroup size="sm">
                                                            <Button
                                                              className={`btn-icon btn-icon-only bd-r-50 btn-condition happy`}
                                                              color="light"
                                                              onClick={() =>
                                                                onHandleConditionInspection(
                                                                  idxUnit,
                                                                  idxPoint,
                                                                  INSPECTION_ITEM_STATUS.GREEN,
                                                                  inspectionItem.id,
                                                                )
                                                              }
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
                                                              onClick={() =>
                                                                onHandleConditionInspection(
                                                                  idxUnit,
                                                                  idxPoint,
                                                                  INSPECTION_ITEM_STATUS.YELLOW,
                                                                  inspectionItem.id,
                                                                )
                                                              }
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
                                                              onClick={() =>
                                                                onHandleConditionInspection(
                                                                  idxUnit,
                                                                  idxPoint,
                                                                  INSPECTION_ITEM_STATUS.RED,
                                                                  inspectionItem.id,
                                                                )
                                                              }
                                                              active={
                                                                inspectionItem.status ===
                                                                INSPECTION_ITEM_STATUS.RED
                                                              }
                                                            >
                                                              <EmoticonSadOutlineIcon className="btn-icon-wrapper emoticon-sad-icon" />
                                                            </Button>
                                                            <Uploader
                                                              filesCount={
                                                                inspectionItem.images
                                                                  ? inspectionItem
                                                                      .images
                                                                      .length
                                                                  : 0
                                                              }
                                                              onUpload={(
                                                                files,
                                                              ) => {
                                                                onHandleAddImages(
                                                                  idxUnit,
                                                                  idxPoint,
                                                                  files,
                                                                );
                                                                setErrorMessageLimitFile(
                                                                  inspectionItem.id,
                                                                  false,
                                                                );
                                                              }}
                                                              onUploadError={({
                                                                message,
                                                              }) => {
                                                                if (message) {
                                                                  setErrorMessageLimitFile(
                                                                    inspectionItem.id,
                                                                    true,
                                                                  );
                                                                }
                                                              }}
                                                            />
                                                            <Button
                                                              className="btn-icon btn-icon-only bd-r-50 btn-condition"
                                                              color="light"
                                                              // disabled={!includes([INSPECTION_ITEM_STATUS.YELLOW, INSPECTION_ITEM_STATUS.RED], inspectionItem.status)}
                                                              onClick={() =>
                                                                onHandleAddBill(
                                                                  idxUnit,
                                                                  idxPoint,
                                                                )
                                                              }
                                                            >
                                                              <CurrencyEurIcon className="btn-icon-wrapper currency-eur-icon" />
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
                                                        inspectionItem.images
                                                          .length < 1 ||
                                                        inspectionItem.images
                                                          .length > 8 ||
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
                                                    {limitFilesError[
                                                      inspectionItem.id
                                                    ] && (
                                                      <Alert
                                                        className="mt-1"
                                                        color="danger"
                                                        isOpen={true}
                                                      >
                                                        {intl.formatMessage({
                                                          id:
                                                            "components.errors.limitPhotos",
                                                        })}
                                                      </Alert>
                                                    )}
                                                    <TextareaAutosize
                                                      className={`${
                                                        isSubmitting &&
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
                                                      value={
                                                        inspectionItem.findings ||
                                                        ""
                                                      }
                                                      disabled={isSubmitted}
                                                      onChange={({ target }) =>
                                                        handleChangeFindings(
                                                          idxUnit,
                                                          idxPoint,
                                                          target.value,
                                                        )
                                                      }
                                                    />
                                                    {/* {isSubmitting && !inspectionItem.findings && includes([INSPECTION_ITEM_STATUS.YELLOW, INSPECTION_ITEM_STATUS.RED], inspectionItem.status) && (
                                                          <FormFeedback className="d-block">Description is required.</FormFeedback>
                                                        )} */}

                                                    {/* Photos */}
                                                    <div>
                                                      <aside
                                                        style={
                                                          styles.thumbsContainer
                                                        }
                                                      >
                                                        {map(
                                                          inspectionItem.images,
                                                          (file, idxImage) => {
                                                            let previewImage = !file.data
                                                              ? file
                                                              : URL.createObjectURL(
                                                                  arrayBufferToBlob(
                                                                    file.data,
                                                                    file.type,
                                                                  ),
                                                                );
                                                            return (
                                                              <div
                                                                style={
                                                                  styles.thumb
                                                                }
                                                                key={`unit-${idxUnit}-${idxImage}`}
                                                              >
                                                                <div
                                                                  style={
                                                                    styles.thumbRemove
                                                                  }
                                                                  onClick={() =>
                                                                    onHandleRemoveImages(
                                                                      idxUnit,
                                                                      idxPoint,
                                                                      idxImage,
                                                                    )
                                                                  }
                                                                >
                                                                  <CloseCircleOutline
                                                                    fill="#fff"
                                                                    className="svg-shadow"
                                                                  />
                                                                </div>

                                                                <div
                                                                  style={
                                                                    styles.thumbInner
                                                                  }
                                                                >
                                                                  <img
                                                                    src={
                                                                      previewImage
                                                                    }
                                                                    style={
                                                                      styles.img
                                                                    }
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
                                                    {map(
                                                      inspectionItem.bills,
                                                      (billItem, idxBill) => {
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
                                                                onClick={() =>
                                                                  onHandleRemoveBill(
                                                                    idxUnit,
                                                                    idxPoint,
                                                                    idxBill,
                                                                  )
                                                                }
                                                              >
                                                                <MinusIcon />
                                                              </Button>
                                                              <div className="flex-grow-1">
                                                                <FormGroup>
                                                                  <Input
                                                                    type="text"
                                                                    placeholder={intl.formatMessage(
                                                                      {
                                                                        id:
                                                                          "components.input.placeholder.expenditureDesc",
                                                                      },
                                                                    )}
                                                                    value={
                                                                      billItem.description ||
                                                                      ""
                                                                    }
                                                                    onChange={({
                                                                      target,
                                                                    }) =>
                                                                      onHandleChangeBillDescription(
                                                                        idxUnit,
                                                                        idxPoint,
                                                                        idxBill,
                                                                        target.value,
                                                                      )
                                                                    }
                                                                    invalid={
                                                                      isSubmitting &&
                                                                      !billItem.description
                                                                    }
                                                                  />
                                                                  {isSubmitting &&
                                                                    !billItem.description && (
                                                                      <FormFeedback className="d-block">
                                                                        {intl.formatMessage(
                                                                          {
                                                                            id:
                                                                              "components.errors.description.require",
                                                                          },
                                                                        )}
                                                                      </FormFeedback>
                                                                    )}
                                                                </FormGroup>
                                                                <FormGroup
                                                                  row
                                                                  className="mt-2 mb-1"
                                                                >
                                                                  <Col>
                                                                    <FormGroup>
                                                                      <Select
                                                                        className={`${
                                                                          isSubmitting &&
                                                                          !billItem.costtype
                                                                            ? "is-invalid"
                                                                            : ""
                                                                        } select-cost-type`}
                                                                        value={
                                                                          billItem.costtype
                                                                            ? find(
                                                                                costTypes,
                                                                                (
                                                                                  itemCostType,
                                                                                ) =>
                                                                                  itemCostType._id ===
                                                                                  billItem.costtype,
                                                                              )
                                                                            : {}
                                                                        }
                                                                        getOptionLabel={(
                                                                          opt,
                                                                        ) =>
                                                                          opt.name
                                                                        }
                                                                        getOptionValue={(
                                                                          opt,
                                                                        ) =>
                                                                          opt._id
                                                                        }
                                                                        onChange={(
                                                                          val,
                                                                        ) =>
                                                                          onHandleChangeBillCostType(
                                                                            idxUnit,
                                                                            idxPoint,
                                                                            idxBill,
                                                                            val._id,
                                                                          )
                                                                        }
                                                                        options={
                                                                          costTypes
                                                                        }
                                                                        placeholder={intl.formatMessage(
                                                                          {
                                                                            id:
                                                                              "components.input.placeholder.costType",
                                                                          },
                                                                        )}
                                                                        noOptionsMessage={() =>
                                                                          intl.formatMessage(
                                                                            {
                                                                              id:
                                                                                "components.select.noOption",
                                                                            },
                                                                          )
                                                                        }
                                                                      />
                                                                      {isSubmitting &&
                                                                        !billItem.costtype && (
                                                                          <FormFeedback className="d-block">
                                                                            {intl.formatMessage(
                                                                              {
                                                                                id:
                                                                                  "components.errors.costType.require",
                                                                              },
                                                                            )}
                                                                          </FormFeedback>
                                                                        )}
                                                                    </FormGroup>
                                                                  </Col>
                                                                  <Col>
                                                                    <FormGroup>
                                                                      <NumberFormat
                                                                        fixedDecimalScale={
                                                                          true
                                                                        }
                                                                        thousandSeparator="."
                                                                        decimalSeparator=","
                                                                        className={`${
                                                                          isSubmitting &&
                                                                          !billItem.price
                                                                            ? "is-invalid "
                                                                            : ""
                                                                        } form-control`}
                                                                        decimalScale={
                                                                          2
                                                                        }
                                                                        inputMode="numeric"
                                                                        allowNegative={
                                                                          false
                                                                        }
                                                                        allowLeadingZeros={
                                                                          false
                                                                        }
                                                                        isAllowed={(
                                                                          values,
                                                                        ) => {
                                                                          const {
                                                                            formattedValue,
                                                                            floatValue,
                                                                          } = values;
                                                                          return (
                                                                            formattedValue ===
                                                                              "" ||
                                                                            floatValue <=
                                                                              10000
                                                                          );
                                                                        }}
                                                                        value={
                                                                          billItem.price ||
                                                                          undefined
                                                                        }
                                                                        onValueChange={(
                                                                          values,
                                                                        ) => {
                                                                          const {
                                                                            floatValue,
                                                                          } = values;
                                                                          onHandleChangeBillPrice(
                                                                            idxUnit,
                                                                            idxPoint,
                                                                            idxBill,
                                                                            floatValue,
                                                                          );
                                                                        }}
                                                                        placeholder="€"
                                                                        prefix="€ "
                                                                      />
                                                                      {isSubmitting &&
                                                                        !billItem.price && (
                                                                          <FormFeedback className="d-block">
                                                                            {intl.formatMessage(
                                                                              {
                                                                                id:
                                                                                  "components.errors.price.require",
                                                                              },
                                                                            )}
                                                                          </FormFeedback>
                                                                        )}
                                                                    </FormGroup>
                                                                  </Col>
                                                                  <span className="my-2">
                                                                    X
                                                                  </span>
                                                                  <Col>
                                                                    <FormGroup>
                                                                      <NumericInput
                                                                        type="number"
                                                                        min={1}
                                                                        max={
                                                                          100
                                                                        }
                                                                        className="form-control"
                                                                        placeholder={intl.formatMessage(
                                                                          {
                                                                            id:
                                                                              "components.input.placeholder.unitQuantity",
                                                                          },
                                                                        )}
                                                                        value={
                                                                          billItem.quantity ||
                                                                          1
                                                                        }
                                                                        onChange={(
                                                                          value,
                                                                        ) =>
                                                                          onHandleChangeBillQuantity(
                                                                            idxUnit,
                                                                            idxPoint,
                                                                            idxBill,
                                                                            value >
                                                                              0
                                                                              ? value
                                                                              : billItem.quantity,
                                                                          )
                                                                        }
                                                                      />
                                                                      {isSubmitting &&
                                                                        !billItem.quantity && (
                                                                          <FormFeedback className="d-block">
                                                                            {intl.formatMessage(
                                                                              {
                                                                                id:
                                                                                  "components.errors.quantity.require",
                                                                              },
                                                                            )}
                                                                          </FormFeedback>
                                                                        )}
                                                                    </FormGroup>
                                                                  </Col>
                                                                  <span className="my-2">
                                                                    =
                                                                  </span>
                                                                  <Col>
                                                                    <Input
                                                                      type="text"
                                                                      value={
                                                                        billItem.price &&
                                                                        billItem.quantity
                                                                          ? nlFormat(
                                                                              parseFloat(
                                                                                billItem.price,
                                                                              ) *
                                                                                billItem.quantity,
                                                                            )
                                                                          : ""
                                                                      }
                                                                      disabled
                                                                      className="border-0 no-background"
                                                                    />
                                                                  </Col>
                                                                </FormGroup>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        );
                                                      },
                                                    )}
                                                  </FormGroup>
                                                )}
                                              </ListGroupItem>
                                            );
                                          },
                                        )}
                                      </ListGroup>
                                    </Collapse>
                                  </React.Fragment>
                                );
                              },
                            )}
                          </CardBody>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                </Col>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <DialogCopyTemplate
        isOpen={toggleDialogCopyTemplate}
        onToggleOpen={onHandleToggleDialogCopyTemplate}
        onCopyTemplate={onCopyTemplate}
      />

      <ConfirmCompleteModal
        isOpen={showCompletedDialog}
        onToggleOpen={() => setShowCompletedDialog(!showCompletedDialog)}
        onSendConfirmComplete={onSendConfirmComplete}
      />
      <ModalConfirmReject
        isOpen={showConfirmRejectModal}
        inspection={inspection}
        onToggleOpen={() => setShowConfirmRejectModal(!showConfirmRejectModal)}
      />
      <ModalGateway>
        {modalIsOpenImages ? (
          <Modal onClose={toggleModalImages}>
            <Carousel views={modalSourceImages} />
          </Modal>
        ) : null}
      </ModalGateway>
      {isFetchingInspectionData ? <LoadingIndicator /> : null}
    </Fragment>
  );
}

export default memo(injectIntl(DetailInspection));
