/**
 *
 * Inspections new/edit
 *
 */
import React, { Fragment } from "react";
import { useParams } from "react-router-dom";

// ###
import PageLayout from "../../../components/PageLayout";

// ###
import InspectionNew from "./InspectionNew";
import InspectionDetails from "./InspectionDetails";
function InspectionEdit(props) {
  const { inspectionId } = useParams();

  const isEdit = inspectionId !== "new";

  return (
    <Fragment>
      <PageLayout>
        {isEdit ? (
          <InspectionDetails {...props} inspectionId={inspectionId} />
        ) : (
            <InspectionNew {...props} />
          )}
      </PageLayout>
    </Fragment>
  );
}

export default InspectionEdit;
