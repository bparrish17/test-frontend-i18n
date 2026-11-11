import { Flex, Text, VStack, HStack, Button, IconButton, Divider, Spacer } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';

import { ArrowLeftIcon, ArrowRightIcon, SFCalendarIcon } from '@assets/icons';
import { useBreakpoints, useBreakpointValue } from '@util/hooks';
import StyledModal from '@components/general/modals/styled-modal.component';
import { useTranslation } from 'react-i18next';

export default function FeedRangepicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  disclosure
}) {
  const { t } = useTranslation();

  const monthsShown = useBreakpointValue({ base: 1, md: 2 });
  const [startDateObj, setStartDateObj] = useState(startDate && new Date(startDate));
  const [endDateObj, setEndDateObj] = useState(endDate && new Date(endDate));

  useEffect(() => {
    if (startDateObj) {
      setStartDate(new Date(startOfDay(startDateObj)).getTime());
    }
    if (endDateObj) {
      setEndDate(new Date(endOfDay(endDateObj)).getTime());
    }
  }, [startDateObj, endDateObj]);

  return (
    <StyledModal
      disclosure={disclosure}
      modalProps={{ onOverlayClick: () => disclosure.onClose(true) }}
      modalContentProps={{
        w: { base: '100vw', xl: '65vw', '2xl': '55vw' },
        h: { base: '520px', md: 'auto' }
      }}
      title={t('feedRangepicker.customDateRange')}
    >
      <VStack
        gap={{ base: 0, md: 6 }}
        pt={{ base: 2, md: 6 }}
      >
        <DatePicker
          selected={startDateObj}
          onChange={([start, end]) => {
            setStartDateObj(start);
            setEndDateObj(end);
          }}
          startDate={startDateObj}
          endDate={endDateObj}
          selectsRange
          inline
          dayClassName={() => 'custom-day'}
          calendarClassName='custom-calendar'
          formatWeekDay={(nameOfDay) => nameOfDay.charAt(0)}
          renderCustomHeader={(props) => <RangepickerHeader {...props} />}
          monthsShown={monthsShown}
        />
        <Divider />
        <Flex
          justify='space-between'
          w='full'
          p={4}
          pt={0}
        >
          <Button
            variant='reskinSecondary'
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}
          >
            {t('common.reset')}
          </Button>
          <Button
            variant='reskinPrimary'
            onClick={() => disclosure.onClose(true)}
          >
            {t('common.done')}
          </Button>
        </Flex>
      </VStack>
    </StyledModal>
  );
}

export function SelectedDateRange({ startDate, endDate, onClick }) {
  const { t } = useTranslation();

  return (
    <HStack
      fontSize='xs'
      bgColor='surface.surface'
      rounded='xl'
      border='reskin'
    >
      <Text
        color={!startDate && 'surface.onSurfaceVariant'}
        ml={3}
      >
        {startDate ? format(startDate, 'MM/dd/yy') : t('feedRangepicker.mmDdYy')}
      </Text>
      <Text>-</Text>
      <Text color={!endDate && 'surface.onSurfaceVariant'}>
        {endDate ? format(endDate, 'MM/dd/yy') : t('feedRangepicker.mmDdYy')}
      </Text>
      <Spacer />
      <IconButton
        size='sm'
        variant='ghost'
        icon={<SFCalendarIcon boxSize='14px' />}
        onClick={onClick}
      />
    </HStack>
  );
}

function RangepickerHeader({ monthDate, customHeaderCount, decreaseMonth, increaseMonth }) {
  const { isMobile } = useBreakpoints();
  const hideLeftIcon = customHeaderCount === 1 && !isMobile;
  const hideRightIcon = customHeaderCount === 0 && !isMobile;

  return (
    <Flex
      align='center'
      justify='space-between'
    >
      <IconButton
        style={hideLeftIcon ? { visibility: 'hidden' } : null}
        icon={<ArrowLeftIcon size='18px' />}
        rounded='full'
        size='sm'
        onClick={decreaseMonth}
      />
      <Text
        textAlign='center'
        py={{ base: 2, md: 8 }}
        className='react-datepicker__current-month'
      >
        {format(monthDate, 'MMM yyyy')}
      </Text>
      <IconButton
        style={hideRightIcon ? { visibility: 'hidden' } : null}
        icon={<ArrowRightIcon size='18px' />}
        rounded='full'
        size='sm'
        onClick={increaseMonth}
      />
    </Flex>
  );
}
