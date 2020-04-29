import React from "react";
import Loader from "react-loaders";

// ###
import "./styles.scss";

function LoadingIndicator() {
  return (
    <div className="loading-indicator-content">
      <div className="bg-loading"></div>
      <Loader type="line-scale" />
    </div>
  );
}

export default LoadingIndicator;
