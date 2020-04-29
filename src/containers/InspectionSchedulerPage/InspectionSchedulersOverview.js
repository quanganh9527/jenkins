import React from "react";
import { injectIntl } from "react-intl";
import { Col, Container, Card, Row, Button } from "reactstrap";

import PageLayout from "components/PageLayout";
import PageTitle from "components/PageTitle";
import TablePagination from "components/TablePagination";

import TableFilters from "./components/TableFilters";

import { inspectionSchedulersColums } from "./constants";

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const InspectionSchedulersOverview = (props) => {
  const { intl } = props;

  const refTableNode = React.useRef(null);

  return (
    <PageLayout>
      <PageTitle
        heading={intl.formatMessage({
          id: "components.pageTitle.inspectionSchedulersOverview",
        })}
        icon="page-title-custom-icon nav-icon-inspections"
      />
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="main-card p-4">
              <TableFilters intl={intl} onHandleResetFilters={() => {}} />

              <Row>
                <Col>
                  <TablePagination
                    refTableNode={refTableNode}
                    intl={intl}
                    data={[]}
                    columns={inspectionSchedulersColums(intl)}
                    defaultSorted={defaultSorted}
                    loading={false}
                    totalSize={10}
                    onPaginationChange={() => {}}
                    onRowEventClick={() => {}}
                    // resetFilter={onHandleResetFilters}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </PageLayout>
  );
};

export default React.memo(injectIntl(InspectionSchedulersOverview));
