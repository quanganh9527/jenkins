import React from "react";
import loadable from "@loadable/component";

export const InspectionSchedulersOverview = loadable(
  () => import(/* webpackPrefetch: true */ "./InspectionSchedulersOverview"),
  {
    fallback: <div>Loading...</div>,
  },
);
