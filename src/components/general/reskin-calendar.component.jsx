import {
  HStack,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useConst,
  useDisclosure,
  Text,
  Spacer,
  Icon,
  Button,
  Tooltip,
  Flex
} from '@chakra-ui/react';
import { isToday, startOfDay, format, isBefore, addMinutes } from 'date-fns';
import { noop } from 'lodash-es';
import ReactDatePicker from 'react-datepicker';
import { ChevronLeftIcon, ChevronRightIcon, SFCalendarIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export default function ReskinCalendar({
  date,
  setDate,
  trigger,
  minDate,
  maxDate,
  triggerProps,
  fadePastDates = true,
  decreaseMonthTooltip, // for minDate tooltips
  popoverContentProps = {},
  ...props
}) {
  const { t } = useTranslation();

  const today = useConst(Date.now());
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBackToToday = () => {
    setDate(startOfDay(new Date()).getTime());
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement='bottom-start'
      {...props}
    >
      <PopoverTrigger>
        {trigger ?? (
          <IconButton
            icon={<SFCalendarIcon boxSize={6} />}
            color='brandPrimary.primary'
            variant='unstyled'
            {...triggerProps}
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        w={{ base: 'calc(100vw - 32px)', sm: '430px' }}
        mx='auto'
        borderRadius='lg'
        display='flex'
        justifyContent='center'
        alignItems='center'
        _focus={{ shadow: 'none' }}
        sx={reactDatePickerStyles}
        {...popoverContentProps}
      >
        <ReactDatePicker
          inline
          selected={date}
          onChange={(newDate) => {
            setDate(newDate.getTime());
            onClose();
          }}
          dayClassName={(dayDate) => {
            if (dayDate < today && fadePastDates) {
              return 'custom-day custom-day__past';
            } else {
              return 'custom-day';
            }
          }}
          minDate={minDate}
          maxDate={maxDate}
          renderCustomHeader={({ decreaseMonth, increaseMonth, monthDate }) => {
            const isDecreaseMonthDisabled = isBefore(monthDate, addMinutes(minDate, 1));
            // todo: can add same logic to maxDate, if needed
            return (
              <HStack
                px={4}
                pt={4}
                pb={2}
              >
                <Text
                  fontWeight={600}
                  fontSize='16px'
                  color='brandPrimary.primary'
                >
                  {format(monthDate, 'MMMM yyyy')}
                </Text>
                <Spacer />
                {!isToday(date) && (
                  <Button
                    variant='link'
                    onClick={handleBackToToday}
                    fontSize='sm'
                  >
                    {t('reskinCalendar.backToToday')}
                  </Button>
                )}
                <Tooltip
                  label={decreaseMonthTooltip?.label}
                  isDisabled={
                    !decreaseMonthTooltip || (decreaseMonthTooltip && !isDecreaseMonthDisabled)
                  }
                >
                  <Flex>
                    <Icon
                      as={ChevronLeftIcon}
                      boxSize={6}
                      cursor='pointer'
                      color={
                        isDecreaseMonthDisabled ? 'surface.outlineVariant' : 'brandPrimary.primary'
                      }
                      onClick={isDecreaseMonthDisabled ? noop : decreaseMonth}
                    />
                  </Flex>
                </Tooltip>
                <Icon
                  as={ChevronRightIcon}
                  boxSize={6}
                  cursor='pointer'
                  color='brandPrimary.primary'
                  onClick={increaseMonth}
                />
              </HStack>
            );
          }}
          calendarClassName='custom-calendar custom-calendar--agenda'
          formatWeekDay={(nameOfDay) => nameOfDay.charAt(0)}
        />
      </PopoverContent>
    </Popover>
  );
}

// it's not great, but it allows for using semantic tokens
/** @type {import('@chakra-ui/react').SystemStyleObject} */
const reactDatePickerStyles = {
  '&>div': { w: 'full' },
  '.react-datepicker': {
    w: 'full',
    border: 'none',
    borderRadius: '2xl',
    bgColor: 'surface.surfaceBright',
    fontFamily: "'Inter', 'Open Sans', 'Helvetica Neue', sans-serif"
  },
  '.react-datepicker__month': {
    bgColor: 'surface.surfaceBright',
    border: '1px solid',
    borderColor: 'surface.surface',
    borderRadius: 'lg',
    mt: 0,
    overflow: 'hidden'
  },
  '.react-datepicker__week': {
    display: 'flex',
    justifyContent: 'space-between'
  },
  '.react-datepicker__week:not(:last-child)': {
    borderBottom: '1px solid',
    borderColor: 'surface.surface'
  },
  '.react-datepicker__month-container': { w: 'full' },
  '.react-datepicker__header': {
    backgroundColor: 'inherit',
    border: 'none',
    padding: 0,
    display: 'flex',
    flexDir: 'column'
  },
  '.react-datepicker__current-month': {
    padding: '34px 0',
    fontFamily: "'Inter', 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    lineHeight: '20px',
    fontWeight: 600
  },
  '.react-datepicker__day-names': {
    px: 5,
    pb: 2,
    w: 'full',
    display: 'flex',
    justifyContent: 'space-between'
  },
  '.react-datepicker__day-name': {
    textTransform: 'uppercase',
    fontWeight: 600,
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: 'surface.onSurfaceVariant'
  },
  '.react-datepicker__day--today': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    color: 'surface.onSurface !important'
  },
  '.react-datepicker__day--today:before': {
    content: '""',
    position: 'absolute',
    w: 'calc(100% - 2px)',
    h: 'calc(100% - 2px)',
    border: '2px solid',
    borderColor: 'brandPrimary.primary'
  },
  '.react-datepicker__day--today:after': {
    content: '"Today"',
    fontSize: '10px',
    lineHeight: '10px'
  },
  '.custom-day': {
    height: '50px',
    w: 'full',
    m: 0,
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: 'surface.onSurfaceVariant',
    fontWeight: 600
  },
  '.custom-day:not(:last-child)': {
    borderRight: '1px solid',
    borderColor: 'surface.surface'
  },
  '.custom-day.react-datepicker__day--outside-month, .react-datepicker__day--disabled': {
    bgColor: 'surface.surface',
    color: 'surface.outline'
  },
  '.react-datepicker__day--disabled': { fontWeight: 300 },
  '.custom-day.custom-day__past': {
    color: 'surface.outline'
  },
  '.react-datepicker__today-button': {
    position: 'absolute',
    right: 0,
    mr: 5,
    top: 16,
    bgColor: 'transparent',
    border: 'none',
    fontWeight: 500,
    fontSize: '14px',
    color: 'brandPrimary.primary'
  },
  '.react-datepicker__navigation--previous': {
    top: 8,
    left: 16
  },
  '.react-datepicker__navigation--next': {
    top: 8,
    right: 16
  },
  '.react-datepicker__day--weekend': {},
  '.custom-day.react-datepicker__day--range-start, .custom-day.react-datepicker__day--range-end, .custom-day.react-datepicker__day--selected':
    {
      bgColor: 'brandPrimary.primary',
      color: 'white !important'
    },
  '.custom-day.react-datepicker__day--range-start:hover, .custom-day.react-datepicker__day--range-end:hover':
    {
      backgroundColor: '#963d36',
      color: 'white'
    },
  '.custom-day.react-datepicker__day--in-range:not(.react-datepicker__day--range-start, .react-datepicker__day--range-end)':
    {
      backgroundColor: '#f8edec',
      color: 'black'
    },
  '.custom-day.react-datepicker__day--in-range:hover:not(.react-datepicker__day--range-start, .react-datepicker__day--range-end)':
    {
      backgroundColor: '#b7494154',
      color: 'black'
    },
  '.custom-day.react-datepicker__day--keyboard-selected:not(.react-datepicker__day--in-range)': {
    backgroundColor: 'unset'
  },
  '.custom-day.react-datepicker__day--selecting-range-start, .custom-day.react-datepicker__day--selecting-range-end':
    {
      backgroundColor: '#b7494154',
      color: 'black'
    },
  '.custom-day.react-datepicker__day--in-selecting-range:not(.react-datepicker__day--selecting-range-start, .react-datepicker__day--selecting-range-end, .react-datepicker__day--in-range)':
    {
      backgroundColor: '#f8edec',
      color: 'black'
    }
};
