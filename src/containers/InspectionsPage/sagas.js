import { takeLatest, call, put, all, takeEvery } from "redux-saga/effects";
import {
  GET_INIT_NEW_INSPECTION,
  RECEIVE_INSPECTORS,
  // RECEIVE_LOCATIONS,
  RECEIVE_MESSAGE_INSPECTION,
  RECEIVE_MESSAGE_MAINTENANCE,
  RECEIVE_MESSAGE_CLEANING,
  SUBMIT_GET_UNITS_TEMPLATE,
  RECEIVE_UNITS_TEMPLATE,
  SUBMIT_OPEN_NEW_INSPECTION,
  RECEIVE_GET_INSPECTIONS,
  SUBMIT_GET_INSPECTIONS,
  SUBMIT_GET_INSPECTION,
  RECEIVE_GET_INSPECTION,
  RECEIVE_GET_LOCATION,
  RECEIVE_GET_COSTTYPES,
  SUBMIT_GET_COSTTYPES,
  SUBMIT_GET_CONTACTS,
  RECEIVE_GET_PERSONS,
  RECEIVE_GET_GROUPINGS,
  SUBMIT_GET_DEBTORCONTACT,
  RECEIVE_GET_DEBTORCONTACT,
  SUBMIT_COMPLETE_INSPECTION,
  SUBMIT_REJECT_INSPECTION,
  SUBMIT_DOWNLOAD_REPORT,
  SUBMIT_GET_MAINTENANCES,
  SUBMIT_OPEN_NEW_MAINTENANCE,
  RECEIVE_GET_MAINTENANCES,
  SUBMIT_COMPLETE_MAINTENANCE,
  SUBMIT_REJECT_MAINTENANCE,
  SUBMIT_GET_CLEANINGS,
  RECEIVE_GET_CLEANINGS,
  SUBMIT_OPEN_NEW_CLEANING,
  SUBMIT_COMPLETE_CLEANING,
  SUBMIT_REJECT_CLEANING,

  // Pagination
  INSPECTION_FETCH_COUNT_DATA,
  INSPECTION_FETCH_COUNT_DATA_SUCCESS,
  INSPECTION_GET_DATA_REQUEST_STATUS,
  INSPECTION_REVIEW_REQUEST_STATUS,
  // Maintenance
  MAINTENANCE_FETCH_COUNT_DATA,
  MAINTENANCE_FETCH_COUNT_DATA_SUCCESS,
  MAINTENANCE_GET_DATA_REQUEST_STATUS,
  //Cleaning
  CLEANING_FETCH_COUNT_DATA,
  CLEANING_FETCH_COUNT_DATA_SUCCESS,
  CLEANING_GET_DATA_REQUEST_STATUS,
  // Constants Variable
  INSPECTION_STATUS,
} from "./constants";
import { actionTypes } from "./constants";
import {
  allowReviewInspection,
} from "./utils";

import { HIDDEN_STATUS_REQUEST_LOADING_PROVIDER } from "../LoadingProvider/constants";

import {
  locationService,
  usersPermissions,
  inspectionService,
  invoiceService,
  contactService,
} from "../../services";
import { push } from "react-router-redux";
import { filter, map, concat } from "lodash";
import Config from "../../config";
import uuid from "uuid";
import * as reduxActions from "./action";

export function* getInitNewInspection({ role }) {
  try {
    // const locations = yield call(locationService.getLocations, {
    //   active: true,
    //   _limit: 10,
    //   _start: 0,
    // });
    // yield put({ type: RECEIVE_LOCATIONS, data: locations });

    const inspections = yield call(usersPermissions.fetchUsers, {
      roles: role,
      blocked: false,
    });
    yield put({ type: RECEIVE_INSPECTORS, data: inspections });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  }
}

export function* getUnitInspectionTemplate({ unitIds }) {
  try {
    const units = yield call(locationService.getInspectionByUnitIds, unitIds);
    yield put({ type: RECEIVE_UNITS_TEMPLATE, data: units });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  }
}

export function* handleSubmitOpenInspection({ inspection }) {
  try {
    yield call(inspectionService.createNewInspection, inspection);
    let notification = {
      type: "success",
      message: "Inspection created successfully",
      key: "pages.inspection.createInspection.success",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });

    yield put(push(`/inspections`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
      page: "new",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* getAllInspection({ searchData }) {
  try {
    yield put({ type: INSPECTION_GET_DATA_REQUEST_STATUS, data: true });
    const inspections = yield call(
      inspectionService.getAllInspection,
      searchData,
    );
    yield put({ type: RECEIVE_GET_INSPECTIONS, data: inspections });
    yield put({ type: INSPECTION_GET_DATA_REQUEST_STATUS, data: false });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
    yield put({ type: INSPECTION_GET_DATA_REQUEST_STATUS, data: false });
  }
}

// Pagination
function* fetchCountInspections({ params }) {
  try {
    const totalData = yield call(
      inspectionService.fetchCountInspecitons,
      params,
      "/inspections/count",
    );
    yield put({ type: INSPECTION_FETCH_COUNT_DATA_SUCCESS, data: totalData });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  }
}

export function* getInspection({ id, roleByJobType, user }) {
  try {
    // TODO need to check status Ready and role can review
    yield put({ type: INSPECTION_REVIEW_REQUEST_STATUS, data: true });
    const inspection = yield call(inspectionService.getInspection, id);
    if (inspection) {
      const inspections = yield call(usersPermissions.fetchUsers, {
        roles: roleByJobType,
        blocked: false,
      });
      yield put({ type: RECEIVE_INSPECTORS, data: inspections });
      yield put({ type: RECEIVE_GET_INSPECTION, data: inspection });
      if (inspection.location) {
        const { country } = inspection.location;
        let locationId = inspection.location._id;
        let location = yield call(locationService.getLocation, locationId);
        if (location) {
          yield put({ type: RECEIVE_GET_LOCATION, data: location });
          yield put({ type: INSPECTION_REVIEW_REQUEST_STATUS, data: false });
        }

        // Fetch costtype when inspetion Ready to review inspection
        if (
          [
            INSPECTION_STATUS.READY,
            INSPECTION_STATUS.COMPLETED,
            INSPECTION_STATUS.CLOSED,
          ].includes(inspection.status)
        ) {
          yield put({
            type: SUBMIT_GET_COSTTYPES,
            params: { country: country },
          });
        }
      } else {
        yield put({ type: INSPECTION_REVIEW_REQUEST_STATUS, data: false });
      }

      // Fetch contact person & grouping & debtor contact when Reviewer to review inspection
      const isReviewInspection = allowReviewInspection(
        user,
        "Inspection",
        inspection.status,
      );
      if (isReviewInspection) {
        yield call(getContacts, { active: true });
        yield call(getDebtorContacts);
      }
    } else {
      yield put(push(`/inspections`));
      yield put({ type: INSPECTION_REVIEW_REQUEST_STATUS, data: false });
    }
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: INSPECTION_REVIEW_REQUEST_STATUS, data: false });
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  }
}
export function* getCostTypes({ params }) {
  try {
    const costTypes = yield call(invoiceService.getCostTypes, params);
    yield put({ type: RECEIVE_GET_COSTTYPES, data: costTypes });
  } catch (error) {
    if (error.response && error.response.status !== 403) {
      let notification = {
        type: "error",
        message: error.data.message || "Error",
      };
      yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
    }
  }
}

export function* getContacts({ params }) {
  try {
    const persons = yield call(locationService.getContactPerson, params);
    yield put({ type: RECEIVE_GET_PERSONS, data: persons });
    const groupings = yield call(locationService.getContactGroupings, params);
    yield put({ type: RECEIVE_GET_GROUPINGS, data: groupings });
  } catch (error) {
    if (error.response && error.response.status !== 403) {
      let notification = {
        type: "error",
        message: error.data.message || "Error",
      };
      yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
    }
  }
}

export function* getDebtorContacts() {
  try {
    let contacts = yield call(contactService.getDebtorContactList, {
      isDebtor: true,
    });
    // contacts = filter(contacts, item => item.isDebtor);
    yield put({ type: RECEIVE_GET_DEBTORCONTACT, data: contacts });
  } catch (error) {
    if (error.response && error.response.status !== 403) {
      let notification = {
        type: "error",
        message: error.data.message || "Error",
      };
      yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
    }
  }
}
const arrayBufferToBlob = (buffer, type) => {
  return new Blob([buffer], { type: type });
};
export function* uploadImages(images) {
  try {
    let formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      const { data, type } = images[i];
      const blob = arrayBufferToBlob(data, type);
      formData.append("files", blob, uuid());
    }
    formData.append("path", Config.S3_IMAGE_PATH);
    const resp = yield call(inspectionService.uploadImage, formData);
    return resp;
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  }
}
// complete inspection
export function* handleSubmitCompleteInspection({
  inspectionId,
  inspectionData,
}) {
  try {
    let { inspectionItems } = inspectionData;
    // handle upload images
    for (let i in inspectionItems) {
      let { images } = inspectionItems[i];
      let imagesUploaded = [];
      images = images || [];
      let imagesUpload = filter(images, (item) => item.data && item.type);
      if (imagesUpload && imagesUpload.length) {
        imagesUploaded = yield call(uploadImages, imagesUpload);
        inspectionItems[i].images = concat(
          filter(images, (item) => !item.data),
          map(imagesUploaded, (item) => item.url),
        );
      }
    }

    yield call(
      inspectionService.completeInspection,
      inspectionId,
      inspectionData,
    );
    let notification = {
      type: "success",
      message: "Inspection completed",
      key: "pages.inspection.changeStatus.complete",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });

    yield put(push(`/inspections`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}
export function* handleSubmitRejectInspection({ inspectionId, rejectMessage }) {
  try {
    yield call(inspectionService.rejectInspection, inspectionId, rejectMessage);
    let notification = {
      type: "success",
      message: "Inspection rejected successfully",
      key: "pages.inspection.changeStatus.reject",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });

    yield put(push(`/inspections`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* submitDownloadFileReport({ identifier }) {
  try {
    yield call(inspectionService.dowloadFileReportInspection, identifier);
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  }
}
// Maintenance sagas

export function* getMaintenances({ searchData }) {
  try {
    yield put({ type: MAINTENANCE_GET_DATA_REQUEST_STATUS, data: true });
    const maintenances = yield call(
      inspectionService.getAllInspection,
      searchData,
      "/inspections/maintenances",
    );
    yield put({ type: RECEIVE_GET_MAINTENANCES, data: maintenances });
    yield put({ type: MAINTENANCE_GET_DATA_REQUEST_STATUS, data: false });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });
    yield put({ type: MAINTENANCE_GET_DATA_REQUEST_STATUS, data: false });
  }
}

// Pagination
function* fetchCountMaintenances({ params }) {
  try {
    const totalData = yield call(
      inspectionService.fetchCountInspecitons,
      params,
      "/inspections/count",
    );
    yield put({ type: MAINTENANCE_FETCH_COUNT_DATA_SUCCESS, data: totalData });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });
  }
}

export function* handleSubmitOpenMaintenance({ inspection }) {
  try {
    yield call(
      inspectionService.createNewInspection,
      inspection,
      "/inspections/maintenance",
    );
    let notification = {
      type: "success",
      message: "Maintenance created successfully",
      key: "pages.maintenance.createMaintenance.success",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });

    yield put(push(`/maintenances`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
      page: "new",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* handleSubmitRejectMaintenance({
  inspectionId,
  rejectMessage,
}) {
  try {
    yield call(
      inspectionService.rejectMaintenance,
      inspectionId,
      rejectMessage,
    );
    let notification = {
      type: "success",
      message: "Maintenance rejected successfully",
      key: "pages.maintenance.changeStatus.reject",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });

    yield put(push(`/maintenances`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* handleSubmitCompleteMaintenance({
  inspectionId,
  inspectionData,
}) {
  try {
    let { inspectionItems } = inspectionData;
    // handle upload images
    for (let i in inspectionItems) {
      let { images } = inspectionItems[i];
      let imagesUploaded = [];
      images = images || [];
      let imagesUpload = filter(images, (item) => item.data && item.type);
      if (imagesUpload && imagesUpload.length) {
        imagesUploaded = yield call(uploadImages, imagesUpload);
        inspectionItems[i].images = concat(
          filter(images, (item) => !item.data),
          map(imagesUploaded, (item) => item.url),
        );
      }
    }

    yield call(
      inspectionService.completeMaintenance,
      inspectionId,
      inspectionData,
    );
    let notification = {
      type: "success",
      message: "Maintenance completed",
      key: "pages.maintenance.changeStatus.complete",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });

    yield put(push(`/maintenances`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_MAINTENANCE, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

// Cleaning sagas
export function* getCleanings({ searchData }) {
  try {
    yield put({ type: CLEANING_GET_DATA_REQUEST_STATUS, data: true });
    const cleanings = yield call(
      inspectionService.getAllInspection,
      searchData,
      "/inspections/cleanings",
    );
    yield put({ type: RECEIVE_GET_CLEANINGS, data: cleanings });
    yield put({ type: CLEANING_GET_DATA_REQUEST_STATUS, data: false });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });
    yield put({ type: CLEANING_GET_DATA_REQUEST_STATUS, data: false });
  }
}

// Pagination
function* fetchCountCleanings({ params }) {
  try {
    const totalData = yield call(
      inspectionService.fetchCountInspecitons,
      params,
      "/inspections/count",
    );
    yield put({ type: CLEANING_FETCH_COUNT_DATA_SUCCESS, data: totalData });
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });
  }
}

export function* handleSubmitOpenCleaning({ inspection }) {
  try {
    yield call(
      inspectionService.createNewInspection,
      inspection,
      "/inspections/cleaning",
    );
    let notification = {
      type: "success",
      message: "Cleaning created successfully",
      key: "pages.cleaning.createCleaning.success",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });

    yield put(push(`/cleaning`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data ? error.data.message : "Error",
      page: "new",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* handleSubmitRejectCleaning({ inspectionId, rejectMessage }) {
  try {
    yield call(inspectionService.rejectCleaning, inspectionId, rejectMessage);
    let notification = {
      type: "success",
      message: "Cleaning rejected successfully",
      key: "pages.cleaning.changeStatus.reject",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });

    yield put(push(`/cleaning`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

export function* handleSubmitCompleteCleaning({
  inspectionId,
  inspectionData,
}) {
  try {
    let { inspectionItems } = inspectionData;
    // handle upload images
    for (let i in inspectionItems) {
      let { images } = inspectionItems[i];
      let imagesUploaded = [];
      images = images || [];
      let imagesUpload = filter(images, (item) => item.data && item.type);
      if (imagesUpload && imagesUpload.length) {
        imagesUploaded = yield call(uploadImages, imagesUpload);
        inspectionItems[i].images = concat(
          filter(images, (item) => !item.data),
          map(imagesUploaded, (item) => item.url),
        );
      }
    }

    yield call(
      inspectionService.completeCleaning,
      inspectionId,
      inspectionData,
    );
    let notification = {
      type: "success",
      message: "Cleaning completed",
      key: "pages.cleaning.changeStatus.complete",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });

    yield put(push(`/cleaning`));
  } catch (error) {
    let notification = {
      type: "error",
      message: error.data.message || "Error",
    };
    yield put({ type: RECEIVE_MESSAGE_CLEANING, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}

/**
 * Em Dinh: https://infodation.atlassian.net/browse/EEAC-597?oldIssueView=true
 */
const notiWithJobType = {
  inspection: {
    type: RECEIVE_MESSAGE_INSPECTION,
    notification: {
      type: "success",
      message: "Update inspection job success",
      key: "components.notification.updateInspectionSuccess",
    },
  },
  maintenance: {
    type: RECEIVE_MESSAGE_MAINTENANCE,
    notification: {
      type: "success",
      message: "Update maintenance job success",
      key: "components.notification.updateMaintenanceSuccess",
    },
  },
  cleaning: {
    type: RECEIVE_MESSAGE_CLEANING,
    notification: {
      type: "success",
      message: "Update cleaning job success",
      key: "components.notification.updateCleaningSuccess",
    },
  },
};

export function* updateInspection({ payload }) {
  const { jobId, data, jobType, status } = payload;
  try {
    const res = yield call(
      inspectionService.updateInspection,
      jobId,
      data,
      jobType,
      status,
    );
    yield put(reduxActions.updateInspectionSuccess(res));
    yield put(notiWithJobType[jobType]);
  } catch (error) {
    console.log("function*updateInspection -> error", error);
    let notification = {
      type: "error",
      message: error.data.message || "Error",
      page: "new",
    };
    yield put({ type: RECEIVE_MESSAGE_INSPECTION, notification });
  } finally {
    // hidden loading provider
    yield put({ type: HIDDEN_STATUS_REQUEST_LOADING_PROVIDER });
  }
}
/**
 * End of Em Dinh
 */

export default function defaultInspectionSaga() {
  return function* watchEmployeeSaga() {
    yield all([
      // Inspection
      yield takeLatest(GET_INIT_NEW_INSPECTION, getInitNewInspection),
      yield takeLatest(SUBMIT_GET_INSPECTIONS, getAllInspection),
      yield takeEvery(SUBMIT_GET_UNITS_TEMPLATE, getUnitInspectionTemplate),
      yield takeEvery(SUBMIT_OPEN_NEW_INSPECTION, handleSubmitOpenInspection),
      yield takeLatest(SUBMIT_GET_INSPECTION, getInspection),
      yield takeLatest(SUBMIT_GET_COSTTYPES, getCostTypes),
      yield takeLatest(SUBMIT_GET_CONTACTS, getContacts),
      yield takeLatest(SUBMIT_GET_DEBTORCONTACT, getDebtorContacts),
      yield takeLatest(actionTypes.UPDATE_INSPECTION, updateInspection),

      yield takeEvery(
        SUBMIT_COMPLETE_INSPECTION,
        handleSubmitCompleteInspection,
      ),
      yield takeEvery(SUBMIT_REJECT_INSPECTION, handleSubmitRejectInspection),

      yield takeLatest(SUBMIT_DOWNLOAD_REPORT, submitDownloadFileReport),

      //Maintenance
      yield takeLatest(SUBMIT_GET_MAINTENANCES, getMaintenances),
      yield takeEvery(SUBMIT_OPEN_NEW_MAINTENANCE, handleSubmitOpenMaintenance),
      yield takeEvery(SUBMIT_REJECT_MAINTENANCE, handleSubmitRejectMaintenance),
      yield takeEvery(
        SUBMIT_COMPLETE_MAINTENANCE,
        handleSubmitCompleteMaintenance,
      ),

      //Cleaning
      yield takeLatest(SUBMIT_GET_CLEANINGS, getCleanings),
      yield takeEvery(SUBMIT_OPEN_NEW_CLEANING, handleSubmitOpenCleaning),
      yield takeEvery(SUBMIT_REJECT_CLEANING, handleSubmitRejectCleaning),
      yield takeEvery(SUBMIT_COMPLETE_CLEANING, handleSubmitCompleteCleaning),

      // Pagination saga
      // Inspeciton
      yield takeEvery(INSPECTION_FETCH_COUNT_DATA, fetchCountInspections),
      // Maintenance
      yield takeEvery(MAINTENANCE_FETCH_COUNT_DATA, fetchCountMaintenances),
      // Cleaning
      yield takeEvery(CLEANING_FETCH_COUNT_DATA, fetchCountCleanings),
    ]);
  };
}
