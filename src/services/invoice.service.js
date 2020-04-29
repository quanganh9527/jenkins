import AxiosInstance from '../utilities/interceptor';

export const invoiceService = {
  getCostCenters,
  addNewCostCenter,
  updateCostCenter,
  getCostTypes,
  getVatTypes,
  getLedgerAccounts,
  addNewCostType,
  updateCostType,
  getReviewInvoices,
  addNewInvoice,
  fetchCountCostCenters
};

//COST CENTERS
function getCostCenters(params = {}) {
  let config = {
    method: "GET",
    url: `/costcenters`,
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

function fetchCountCostCenters(params = {}) {
  let config = {
    method: "GET",
    url: '/costcenters/count',
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

function addNewCostCenter(costCenter) {
  let config = {
    method: "POST",
    url: `/costcenters`,
    data: costCenter
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

function updateCostCenter(centerId, costCenter) {

  let config = {
    method: "PUT",
    url: `/costcenters/${centerId}`,
    data: costCenter
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


//COST TYPES

function getCostTypes(params) {
  let config = {
    method: "GET",
    url: `/costtypes`,
    params: params
  };
  config.params = { ...config.params || {}, "_limit": -1, "_sort": "updatedDate:DESC" };
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

function getVatTypes() {
  let config = {
    method: "GET",
    url: `/vattypes`,
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

function getLedgerAccounts() {
  let config = {
    method: "GET",
    url: `/ledgeraccounts`,
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

function addNewCostType(costType) {
  let config = {
    method: "POST",
    url: `/costtypes`,
    data: costType
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

function updateCostType(typeId, costType) {

  let config = {
    method: "PUT",
    url: `/costtypes/${typeId}`,
    data: costType
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
//COST INVOICES 

function getReviewInvoices(searchData) {
  let config = {
    method: "POST",
    url: `/inspectionbills/calculationCostBill`,
    data: searchData
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
function addNewInvoice(invoices) {
  let config = {
    method: "POST",
    url: `/invoices`,
    data: invoices
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