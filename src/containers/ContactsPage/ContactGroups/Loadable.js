import React from "react";
import loadable from "@loadable/component";

const ContactGroupsLoadable = loadable(() => import("./index"), {
  fallback: <div>Loading...</div>,
});

export { ContactGroupsLoadable };