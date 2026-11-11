import { Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePatchTenantAsAppUser } from '@services/query-services/tenants.query-service';
import { useUserStore } from '@store/app.store';
import FullPageLoader from '@components/general/loader/full-page-loader.component';
import { registerWithBackend } from '@services/zoom.service';
import { useStyledToast } from '@util/hooks';
import { useRollbar } from '@rollbar/react';

function getCodeFromQueryString(s) {
  const params = new URLSearchParams(s);
  return params.get('code');
}

async function authorize(
  code,
  patchTenantAsAppUser,
  userStore,
  tenantId,
  toast,
  navigate,
  rollbar
) {
  try {
    const response = await registerWithBackend(code);
    patchTenantAsAppUser(
      { id: tenantId, recall_config: { zoom_oauth_credential_id: response.id } },
      {
        onSuccess: () => {
          userStore.refreshSessionTenant(tenantId);
          toast({
            title: 'Zoom connected successfully.',
            status: 'success'
          });
          navigate('/agenda');
        },
        onError: (err) => {
          throw new Error(err);
        }
      }
    );
  } catch (e) {
    rollbar?.error('Error while authorizing Zoom with backend', e);
    toast({
      title: 'Something went wrong. You might already have Zoom connected.',
      status: 'error'
    });
  }
}

function ZoomCallbackPage() {
  const { mutateAsync: patchTenantAsAppUser } = usePatchTenantAsAppUser();
  const userStore = useUserStore();
  const user = userStore.user;

  const { search } = useLocation();
  const code = getCodeFromQueryString(search);
  const navigate = useNavigate();
  const toast = useStyledToast();
  const rollbar = useRollbar();

  useEffect(() => {
    if (code && user) {
      authorize(
        code,
        patchTenantAsAppUser,
        userStore,
        user.tenants[0].id,
        toast,
        navigate,
        rollbar
      );
    }
  }, [code, user]);

  return (
    <FullPageLoader>
      <Text>hello world</Text>
    </FullPageLoader>
  );
}

export default ZoomCallbackPage;
