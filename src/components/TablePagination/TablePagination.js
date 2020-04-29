import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { Comparator } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import overlayFactory from "react-bootstrap-table2-overlay";
import { includes } from "lodash";

import "./style.scss";
function TablePagination({
  refTableNode,
  intl,
  columns,
  data,
  loading,
  page,
  sizePerPage,
  totalSize,
  onPaginationChange,
  onRowEventClick,
  resetFilter,
  filterParams,
}) {
  const [dataTable, setDataTable] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setDataTable(data);
    }
  }, [data, isLoading]);

  const customTotalPagination = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
      <FormattedMessage
        id="components.table.navigation.ShowingNumberResults"
        values={{ from, to, size }}
      />
    </span>
  );

  const options = {
    paginationSize: 7,
    pageStartIndex: page,
    totalSize: totalSize,
    firstPageText: intl.formatMessage({
      id: "components.table.navigation.firstPageText",
    }),
    prePageText: intl.formatMessage({
      id: "components.table.navigation.prePageText",
    }),
    nextPageText: intl.formatMessage({
      id: "components.table.navigation.nextPageText",
    }),
    lastPageText: intl.formatMessage({
      id: "components.table.navigation.lastPageText",
    }),
    nextPageTitle: intl.formatMessage({
      id: "components.table.navigation.nextPageTitle",
    }),
    prePageTitle: intl.formatMessage({
      id: "components.table.navigation.prePageTitle",
    }),
    firstPageTitle: intl.formatMessage({
      id: "components.table.navigation.firstPageTitle",
    }),
    lastPageTitle: intl.formatMessage({
      id: "components.table.navigation.lastPageTitle",
    }),
    showTotal: true,
    paginationTotalRenderer: customTotalPagination,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
    ]
      .concat(
        totalSize >= 10
          ? [
              {
                text: "20",
                value: 20,
              },
            ]
          : [],
      )
      .concat(
        totalSize >= 20
          ? [
              {
                text: "50",
                value: 50,
              },
            ]
          : [],
      )
      .concat(
        totalSize >= 50
          ? [
              {
                text: "100",
                value: 100,
              },
            ]
          : [],
      )
      .concat(
        totalSize > 100
          ? [
              {
                text: intl.formatMessage({
                  id: "components.table.navigation.allPageTitle",
                }),
                value: totalSize,
              },
            ]
          : [],
      ),
  };
  const handleTableChange = (
    type,
    { page, sizePerPage, filters, sortField, sortOrder, cellEdit },
  ) => {
    if (type === "pagination") {
      resetFilter();
      setIsLoading(false);
      onPaginationChange(page, sizePerPage, filterParams, type);
    } else {
      setIsLoading(true);
      let result = data;

      // Handle column filters
      result = result.filter((row) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === "TEXT") {
            if (comparator === Comparator.LIKE) {
              valid = includes(
                row[dataField].toLowerCase(),
                filterVal.toLowerCase(),
              );
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      // Handle column sort
      if (sortOrder === "asc") {
        result = result.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = result.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      setDataTable(result);
    }
  };
  return (
    <div>
      <BootstrapTable
        ref={refTableNode}
        hover
        bootstrap4
        keyField="id"
        remote
        data={dataTable}
        columns={columns}
        // defaultSorted={defaultSorted}
        headerClasses="thead-red"
        filter={filterFactory()}
        rowEvents={{
          onClick: (e, row, rowIndex) => onRowEventClick(e, row, rowIndex),
        }}
        noDataIndication={() => (
          <div>
            {intl.formatMessage({ id: "components.table.title.noResult" })}
          </div>
        )}
        loading={loading}
        overlay={
          loading &&
          overlayFactory({
            spinner: true,
            styles: {
              overlay: (base) => ({
                ...base,
                background: "rgba(255,255,255,0.7)",
              }),
            },
          })
        }
        pagination={paginationFactory(options)}
        onTableChange={handleTableChange}
        wrapperClasses="table-responsive"
      />
    </div>
  );
}
TablePagination.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool,
  page: PropTypes.number,
  sizePerPage: PropTypes.number,
  totalSize: PropTypes.number,
  onTableChange: PropTypes.func,
  onPaginationChange: PropTypes.func,
  onRowEventClick: PropTypes.func,
  resetFilter: PropTypes.func,
  filterParams: PropTypes.object,
};
TablePagination.defaultProps = {
  columns: [],
  data: [],
  loading: false,
  page: 1,
  sizePerPage: 10,
  totalSize: 0,
  resetFilter: () => {},
  filterParams: {},
};
export default TablePagination;
