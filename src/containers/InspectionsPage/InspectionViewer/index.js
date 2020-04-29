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
import InspectionDetails from "./InspectionViewer";
function InspectionViewer(props) {
  const { inspectionId } = useParams();

  return (
    <Fragment>
      <PageLayout>
        <InspectionDetails {...props} inspectionId={inspectionId} />
      </PageLayout>
    </Fragment>
  );
}

export default InspectionViewer;
