import {
  Stack,
  VStack,
  Text,
  Button,
  ButtonGroup,
  Divider,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  useDisclosure
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { some, difference } from 'lodash-es';
import { isAfter } from 'date-fns';
import pluralize from 'pluralize';

import { useUserStore } from '@store/app.store';
import {
  useArchiveInitiative,
  useInitiativeById,
  usePatchInitiative
} from '@services/query-services/initiatives.query-service';
import {
  useMeetings,
  useRemoveInitiativeFromMeeting,
  useUpdateMeetingInitiative
} from '@services/query-services/meetings.query-service';
import {
  useInvalidateQueries,
  useMutationToast,
  useProtectTenant,
  useSetDocumentTitle,
  useStyledToast
} from '@util/hooks';
import {
  toSelectOptions,
  addRulesetToMatchRules,
  convertMatchRulesToRulesets,
  convertRulesetsToMatchRules
} from '@util/helpers';

import FocusEditDetails from '@components/focus/focus-edit-details.component';
import FocusEditMeetings from '@components/focus/focus-edit-meetings.component';
import FocusEditRules from '@components/focus/focus-edit-rules.component';
import FocusEditFollowers from '@components/focus/focus-edit-followers.component';
import StyledModal from '@components/general/modals/styled-modal.component';

const tabStyles = {
  fontWeight: 600,
  color: 'surface.outline',
  _selected: { color: 'surface.onSurfaceVariant' },
  px: { base: 2, sm: 4, md: 6 },
  fontSize: { base: 'sm', sm: 'md' }
};
const tabPanelStyles = { display: 'flex', flexDir: 'column', gap: 8, p: 0 };

export default function FocusSettingsPage() {
  const { focusId } = useParams();
  const navigate = useNavigate();
  const toast = useStyledToast();
  const user = useUserStore((state) => state.user);
  const { mutateAsync: archiveFocus, isLoading: isArchiving } = useArchiveInitiative();
  const enableQueries = !!focusId && !!user?.id && !isArchiving;
  const { data: focus } = useInitiativeById(focusId, {
    enabled: enableQueries
  });
  const { mutateAsync: patchFocus } = usePatchInitiative({
    optimisticUpdateConfig: { enabled: true, type: 'id' }
  });
  useProtectTenant(focus?.tenant?.id);
  useSetDocumentTitle(`${focus?.title} Settings - FORA`);

  const openSuccessToast = (title) => {
    toast({
      position: 'bottom-left',
      duration: 1500,
      title,
      containerProps: { pl: 6 }
    });
  };

  /****************************************************
   * Describe Focus
   ****************************************************/
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('legacyForaBlue');
  const deleteModalDisclosure = useDisclosure();
  const { onSuccess: onDeleteFocusSuccess, onError: onDeleteFocusError } = useMutationToast(
    'focus',
    'delete'
  );
  const invalidateQueries = useInvalidateQueries();

  useEffect(() => {
    if (focus) {
      setTitle(focus?.title);
      setDescription(focus?.description);
      setColor(focus?.color);
    }
  }, [focus]);

  const handleDetailsChange = async () => {
    const changedValues = difference(
      [title, description, color],
      [focus.title, focus.description, focus.color]
    );
    // if changed from existing focus, update
    if (changedValues.length > 0) {
      openSuccessToast('Details updated.');
      await patchFocus({ id: focusId, title, description, color });
    }
  };

  const handleArchiveClick = async () => {
    await archiveFocus(
      { id: focusId, value: !focus?.archived_at },
      {
        onSuccess: async () => {
          onDeleteFocusSuccess();
          await invalidateQueries({ model: 'initiatives', refetchType: 'all' });
          navigate(-1);
          deleteModalDisclosure.onClose();
        },
        onError: onDeleteFocusError
      }
    );
  };

  /****************************************************
   * Add Meetings
   ****************************************************/
  const focusMeetingsBody = { initiative_id: focusId };
  const { data: focusMeetings } = useMeetings(focusMeetingsBody, { enabled: enableQueries });

  /**
   * Custom optimistic updater function for focusMeetings query
   *
   * Typically patch/deleteAttribute calls are updating a certain record in the search results, not whether or
   * not that record should be returned from those results at all. These custom optimistic updaterFns add/remove
   * the patched/deleted meeting from the resulting focusMeetings query
   * @param {(previous, mutationVars) => any[]} updaterFn
   */
  const optimisticUpdateFocusMeetings = (updaterFn) => ({
    optimisticUpdateConfig: {
      enabled: true,
      type: 'search',
      queryKeyToUpdate: focusMeetingsBody,
      updaterFn
    }
  });

  const { mutateAsync: removeFocusFromMeeting } = useRemoveInitiativeFromMeeting(
    optimisticUpdateFocusMeetings((previous, mutationVars) =>
      previous?.filter((prevRecord) => prevRecord.id !== mutationVars.id)
    )
  );

  const { mutateAsync: updateMeetingInitiative } = useUpdateMeetingInitiative({
    optimisticUpdateConfig: { enabled: true, type: 'id' }
  });

  const addMeeting = async (meeting) => {
    const { id, title } = focus;
    await updateMeetingInitiative({
      id: meeting.id,
      value: id,
      params: { propagate: true, rerun: isAfter(new Date(), meeting?.end_at) },
      optimisticUpdateValue: { id, title }
    });
    openSuccessToast('Meeting added.');
  };

  const removeMeetingById = async (meetingId) => {
    openSuccessToast('Meeting removed.');
    await removeFocusFromMeeting({ id: meetingId });
  };

  /****************************************************
   * Add Automation Rules
   ****************************************************/
  const { schedule, rulesets } = convertMatchRulesToRulesets(focus?.match_rules ?? {});

  const toggleSchedule = async () => {
    const updatedMatchRules = convertRulesetsToMatchRules(rulesets, !schedule);
    await patchFocus({ id: focus?.id, match_rules: updatedMatchRules });
  };

  const toggleSensitive = async () => {
    await patchFocus({ id: focus?.id, sensitive: !focus?.sensitive });
  };

  const removeRuleset = async (_i, ruleset) => {
    openSuccessToast('Rule removed');
    const updatedRulesets = rulesets.filter((rs) => rs.id !== ruleset?.id);
    const updatedMatchRules = convertRulesetsToMatchRules(updatedRulesets, schedule);
    await patchFocus({ id: focus?.id, match_rules: updatedMatchRules });
  };

  const addRulesets = async (newRuleset) => {
    openSuccessToast(`${newRuleset?.length} ${pluralize('rule', newRuleset?.length)} added`);
    await patchFocus({
      id: focus?.id,
      match_rules: addRulesetToMatchRules(newRuleset, focus?.match_rules)
    });
  };

  const handleVisibilityChange = async (visibility) => {
    openSuccessToast('Visibility Updated');
    await patchFocus({
      id: focus?.id,
      visibility
    });
  };

  /****************************************************
   * Add Followers
   ****************************************************/

  const onFollowerSelectionChange = async (selectedPeopleOptions) => {
    const collaborators = selectedPeopleOptions?.map((spo) => ({
      id: spo?.value,
      name: spo?.label
    }));
    openSuccessToast('Followers updated');
    await patchFocus({ id: focus.id, collaborators });
  };

  return (
    <VStack
      w={{ base: 'full', md: '840px' }}
      gap={8}
      py={8}
      mx='auto'
    >
      <Text
        fontSize='xl'
        fontWeight={600}
      >
        Category Settings
      </Text>
      <Tabs
        variant='unstyled'
        w='full'
      >
        <TabList
          color='base.text.200'
          pb={{ base: 2, sm: 3, lg: 4 }}
          borderBottom='reskin'
          justifyContent='center'
        >
          <Tab {...tabStyles}>Description</Tab>
          <Tab {...tabStyles}>Meetings</Tab>
          <Tab {...tabStyles}>Rules</Tab>
          <Tab {...tabStyles}>Followers</Tab>
        </TabList>
        <TabIndicator
          height='2px'
          marginTop='-2px'
          bg='surface.onSurfaceVariant'
        />
        <TabPanels
          pt={8}
          px={{ base: 4, md: 6, lg: 8 }}
        >
          <TabPanel {...tabPanelStyles}>
            <FocusEditDetails
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              color={color}
              setColor={setColor}
              onBlur={handleDetailsChange}
            >
              <Divider />
              <StyledModal
                title='Confirm'
                modalContentProps={{ minW: 'unset', w: '400px' }}
                modalBodyProps={{ px: 6, py: 4 }}
                disclosure={deleteModalDisclosure}
                openButton={
                  <Button
                    w='fit-content'
                    colorScheme='critical'
                    variant='reskinPrimary'
                    rounded='xl'
                  >
                    {focus?.archived_at ? 'Recover' : 'Archive'} Category
                  </Button>
                }
              >
                <Stack gap={6}>
                  <Text>
                    {focus?.archived_at
                      ? 'Recovering this category will start associating new content with it. Previous content will not be deleted.'
                      : 'Archiving this category will stop associating new content with it. Previous content will not be deleted. This action cannot be undone.'}
                  </Text>
                  <ButtonGroup
                    size='sm'
                    alignSelf='flex-end'
                  >
                    <Button
                      variant='outline'
                      onClick={deleteModalDisclosure.onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme='critical'
                      variant='reskinPrimary'
                      display='flex'
                      gap={2}
                      isDisabled={isArchiving}
                      onClick={handleArchiveClick}
                    >
                      {isArchiving && <Spinner size='xs' />}
                      {focus?.archived_at ? 'Recover' : 'Archive'} Category
                    </Button>
                  </ButtonGroup>
                </Stack>
              </StyledModal>
            </FocusEditDetails>
          </TabPanel>
          <TabPanel {...tabPanelStyles}>
            <FocusEditMeetings
              addedMeetings={focusMeetings}
              hasMeeting={(id) => some(focusMeetings, { id })}
              addMeeting={addMeeting}
              removeMeetingById={removeMeetingById}
            />
          </TabPanel>
          <TabPanel {...tabPanelStyles}>
            <FocusEditRules
              rulesets={rulesets}
              addRulesets={addRulesets}
              removeRuleset={removeRuleset}
              isAddToMeetingsChecked={schedule}
              handleAddToMeetingCheck={toggleSchedule}
              isSensitiveChecked={focus?.sensitive}
              handleIsSensitiveCheck={toggleSensitive}
              visibility={focus?.visibility}
              handleVisibilityChange={handleVisibilityChange}
            />
          </TabPanel>
          <TabPanel {...tabPanelStyles}>
            <FocusEditFollowers
              value={toSelectOptions('id', 'name')(focus?.collaborators)}
              onChange={onFollowerSelectionChange}
              isClearable={false}
              isEdit
              allowBulkRemap={false}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
