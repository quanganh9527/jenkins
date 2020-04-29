import AxiosInstance from "../utilities/interceptor";
import moment from "moment";
import qs from "qs";
export const inspectionService = {
  createNewInspection,
  getAllInspection,
  getInspection,
  getInspectionBills,
  updateInspectionBillMultiple,
  rejectInspection,
  completeInspection,
  uploadImage,
  dowloadFileReportInspection,
  rejectMaintenance,
  completeMaintenance,
  rejectCleaning,
  completeCleaning,
  fetchCountInspecitons,
  updateInspection,
};

const makeParamsInspecitonFilter = (params) => {
  Object.keys(params).forEach(function (key) {
    // if (params[key] && Array.isArray(params[key])) {
    //   params[key].forEach(item => {
    //     url
    //   })
    //   delete params[key];
    // }
    if (!params[key]) {
      delete params[key];
    } else if (key === "from" || key === "to") {
      if (key === "from") {
        params["dateInspection_gte"] = moment(
          params[key],
          "DD-MM-YYYY",
        ).format();
      } else {
        params["dateInspection_lte"] = moment(params[key], "DD-MM-YYYY")
          .endOf("date")
          .format();
      }
      delete params[key];
    }
  });
  return params;
};

// url for get 'Inspection', 'Maintenance', 'Clearing'

function getAllInspection(params = {}, url = "/inspections") {
  params = makeParamsInspecitonFilter(params);
  let config = {
    method: "GET",
    url,
    params: {
      _sort: "identifier:DESC",
      _limit: -1,
      ...(params || {}),
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function fetchCountInspecitons(params = {}, url = "/inspections/count") {
  params = makeParamsInspecitonFilter(params);
  let config = {
    method: "GET",
    url,
    params: { ...(params || {}) },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function createNewInspection(inspection, url = "/inspections/inspection") {
  let config = {
    method: "POST",
    url: url,
    data: inspection,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}
//getInspectionBills

function getInspectionBills(searchData) {
  let config = {
    method: "GET",
    url: `/inspectionbills`,
  };

  if (searchData) {
    config.params = searchData;
  }
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function updateInspectionBillMultiple(inspectionBills) {
  let config = {
    method: "POST",
    url: `/inspectionbills/updateMultiple`,
    data: inspectionBills,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function getInspection(id) {
  let config = {
    method: "GET",
    url: `/inspections/${id}`,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function rejectInspection(inspectionId, rejectMessage) {
  let config = {
    method: "PUT",
    url: `/inspections/rejected/inspection/${inspectionId}`,
    data: { rejectMessage },
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function completeInspection(inspectionId, inspection) {
  let config = {
    method: "PUT",
    url: `/inspections/completed/inspection/${inspectionId}`,
    data: inspection,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function uploadImage(formData) {
  let config = {
    method: "POST",
    url: `/upload`,
    data: formData,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function dowloadFileReportInspection(identifier) {
  if (!identifier) {
    return;
  }
  let config = {
    method: "GET",
    url: `upload/files?name=${identifier}.pdf&_sort=updatedAt:desc`,
  };
  return AxiosInstance(config)
    .then((response) => {
      let files = response.data;
      if (files[0] && files[0].url) {
        window.open(files[0].url, "_blank");
      }
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

// Maintenance

function rejectMaintenance(inspectionId, rejectMessage) {
  let config = {
    method: "PUT",
    url: `/inspections/rejected/inspection/${inspectionId}`,
    data: { rejectMessage },
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function completeMaintenance(inspectionId, inspection) {
  let config = {
    method: "PUT",
    url: `/inspections/completed/maintenance/${inspectionId}`,
    data: inspection,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

// Cleaning

function rejectCleaning(inspectionId, rejectMessage) {
  let config = {
    method: "PUT",
    url: `/inspections/rejected/cleaning/${inspectionId}`,
    data: { rejectMessage },
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

function completeCleaning(inspectionId, inspection) {
  let config = {
    method: "PUT",
    url: `/inspections/completed/cleaning/${inspectionId}`,
    data: inspection,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}

/**
 * Em Dinh: https://infodation.atlassian.net/browse/EEAC-597?oldIssueView=true
 */
export const jobTypes = {
  inspection: "inspection",
  maintenance: "maintenance",
  cleaning: "cleaning",
};
export const roleByJobType = {
  inspection: "inspector",
  maintenance: "mechanic",
  cleaning: "cleaner",
};
export const jobStatus = {
  open: "open",
  inProgress: "in_progress",
};
const API_ENPOINTS = {
  updateInspection: (
    jobType = jobTypes.inspection,
    status = jobStatus.open,
    jobId,
  ) => {
    return `inspections/${jobType}/${jobId}/${status}`;
  },
};

function updateInspection(
  jobId,
  updateData = {},
  jobType = jobTypes.inspection,
  status = jobStatus.open,
) {
  let config = {
    method: "PUT",
    url: API_ENPOINTS.updateInspection(jobType, status, jobId),
    data: updateData,
  };
  return AxiosInstance(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error && error.response) {
        throw error.response.data;
      }
      throw error;
    });
}
/**
 * End of Em Dinh
 */
