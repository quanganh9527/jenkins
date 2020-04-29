/**
 *
 * Contact new/edit
 *
 */
import React, { Fragment, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { contactActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";
// ###
import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";

// ###
import PersonCreate from "./Create";

import { FormattedMessage, injectIntl } from "react-intl";

function PersonNew({intl}) {

  const childRef = useRef();
  const dispatch = useDispatch();

  const [headingTitle, setHeadingTitle] = useState(<FormattedMessage id="components.pageTitle.newPerson" />);
  const contactState = useSelector(state => state.contact);
  const [forceRerender, setForceRerender] = useState(true);
  const [isActive, setStatusActive] = useState(true);
  let { person } = contactState;
  let { personId } = useParams();

  useEffect(() => {
    dispatch(contactActions.getInitDataPerson());
    if (personId) {
       // Display loading icon request
       dispatch(loadingProviderActions.setStatusLoadingProvider());
      dispatch(contactActions.getPerson(personId));
    }
  }, [dispatch, personId]);

  useEffect(() => {
    if (forceRerender) {
      // reset init form
      dispatch(contactActions.setPersonSelected());
      setStatusActive(true);

      if (childRef.current) {
        childRef.current.handleResetData();
      }
      setForceRerender(false);
    }
  }, [setForceRerender, dispatch, forceRerender]);

  useEffect(() => {
    if (person && person._id && !forceRerender) {
      setHeadingTitle(person.firstName + " " + person.lastName);
      setStatusActive(person.active);
      childRef.current.handleResetData(person);
    }
  }, [person, forceRerender]);

  const handleSubmit = () => {
    // call child submit form
    childRef.current.handleSubmitForm(isActive);
  }

  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={headingTitle}
          icon="page-title-custom-icon nav-icon-contacts"
          hasAction={true}
          hasActionName={<FormattedMessage id="components.button.save" />}
          checkboxParam={{
            value: isActive,
            handleChange: () => setStatusActive(!isActive),
          }}
          handleSubmit={() => handleSubmit()}
        />
        <PersonCreate ref={childRef} intl={intl} FormattedMessage={FormattedMessage} />
      </PageLayout>
    </Fragment>
  );
}

export default injectIntl(PersonNew);
