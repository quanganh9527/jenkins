import { find } from "lodash";
import {
  INSPECTION_ITEM_STATUS,
  ROLE_INSPECTION_CAN_VIEW,
  ROLE_INSPECTION_PLANNER,
  ROLE_MAINTENANCE_CAN_VIEW,
  ROLE_MAINTENANCE_PLANNER,
  ROLE_CLEANING_CAN_VIEW,
  ROLE_CLEANING_PLANNER,
  INSPECTION_STATUS,
  ROLE_INSPECTION_CAN_EDIT,
  ROLE_MAINTENANCE_CAN_EDIT,
  ROLE_CLEANING_CAN_EDIT,
  ROLE_INSPECTION_CAN_REVIEW,
  ROLE_MAINTENANCE_CAN_REVIEW,
  ROLE_CLEANING_CAN_REVIEW,
} from "./constants";
export const checkValidInspecion = (units) => {
  let count = 0;
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const items = unit.inspectionitems;
    for (let j = 0; j < items.length; j++) {
      const { status, findings, images } = items[j];

      if (
        status === INSPECTION_ITEM_STATUS.YELLOW ||
        status === INSPECTION_ITEM_STATUS.RED
      ) {
        if (findings && findings.length && images && images.length) {
          ///
        } else {
          count += 1;
        }
      }
    }
  }

  return count > 0 ? false : true;
};

/**
 * Role viewer just display complated or closed and just view detail
 *  @param jobType Type of Inspection Job (Inspection, Maintenance, Cleaning)
 */
export const checkIsRoleJustViewer = (user, jobType) => {
  const { roles } = user;
  const rolesInspection = {
    Inspection: [...ROLE_INSPECTION_CAN_VIEW, ...ROLE_INSPECTION_PLANNER],
    Maintenance: [...ROLE_MAINTENANCE_CAN_VIEW, ...ROLE_MAINTENANCE_PLANNER],
    Cleaning: [...ROLE_CLEANING_CAN_VIEW, ...ROLE_CLEANING_PLANNER],
  };
  const isViewer = find(
    roles,
    (roleItem) =>
      roleItem._id &&
      find(rolesInspection[jobType], (item) => item === roleItem.type),
  );
  return !isViewer;
};

export const allowEditInspection = (user, jobType, status) => {
  const { roles } = user;
  const rolesInspection = {
    Inspection: [...ROLE_INSPECTION_CAN_EDIT],
    Maintenance: [...ROLE_MAINTENANCE_CAN_EDIT],
    Cleaning: [...ROLE_CLEANING_CAN_EDIT],
  };
  const isEditor =
    find(
      roles,
      (roleItem) =>
        roleItem._id &&
        find(rolesInspection[jobType], (item) => item === roleItem.type),
    ) &&
    [INSPECTION_STATUS.OPEN, INSPECTION_STATUS.INPROGRESS].includes(status);
  return isEditor;
};

export const allowReviewInspection = (user, jobType, status) => {
  const { roles } = user;
  const rolesInspection = {
    Inspection: [...ROLE_INSPECTION_CAN_REVIEW],
    Maintenance: [...ROLE_MAINTENANCE_CAN_REVIEW],
    Cleaning: [...ROLE_CLEANING_CAN_REVIEW],
  };
  const isEditor =
    find(
      roles,
      (roleItem) =>
        roleItem._id &&
        find(rolesInspection[jobType], (item) => item === roleItem.type),
    ) && [INSPECTION_STATUS.READY].includes(status);
  return isEditor;
};
