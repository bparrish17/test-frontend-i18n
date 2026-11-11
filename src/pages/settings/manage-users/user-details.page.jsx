import { Text, Box, Flex, Spinner } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { isEmpty } from 'lodash';
import { useStyledToast } from '@util/hooks';
import {
  usePersonById,
  usePeople,
  useSetManager
} from '@services/query-services/people.query-service';
import { useUserStore } from '@store/app.store';
import UserForm from '@components/settings/user-form.component';
import { usePatchPersonFromDetailsPage } from '@util/hooks/people.hooks';

export default function UserDetailsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: setManager } = useSetManager();
  const patchPersonFromDetailsPage = usePatchPersonFromDetailsPage();

  const toast = useStyledToast();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data: user, isLoading: isLoadingUser } = usePersonById(id);
  const selectedTenantId = useUserStore((state) => state.selectedTenant?.id);
  const { data: managerOptions, isLoading: isLoadingManager } = usePeople(
    { pageSize: 1000, tenant_ids: [selectedTenantId] },
    { includeTotal: false }
  );

  const onFinish = async (values) => {
    setIsSubmitting(true);

    if (!isEmpty(values.manager)) {
      await setManager({ id: user.id, params: { email: values.manager.email } });
      delete values.manager;
    } else {
      values.manager = null;
    }
    await patchPersonFromDetailsPage(id, values, toast, setIsSubmitting);

    setIsSubmitting(false);
  };

  if (isLoadingUser === false && isLoadingManager === false) {
    return (
      <Box
        style={{ padding: 20 }}
        alignItems='flex-start'
      >
        <Text
          fontSize='lg'
          variant='page-header'
          pb={5}
        >
          Edit User: {user.name}
          {user?.title && ', ' + user.title}
        </Text>
        <UserForm
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          selectedTenantId={selectedTenantId}
          isSubmitting={isSubmitting}
          canSetPassword={false}
          managerOptions={managerOptions}
          user={user}
        />
      </Box>
    );
  }
  return (
    <Flex
      w='100v%'
      h='100%'
      justifyContent='center'
      alignItems='center'
    >
      <Spinner
        size='lg'
        mr='15px'
      />
    </Flex>
  );
}
