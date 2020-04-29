import React from "react";
import { Button, Spinner } from "reactstrap";

function ButtonLoading({
  isLoading = false,
  text = "Submit",
  disabled = false,
  ...props
}) {
  return (
    <Button {...props} disabled={disabled}>
      {isLoading ? <Spinner color="light" size="sm" /> : text}
    </Button>
  );
}

export default ButtonLoading;
