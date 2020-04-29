import AxiosInstance from '../utilities/interceptor';
import moment from "moment";

export const locationService = {
  getLocations,
  getContactPerson,
  getContactGroupings,
  getRegions,
  getCountries,
  addNewLocation,
  updateLocation,
  getLocation,
  getUnit,
  addInspection,
  addMultiInspection,
  removeInspection,
  removeAllInspectionByUnitId,
  getInspectionByUnitIds,
  getCostCenters,
  fetchCountLocations
};

function getLocations(params = {}) {
  let config = {
    method: "GET",
    url: '/locations',
    params: { "_sort": "updatedDate:DESC", "_limit": -1, ...params || {} }
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function fetchCountLocations(params = {}) {
  let config = {
    method: "GET",
    url: '/locations/count',
    params: { ...params || {} }
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getLocation(locationId) {
  let config = {
    method: "GET",
    url: `/locations/${locationId}`,
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getUnit(unitId) {
  let config = {
    method: "GET",
    url: `/units/${unitId}`,
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getRegions() {
  let config = {
    method: "GET",
    url: '/regions',
  };
  config.params = { ...config.params || {}, "_limit": -1 };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}
function getCountries() {
  let config = {
    method: "GET",
    url: '/countries',
  };
  config.params = { ...config.params || {}, "_limit": -1 };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getCostCenters() {
  let config = {
    method: "GET",
    url: '/costcenters',
  };
  config.params = { ...config.params || {}, "_limit": -1 };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getContactPerson(params) {
  let config = {
    method: "GET",
    url: '/person',
    params: { "_sort": "updatedDate:DESC", "_limit": -1, ...params || {} }
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getContactGroupings(params) {
  let config = {
    method: "GET",
    url: '/groupings',
    params: { "_sort": "updatedDate:DESC", "_limit": -1, ...params || {} }
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function addNewLocation(location) {
  let config = {
    method: "POST",
    url: `/locations`,
    data: location
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function updateLocation(locationId, location) {
  let updatedDate = moment(new Date()).format("MM/DD/YYYY,hh:mm")
  let config = {
    method: "PUT",
    url: `/locations/${locationId}`,
    data: { updatedDate, ...location }
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function addInspection(inspectionTeample) {
  let config = {
    method: "POST",
    url: `/inspectiontemplates`,
    data: inspectionTeample
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function addMultiInspection(data) {
  let config = {
    method: "POST",
    url: `/inspectiontemplates/createMulti`,
    data: data
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function removeInspection(inspectionId) {
  let config = {
    method: "DELETE",
    url: `/inspectiontemplates/${inspectionId}`,
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function removeAllInspectionByUnitId(unitId) {
  let config = {
    method: "DELETE",
    url: `/inspectiontemplates/deleteAll/${unitId}`
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getInspectionByUnitIds(unitIds) {
  let config = {
    method: "POST",
    url: `/inspectiontemplates/getlist/`,
    data: { unitIds: unitIds }
  };
  return AxiosInstance(config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}