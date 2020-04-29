import React, { Fragment } from "react";
import MetisMenu from "react-metismenu";
import { groupBy, map, orderBy, findKey } from "lodash";
import { FormattedMessage } from "react-intl";
import enMessages from "../../../i18n/locales/en_US.json"
import "./styles.scss";

import { useUserState } from "../../../containers/LoginPage/context";

// components
import CustomLink from "./CustomLink";

function Nav() {
  const userState = useUserState();
  let { user } = userState;
  user = user || {};
  let { navigations } = user;
  navigations = orderBy(navigations, ["group.displayOrder"]);
  let navGroups = groupBy(navigations, "group.name");

  const getNameNav = (nav) => {
    let languageKey = findKey(enMessages, value => value.toLowerCase() === nav.name.toLowerCase());
    return languageKey ? <FormattedMessage id={languageKey} /> : nav.name || "";
  }

  const navs = map(navGroups, group => {
    let rootNav = group[0] && group[0].group ? group[0].group : {};
    group = orderBy(group, ["displayOrder"]);
    return {
      icon: rootNav.icon || "",
      label: getNameNav(rootNav),
      content: map(group, item => {
        return {
          label: getNameNav(item),
          to: item.path,
        };
      }),
    };
  });

  return (
    <Fragment>
      <MetisMenu
        content={navs}
        activeLinkFromLocation
        className="vertical-nav-menu"
        iconNamePrefix=""
        classNameStateIcon="pe-7s-angle-down"
        classNameContainer="nav-item-container"
        classNameItemActive="nav-item-active"
        classNameLinkHasActiveChild="nav-item-has-active-child"
        classNameContainerVisible="nav-item-container-visible"
        classNameItemHasVisibleChild="nav-item-has-visible-child"
        classNameLinkActive="nav-item-link-active"
        classNameLink="nav-item-link"
        classNameItem="nav-item"
        LinkComponent={CustomLink}
      />
    </Fragment>
  );
}
// class Nav extends Component {
//   state = {};

//   render() {
//     console.log(MainNav);
//     return (
//       <Fragment>
//         <MetisMenu
//           content={MainNav}
//           activeLinkFromLocation
//           className="vertical-nav-menu"
//           iconNamePrefix=""
//           classNameStateIcon="pe-7s-angle-down"
//           classNameContainer="nav-item-container"
//           classNameItemActive="nav-item-active"
//           classNameLinkHasActiveChild="nav-item-has-active-child"
//           classNameContainerVisible="nav-item-container-visible"
//           classNameItemHasVisibleChild="nav-item-has-visible-child"
//           classNameLinkActive="nav-item-link-active"
//           classNameLink="nav-item-link"
//           classNameItem="nav-item"
//         />
//       </Fragment>
//     );
//   }

//   // isPathActive(path) {
//   //   return this.props.location.pathname.startsWith(path);
//   // }
// }

export default Nav;
