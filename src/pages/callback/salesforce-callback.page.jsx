import { Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import FullPageLoader from '@components/general/loader/full-page-loader.component';

import { useSalesforceOauth } from '@services/query-services/lambda.query-service';

function getCodeFromQueryString(s) {
  const params = new URLSearchParams(s);
  return params.get('code');
}

function SalesforceCallbackPage() {
  const userStore = useUserStore();
  const user = userStore.user;

  const { search } = useLocation();
  const code = getCodeFromQueryString(search);
  const navigate = useNavigate();
  const toast = useStyledToast();

  const { mutateAsync: salesforceOauth } = useSalesforceOauth();

  async function authorize(code) {
    const tenantId = user.tenants[0].id;
    await salesforceOauth(
      { code, tenant_id: tenantId },
      {
        onSuccess: () => toast({ title: 'Salesforce connected successfully.', status: 'success' }),
        onError: () =>
          toast({
            status: 'error',
            title: 'Something went wrong. You might already have Salesforce connected.'
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
      <Text>Connecting to Salesforce...</Text>
    </FullPageLoader>
  );
}

export default SalesforceCallbackPage;
