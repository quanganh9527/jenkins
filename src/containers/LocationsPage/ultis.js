import { forEach, filter, get } from "lodash";
import Utils from "utilities/utils";
import { locationService } from "services";
/**
 * Call service get data location pagination
 * @params Query params
 * @return {Array} Active location
 */
export const fetchDataLocationAsync = async (
  inputSearch,
  _start = 0,
  _limit = 10,
) => {
  let params = { _limit, _start };

  if (inputSearch) {
    inputSearch.trim();
    params = Object.assign(params, { _q: inputSearch });
  } else {
    params = Object.assign(params, { active: true });
  }

  let data = await locationService.getLocations(params);
  if (inputSearch) data = filter(data, (item) => item.active);
  forEach(data, (item) => {
    item.label = Utils.getLocationIdentifer(item);
    item.country = get(item, "country._id", "");
  });
  return data;
};
