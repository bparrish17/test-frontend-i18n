import { getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import { identity, keyBy, mapValues, merge } from 'lodash-es';
import { useState } from 'react';

export const usePagination = (initialValue = { pageSize: 10, pageIndex: 0 }) => {
  const [pagination, setPagination] = useState(initialValue);

  return {
    body: {
      page: pagination?.pageIndex + 1,
      pageSize: pagination?.pageSize
    },
    tableConfig: {
      manualPagination: true,
      onPaginationChange: setPagination,
      state: {
        pagination
      }
    }
  };
};

/**
 * @typedef {Object} SortingValueOptions
 * @property {boolean} appendKeyword - if true, append `.keyword` to `id` in request body
 *
 * @param {import('@tanstack/react-table').SortingState[]} initialValue
 * @param {{ [id: string]: SortingValueOptions }} config */
export const useSorting = (initialValue = [{ id: 'created_at', desc: false }], config = {}) => {
  const [sorting, setSorting] = useState(initialValue);
  const sortBy = sorting[0]?.id;

  return {
    body: sortBy
      ? {
          // channel-specific backend issue... not relevant otherwise
          sort: `${sortBy}${config?.[sortBy]?.appendKeyword ? '.keyword' : ''}`,
          asc: !sorting[0]?.desc
        }
      : {},
    tableConfig: {
      manualSorting: true,
      enableSortingRemoval: false,
      onSortingChange: setSorting,
      state: {
        sorting
      }
    }
  };
};

/**
 * Converts column filters into a { <filter-id>: <filter-value> } object
 * @param {import('@tanstack/react-table').ColumnFilter[]} filters
 * @returns { [id: string]: any }
 */
const keyFiltersById = (filters) => mapValues(keyBy(filters, 'id'), 'value');

/**
 * Returns
 * - necessary config options to enable filtering on tanstack table
 * - parsed body from said filters to use in the table data API call
 * @param {(filters: object) => object} convertFiltersToBody
 * @param {import('@tanstack/react-table').ColumnFilter[]} initialFilters
 * @returns {{
 *   body: object;
 *   tableConfig: Partial<import('@tanstack/react-table').TableOptions>
 * }}
 */
export const useFiltering = (convertFiltersToBody = identity, initialFilters = []) => {
  const [columnFilters, setColumnFilters] = useState(initialFilters);

  return {
    body: convertFiltersToBody(keyFiltersById(columnFilters)),
    tableConfig: {
      enableColumnFilters: true,
      state: {
        columnFilters
      },
      manualFiltering: true,
      onColumnFiltersChange: setColumnFilters
    }
  };
};

const fallbackData = [];

/**
 *
 * @param {{ data: { data: any[], total: number }}} queryResult
 * @param {import('@tanstack/react-table').ColumnDef<unknown, any>[]} columns
 * @param {Partial<import('@tanstack/react-table').TableOptions>} sortConfig
 * @param {Partial<import('@tanstack/react-table').TableOptions>} paginationConfig
 * @param {Partial<import('@tanstack/react-table').TableOptions>} filteringConfig
 * @param {Partial<import('@tanstack/react-table').TableOptions>} overrides
 * @returns
 */
export const useTanstackTable = (
  queryResult,
  columns,
  sortConfig = {},
  paginationConfig = {},
  filteringConfig = {},
  overrides = {}
) => {
  const table = useReactTable(
    merge(
      {
        data: queryResult.data?.data ?? fallbackData, // don't define as [] here it will rerender until your comp explodes
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        rowCount: queryResult.data?.total, // required for pagination
        enableColumnFilters: false,
        defaultColumn: {
          size: 40,
          minSize: 0,
          maxSize: null
        }
      },
      sortConfig,
      paginationConfig,
      filteringConfig,
      overrides
    )
  );

  return table;
};
