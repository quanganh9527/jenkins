import { httpClient } from "utilities";

const getCostTypes = (params) => httpClient.get("/costtypes", params);
const getPerson = (params) => httpClient.get("/person",params );
const getDebtorRentingContract = (_id) => httpClient.get(`/rentingcontracts/${_id}`);
const getDebtorRentingContracts = (params) => httpClient.get("/rentingcontracts", params);
const getCountDebtorRentingContracts = (params) => httpClient.get("/rentingcontracts/count", params);
const createDebtorRentingContract = (data) =>
  httpClient.post("/rentingcontracts", data);
const updateDebtorRentingContract = (_id, data) => httpClient.put(`/rentingcontracts/${_id}`, data);

export const contractService = {
  getDebtorRentingContract,
  getDebtorRentingContracts,
  getCountDebtorRentingContracts,
  getCostTypes,
  getPerson,
  createDebtorRentingContract,
  updateDebtorRentingContract
};
