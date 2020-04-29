import React, { memo, useState, Fragment, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  FormFeedback,
  InputGroup,
  InputGroupAddon,
  Alert,
} from "reactstrap";
import { faUser, faUnlock } from "@fortawesome/free-solid-svg-icons";
import useForm from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../assets/img/brand/logo.svg";

// styles
import "./styles.scss";

import ButtonLoading from "../../components/ButtonLoading";

import { validationLogin } from "./validation";
import { useUserDispatch, useUserState } from "./context";

function LoginPage(props) {
  const dispatch = useUserDispatch();
  const { isAuthenticated } = useUserState();
  const { signIn } = dispatch;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, errors } = useForm({
    validationSchema: validationLogin(),
  });

  const onSubmit = async data => {
    const { identifier, password } = data;
    signIn(identifier, password, setIsSubmitting, setError);
  };

  useEffect(() => {
    const unsubscribe = () => {
      console.log("unsubscribe");
    };
    return () => unsubscribe();
  }, []);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <div className="h-100 bg-animation app-container">
        <div className="d-flex h-100 justify-content-center align-items-center">
          <Col md="6" sm="6" lg="3" className="mx-auto app-login-box">
            <Card>
              <CardBody>
                <Alert
                  color="danger"
                  isOpen={!!error}
                  toggle={() => setError(null)}
                >
                  {error}
                </Alert>
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="mb-5 mt-3 d-flex justify-content-center">
                    <img src={Logo} alt="logo" />
                  </div>
                  <FormGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="identifier"
                        id="identifier"
                        innerRef={register}
                        placeholder="Username or email"
                        invalid={!!errors.identifier}
                        disabled={isSubmitting}
                      />
                      {errors.identifier && errors.identifier.message && (
                        <FormFeedback>{errors.identifier.message}</FormFeedback>
                      )}
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faUnlock} />
                        </div>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        innerRef={register}
                        placeholder="Password"
                        invalid={!!errors.password}
                        disabled={isSubmitting}
                      />
                      {errors.password && errors.password.message && (
                        <FormFeedback>{errors.password.message}</FormFeedback>
                      )}
                    </InputGroup>
                  </FormGroup>

                  <Row>
                    <Col lg="6" className="mx-auto">
                      <ButtonLoading
                        color="primary"
                        block
                        type="submit"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        text="Login"
                        size="lg"
                      />
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
    </Fragment>
  );
}

export default memo(LoginPage);
