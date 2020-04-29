import React, { Fragment, useState } from "react";
import cx from "classnames";

function SearchBox() {
  const [activeSearch, setActiveSearch] = useState(false);

  return (
    <Fragment>
      <div
        className={cx("search-wrapper", {
          active: activeSearch,
        })}
      >
        <div className="input-holder">
          <input
            type="text"
            className="search-input"
            placeholder="Type to search"
          />
          <button
            onClick={() => setActiveSearch(!activeSearch)}
            className="search-icon"
          >
            <span />
          </button>
        </div>
        <button
          onClick={() => setActiveSearch(!activeSearch)}
          className="close"
        />
      </div>
    </Fragment>
  );
}

export default SearchBox;
