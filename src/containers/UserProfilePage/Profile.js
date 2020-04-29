import React, { Fragment, useEffect, useState, memo } from "react";
import useForm from "react-hook-form";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  CardBody,
  Form,
  FormGroup,
  Input,
  CardFooter,
  CardTitle,
  FormFeedback,
  Alert,
} from "reactstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusinessTime } from "@fortawesome/free-solid-svg-icons";
// components
import UpdatePasswordModal from "./ModalPassword";
import ButtonLoading from "../../components/ButtonLoading";

import { useSelector, useDispatch } from "react-redux";
import { validationUpdateProfile } from "./validation";
import { profileActions, updateUser } from "./actions";
import { find } from "lodash";

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../constants";
import Utils from "../../utilities/utils";

const options = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const languages = [
  { value: "EN", label: "English" },
  { value: "NL", label: "Dutch" },
];

const checkGender = userGender => {
  return options.filter(val => val.value === userGender)[0];
};

const checkRoles = userRoles => {
  return userRoles.map(role => {
    if (role.name) {
      return { value: role.name, label: role.name };
    }
    return null;
  });
};

function Profile({ intl }) {
  // global
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);
  const { user } = profile;

  // local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genderSelected, setGenderSelected] = useState(
    checkGender(user.gender),
  );
  const [isOpenPasswordModal, setIsOpenPasswordModal] = useState(false);

  const { notification } = profile;
  const {
    firstName,
    lastName,
    email,
    username,
    language,
    phoneNumber1,
    phoneNumber2,
    gender,
  } = user;
  const [languageSelected, setLanguageSelected] = useState(language);


  const { register, errors, handleSubmit, setValue } = useForm({
    defaultValues: {
      firstName,
      lastName,
      email,
      username,
      language,
      phoneNumber1,
      phoneNumber2,
      gender,
    },
    validationSchema: validationUpdateProfile(intl),
  });

  useEffect(() => {
    register({ name: "gender" });
    register({ name: "language" });
  }, [register]);

  const onSubmit = data => {
    if (data.email === user.email) {
      delete data.email;
    }
    setIsSubmitting(true);
    dispatch(updateUser(data, setIsSubmitting));
  };

  const onToggleOpenPasswordModal = () => {
    setIsOpenPasswordModal(!isOpenPasswordModal);
  };

  // hidden notification
  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(profileActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }
  });

  return (
    <Fragment>
      <ReactCSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear={true}
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <FormGroup>
          <Row>
            <Col md="12" lg="6">
              {notification && notification.message ? (
                <Alert
                  color={notification.type === "success" ? "success" : "danger"}
                  isOpen={!!notification.message}
                >
                  {Utils.showNotify(intl, notification)}
                </Alert>
              ) : null}
              <Row>
                <Col>
                  <Card className="main-card mb-3">
                    <CardHeader><FormattedMessage id="pages.profile.userInfo" /></CardHeader>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                      <CardBody>
                        <FormGroup>
                          <Input
                            type="text"
                            name="firstName"
                            placeholder={intl.formatMessage({id: "components.input.placeholder.firstName"})}
                            innerRef={register}
                            invalid={!!errors.firstName}
                          />
                          {errors.firstName && errors.firstName.message && (
                            <FormFeedback>
                              {errors.firstName.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder={intl.formatMessage({id: "components.input.placeholder.lastName"})}
                            innerRef={register}
                            invalid={!!errors.lastName}
                          />
                          {errors.lastName && errors.lastName.message && (
                            <FormFeedback>
                              {errors.lastName.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Select
                            onChange={option => {
                              setValue("gender", option.value);
                              setGenderSelected(option);
                            }}
                            options={options}
                            placeholder={intl.formatMessage({id: "components.input.placeholder.gender"})}
                            noOptionsMessage={() => (
                              intl.formatMessage({ id: "components.select.noOption"})
                            )}
                            // id="gender"
                            name="gender"
                            // innerRef={register}
                            value={genderSelected}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Select
                            name="language"
                            options={languages}
                            placeholder={intl.formatMessage({id: "components.input.placeholder.language"})}
                            noOptionsMessage={() => (
                              intl.formatMessage({ id: "components.select.noOption"})
                            )}
                            value={find(languages, item => item.value === languageSelected)}
                            onChange={val => {
                              setLanguageSelected(val.value);
                              setValue("language", val.value);
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder={intl.formatMessage({id: "components.input.placeholder.emailAddress"})}
                            innerRef={register}
                            invalid={!!errors.email}
                          />
                          {errors.email && errors.email.message && (
                            <FormFeedback>{errors.email.message}</FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="text"
                            name="phoneNumber1"
                            id="phoneNumber1"
                            placeholder={intl.formatMessage({id: "components.input.placeholder.phoneNumber"}) + " 1"}
                            innerRef={register}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="text"
                            name="phoneNumber2"
                            id="phoneNumber2"
                            placeholder={intl.formatMessage({id: "components.input.placeholder.phoneNumber"}) + " 2"}
                            innerRef={register}
                          />
                        </FormGroup>

                        <CardTitle><FormattedMessage id="pages.profile.account" /></CardTitle>

                        <FormGroup>
                          <Input
                            type="text"
                            name="username"
                            placeholder={intl.formatMessage({id: "components.input.placeholder.username"})}
                            disabled
                            innerRef={register}
                          />
                        </FormGroup>
                        <Row form>
                          <Col md={12}>
                            <FormGroup className="d-flex justify-content-end">
                              <Button
                                color="danger"
                                className="btn-shadow"
                                onClick={onToggleOpenPasswordModal}
                              >
                                <span className="btn-icon-wrapper pr-2 opacity-7">
                                  <FontAwesomeIcon icon={faBusinessTime} />
                                </span>
                                <FormattedMessage id="components.button.updatePassword" />
                              </Button>
                            </FormGroup>
                          </Col>
                        </Row>

                        <CardTitle><FormattedMessage id="pages.profile.hasRoles" /></CardTitle>

                        <FormGroup>
                          <Select
                            options={checkRoles(user.roles)}
                            value={checkRoles(user.roles)}
                            placeholder={intl.formatMessage({id: "components.input.placeholder.roleName"})}
                            noOptionsMessage={() => (
                              intl.formatMessage({ id: "components.select.noOption"})
                            )}
                            isMulti
                            menuPlacement="top"
                            isDisabled
                          />
                        </FormGroup>
                      </CardBody>

                      <CardFooter className="d-block text-right">
                        <ButtonLoading
                          size="lg"
                          color="success"
                          type="submit"
                          text={intl.formatMessage({id: "components.button.save"})}
                          isLoading={isSubmitting}
                          disabled={isSubmitting}
                        />
                      </CardFooter>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </FormGroup>

        <UpdatePasswordModal
          isOpen={isOpenPasswordModal}
          onToggleOpen={onToggleOpenPasswordModal}
        />
      </ReactCSSTransitionGroup>
    </Fragment>
  );
}

export default memo(injectIntl(Profile));
