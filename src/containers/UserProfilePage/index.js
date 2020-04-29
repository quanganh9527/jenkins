/**
 *
 * User Profile page
 *
 */
import React, { Fragment, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";

import PageLayout from "../../components/PageLayout";

import Profile from "./Profile";

// ###
import { fetchUser, resetProps } from "./actions";

function UserProfile() {
  // global
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.profile);

  useEffect(() => {
    const fetchUserProfile = () => {
      dispatch(fetchUser());
    };
    fetchUserProfile();
    return () => dispatch(resetProps());
  }, [dispatch]);

  return (
    <Fragment>
      <PageLayout
        pageTitleProps={{
          heading: "My accounts",
          icon: "pe-7s-users icon-gradient page-title-custom-icon",
        }}
      />
      {user ? <Profile /> : <div>Loading...</div>}
    </Fragment>
  );
}

export default memo(UserProfile);
