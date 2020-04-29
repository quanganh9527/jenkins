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
import MaintenanceDetail from "./MaintenanceDetails";
import MaintenanceNew from "./MaintenanceNew";
function InspectionEdit(props) {
  const { inspectionId } = useParams();

  const isEdit = inspectionId !== "new";

  return (
    <Fragment>
      <PageLayout>
        {isEdit ? (
          <MaintenanceDetail {...props} inspectionId={inspectionId} />
        ) : (
            <MaintenanceNew {...props} />
          )}
      </PageLayout>
    </Fragment>
  );
}

export default InspectionEdit;
