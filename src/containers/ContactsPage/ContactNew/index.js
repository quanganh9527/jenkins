/**
 *
 * Contact new/edit
 *
 */
import React, { Fragment, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { contactActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";
// ###
import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";

// ###
import GroupNew from "./Group";

import { FormattedMessage, injectIntl } from "react-intl";

function ContactNew({ intl }) {
  const childRef = useRef();
  const dispatch = useDispatch();
  const [isActive, setStatusActive] = useState(true);
  const [headingTitle, setHeadingTitle] = useState(
    <FormattedMessage id="components.pageTitle.newGroup" />,
  );
  const contactState = useSelector(state => state.contact);
  const [forceRerender, setForceRerender] = useState(true);
  let { grouping } = contactState;
  let { groupingId } = useParams();

  useEffect(() => {
    dispatch(contactActions.getInitDataGrouping());
  }, [dispatch]);

  useEffect(() => {
    if (forceRerender) {
      // reset init form
      dispatch(contactActions.setGroupingSelected());
      setStatusActive(true);

      if (childRef.current) {
        childRef.current.handleResetDataGrouping();
      }
      setForceRerender(false);
    }
  }, [setForceRerender, dispatch, forceRerender]);
  useEffect(() => {
    if (groupingId) {
      // Display loading icon request
      dispatch(loadingProviderActions.setStatusLoadingProvider());
      dispatch(contactActions.getGrouping(groupingId));
    }
  }, [dispatch, groupingId]);

  useEffect(() => {
    // check and call child reset grouping form
    if (grouping && grouping._id && !forceRerender) {
      setHeadingTitle(grouping.name);
      setStatusActive(grouping.active);
      childRef.current.handleResetDataGrouping(grouping);
    }
  }, [grouping, forceRerender]);
  const handleChangeActive = activeStatus => {
    setStatusActive(activeStatus);
    // call child ref set active for form
  };
  const handleSubmit = () => {
    // call child submit form
    childRef.current.handleSubmitForm(isActive);
  };
  const handleChangeGroupingName = groupingName => {
    setHeadingTitle(groupingName);
  };
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
            handleChange: () => handleChangeActive(!isActive),
          }}
          handleSubmit={() => handleSubmit()}
        />
        <GroupNew
          ref={childRef}
          intl={intl}
          FormattedMessage={FormattedMessage}
          grouping={grouping}
          handleChangeGroupingName={handleChangeGroupingName}
        />
      </PageLayout>
    </Fragment>
  );
}

export default injectIntl(ContactNew);
