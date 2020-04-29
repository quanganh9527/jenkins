import React from "react";
import SvgIcon from "../../components/SvgIcon";

export default function Minus({ className, ...others }) {
  return (
    <SvgIcon className={className} {...others}>
      <path d="M19,13H5V11H19V13Z" />
    </SvgIcon>
  );
}
