import { Stack, HStack, Icon, Text, Divider, Button, Flex, useConst } from '@chakra-ui/react';
import { chakraComponents } from 'chakra-react-select';
import { format, isAfter, sub } from 'date-fns';
import { map, omit } from 'lodash-es';
import { useState } from 'react';

import { useAvailableSymbols } from '@services/query-services/fmp.query-service';
import { useSubscribeToEarningsCalls } from '@services/query-services/channels.query-service';
import { useBreakpointValue, useDebouncedProp, useStyledToast } from '@util/hooks';
import { SFCalendarIcon, SFPlusCircleIcon } from '@assets/icons';

import CustomSelect from '@components/general/form/custom-select.component';
import StyledModal from '@components/general/modals/styled-modal.component';
import ReskinCalendar from '@components/general/reskin-calendar.component';
import { useTranslation } from 'react-i18next';

export default function AddTickerModal({ disclosure }) {
  const { t } = useTranslation();

  const toast = useStyledToast();
  const datepickerPlacement = useBreakpointValue({ base: 'auto', lg: 'right-end' });
  const minDatepickerDate = useConst(sub(new Date(), { years: 2 }));
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [inputText, setInputText] = useState('');
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [debouncedInputText] = useDebouncedProp(inputText);

  const { data: availableSymbols, isLoading } = useAvailableSymbols(debouncedInputText, {
    enabled: debouncedInputText?.length >= 2 && debouncedInputText?.length <= 30,
    select: (symbols) => map(symbols, 'value')
  });

  const { mutateAsync: subscribeToEarningsCalls } = useSubscribeToEarningsCalls();

  const handleInputChange = (inputText, meta) => {
    if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
      setInputText(inputText);
    }
  };

  const handleSubscribeClick = async () => {
    setIsSubscribing(true);
    await subscribeToEarningsCalls(
      { tickers: selectedTickers, fromDate: selectedDate },
      {
        onSuccess: (res) => {
          const { successTickers, errorTickers } = res;
          const successList = map(successTickers, 'symbol');
          if (successTickers?.length > 0) {
            toast({
              title: `Added ${successList?.join(', ')}`,
              status: 'success',
              isClosable: true
            });
          }
          if (errorTickers?.length === 0) {
            setSelectedTickers([]);
            disclosure.onClose();
          } else {
            errorTickers?.forEach((errorTicker) => {
              toast({
                title: errorTicker?.message,
                status: 'error'
              });
            });
            setSelectedTickers(errorTickers?.map((errorTicker) => omit(errorTicker, 'message')));
          }
        }
      }
    );

    setIsSubscribing(false);
  };

  return (
    <StyledModal
      disclosure={disclosure}
      title={
        <HStack>
          <Icon
            as={SFPlusCircleIcon}
            color='brandPrimary.onPrimary'
            boxSize={7}
            p={1}
          />
          <Text variant='body-600-md'>{t('addTickerModal.subscribeToEarningsCalls')}</Text>
        </HStack>
      }
      modalProps={{
        scrollBehavior: 'inside',
        onClose: () => {
          setSelectedDate();
          disclosure.onClose();
        }
      }}
      modalContentProps={{ w: { base: '95vw', lg: '720px' } }}
      modalBodyProps={{ p: 11 }}
      modalHeaderProps={{
        bgColor: 'brandPrimary.primary',
        color: 'brandPrimary.onPrimary'
      }}
      modalCloseButtonProps={{ color: 'brandPrimary.onPrimary' }}
    >
      <Stack gap={3}>
        <Text
          variant='body-500-md'
          color='surface.onSurfaceVariant'
        >
          {t('addTickerModal.addStockTickersFrom')}
        </Text>
        <CustomSelect
          size='md'
          placeholder={t('addTickerModal.enterAStockTickerPlaceholder')}
          getOptionValue={(opt) => opt?.symbol}
          getOptionLabel={(opt) => opt?.symbol}
          inputValue={inputText}
          onInputChange={handleInputChange}
          options={availableSymbols}
          value={selectedTickers}
          onChange={setSelectedTickers}
          filterOption={null}
          isLoading={!!inputText && isLoading}
          components={{
            Option,
            LoadingMessage,
            NoOptionsMessage
          }}
        />
        <HStack
          py={2}
          gap={5}
        >
          <ReskinCalendar
            trigger={
              <Button
                variant='reskinSecondary'
                size='reskinMd'
                rightIcon={<SFCalendarIcon boxSize='13px' />}
              >
                {selectedDate
                  ? `Starting ${format(selectedDate, 'PP')}`
                  : t('addTickerModal.startingDateOptional')}
              </Button>
            }
            minDate={minDatepickerDate}
            date={selectedDate}
            setDate={setSelectedDate}
            fadePastDates={false}
            placement={datepickerPlacement}
            strategy='fixed'
            decreaseMonthTooltip={{
              label: t('addTickerModal.ifYouNeedSummaries'),
              isDisabled: (monthDate) => isAfter(sub(monthDate, { minutes: 1 }), minDatepickerDate)
            }}
            popoverContentProps={{ ml: { base: 3, lg: 'unset' } }}
          />
          <Text
            variant='label-500-md'
            color='surface.onSurfaceVariant'
          >
            {t('addTickerModal.ifYouDonT')}
          </Text>
        </HStack>
        <Divider />
        <Flex
          justify='flex-end'
          mt={3}
        >
          <Button
            variant='reskinPrimary'
            size='reskinLg'
            borderRadius='lg'
            isLoading={isSubscribing}
            isDisabled={selectedTickers?.length === 0}
            onClick={handleSubscribeClick}
          >
            {t('addTickerModal.subscribe')}
          </Button>
        </Flex>
      </Stack>
    </StyledModal>
  );
}

function Option({ data: option, ...props }) {
  return (
    <chakraComponents.Option {...props}>
      <HStack>
        <Text
          as='span'
          color='surface.onSurface'
          variant='label-500-md'
        >
          {option?.symbol}
        </Text>
        <Text
          as='span'
          color='surface.outline'
          variant='label-500-md'
        >
          {option?.companyName}
        </Text>
      </HStack>
    </chakraComponents.Option>
  );
}

function LoadingMessage(props) {
  const inputText = props.selectProps?.inputValue;
  const inputHasTwoChars = inputText?.length >= 2;

  return (
    <chakraComponents.LoadingMessage {...props}>
      <Text>{inputHasTwoChars ? 'Loading...' : 'Input at least 2 characters to search...'}</Text>
    </chakraComponents.LoadingMessage>
  );
}

function NoOptionsMessage(props) {
  const inputText = props.selectProps?.inputValue;
  const hasInput = inputText?.length > 0;

  return (
    <chakraComponents.NoOptionsMessage {...props}>
      <Text>{hasInput ? 'No tickers found' : 'Input a ticker or company name'}</Text>
    </chakraComponents.NoOptionsMessage>
  );
}
