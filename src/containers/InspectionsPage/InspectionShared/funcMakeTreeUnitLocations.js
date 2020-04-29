/**
 * Function make tree unit location for tree dropdow
 * @location Object location
 * @return {Array} units
 */
import { filter, map } from "lodash";
function funcMakeTreeUnitLocations(location) {
  let treeUnits = [
    {
      label: "Select all",
      value: "selectAll",
      className: "select-all-tree",
      tagClassName: "select-all-tree-tag",
    },
  ];

  const makeTreeUnit = (currentNode, parent = undefined, sortByRef) => {
    let childNode = filter(
      location.units,
      (itemSub) => itemSub.parent === currentNode._id && itemSub.status,
    );
    let sortedString = `${sortByRef || ""} ${currentNode.name}`;
    return Object.assign(
      {
        label: currentNode.name,
        value: currentNode._id,
        sorted: sortedString,
        parent,
      },
      childNode && childNode.length > 0
        ? {
            actions: [
              {
                className: "action",
                text: "Select all",
                unitValue: currentNode._id,
                selectedAll: true,
              },
            ],
            children: map(childNode, (itemSubNode) =>
              makeTreeUnit(itemSubNode, currentNode._id, sortedString),
            ),
          }
        : {},
    );
  };

  treeUnits = treeUnits.concat(
    map(
      filter(location.units, (item) => !item.parent && item.status),
      (item) => {
        return makeTreeUnit(item);
      },
    ),
  );
  return treeUnits;
};

export default funcMakeTreeUnitLocations;