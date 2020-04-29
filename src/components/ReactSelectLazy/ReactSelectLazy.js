/**
 * React select Async fetch data
 * Each call 10 item/page
 * Support for filter
 * Support scroll load more
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import __ from "lodash";
import "./style.scss";

/**
 *
 * @param {refProp} refProp Parent element ref
 */
function ReactSelectLazy({
  refProp,
  isDisabled,
  className,
  value,
  isClearable,
  placeholder,
  noOptionsMessage,
  defaultOptions,
  onChange,
  fetchDataAsync,
  isDisplayGroup,
}) {
  const [inputValue, setInputValue] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [options, setOptions] = useState([]);
  const debouncedFetch = (
    inputSearch,
    callback,
    _start = 0,
    _limit = 10,
    _options = [],
  ) => {
    try {
      fetchDataAsync(inputSearch, _start, _limit, _options)
        .then((result) => callback(result))
        .catch(() => callback([]));
    } catch (error) {
      callback([]);
    }
  };

  useEffect(() => {
    setIsloading(true);
    setHasMore(false); // Reset condition load more when scroll to bottom
    debouncedFetch("", (result) => {
      setIsloading(false);
      setOptions(result);
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = __.debounce((value, actionMeta) => {
    const { action } = actionMeta;
    if (inputValue === value || action !== "input-change") return;
    setIsloading(true);
    setHasMore(false); // Reset condition load more when scroll to bottom
    setInputValue(value);
    debouncedFetch(value, (result) => {
      setOptions(result);
      setIsloading(false);
    });
  }, 300);
  const onHandleMenuScrollToBottom = __.debounce(async () => {
    if (hasMore) return;
    setIsloading(true);
    setHasMore(true);
    let _start = options.length;
    await debouncedFetch(
      inputValue,
      (result) => {
        setIsloading(false);

        let newOptions = [];
        if (isDisplayGroup) {
          // Check lasted all data fetch
          const isLastedGroup = __.find(result, item => !__.isEmpty(item.options));
          setHasMore(!isLastedGroup);
          //TODO push item option into group by label
          newOptions = __.reduce(
            result,
            (acc, item) => {
              const { label, options } = item;

              let indexOption = __.findIndex(acc, (op) => op.label === label);

              if (indexOption > -1) {
                acc[indexOption].options = [
                  ...options,
                  ...acc[indexOption].options,
                ];
              } else {
                acc.push(item);
              }
              return acc;
            },
            [...options],
          );
        } else {
          newOptions = __.concat(options, result);
          // Condition to stop fetch load more data
          const isLatestData = !result || result.length < 1;
          setHasMore(isLatestData);
        }
        
        setOptions(newOptions);
      },
      _start,
      10,
      options,
    );
  }, 500);
  const onSearchChange = (selectedOption) => {
    onChange(selectedOption || null);
  };

  return (
    <div>
      <Select
        className={className || ""}
        ref={refProp}
        cacheOptions={true}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
        value={value && value._id ? value : null}
        options={options}
        isDisabled={isDisabled}
        defaultOptions={defaultOptions}
        isLoading={isLoading}
        isClearable={isClearable}
        onInputChange={onInputChange}
        onChange={(e) => {
          onSearchChange(e);
        }}
        onMenuScrollToBottom={onHandleMenuScrollToBottom}
        getOptionValue={(opt) => opt._id}
        styles={{
          container: (base, state) => {
            return {
              ...base,
              zIndex: state.isFocused ? "999" : "1", //Only when current state focused
            };
          },
        }}
        filterOption={false} // Disable filter options
      />
    </div>
  );
}
ReactSelectLazy.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  value: PropTypes.object,
  isClearable: PropTypes.bool,
  placeholder: PropTypes.string,
  noOptionsMessage: PropTypes.func,
  defaultOptions: PropTypes.any,
  onChange: PropTypes.func,
  fetchDataAsync: PropTypes.func,
  isDisplayGroup: PropTypes.bool,
};
ReactSelectLazy.defaultProps = {
  isDisabled: false,
};
export default ReactSelectLazy;
