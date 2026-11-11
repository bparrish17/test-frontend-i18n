import { useMemo } from 'react';
import { capitalize, get } from 'lodash';

import { getColumnInputProps } from '@util/helpers/table.helpers';

export const useUserColumns = () => {
  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        ...getColumnInputProps('name'),
        render: (name) => name,
        sorter: (a, b) => a - b,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Email',
        dataIndex: 'email',
        ...getColumnInputProps('email'),
        render: (email) => email,
        sorter: (a, b) => a - b,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Title',
        dataIndex: 'title',
        render: (title) => title,
        sorter: (a, b) => a?.title - b?.title,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Manager',
        dataIndex: 'manager',
        render: (user) => user?.name || '',
        sorter: (a, b) => a?.manager?.name - b?.manager?.name,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Type',
        dataIndex: 'type',
        render: (type) => capitalize(type),
        sorter: (a, b) => a.type - b.type,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Active',
        dataIndex: 'active',
        render: (active) => (active === true ? 'Active' : ''),
        sorter: (a, b) => a.active - b.active,
        sortDirections: ['descend', 'ascend']
      }
    ],
    []
  );

  return columns;
};

export const filtersToUserSearchBody = (filters) => {
  return {
    type: get(filters, ['type', 0]),
    has_nylas_account_id: get(filters, ['nylas', 0]),
    email: get(filters, ['email', 0]),
    name: get(filters, ['name', 0])
  };
};
