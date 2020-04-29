import React from "react";

const SvgIcon = ({
  viewBox = "0 0 24 24",
  width = 24,
  height = 24,
  children,
  fill = "#b8b8b8",
  ...others
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      {...others}
    >
      {children}
    </svg>
  );
};

export default SvgIcon;
