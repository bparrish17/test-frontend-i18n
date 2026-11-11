import { Flex, Spinner, Text, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useCreatePerson, usePeople } from '@services/query-services/people.query-service';
import { useStyledToast } from '@util/hooks';
import UserForm from '@components/settings/user-form.component';
import { useUserStore } from '@store/app.store';

export default function CreateUserPage() {
  const [isSubmitting, setIsSubmitting] = useState();
  const { mutateAsync: createPerson } = useCreatePerson();
  const toast = useStyledToast();
  const selectedTenant = useUserStore((state) => state.tenant);

  const { data: managerOptions, isLoading: isLoadingManagers } = usePeople(
    { pageSize: 1000, tenant_ids: [selectedTenant?.id] },
    {
      includeTotal: true
    }
  );

  const onFinish = async (values) => {
    setIsSubmitting('submitting');
    values.password = Math.ceil(new Date().getTime() / Math.random()).toString();

    await createPerson(
      {
        ...values,
        tenants: [{ id: selectedTenant?.id }]
      },
      {
        onSuccess: () => {
          setIsSubmitting('success');
          toast({
            title: 'User successfully created',
            status: 'success',
            duration: 4000,
            isClosable: true
          });
          setTimeout(() => setIsSubmitting(''), 1000);
        },
        onError: (err) => {
          setIsSubmitting('error');
          const errorMsg = err?.response?.data?.errors?.[0];
          toast({
            title: `Failed to create user${errorMsg ? ', ' + errorMsg : '.'}`,
            status: 'error',
            duration: 4000,
            isClosable: true
          });
        }
      }
    );
  };

  if (!isLoadingManagers) {
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
          Add User
        </Text>
        <UserForm
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          selectedTenantId={selectedTenant?.id}
          isSubmitting={isSubmitting}
          managerOptions={managerOptions.data}
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
