import { Flex, IconButton, useConst } from '@chakra-ui/react';
import { useState } from 'react';
import { add, startOfDay } from 'date-fns';

import { useMeetings } from '@services/query-services/meetings.query-service';
import { useDebouncedProp } from '@util/hooks';
import { PlusIcon, CheckIcon } from '@assets/icons';
import MeetingStackItem from '@components/general/meeting-stack-item.component';
import CustomSelect from './form/custom-select.component';
import { useTranslation } from 'react-i18next';

const MeetingOption = ({ innerProps, meeting, isAdded, onAddMeetingClick }) => {
  const { t } = useTranslation();

  return (
    <div {...innerProps}>
      <MeetingStackItem
        meeting={meeting}
        containerProps={{ p: 4 }}
        titleProps={{ fontSize: 'md' }}
      >
        {isAdded ? (
          <Flex
            w={9}
            h={9}
            rounded='full'
            justify='center'
            align='center'
            bgColor='brandPrimary.primary'
            color='white'
          >
            <CheckIcon />
          </Flex>
        ) : (
          <IconButton
            icon={<PlusIcon size='21px' />}
            rounded='full'
            size='sm'
            bgColor='surface.onSurfaceVariant'
            onClick={onAddMeetingClick}
            aria-label={t('meetingSelect.addFollowersButtonAriaLabel')}
          />
        )}
      </MeetingStackItem>
    </div>
  );
};

export default function MeetingSelect({ hasMeeting, addMeeting }) {
  const { t } = useTranslation();

  const [input, setInput] = useState('');
  const [searchText] = useDebouncedProp(input);
  const today = useConst(startOfDay(new Date()).getTime());
  const monthFromNow = useConst(add(today, { months: 1 }).getTime());

  const { data: meetings, isFetching } = useMeetings(
    {
      pageSize: 50,
      query: `${searchText ?? ''}*`,
      end_at_from: today,
      end_at_to: monthFromNow,
      asc: true,
      sort: 'end_at'
    },
    { select: (meetings) => meetings.map((m) => ({ ...m, value: m.id })) }
  );

  const handleInputChange = (inputText, meta) => {
    if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
      setInput(inputText);
    }
  };

  return (
    <CustomSelect
      isSearchable
      name='meetings'
      options={meetings}
      inputValue={input}
      onInputChange={handleInputChange}
      isLoading={isFetching}
      filterOption={null}
      isOptionDisabled={() => true} // hard prevent option selection
      placeholder={t('meetingSelect.searchForUpcomingMeetingsPlaceholder')}
      components={{
        Option: ({ innerProps, data: meeting, ...extra }) => (
          <MeetingOption
            innerProps={innerProps}
            meeting={meeting}
            isAdded={hasMeeting(meeting?.id, 'id')}
            onAddMeetingClick={() => addMeeting(meeting)}
            {...extra}
          />
        )
      }}
    />
  );
}
