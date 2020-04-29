import __ from "lodash";
import moment from "moment";
import Utils from "utilities/utils";
import { locationService } from "services";
import { funcMakeTreeUnitLocations } from "containers/InspectionsPage/InspectionShared";
/**
 * Call service get data custormer pagination
 * @params Query params
 * @return {Array} Persons & Grouping
 */

export const fetchDataCustomer = async (
  inputSearch,
  _start = 0,
  _limit = 10,
  _options = [],
  intl,
) => {
  const person = intl.formatMessage({ id: "components.select.people" });
  const grouping = intl.formatMessage({ id: "components.select.groupings" });
  let params = { _limit };
  if (inputSearch) {
    inputSearch.trim();
    params = Object.assign(params, { _q: inputSearch });
  } else {
    params = Object.assign(params, { active: true });
  }
  const _persons = __.find(_options, (item) => item.label === String(person));
  const _groupings = __.find(
    _options,
    (item) => item.label === String(grouping),
  );

  let _startPerson = 0;
  if (!__.isEmpty(_persons) && _persons.options.length) {
    _startPerson = _persons.options.length;
  }
  let _startGrouping = 0;
  if (!__.isEmpty(_groupings) && _groupings.options.length) {
    _startGrouping = _groupings.options.length;
  }
  let persons = await locationService.getContactPerson(
    Object.assign(params, { _start: _startPerson }),
  );
  let groupings = await locationService.getContactGroupings(
    Object.assign(params, { _start: _startGrouping }),
  );
  __.forEach(persons, (item) => {
    item.label = `${item.firstName} ${item.lastName}`;
    item.name = `${item.firstName} ${item.lastName}`;
    item.type = "person";
  });
  __.forEach(groupings, (item) => {
    item.label = item.name;
    item.type = "grouping";
  });
  if (inputSearch) {
    persons = __.filter(persons, (item) => item.active);
    groupings = __.filter(groupings, (item) => item.active);
  }
  const data = [
    {
      label: person,
      options: persons,
    },
    {
      label: grouping,
      options: groupings,
    },
  ];
  return data;
};

// Handle dropdown select units
export const isSelecteAllTreeData = (treeData) => {
  let checked = true;
  treeData = __.filter(treeData, (item) => item.value !== "selectAll");
  __.forEach(treeData, (item) => {
    if (
      item.children &&
      item.children.length > 0 &&
      __.find(item.children, (childrenNode) => !childrenNode.checked)
    ) {
      checked = false;
      return false;
    }
    if (item.children && item.children.length > 0) {
      checked = isSelecteAllTreeData(item.children);
      return;
    }
  });
  if (__.find(treeData, (item) => !item.checked)) {
    checked = false;
    return false;
  }
  return checked;
};

export const handleToggleSelectedAllUnit = (treeData, checked) => {
  let nodesSelected = [];
  const makeTreeCheckedUnit = (currentNode) => {
    if (currentNode.children && currentNode.children.length > 0) {
      __.forEach(currentNode.children, (item, idx) => {
        item.checked = checked;
        if (checked) {
          nodesSelected.push({
            id: item.value,
            name: item.label,
            points: [],
            position: item.position,
            parent: item.parent,
          });
        }
        if (item.actions && item.actions[0]) {
          item.actions[0].text = checked ? "Deselect all" : "Select all";
          item.actions[0].selectedAll = !checked;
        }
        makeTreeCheckedUnit(item);
      });
    }
  };
  __.forEach(treeData, (item, idx) => {
    item.checked = checked;
    if (checked) {
      nodesSelected.push({
        id: item.value,
        name: item.label,
        points: [],
        position: item.position,
        parent: item.parent,
      });
    }
    if (item.actions && item.actions[0]) {
      item.actions[0].text = checked ? "Deselect all" : "Select all";
      item.actions[0].selectedAll = !checked;
    }
    makeTreeCheckedUnit(item);
  });
  /**
   * TODO
   * Remove duplicate
   * Sort units by order position
   */
  nodesSelected = __.uniqBy(nodesSelected, (item) => item.id);
  nodesSelected = __.sortBy(nodesSelected, (item) => item.position);
  // Remake tree data units item[0]
  if (treeData && treeData[0] && treeData[0].value === "selectAll") {
    treeData[0].checked = isSelecteAllTreeData(treeData);
  } else {
    treeData[0].checked = isSelecteAllTreeData(treeData);
  }
  return {
    nodesSelected,
    treeData,
  };
};

export const _unitTree = {
  makeTreeData(flatData, nodesSelected) {
    flatData = __.filter(flatData, (item) => item.status);
    let rootTree = {
      label: "Select all",
      value: "selectAll",
      className: "select-all-tree",
      tagClassName: "select-all-tree-tag",
      checked:
        !__.isEmpty(nodesSelected) && flatData.length === nodesSelected.length,
    };
    const recursive = (currentNode, parent = undefined) => {
      const children = __.orderBy(
        __.filter(
          flatData,
          (item) => item.parent === currentNode._id && item.status,
        ),
        ["postion"],
        ["asc"],
      );
      const checked = __.includes(nodesSelected, currentNode._id);
      const checkedAllChild = !__.find(
        children,
        (item) => !__.includes(nodesSelected, item._id),
      );
      const action = {
        className: "action",
        text: checked && checkedAllChild ? "Deselect all" : "Select all",
        unitValue: currentNode._id,
        selectedAll: !checked || !checkedAllChild,
      };
      return Object.assign(
        {
          label: currentNode.name,
          value: currentNode._id,
          position: currentNode.position,
          parent,
          checked: checked,
        },
        !__.isEmpty(children) && {
          actions: [action],
          children: __.map(children, (child) =>
            recursive(child, currentNode._id),
          ),
        },
      );
    };
    const parentNodes = __.orderBy(
      __.filter(flatData, (item) => !item.parent && item.status),
      ["position", ["asc"]],
    );
    let treeData = __.reduce(
      parentNodes,
      (acc, flatItem) => {
        acc.push(recursive(flatItem));
        return acc;
      },
      [],
    );
    rootTree.checked = !__.find(treeData, (item) => !item.checked);
    return [rootTree, ...treeData];
  },
  onChangeNodeTree(treeData, nodesSelected, currentNode, selectedNodes) {
    if (currentNode.value === "selectAll") {
      // Slected all unit when chose selected all
      return handleToggleSelectedAllUnit(treeData, currentNode.checked);
    }

    const loopFindTreeNode = (currentNodes) => {
      __.forEach(currentNodes, (item, idx) => {
        if (item.value === currentNode.value) {
          // makeUnitTreeActionSelect(item);
          if (currentNode.checked) {
            item.checked = true;
            nodesSelected.push({
              id: item.value,
              name: item.label,
              points: [],
              position: item.position,
              parent: item.parent,
            });
          } else {
            item.checked = false;
            // remove units
            let indexCurrentUnits = __.findIndex(
              nodesSelected,
              (itemUnit) => itemUnit.id === item.value,
            );
            if (indexCurrentUnits > -1) {
              nodesSelected.splice(indexCurrentUnits, 1);
            }
          }
          if (item.actions && item.actions[0]) {
            let checkSelectedAll =
              currentNode.checked &&
              !__.find(item.children, (childItem) => !childItem.checked);
            item.actions[0].text = checkSelectedAll
              ? "Deselect all"
              : "Select all";
            item.actions[0].selectedAll = !checkSelectedAll;
          }
          return;
        } else if (item.children && item.children.length > 0) {
          if (
            __.find(
              item.children,
              (childItem) => childItem.value === currentNode.value,
            )
          ) {
            let checkSelectedAll =
              currentNode.checked &&
              !__.find(
                __.filter(
                  item.children,
                  (childItem) => childItem.value !== currentNode.value,
                ),
                (childItem) => !childItem.checked,
              );
            item.actions[0].text = checkSelectedAll
              ? "Deselect all"
              : "Select all";
            item.actions[0].selectedAll = !checkSelectedAll;
          }
          loopFindTreeNode(item.children);
        }
      });
    };
    loopFindTreeNode(treeData);

    /**
     * TODO
     * Remove duplicate
     * Sort units by order position
     */
    nodesSelected = __.uniqBy(nodesSelected, (item) => item.id);
    nodesSelected = __.sortBy(nodesSelected, (item) => item.position);
    // Remake tree data units item[0]
    if (treeData && treeData[0] && treeData[0].value === "selectAll") {
      treeData[0].checked = isSelecteAllTreeData(treeData);
    } else {
      treeData[0].checked = isSelecteAllTreeData(treeData);
    }
    return {
      nodesSelected,
      treeData,
    };
  },

  /**
   * Handle when click Select or Deselect units
   * @param {Array} treeData
   * @param {Array} nodesSelected Units selected
   * @param {Array} nodesToggle  Current tree expaned
   * @param {Object} node  Params of action
   * @param {Object} action Params of action
   * @returns {Object: {units, treeData}} units selected & new treeData
   */
  onActionClickCheckboxTree(
    treeData,
    nodesSelected,
    nodesToggle,
    node,
    action,
  ) {
    const { unitValue, selectedAll } = action;
    const makeUnitTreeActionSelect = (nodeData) => {
      nodeData.checked = selectedAll;
      if (selectedAll) {
        nodesSelected.push({
          id: nodeData.value,
          name: nodeData.label,
          points: [],
          position: nodeData.position,
          parent: nodeData.parent,
        });
      } else {
        // remove units unselected
        let indexCurrentUnits = __.findIndex(
          nodesSelected,
          (itemUnit) => itemUnit.id === nodeData.value,
        );
        if (indexCurrentUnits > -1) {
          nodesSelected.splice(indexCurrentUnits, 1);
        }
      }
      if (nodeData.actions && nodeData.actions[0]) {
        nodeData.actions[0].text = selectedAll ? "Deselect all" : "Select all";
        nodeData.actions[0].selectedAll = !selectedAll;
      }
      if (nodeData && nodeData.children && nodeData.children.length > 0) {
        __.forEach(nodeData.children, (item) => makeUnitTreeActionSelect(item));
      }
    };
    if (unitValue) {
      // TODO: Handle expanded tree unit
      const loopFindTreeNode = (currentNodes) => {
        __.forEach(currentNodes, (item, idx) => {
          if (__.find(nodesToggle, (nodeItem) => nodeItem === item.value)) {
            item.expanded = true;
          } else {
            item.expanded = false;
          }
          if (item.value === unitValue) {
            makeUnitTreeActionSelect(item);
            return;
          } else if (item.children && item.children.length > 0) {
            loopFindTreeNode(item.children);
          }
        });
      };
      loopFindTreeNode(treeData);
    }
    /**
     * TODO
     * Remove duplicate
     * Sort units by order position
     */
    nodesSelected = __.uniqBy(nodesSelected, (item) => item.id);
    nodesSelected = __.sortBy(nodesSelected, (item) => item.position);
    // Remake tree data units
    if (treeData && treeData[0] && treeData[0].value === "selectAll") {
      treeData[0].checked = isSelecteAllTreeData(treeData);
    }
    return {
      treeData,
      nodesSelected,
    };
  },
  onNodeToggleTree(treeData, nodesToggle, currentNode) {
    if (currentNode.expanded) {
      nodesToggle.push(currentNode.value);
      nodesToggle = __.uniq(nodesToggle);
    } else {
      nodesToggle = __.filter(
        nodesToggle,
        (item) => item !== currentNode.value,
      );
    }

    const handleExpandedTree = (nodesToggle) => {
      let treeUnitsClone = [...treeData];
      __.forEach(treeData, (item) => {
        if (__.find(nodesToggle, (nodeItem) => nodeItem === item.value)) {
          item.expanded = true;
        } else {
          item.expanded = false;
        }
        __.forEach(item.children, (childItem) => {
          if (
            __.find(nodesToggle, (nodeItem) => nodeItem === childItem.value)
          ) {
            childItem.expanded = true;
          } else {
            childItem.expanded = false;
          }
        });
      });
      return {
        treeData: treeUnitsClone,
        nodesToggle,
      };
    };
    return handleExpandedTree(nodesToggle);
  },
};

export const _rentingContractData = {
  getParamData() {},
};

// Sevices data
export const makeDataParamsCreateUpdateRentingContract = (
  active,
  noticeDays,
  customer,
  invoiceContact,
  location,
  _startDate,
  _endDate,
  agreementLines,
  rentingContractId,
) => {
  const _agreementLines = [...agreementLines];
  const { _id } = customer;
  const locationId = !__.isEmpty(location) ? location._id : null;
  let data = {};
  if (rentingContractId) {
    data["_id"] = rentingContractId;
    data["id"] = rentingContractId;
  }
  if (rentingContractId) {
    //TODO check expired contract
    if (
      _endDate &&
      moment(_endDate).isValid() &&
      moment(new Date().toISOString()).endOf("date").valueOf() >
        moment(moment(_endDate).toISOString()).endOf("date").valueOf()
    ) {
      data["active"] = false;
    } else {
      data["active"] = active;
    }
  } else {
    data["active"] = active;
  }
  data["noticeDays"] = noticeDays;
  data["invoiceContact"] = invoiceContact;
  data["startDate"] = moment(_startDate).toISOString();
  data["customer"] = _id || null;
  data["locationIdentifier"] = locationId || null;
  if (_endDate && moment(_endDate).isValid()) {
    data["endDate"] = moment(_endDate).toISOString();
  }
  data["agreementLines"] = __.reduce(
    _agreementLines,
    (acc, agreement) => {
      const { _id: agreementId, type, costLineGenerals, units } = agreement;
      let agreementItem = __.pick(agreement, ["type", "description"]);
      if (rentingContractId) {
        agreementItem["rentingContract"] = rentingContractId;
      }
      // Update case
      if (agreementId) {
        agreementItem["_id"] = agreementId;
        agreementItem["id"] = agreementId;
        // if (deleted) {
        //   agreementItem["deleted"] = deleted; // Will deleted
        // }
      }
      // Special case Accommodation
      if (type === "Accommodation") {
        agreementItem["units"] = __.reduce(
          units,
          (accUnits, item) => {
            // Remove checkbox selected all
            if (item.id !== "selectAll") {
              accUnits.push(item.id);
            }
            return accUnits;
          },
          [],
        );
      }
      if (!__.isEmpty(costLineGenerals)) {
        agreementItem["costLineGenerals"] = __.reduce(
          costLineGenerals,
          (accCostLines, costLine) => {
            const {
              _id: costLineId,
              period,
              invoiceDate,
              startDate,
              endDate,
              costType,
            } = costLine;
            const _type = costLine.type;
            let costLineItem = __.pick(costLine, [
              "type",
              "description",
              "amount",
            ]);
            costLineItem["invoiceDate"] = moment(invoiceDate).toISOString();
            if (agreementId) {
              costLineItem["agreementLine"] = agreementId;
            }
            // Update case
            if (costLineId) {
              costLineItem["_id"] = costLineId;
              costLineItem["id"] = costLineId;
              // Check expired general costline
              if (endDate && moment(endDate).isValid()) {
                if (
                  moment(new Date().toISOString()).endOf("date").valueOf() >
                  moment(moment(endDate).toISOString()).endOf("date").valueOf()
                ) {
                  costLineItem["expired"] = true;
                } else if (
                  _endDate &&
                  moment(_endDate).isValid() &&
                  moment(moment(_endDate).toISOString())
                    .endOf("date")
                    .valueOf() >
                    moment(moment(endDate).toISOString())
                      .endOf("date")
                      .valueOf()
                ) {
                  costLineItem["expired"] = true;
                } else {
                  costLineItem["expired"] = false;
                }
              }
            }
            const costTypeId = !__.isEmpty(costType) ? costType._id : null;
            costLineItem["costType"] = costTypeId;
            // Special case Periodic
            if (_type === "Periodic") {
              costLineItem["period"] = period;
              costLineItem["startDate"] = moment(startDate).toISOString();
              if (endDate && moment(endDate).isValid())
                costLineItem["endDate"] = moment(endDate).toISOString();
            }
            accCostLines.push(costLineItem);
            return accCostLines;
          },
          [],
        );
      }
      acc.push(agreementItem);
      return acc;
    },
    [],
  );
  return data;
};
export const convertResponseContractToFormdata = (
  _contract,
  costTypes,
  location,
) => {
  let contract = {
    id: "",
    _id: "",
    type: "",
    active: true,
    noticeDays: "",
    contractId: "",
    startDate: null,
    endDate: null,
    invoiceContact: "",
    location: "",
    treeUnit: {},
    custormer: {},
    person: {},
    grouping: {},
    agreementLines: [],
  };
  contract = Object.assign(
    contract,
    __.pick(_contract, [
      "id",
      "_id",
      "type",
      "active",
      "noticeDays",
      "contractId",
      "startDate",
      "endDate",
      "person",
      "grouping",
    ]),
  );
  // Customer & invoiceContact
  if (!__.isEmpty(_contract.person)) {
    const labelCustomer = `${_contract.person.firstName} ${_contract.person.lastName}`;
    contract["customer"] = Object.assign(
      _contract.person,
      {
        name: labelCustomer,
      },
      { label: labelCustomer },
      { type: "person" },
    );
  } else if (!__.isEmpty(_contract.grouping)) {
    contract["customer"] = Object.assign(
      _contract.grouping,
      { label: _contract.grouping.name },
      {
        type: "grouping",
      },
    );
  }
  if (!__.isEmpty(_contract.invoiceContact) && _contract.invoiceContact._id) {
    contract["invoiceContact"] = __.get(_contract, "invoiceContact._id", null);
  }
  // Location selected
  const { country } = location;
  location["label"] = Utils.getLocationIdentifer(location);
  location["country"] = __.get(country, "country._id", "");
  const treeDataUnit = funcMakeTreeUnitLocations({ ...location });
  if (!__.isEmpty(location) && location._id) {
    contract["location"] = location;
    contract["treeUnit"] = treeDataUnit;
  }
  // Agreement lines
  let _agreementLines = __.reduce(
    _contract.agreementLines,
    (acc, agreement) => {
      const { _id, type, description, costLineGenerals } = agreement;
      let agreementItem = {
        _id,
        type,
        description,
      };
      // Special type Accommodation
      if (type === "Accommodation") {
        /**
         * units: [] Units & Sub-units selected
         * treeData: treeUnit || [], // Current tree of Agreement
         * nodesToggle: [], // Cureent node toggle of Agreement
         */
        const { units } = agreement;
        agreementItem["units"] = units;
        agreementItem["nodesToggle"] = [];
        agreementItem["treeData"] = _unitTree.makeTreeData(
          [...location.units],
          __.map(units, (item) => item._id),
        );
      }
      agreementItem["costLineGenerals"] = __.reduce(
        costLineGenerals,
        (costLines, costLine) => {
          let costLineItem = Object.assign(
            __.pick(costLine, [
              "_id",
              "type",
              "description",
              "amount",
              "period",
              "agreementLine",
            ]),
          );

          // Costtype
          costLineItem["costType"] = __.find(
            costTypes,
            (item) => item._id === costLine.costType,
          );

          if (costLine.invoiceDate && moment(costLine.invoiceDate).isValid()) {
            costLineItem["invoiceDate"] = moment(costLine.invoiceDate).toDate();
          }
          if (costLine.startDate && moment(costLine.startDate).isValid()) {
            costLineItem["startDate"] = moment(costLine.startDate).toDate();
          }
          if (costLine.endDate && moment(costLine.endDate).isValid()) {
            costLineItem["endDate"] = moment(costLine.endDate).toDate();
          }
          costLines.push(costLineItem);
          return costLines;
        },
        [],
      );
      acc.push(agreementItem);
      return acc;
    },
    [],
  );
  contract["agreementLines"] = _agreementLines;

  return contract;
};
