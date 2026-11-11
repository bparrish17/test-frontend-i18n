import { identity } from 'lodash';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Center } from '@chakra-ui/react';
import { MotionBox } from '@components/general/motion-box.component';
import { ChevronDownIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export const tableParamsToBody = (
  { pagination, filters, sorter, defaultSortField },
  mapFilters = identity
) => {
  switch (sorter?.field) {
    case 'manager': {
      sorter.field += '.name.keyword';
      break;
    }
    case 'name':
    case 'email':
    case 'title': {
      sorter.field += '.keyword';
      break;
    }
  }
  return {
    page: pagination.current,
    pageSize: pagination.pageSize,
    asc: sorter?.order === 'ascend',
    sort: sorter?.field ?? sorter?.columnKey ?? defaultSortField,
    ...mapFilters(filters)
  };
};

export const getColumnInputProps = (dataIndex) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <ColumnSearchActions
        onConfirm={confirm}
        onClearFilters={clearFilters}
        onClose={close}
      />
    </div>
  ),
  filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
  filterOnClose: true
});

function ColumnSearchActions({ onConfirm, onClearFilters, onClose }) {
  const { t } = useTranslation();

  return (
    <Space>
      <Button
        type='primary'
        size='small'
        icon={<SearchOutlined />}
        style={{ width: 90 }}
        onClick={() => onConfirm()}
      >
        {t('tableHelpers.search')}
      </Button>
      <Button
        size='small'
        style={{ width: 90 }}
        onClick={() => {
          onClearFilters();
          onConfirm();
        }}
      >
        {t('tableHelpers.reset')}
      </Button>
      <Button
        type='link'
        size='small'
        onClick={() => onClose()}
      >
        {t('tableHelpers.close')}
      </Button>
    </Space>
  );
}

export const expansionColumn = {
  id: 'toggle-expand',
  header: '',
  size: 0.5,
  cell: (info) => {
    const isExpanded = info.row.getIsExpanded();
    return (
      <MotionBox
        initial={{ rotate: 360 }}
        animate={{ rotate: info.row.getIsExpanded() ? 180 : 360 }}
        transition='linear'
      >
        <Center
          boxSize={5}
          color={isExpanded ? 'surface.onSurface' : 'surface.outline'}
        >
          <ChevronDownIcon />
        </Center>
      </MotionBox>
    );
  }
};
