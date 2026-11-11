import { Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';

import {
  useInvalidateQueries,
  usePusherChannel,
  usePusherEvent,
  useStyledToast,
  useTimeout
} from '@util/hooks';
import NylasService from '@services/nylas.service';
import FullPageLoader from '@components/general/loader/full-page-loader.component';
import { useUserStore } from '@store/app.store';
import { addDigestConfigToNewUser } from '@util/helpers';

const nylasService = NylasService.getInstance();

export default function NylasCallbackPage() {
  const toast = useStyledToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [nylasGrantId, setNylasGrantId] = useState();
  const { channel } = usePusherChannel(nylasGrantId);
  const invalidateQueries = useInvalidateQueries();
  const user = useUserStore((state) => state.user);
  const rollbar = useRollbar();

  const refreshNylasAccount = async () => {
    await invalidateQueries({
      model: 'nylas/accounts',
      queryKey: 'current-account-status',
      refetchType: 'all'
    });
    toast({
      title: 'Calendar connected successfully.',
      status: 'success'
    });
    navigate('/');
  };

  const handleNylasConnectError = (title) => {
    toast({
      title: title || 'Something went wrong while connecting your calendar. Please try again.',
      status: 'error'
    });
    navigate('/');
  };

  const authorize = async (code) => {
    try {
      const { id } = await nylasService.registerWithBackend(code);
      setNylasGrantId(id);

      // https://foraday.atlassian.net/browse/FORA-1352
      // Attempt to add digest configs when a user connects a calendar.  If
      // the user already has a digest config, this will do nothing
      await addDigestConfigToNewUser(user);
    } catch (e) {
      rollbar?.error('Error while authorizing Nylas with backend', e, user);
      handleNylasConnectError('Something went wrong. You might already have a calendar connected.');
    }
  };

  useEffect(() => {
    if (code && user) authorize(code);
  }, [code, user]);

  // timeout this page after a vaguely long amount of time in case of weird uncaught failure
  useTimeout(handleNylasConnectError, 25 * 1000);
  usePusherEvent(channel, 'on_error', () => handleNylasConnectError());
  usePusherEvent(channel, 'on_completion', refreshNylasAccount);

  return (
    <FullPageLoader>
      <Text>Connecting Your Calendar...</Text>
    </FullPageLoader>
  );
}
