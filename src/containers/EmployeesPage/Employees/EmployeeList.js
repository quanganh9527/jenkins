import React, { Fragment, useState, useEffect, useCallback, useRef } from "react";
import { map, find, filter, includes, forEach } from "lodash";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { useSelector, useDispatch } from "react-redux";
import { employeeActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";

import useForm from "react-hook-form";
import { validationCreateAccount } from "../validation";
import generatePassword from "../../../utilities/generatePassword";
// import classnames from "classnames";
import {
  Row,
  Col,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Button,
  CardBody,
  Form,
  FormGroup,
  Input,
  CustomInput,
  CardFooter,
  CardTitle,
  FormFeedback,
  Alert,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import Select from "react-select";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ResetPasswordModal from "./ResetPasswordModal";
import ButtonLoading from "../../../components/ButtonLoading";

import { FormattedMessage, injectIntl } from "react-intl";
import { TIME_HIDDEN_NOTIFICATION } from "../../../constants";
import Utils from "../../../utilities/utils";

const options = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

const languages = [
  { value: "EN", label: "English" },
  { value: "NL", label: "Dutch" },
];

function EmployeeList({ intl }) {
  // init dispatch
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  // get init state users & roles
  useEffect(() => {
    dispatch(employeeActions.getUsers());
    // fetch all roles
    dispatch(employeeActions.getRoles());
  }, [dispatch]);

  // init hook state
  const [searchKeywword, setSearchKeyword] = useState("");
  const [searchKeywwordInput, setSearchKeywordInput] = useState("");
  const [showActiveAccount, setStatusDisplayAccount] = useState(true);

  const [blockedUser, setStatusUserForm] = useState(false);
  const [genderSelected, setGenderSelected] = useState("Male");
  const [languageSelected, setLanguageSelected] = useState("EN");
  const [rolesSelected, setRolesSelected] = useState([]);

  // get state of store
  const employee = useSelector(state => state.employee);
  const loadingStateProvider = useSelector(state => state.loadingProvider);

  const { roles, users, notification, isResetForm, isLoadingData, isShowRowEmpty } = employee;

  const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] = useState(
    false,
  );
  const [isSubmitting, setIsSubmitting] = useState(false); // handle status submit form

  const [userIdSelected, setuserIdSelected] = useState("");

  // form
  const [inputPasswordType, setInputPasswordType] = useState("password");
  const [isGeneratePassword, setIsGeneratePassword] = useState(false);

  const setShowRowEmpty = useCallback((status) => {
    dispatch(employeeActions.setShowRowEmpty(status));
  }, [dispatch]);

  const initUserForm = useCallback((user = {}) => {
    return Object.assign(
      user,
      {
        rolesSelect: user.roles && user.roles[0] ? user.roles[0]._id : "",
        roles: user.roles || [],
      },
      {
        genderSelect: user.gender || "Male",
        gender: user.gender || "Male",
      },
      {
        languageSelect: user.language || "EN",
        language: user.language || "EN",
      },
    );
  }, []);

  const {
    handleSubmit,
    register,
    errors,
    setValue,
    getValues,
    reset,
    setError,
    formState
  } = useForm({
    validationSchema: validationCreateAccount(intl, userIdSelected ? true : false),
    submitFocusError: true,
  });
  useEffect(() => {
    // custom validation
    register({ name: "languageSelect" });
    register({ name: "language" });
    register({ name: "genderSelect" });
    register({ name: "gender" });
    register({ name: "roles" });
    register({ name: "rolesSelect" });
  });

  // handle focus input
  useEffect(() => {
    if (formState.isSubmitted && !formState.isValid) {
      if (errors && Object.keys(errors).length === 1 && errors['rolesSelect']) {
        const form = document.forms['form-employee'];
        if (form && form['rolesSelect']) {
          inputEl.current.focus();
        }
      }
    }
  });
  useEffect(() => {
    if (employee.errors && Object.keys(employee.errors).length > 0) {
      forEach(employee.errors, (errorItem, key) => {
        // get form data to handle foucs error
        const form = document.forms['form-employee'];
        if (form && form[key]) {
          form[key].focus();
          return false;
        }
        // setError(key, 'notMatch', errorItem);
      });
      dispatch(employeeActions.resetErrorsForm());
    }
  }, [employee, setError, dispatch])
  const handleSelectUser = user => {
    // setShowRowEmpty(false);
    setIsSubmitting(false);
    setuserIdSelected(user._id);
    setGenderSelected(user.gender || "Male");
    setLanguageSelected(user.language || "EN");
    setRolesSelected(user.roles || []);
    setStatusUserForm(user ? user.blocked : true);
    reset(initUserForm(user)); // reset user form by user selected
  };

  const onToggleOpenResetPasswordModal = () => {
    setIsOpenResetPasswordModal(!isOpenResetPasswordModal);
  };

  const onHandleGeneratePassword = () => {
    setIsGeneratePassword(true);
    setTimeout(() => {
      setValue("password", generatePassword());
      setIsGeneratePassword(false);
    }, 1000);
  };

  const onHandleShowPassword = () => {
    if (inputPasswordType === "password") {
      setInputPasswordType("text");
    } else {
      setInputPasswordType("password");
    }
  };
  const addEmptyAccount = useCallback(
    createEmptyRow => {
      if (createEmptyRow) {
        setShowRowEmpty(true);
      }
      setIsSubmitting(false);
      // add new line in top and reset form
      setuserIdSelected("");
      setRolesSelected([]);
      setStatusUserForm(false);
      setGenderSelected("Male");
      setLanguageSelected("EN");
      reset(initUserForm());
    },
    [
      reset,
      setShowRowEmpty,
      setuserIdSelected,
      setRolesSelected,
      setStatusUserForm,
      setGenderSelected,
      setLanguageSelected,
      initUserForm,
    ],
  );

  useEffect(() => {
    if (notification && notification.message) {
      setTimeout(() => {
        dispatch(employeeActions.resetNotification());
      }, TIME_HIDDEN_NOTIFICATION);
    }

    // set default gender form
    if (!getValues()["gender"]) {
      setValue("gender", "Male");
      setValue("genderSelect", "Male");
    }

    if (!getValues()["language"]) {
      setValue("language", "EN");
      setValue("languageSelect", "EN");
    }
  });
  const onSubmit = values => {
     // prevent try to submit when submitting
     if (loadingStateProvider.isSubmittingStatusProvider) return;
    values.blocked = blockedUser;
    values.roles = map(values.roles, roleItem => roleItem._id);
    delete values.genderSelect;
    delete values.rolesSelect;
    delete values.languageSelect;
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    if (userIdSelected) {
      handleUpdateUserAccount(userIdSelected, values);
    } else {
      handleCreateUserAccount(values);
    }
  };

  const handleCreateUserAccount = account => {
    setIsSubmitting(true);
    dispatch(employeeActions.addAccountSubmit(account));
    setIsSubmitting(false);
  };
  const handleUpdateUserAccount = (userId, account) => {
    setIsSubmitting(true);
    dispatch(employeeActions.submitFormData());
    dispatch(employeeActions.updateAccountSubmit(userId, account));
    setIsSubmitting(false);
  };
  // reset form with action success
  useEffect(() => {
    if (isResetForm) {
      addEmptyAccount();
      dispatch(employeeActions.submitFormData());
    }
  }, [isResetForm, addEmptyAccount, dispatch]);

  const handleSubmitSearch = event => {
    event.preventDefault();
    setSearchKeyword(searchKeywwordInput);
  };

  const handleSearchUser = () => {
    if (users && users.length > 0) {
      return filter(users, userItem => {
        let fullName = userItem.firstName + " " + userItem.lastName;
        return (
          userItem.blocked === !showActiveAccount &&
          (!searchKeywword ||
            includes(fullName.toLowerCase(), searchKeywword.toLowerCase()))
        );
      });
    }
    return [];
  };
  const usersDisplay = handleSearchUser(); // search result

  // disable form when unselect user
  useEffect(() => {
    if (!userIdSelected && !isShowRowEmpty) {
      setIsSubmitting(true);
    }
  }, [userIdSelected, isShowRowEmpty]);
  
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
          {notification && notification.message && !notification.display ? (
            <Alert
              color={notification.type === "success" ? "success" : "danger"}
              isOpen={!!notification.message}
            >
              {Utils.showNotify(intl, notification)}
            </Alert>
          ) : null}
          <Row>
            <Col>
              <div>
                <Form
                  inline
                  className="mb-3"
                  noValidate
                  onSubmit={handleSubmitSearch}
                >
                  <FormGroup>
                    <div className="search-wrapper active">
                      <div className="input-holder">
                        <input
                          type="text"
                          className="search-input"
                          placeholder={intl.formatMessage({ id: 'components.input.placeholder.typeToSearch' })}
                          value={searchKeywwordInput}
                          onChange={({ target }) => {
                            setSearchKeywordInput(target.value);
                            setSearchKeyword(target.value);
                          }}
                        />
                        <button className="search-icon" type="submit">
                          <span />
                        </button>
                      </div>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div>
                      <CustomInput
                        type="checkbox"
                        id="showActiveAccount"
                        label={intl.formatMessage({ id: 'components.checkBox.showOnlyActive' })}
                        checked={showActiveAccount}
                        value={showActiveAccount}
                        onChange={() =>
                          setStatusDisplayAccount(!showActiveAccount)
                        }
                      />
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Button
                      className="btn-icon btn-icon-only ml-3"
                      size="lg"
                      type="button"
                      color="primary"
                      onClick={() => addEmptyAccount(true)}
                    >
                      <i className="pe-7s-add-user btn-icon-wrapper"> </i>
                    </Button>
                  </FormGroup>
                </Form>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md="12" lg="6">
              <Card className="main-card mb-3">
                <CardHeader><FormattedMessage id="pages.profile.employees" /></CardHeader>
                <ListGroup className="todo-list-wrapper list-employees" flush>
                  {isShowRowEmpty ? (
                    <ListGroupItem
                      tag="button"
                      className={!userIdSelected ? "active" : ""}
                      key="row-empty"
                      onClick={() => handleSelectUser({})}
                    >
                      <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                          <div className="widget-content-left">
                            <div className="widget-heading">
                              <i className="pe-7s-add-user btn-icon-wrapper">
                                {" "}
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                  ) : null}
                  {
                    usersDisplay && usersDisplay.length ? map(usersDisplay, (userItem, idx) => {
                      userItem.fullName =
                        userItem.firstName + " " + userItem.lastName;
                      return (
                        <ListGroupItem
                          tag="button"
                          className={
                            userItem._id === userIdSelected ? "active" : ""
                          }
                          key={userItem._id}
                          onClick={() => handleSelectUser(userItem)}
                        >
                          <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                              <div className="widget-content-left my-auto">
                                <div className="widget-heading d-flex">
                                  <i className="pe-7s-user btn-icon-wrapper align-middle">
                                    {" "}
                                  </i>
                                  <p className="my-auto ml-2">
                                    {userItem.fullName}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ListGroupItem>
                      );
                    })
                      : <h6 className="text-center py-2 text-danger">{!isLoadingData && <FormattedMessage id="pages.profile.noResult" />}</h6>
                  }
                </ListGroup>
              </Card>
            </Col>

            <Col md="12" lg="6">
              {/* Employee */}
              <Row>
                <Col>
                  <Card className="main-card mb-3">
                    <CardHeader><FormattedMessage id="pages.profile.employee" /></CardHeader>
                    <CardBody>
                      <Form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        name="form-employee"
                        autoComplete="off"
                      >
                        <FormGroup>
                          <Input
                            type="text"
                            name="firstName"
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.firstName' })}
                            disabled={isSubmitting}
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
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.lastName' })}
                            disabled={isSubmitting}
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
                            value={
                              find(
                                options,
                                optionGender =>
                                  optionGender.value === genderSelected,
                              ) || {}
                            }
                            name="gender"
                            isDisabled={isSubmitting}
                            onChange={val => {
                              setGenderSelected(val.value);
                              setValue("gender", val.value);
                              setValue("genderSelect", val.value);
                            }}
                            options={options}
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.lastName' })}
                            noOptionsMessage={() => (
                              intl.formatMessage({ id: "components.select.noOption"})
                            )}
                            innerRef={register}
                            invalid={!!errors.genderSelect}
                          />
                          {errors.genderSelect &&
                            !genderSelected &&
                            errors.genderSelect.message && (
                              <FormFeedback style={{ display: "block" }}>
                                {errors.genderSelect.message}
                              </FormFeedback>
                            )}
                        </FormGroup>
                        <FormGroup>
                          <Select
                            value={
                              find(
                                languages,
                                item =>
                                  item.value === languageSelected,
                              ) || {}
                            }
                            name="language"
                            isDisabled={isSubmitting}
                            onChange={val => {
                              setLanguageSelected(val.value);
                              setValue("language", val.value);
                              setValue("languageSelect", val.value);
                            }}
                            options={languages}
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.language' })}
                            noOptionsMessage={() => (
                              intl.formatMessage({ id: "components.select.noOption"})
                            )}
                            innerRef={register}
                            invalid={!!errors.languageSelect}
                          />
                          {errors.languageSelect &&
                            !languageSelected &&
                            errors.languageSelect.message && (
                              <FormFeedback style={{ display: "block" }}>
                                {errors.languageSelect.message}
                              </FormFeedback>
                            )}
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="email"
                            name="email"
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.emailAddress' })}
                            disabled={isSubmitting}
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
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.phoneNumber' }) + " 1"}
                            disabled={isSubmitting}
                            innerRef={register}
                            invalid={!!errors.phoneNumber1}
                          />
                          {errors.phoneNumber1 &&
                            errors.phoneNumber1.message && (
                              <FormFeedback>
                                {errors.phoneNumber1.message}
                              </FormFeedback>
                            )}
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="text"
                            name="phoneNumber2"
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.phoneNumber' }) + " 2"}
                            disabled={isSubmitting}
                            innerRef={register}
                          />
                        </FormGroup>

                        <CardTitle><FormattedMessage id="pages.profile.account" /></CardTitle>

                        <FormGroup>
                          <Input
                            type="text"
                            name="username"
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.username' })}
                            disabled={isSubmitting || userIdSelected}
                            innerRef={register}
                            invalid={!!errors.username}
                            autoComplete="new-password"
                          />
                          {errors.username && errors.username.message && (
                            <FormFeedback>
                              {errors.username.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                        {!userIdSelected ? (
                          <FormGroup>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <Button
                                  className="btn-icon btn-icon-only"
                                  color="info"
                                  onClick={onHandleShowPassword}
                                  type="button"
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      inputPasswordType === "text"
                                        ? faEye
                                        : faEyeSlash
                                    }
                                  />
                                </Button>
                              </InputGroupAddon>
                              <Input
                                type={inputPasswordType}
                                name="password"
                                placeholder={intl.formatMessage({ id: 'components.input.placeholder.newPassword' })}
                                disabled={isSubmitting}
                                innerRef={register}
                                invalid={!!errors.password}
                                autoComplete="new-password"
                              />
                              <InputGroupAddon addonType="append">
                                <ButtonLoading
                                  color="secondary"
                                  type="button"
                                  onClick={onHandleGeneratePassword}
                                  isLoading={isGeneratePassword}
                                  text={intl.formatMessage({ id: 'components.button.generate' })}
                                  disabled={isSubmitting}
                                />
                              </InputGroupAddon>
                              {errors.password && errors.password.message && (
                                <FormFeedback>
                                  {errors.password.message}
                                </FormFeedback>
                              )}
                            </InputGroup>
                          </FormGroup>
                        ) : null}
                        <Row form>
                          <Col md={6}>
                            <FormGroup>
                              <CustomInput
                                type="checkbox"
                                name="blocked"
                                id="activeAccount"
                                label={intl.formatMessage({ id: 'components.checkBox.accountIsActive' })}
                                checked={!blockedUser}
                                disabled={isSubmitting}
                                innerRef={register}
                                onChange={() => {
                                  setStatusUserForm(!blockedUser);
                                  setValue("blocked", !blockedUser);
                                }}
                              />
                            </FormGroup>
                          </Col>
                          {userIdSelected ? (
                            <Col md={6}>
                              <FormGroup className="d-flex justify-content-end">
                                <Button
                                  className="btn-icon"
                                  size="sm"
                                  type="button"
                                  color="danger"
                                  onClick={() =>
                                    onToggleOpenResetPasswordModal()
                                  }
                                >
                                  <i className="pe-7s-refresh-2 btn-icon-wrapper"></i>
                                  <FormattedMessage id="components.button.resetPassword" />
                                </Button>
                              </FormGroup>
                            </Col>
                          ) : null}
                        </Row>

                        <CardTitle>
                          <FormattedMessage id="pages.profile.hasRoles" />
                        </CardTitle>

                        <FormGroup>
                          <Select
                            value={rolesSelected || []}
                            options={roles}
                            name="rolesSelect"
                            getOptionLabel={opt => opt.name}
                            getOptionValue={opt => opt._id}
                            placeholder={intl.formatMessage({ id: 'components.input.placeholder.roleName' })}
                            noOptionsMessage={() => (
                              intl.formatMessage({ id: "components.select.noOption"})
                            )}
                            isMulti
                            isDisabled={isSubmitting}
                            menuPlacement="top"
                            ref={inputEl}
                            innerRef={register}
                            onChange={selectedOption => {
                              setRolesSelected(selectedOption);
                              setValue("roles", selectedOption);
                              setValue(
                                "rolesSelect",
                                selectedOption && selectedOption[0]
                                  ? selectedOption[0]._id
                                  : "",
                              );
                            }}
                          />
                          {errors.rolesSelect && errors.rolesSelect.message && (
                            <FormFeedback style={{ display: "block" }}>
                              {errors.rolesSelect.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Form>
                    </CardBody>
                    <CardFooter className="d-flex justify-content-between">
                      <div>
                        {notification &&
                          notification.message &&
                          notification.display ? (
                            <p
                              className={
                                notification.type === "success"
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {Utils.showNotify(intl, notification)}
                            </p>
                          ) : null}
                      </div>
                      <div>
                        <Button
                          type="button"
                          size="lg"
                          outline
                          color="secondary"
                          onClick={() => {
                            setShowRowEmpty(false);
                            addEmptyAccount();
                          }}
                          className="mr-2"
                          disabled={isSubmitting}
                        >
                          <FormattedMessage id="components.button.cancel" />
                        </Button>
                        <Button
                          type="button"
                          size="lg"
                          color="success"
                          onClick={handleSubmit(onSubmit)}
                          disabled={isSubmitting}
                        >
                          <FormattedMessage id="components.button.save" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </FormGroup>

        <ResetPasswordModal
          isOpen={isOpenResetPasswordModal}
          onToggleOpen={onToggleOpenResetPasswordModal}
          userId={userIdSelected}
          dispatch={dispatch}
        />
      </ReactCSSTransitionGroup>
    </Fragment>
  );
}

export default injectIntl(EmployeeList);
