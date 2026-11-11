import { Grid, GridItem, IconButton, Divider, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { pick } from 'lodash-es';
import pluralize from 'pluralize';

import { useUserStore } from '@store/app.store';
import { useCreateInitiative } from '@services/query-services/initiatives.query-service';
import { useMatchMeetings, usePatchMeeting } from '@services/query-services/meetings.query-service';
import { useArrayState, useSetDocumentTitle, useStyledToast } from '@util/hooks';
import { ArrowLeftIcon } from '@assets/icons';
import { convertRulesetsToMatchRules } from '@util/helpers';

import CreateFocusStepper from '@components/create-focus/create-focus-stepper.component';
import FocusEditDetails from '@components/focus/focus-edit-details.component';
import FocusEditMeetings from '@components/focus/focus-edit-meetings.component';
import FocusEditRules from '@components/focus/focus-edit-rules.component';
import FocusEditFollowers from '@components/focus/focus-edit-followers.component';
import CenteredLayout from '@layouts/centered.layout';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { useRollbar } from '@rollbar/react';

const stepperConfigs = [
  {
    title: 'Describe the category',
    subtitle: 'Add context to help Fora understand this category.'
  },
  {
    title: 'Add meetings',
    subtitle: 'You can add meetings for Fora to join and associate with this category.',
    continueTo: 'Add Meetings'
  },
  {
    title: 'Add automation',
    subtitle: 'Enable this category to be automatically assigned when certain conditions are met.',
    continueTo: 'Rules & Automation'
  },
  {
    title: 'Share this category',
    subtitle: 'Select colleagues to follow this category.',
    continueTo: 'Followers'
  }
];

export default function CreateFocusPage() {
  useSetDocumentTitle('Create Category - FORA');
  const navigate = useNavigate();
  const toast = useStyledToast();
  const [isCreating, setIsCreating] = useState(false);
  const user = useUserStore((state) => state.user);
  const { mutateAsync: patchMeeting } = usePatchMeeting();
  const { mutateAsync: createFocus } = useCreateInitiative();
  const [oneIndexedStep, setOneIndexedStep] = useQueryParam('step', withDefault(NumberParam, 1));
  const step = oneIndexedStep - 1;
  const setStep = (step) => setOneIndexedStep(step + 1);
  const rollbar = useRollbar();

  // Describe Focus
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('legacyForaBlue');

  const openActionToast = (title) => {
    toast({
      position: 'bottom-left',
      duration: 1500,
      title,
      containerProps: { pl: 6 }
    });
  };

  // Add Meetings
  const {
    addedItems: addedMeetings,
    hasItem: hasMeeting,
    addItems: addMeetings,
    removeItemByProp
  } = useArrayState();
  const removeMeetingById = (id) => removeItemByProp(id, 'id');

  // Add Automation Rules
  const [isAddToMeetingsChecked, setIsAddToMeetingsChecked] = useState(true);
  const [isSensitiveChecked, setIsSensitiveChecked] = useState(false);
  const [visibility, setVisibility] = useState('Owner');
  const {
    addedItems: rulesets,
    addItems: addRulesets,
    removeItem: removeRuleset
  } = useArrayState([]);

  // Add Followers
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [isBulkRemapChecked, setIsBulkRemapChecked] = useState(true);
  const { mutateAsync: matchMeetingsToFocus } = useMatchMeetings();

  const handleBackClick = () => {
    if (step > 0) setStep(step - 1);
    else navigate(-1);
  };

  const handleFinishClick = async () => {
    setIsCreating(true);
    try {
      const createdFocus = await createFocus(
        {
          type: 'Focus',
          title,
          description,
          color,
          collaborators: [
            pick(user, ['id', 'name']),
            ...selectedPeople.map((p) => ({ id: p.value, name: p.label }))
          ],
          visibility,
          creator: { id: user?.id },
          tenant: pick(user, ['tenants', 0]),
          match_rules: convertRulesetsToMatchRules(rulesets, isAddToMeetingsChecked),
          sensitive: isSensitiveChecked
        },
        {
          onError: () => {
            throw new Error('Failed to create category. Please try again.');
          }
        }
      );

      if (isBulkRemapChecked) {
        await matchMeetingsToFocus(
          {
            start_at_from: createdFocus?.created_at,
            not_canceled: true,
            only_active_calendars: true
          },
          {
            onError: () => {
              throw new Error('Failed to match meetings to category. Please try again.');
            }
          }
        );
      }

      for (const meeting of addedMeetings) {
        await patchMeeting({
          id: meeting?.id,
          initiative: { ...pick(createdFocus, ['id', 'title']) }
        });
      }

      toast({
        title: 'Category Created Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      navigate('/focuses', {
        state: {
          isFocusCreated: true,
          title: createdFocus?.title,
          collaborators: createdFocus?.collaborators?.length ?? 0,
          rules: rulesets?.length
        }
      });
    } catch (e) {
      rollbar?.error('Error creating category', e);
      setIsCreating(false);
      toast({
        title: e.message || 'Failed to finish creating category. Please try again.',
        status: 'error'
      });
    }
  };

  return (
    <CenteredLayout
      data-cy='focus-create-page'
      px={4}
      py={12}
    >
      <Grid
        templateColumns='repeat(3, 1fr)'
        w='full'
        h='32px'
        mb={4}
      >
        <GridItem>
          {step > 0 && (
            <IconButton
              size='sm'
              aria-label='go back a step'
              icon={<ArrowLeftIcon />}
              rounded='full'
              onClick={handleBackClick}
            />
          )}
        </GridItem>
        <GridItem
          w='full'
          textAlign='center'
        >
          <Heading size='md'>New Category</Heading>
        </GridItem>
      </Grid>
      <Divider />
      <CreateFocusStepper
        title={stepperConfigs[step].title}
        step={step}
        subtitle={stepperConfigs[step].subtitle}
        actionText={
          step === 3
            ? 'Finish'
            : `Continue to Step ${step + 2}: ${stepperConfigs[step + 1].continueTo}`
        }
        actionDisabled={!title.length || !description.length}
        actionLoading={isCreating}
        onActionClick={() => {
          if (step === 3) {
            handleFinishClick();
          } else {
            setStep(step + 1);
          }
        }}
      >
        {step === 0 && (
          <FocusEditDetails
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            color={color}
            setColor={setColor}
          />
        )}
        {step === 1 && (
          <FocusEditMeetings
            addedMeetings={addedMeetings}
            hasMeeting={hasMeeting}
            addMeeting={(meeting) => {
              openActionToast('Meeting added.');
              addMeetings(meeting);
            }}
            removeMeetingById={removeMeetingById}
          />
        )}
        {step === 2 && (
          <FocusEditRules
            rulesets={rulesets}
            addRulesets={(rulesets) => {
              openActionToast(`${rulesets?.length} ${pluralize('rule', rulesets?.length)} added`);
              addRulesets(...rulesets);
            }}
            removeRuleset={(i) => {
              openActionToast('Rule removed.');
              removeRuleset(i);
            }}
            isAddToMeetingsChecked={isAddToMeetingsChecked}
            handleAddToMeetingCheck={(e) => setIsAddToMeetingsChecked(e.target.checked)}
            isSensitiveChecked={isSensitiveChecked}
            handleIsSensitiveCheck={(e) => setIsSensitiveChecked(e.target.checked)}
            visibility={visibility}
            handleVisibilityChange={setVisibility}
          />
        )}
        {step === 3 && (
          <FocusEditFollowers
            value={selectedPeople}
            onChange={setSelectedPeople}
            isBulkRemapChecked={isBulkRemapChecked}
            setIsBulkRemapChecked={setIsBulkRemapChecked}
          />
        )}
      </CreateFocusStepper>
    </CenteredLayout>
  );
}
