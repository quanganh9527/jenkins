import React from "react";
import { FormGroup, Button } from "reactstrap";
import { useHistory } from "react-router-dom";

// ###
import "./styles.scss";

function NotFound() {
  // global
  const history = useHistory();

  const onHandleGotoHome = () => {
    history.push("/");
  };

  return (
    <div className="not-found-page-content">
      <h1>404</h1>
      <p>Oops, an error has occurred. Page not found!</p>
      <FormGroup>
        <Button color="primary" onClick={onHandleGotoHome}>
          Go to Home
        </Button>
      </FormGroup>
    </div>
  );
}

export default NotFound;
