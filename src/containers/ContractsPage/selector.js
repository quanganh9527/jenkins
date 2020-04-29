import { createSelector } from "reselect";
import { isEmpty } from "lodash";
import Utils from "utilities/utils";
export const selectRentingContract = () => (state) => state.rentingContract;

export const getNotification = () =>
  createSelector(selectRentingContract(), (state) => state.notification);
export const makeSelectCostTypes = () =>
  createSelector(selectRentingContract(), (state) => state.costTypes);

export const makeSelectStatusDebtorRentingContracts = () =>
  createSelector(
    selectRentingContract(),
    (state) => state.isFetchingDebtorRenting,
  );
export const makeSelectDebtorRentingContract = () =>
  createSelector(
    selectRentingContract(),
    (state) => state.debtorRentingContract,
  );

export const makeSelectDebtorRentingContracts = () =>
  createSelector(selectRentingContract(), (state) =>
    state.debtorRentingContracts.map((item) => {
      let customer = {};
      if (!isEmpty(item.person) && item.person._id) {
        const name = `${item.person.firstName} ${item.person.lastName}`;
        customer = Object.assign(item.person, { name }, { type: "person" });
      } else if (!isEmpty(item.grouping) && item.grouping._id) {
        customer = Object.assign(item.grouping, { type: "grouping" });
      }

      return Object.assign(
        item,
        {
          locationIdentifier: Utils.getLocationIdentifer(item.location),
        },
        { customer },
      );
    }),
  );

export const makeSelectCountDebtorRentingContracts = () =>
  createSelector(
    selectRentingContract(),
    (state) => state.countDebtorRentingContract,
  );
