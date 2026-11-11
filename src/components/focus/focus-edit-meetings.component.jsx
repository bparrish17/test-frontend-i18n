import { Text } from '@chakra-ui/react';

import { HorizontalDotMenuIcon } from '@assets/icons';
import MeetingStackItem from '@components/general/meeting-stack-item.component';
import MeetingSelect from '@components/general/meeting-select.component';
import Dropdown from '@components/general/dropdown.component';
import FocusFormField from '@components/focus/focus-form-field.component';
import { useTranslation } from 'react-i18next';

export default function FocusEditMeetings({
  addedMeetings,
  hasMeeting,
  addMeeting,
  removeMeetingById
}) {
  const { t } = useTranslation();

  const sourceMenuItems = (source) => [
    {
      name: 'Remove Meeting',
      props: { color: 'live.primary' },
      onClick: () => removeMeetingById(source?.id)
    }
  ];

  return (
    <>
      <FocusFormField label={t('focusEditMeetings.findMeetings')}>
        <MeetingSelect
          hasMeeting={hasMeeting}
          addMeeting={addMeeting}
        />
      </FocusFormField>

      <FocusFormField label={t('focusEditMeetings.addedMeetings')}>
        {addedMeetings?.length > 0 ? (
          addedMeetings.map((meeting) => (
            <MeetingStackItem
              key={meeting?.id}
              meeting={meeting}
            >
              <Dropdown
                menuItems={sourceMenuItems(meeting)}
                triggerButtonProps={{ variant: 'ghost' }}
                icon={<HorizontalDotMenuIcon />}
              />
            </MeetingStackItem>
          ))
        ) : (
          <Text
            as='span'
            color='surface.onSurfaceVariant'
            fontSize='sm'
          >
            {t('focusEditMeetings.noMeetingsAdded')}
          </Text>
        )}
      </FocusFormField>
    </>
  );
}
