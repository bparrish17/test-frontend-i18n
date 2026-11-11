import { format, subDays } from 'date-fns';
import { useState } from 'react';
import { get, omit } from 'lodash-es';

import { useIsUserType, useStyledToast } from '@util/hooks';
import { usePatchChannel, useCreateChannel } from '@services/query-services/channels.query-service';
import { formatCronToCadence, getAPIError } from '@util/helpers';
import * as digestHelpers from '@util/helpers/digest.helpers';
import { useUserStore } from '@store/app.store';

export const useEditDigestActions = () => {};
export const useCreateDigestActions = () => {};

/**
 * @param {'create' | 'edit'} action
 * @returns {{ onSuccess: () => void; onError: () => void }}
 */
const useDigestActionCallbacks = (action, onSuccessCb) => {
  const toast = useStyledToast();
  return {
    onSuccess: (channel) => {
      const dateText =
        formatCronToCadence(channel.schedule) === 'daily'
          ? 'tonight at midnight'
          : `at midnight on ${format(subDays(channel.next_run_at, 1), 'LLLL do')}`;
      const successTitle = `Digest Successfully ${action === 'edit' ? 'Updated' : 'Created'}`;
      const successDescription =
        action === 'edit'
          ? 'Your next summary will generate '
          : 'Your first summary will generate ';

      toast({
        status: 'success',
        title: successTitle,
        description: successDescription.concat(dateText)
      });
      onSuccessCb();
    },
    onError: (res) => {
      const defaultErrMsg = `Something went wrong while ${
        action === 'edit' ? 'updating' : 'creating'
      } digest. Please try again.`;
      toast({
        status: 'error',
        title: getAPIError(res, defaultErrMsg)
      });
    }
  };
};

/**
 *
 * @param {'Slack' | 'Teams'} source
 * @param {Channel} digest
 * @param {() => void} onSuccessCb
 * @returns
 */
export const useEditDigest = (source, digest, onSuccessCb) => {
  const { mutateAsync: patchChannel, isLoading: isPatching } = usePatchChannel();
  const { onSuccess, onError } = useDigestActionCallbacks('edit', onSuccessCb);

  /**
   * @param {Partial<Channel>} channelBody
   */
  const onPatch = async (channelBody) => {
    await patchChannel(
      {
        id: digest?.id,
        source,
        ...channelBody
      },
      { onSuccess, onError }
    );
  };

  return { isPatching, onPatch };
};

/**
 * @param {'Slack' | 'Teams'} source
 * @param {() => void} onSuccessCb
 */
export const useCreateDigest = (source, onSuccessCb) => {
  const { mutateAsync: createChannel, isLoading: isCreating } = useCreateChannel();
  const { onSuccess, onError } = useDigestActionCallbacks('create', onSuccessCb);

  /**
   * @param {Partial<Channel>} channelBody
   */
  const onCreate = async (channelBody) => {
    await createChannel({ source, ...channelBody }, { onSuccess, onError });
  };

  return { isCreating, onCreate };
};

export const useSelectedTeams = (digest) => {
  const initialTeams = digest ? digestHelpers.convertDigestToTeamSelections(digest) : {};
  const [addedTeams, setAddedTeams] = useState(initialTeams);

  const addTeam = (teamId) => {
    const updatedTeams = { ...addedTeams };
    setAddedTeams({
      ...updatedTeams,
      [teamId]: { selectionType: 'allChannels', channels: new Set() }
    });
  };

  const removeTeam = (teamId) => {
    setAddedTeams(omit(addedTeams, teamId));
  };

  /**
   * @param {string} teamId
   * @param {digestHelpers.SelectionType} selectionType
   */
  const setTeamSelectionType = (teamId, selectionType) => {
    setAddedTeams({ ...addedTeams, [teamId]: { ...addedTeams[teamId], selectionType } });
  };

  const addChannel = (teamId, channelId) => {
    const updatedChannels = new Set({ ...addedTeams[teamId] }.channels);
    updatedChannels.add(channelId);
    setAddedTeams({
      ...addedTeams,
      [teamId]: { ...addedTeams[teamId], channels: updatedChannels }
    });
  };

  const removeChannel = (teamId, channelId) => {
    const updatedChannels = new Set({ ...addedTeams[teamId] }.channels);
    updatedChannels.delete(channelId);
    setAddedTeams({
      ...addedTeams,
      [teamId]: { ...addedTeams[teamId], channels: updatedChannels }
    });
  };

  return {
    addedTeams,
    addTeam,
    removeTeam,
    setTeamSelectionType,
    addChannel,
    removeChannel
  };
};

/**
 *
 * @param {'Slack' | 'Teams'} digestType
 */
export const useDigestModalConfigVals = (digestType) => {
  const configPath = { Teams: 'teams_config', Slack: 'slack_config' };
  const tenantHasAccess = useUserStore(
    (state) => !!get(state, ['tenant', configPath[digestType], 'access_token'])
  );
  const userTz = useUserStore((state) => state?.user?.time_zone_id);
  const tenantTz = useUserStore((state) => state?.tenant?.time_zone_id);
  const isAdminOrExecutive = useIsUserType('Executive', 'Admin');

  return {
    tenantHasAccess,
    userTz,
    tenantTz,
    isAdminOrExecutive
  };
};
