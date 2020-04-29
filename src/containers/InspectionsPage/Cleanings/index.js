/**
 *
 * Cleaningss new/edit
 *
 */
import React, { Fragment } from "react";
import { useParams } from "react-router-dom";

// ###
import PageLayout from "../../../components/PageLayout";

// ###
import CleaningDetail from "./CleaningDetails";
import CleaningNew from "./CleaningNew";
function CleaningsEdit(props) {
  const { inspectionId } = useParams();

  const isEdit = inspectionId !== "new";

  return (
    <Fragment>
      <PageLayout>
        {isEdit ? (
          <CleaningDetail {...props} inspectionId={inspectionId} />
        ) : (
          <CleaningNew {...props} />
          )}
      </PageLayout>
    </Fragment>
  );
}

export default CleaningsEdit;
