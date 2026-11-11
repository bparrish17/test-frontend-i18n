import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'antd';

import { useUserStore } from '@store/app.store';
import { useSetDocumentTitle } from '@util/hooks';
import { Spacer, Stack, HStack, Button, Heading } from '@chakra-ui/react';
import { SFPlusIcon } from '@assets/icons';

import { tableParamsToBody } from '@util/helpers/table.helpers.jsx';
import { usePeople } from '@services/query-services/people.query-service';
import { filtersToUserSearchBody, useUserColumns } from '@util/helpers';
import './manage-users.css';
import { useTranslation } from 'react-i18next';

function ManageUsersPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Manage Users - FORA');
  const navigate = useNavigate();
  const appTenant = useUserStore((state) => state.tenant);
  const [total, setTotal] = useState(0);
  const [peopleArr, setPeopleArr] = useState([]);
  const columns = useUserColumns();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20
    }
  });
  const {
    data: peopleRes,
    isLoading,
    refetch
  } = usePeople(tableParamsToBody(tableParams, filtersToUserSearchBody), { includeTotal: true });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({ pagination, filters, sorter });
  };

  useEffect(() => {
    refetch();
  }, [tableParams]);

  useEffect(() => {
    let filteredPeople = peopleRes?.data;
    if (appTenant.id !== '8cff9346-a5fe-42e6-bd20-de3731fe3bfe') {
      filteredPeople = peopleRes?.data?.filter(
        (person) => person.email.includes('@fora.day') === false
      );
    }
    setPeopleArr(filteredPeople);
    setTotal(peopleRes?.total);
  }, [peopleRes?.data]);

  return (
    <Stack
      p={11}
      gap={11}
    >
      <HStack gap={4}>
        <Heading
          size={{ base: 'sm', lg: '2xl' }}
          lineHeight={1.3}
        >
          {t('manageUsersPage.manageUsers')}
        </Heading>
        <Spacer />
        <Button
          onClick={() => navigate('/settings/manage-users/add-user')}
          size='reskinMd'
          variant='reskinPrimary'
          iconSpacing={1}
          rightIcon={<SFPlusIcon style={{ paddingRight: 0 }} />}
        >
          {t('manageUsersPage.newUser')}
        </Button>
      </HStack>

      <Table
        className='manage-users-table'
        size='small'
        rowKey='id'
        loading={isLoading}
        columns={columns}
        dataSource={peopleArr}
        pagination={{ ...tableParams.pagination, total }}
        onChange={handleTableChange}
        onRow={(record) => {
          return {
            onClick: () => navigate(`/settings/manage-users/edit-user?id=${record?.id}`)
          };
        }}
      />
    </Stack>
  );
}

export default ManageUsersPage;
