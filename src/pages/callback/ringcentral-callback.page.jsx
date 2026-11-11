import { Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import FullPageLoader from '@components/general/loader/full-page-loader.component';

import { useRingCentralOauth } from '@services/query-services/lambda.query-service';
import { useTranslation } from 'react-i18next';

function RingCentralCallbackPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const toast = useStyledToast();
  const user = useUserStore((state) => state.user);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const code = params.get('code');

  const { mutateAsync: ringCentralOauth } = useRingCentralOauth();

  async function authorize(code) {
    const tenantId = user.tenants[0].id;
    await ringCentralOauth(
      { code, tenantId },
      {
        onSuccess: () =>
          toast({
            title: t('ringcentralCallbackPage.ringcentralConnectedSuccessfully'),
            status: 'success'
          }),
        onError: () =>
          toast({
            status: 'error',
            title: t('ringcentralCallbackPage.somethingWentWrongYou')
          })
      }
    );

    navigate('/agenda');
  }

  useEffect(() => {
    if (code && user) authorize(code);
  }, [code, user]);

  return (
    <FullPageLoader>
      <Text>{t('ringcentralCallbackPage.connectingToRingcentral')}</Text>
    </FullPageLoader>
  );
}

export default RingCentralCallbackPage;
