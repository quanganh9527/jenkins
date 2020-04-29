import React, { Fragment } from "react";
import ResizeDetector from "react-resize-detector";
import cx from "classnames";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

// Layout
import AppHeader from "../../components/Layout/AppHeader";
import AppSidebar from "../../components/Layout/AppSidebar";

// pages
import {
  Inspections,
  InspectionEdit,
  MaintenanceEdit,
  CleaningEdit,
  InspectionViewer,
} from "../InspectionsPage";
import {
  Invoices,
  // InvoiceBook,
  CostCenterManage,
  CostTypeManage,
  CustomCostLine,
} from "../InvoicesPage";
import { Locations, LocationEdit, OrganizeTemplates } from "../LocationsPage";
import { Employees } from "../EmployeesPage";
import {
  ContactNew,
  PersonNew,
  ContactGroupsLoadable,
  ContactsLoadable,
  DebtorSettings,
} from "../ContactsPage";
import UserProfilePage from "../UserProfilePage";
import SinglePage from "../SinglePage";
import { DebtorRenting, AddContracts } from "containers/ContractsPage";
import { LazyComponents as InspectionSchedulerPage } from "containers/InspectionSchedulerPage";

class AdminLayout extends React.Component {
  render() {
    let {
      colorScheme,
      enableFixedHeader,
      enableFixedSidebar,
      enableFixedFooter,
      enableClosedSidebar,
      closedSmallerSidebar,
      enableMobileMenu,
      enablePageTabsAlt,
    } = this.props;

    return (
      <ResizeDetector
        handleWidth
        render={({ width }) => (
          <Fragment>
            <div
              className={cx(
                "app-container app-theme-" + colorScheme,
                { "fixed-header": enableFixedHeader },
                { "fixed-sidebar": enableFixedSidebar || width < 1250 },
                { "fixed-footer": enableFixedFooter },
                { "closed-sidebar": enableClosedSidebar || width < 1250 },
                {
                  "closed-sidebar-mobile": closedSmallerSidebar || width < 1250,
                },
                { "sidebar-mobile-open": enableMobileMenu },
                { "body-tabs-shadow-btn": enablePageTabsAlt },
              )}
            >
              <Fragment>
                <AppHeader />
                <div className="app-main">
                  <AppSidebar />
                  <div className="app-main__outer">
                    <div className="app-main__inner">
                      <Switch>
                        <Route
                          path="/contracts/debtor-renting-contracts/create"
                          component={AddContracts}
                        />
                        <Route
                          path="/contracts/debtor-renting-contracts/:contractId"
                          component={AddContracts}
                        />
                        <Route
                          path="/contracts/debtor-renting-contracts"
                          component={DebtorRenting}
                        />

                        {/* Inspections */}

                        <Route
                          path="/inspections/schedulers"
                          component={
                            InspectionSchedulerPage.InspectionSchedulersOverview
                          }
                        />

                        <Route
                          path="/inspections/inspection-templates"
                          component={OrganizeTemplates}
                        />

                        <Route path="/inspections/:inspectionId/summary">
                          <InspectionViewer
                            {...this.props}
                            jobType="Inspection"
                          />
                        </Route>
                        <Route path="/inspections/:inspectionId">
                          <InspectionEdit
                            {...this.props}
                            jobType="Inspection"
                          />
                        </Route>
                        <Route path="/inspections">
                          <Inspections {...this.props} jobType="Inspection" />
                        </Route>

                        {/* Maintenance */}

                        <Route path="/maintenances/:inspectionId/summary">
                          <InspectionViewer
                            {...this.props}
                            jobType="Maintenance"
                          />
                        </Route>
                        <Route path="/maintenances/:inspectionId">
                          <MaintenanceEdit
                            {...this.props}
                            jobType="Maintenance"
                          />
                        </Route>
                        <Route path="/maintenances">
                          <Inspections {...this.props} jobType="Maintenance" />
                        </Route>

                        {/* Cleaning */}

                        <Route path="/cleaning/:inspectionId/summary">
                          <InspectionViewer
                            {...this.props}
                            jobType="Cleaning"
                          />
                        </Route>
                        <Route path="/cleaning/:inspectionId">
                          <CleaningEdit {...this.props} jobType="Cleaning" />
                        </Route>
                        <Route path="/cleaning">
                          <Inspections {...this.props} jobType="Cleaning" />
                        </Route>

                        {/* Invoices */}
                        {/* <Route path="/invoices/book" component={InvoiceBook} /> */}
                        <Route
                          path="/invoices/custom-cost-lines"
                          component={CustomCostLine}
                        />
                        <Route
                          path="/invoices/cost-centers"
                          component={CostCenterManage}
                        />
                        <Route
                          path="/invoices/cost-types"
                          component={CostTypeManage}
                        />
                        <Route path="/invoices" component={Invoices} />

                        {/* Locations */}
                        <Route path="/locations/new" component={LocationEdit} />

                        <Route
                          path="/locations/:locationId"
                          component={LocationEdit}
                        />
                        <Route path="/locations" component={Locations} />

                        {/* Employees */}
                        <Route path="/employees" component={Employees} />

                        {/* Contacts */}
                        <Route
                          path="/contacts/people/new"
                          component={PersonNew}
                        />
                        <Route
                          path="/contacts/people/:personId"
                          component={PersonNew}
                        />
                        <Route
                          path="/contacts/group/new"
                          component={ContactNew}
                        />
                        <Route
                          path="/contacts/group/:groupingId"
                          component={ContactNew}
                        />
                        <Route
                          path="/contacts/group"
                          component={ContactGroupsLoadable}
                        />
                        <Route
                          path="/contacts/people"
                          component={ContactsLoadable}
                        />
                        <Route
                          exact
                          path="/contacts/debtor-settings"
                          component={DebtorSettings}
                        />

                        {/* User Profile Page */}
                        <Route
                          path="/user-profile"
                          component={UserProfilePage}
                        />

                        <Route path="/" component={SinglePage.Dashboard} />
                        <Route component={SinglePage.NotFound} />
                      </Switch>
                    </div>
                  </div>
                </div>
              </Fragment>
            </div>
          </Fragment>
        )}
      ></ResizeDetector>
    );
  }
}

const mapStateToProp = (state) => ({
  colorScheme: state.ThemeOptions.colorScheme,
  enableFixedHeader: state.ThemeOptions.enableFixedHeader,
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  enableFixedFooter: state.ThemeOptions.enableFixedFooter,
  enableFixedSidebar: state.ThemeOptions.enableFixedSidebar,
  enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
  enablePageTabsAlt: state.ThemeOptions.enablePageTabsAlt,
});

export default connect(mapStateToProp)(AdminLayout);
