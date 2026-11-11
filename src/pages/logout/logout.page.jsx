import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';

function LogoutPage() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useStyledToast();
  const userStore = useUserStore();
  const rollbar = useRollbar();

  useEffect(() => {
    const logout = async () => {
      try {
        await userStore.logout();
        queryClient.removeQueries();
        navigate('/login');
        toast({
          title: t('logoutPage.logoutSuccessful'),
          isClosable: true,
          duration: 4000
        });
      } catch (e) {
        rollbar?.error('Error during logout', e);
        toast({
          title: t('logoutPage.errorDuringLogout'),
          status: 'error',
          isClosable: true,
          duration: 4000
        });
      }
    };
    logout();
  }, []);

  return (
    <Flex
      data-cy='logout-page'
      h='full'
      alignItems='center'
      flexDir='column'
      pt={16}
      gap={6}
    >
      <Spinner />
      <div>{t('logoutPage.loggingOut')}</div>
    </Flex>
  );
}

export default LogoutPage;
