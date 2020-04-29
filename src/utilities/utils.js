import { orderBy } from "lodash";

const Utils = {
  getLocationIdentifer,
  showNotify,
  orderByPosition
};

function getLocationIdentifer(location) {
  return `${location.city ? `${location.city},` : ""} ${
    location.street || ""
  } ${location.number || ""} ${location.suffix || ""}`;
}

function showNotify(intl, notification) {
  return notification.key
    ? intl.formatMessage({ id: notification.key })
    : notification.message;
}

function orderByPosition(data) {
  return orderBy(data, [(item) => item.position || 0]);
}

export default Utils;
