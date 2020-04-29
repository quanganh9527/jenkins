import React from "react";
import loadable from "@loadable/component";

const ContactsLoadable = loadable(() => import("./index"), {
  fallback: <div>Loading...</div>,
});

export { ContactsLoadable };
