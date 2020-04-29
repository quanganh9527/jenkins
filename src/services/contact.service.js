import AxiosInstance from '../utilities/interceptor';

export const contactService = {
  addNewGrouping,
  updateGrouping,
  getGrouping,
  getPerson,
  addNewPerson,
  updatePerson,
  getDebtorContactList,
  addDebtorCotact,
  updateDebtorCotact,
  fetchCountPeople,
  fetchCountGrouping
};


function fetchCountPeople(params = {}) {
  let config = {
    method: "GET",
    url: '/person/count',
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
function fetchCountGrouping(params = {}) {
  let config = {
    method: "GET",
    url: '/groupings/count',
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

function addNewGrouping(group){

  let config = {
    method: "POST",
    url: `/groupings`,
    data: group
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

function getGrouping(groupingId) {
  let config = {
    method: "GET",
    url: `/groupings/${groupingId}`,
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

function updateGrouping(groupId, group){
  
  let config = {
    method: "PUT",
    url: `/groupings/${groupId}`,
    data: group
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

function getPerson(personId) {
  let config = {
    method: "GET",
    url: `/person/${personId}`,
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

function addNewPerson(person) {
  let config = {
    method: "POST",
    url: `/person`,
    data: person
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

function updatePerson(personId, person){
  
  let config = {
    method: "PUT",
    url: `/person/${personId}`,
    data: person
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

function getDebtorContactList(params) {
  let config = {
    method: "GET",
    url: `/debtorcontacts`,
  };
  if (params) {
    config.params = params;
  }
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

function addDebtorCotact(debtorContact) {
  let config = {
    method: "POST",
    url: `/debtorcontacts`,
    data: debtorContact
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

function updateDebtorCotact(debtorId, debtorContact){
  
  let config = {
    method: "PUT",
    url: `/debtorcontacts/${debtorId}`,
    data: debtorContact
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