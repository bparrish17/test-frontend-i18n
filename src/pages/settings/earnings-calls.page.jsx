import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  Stack,
  Tabs,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';

import { useDebouncedProp, useSetDocumentTitle, useStyledToast } from '@util/hooks';
import { useChannels, useDeleteChannel } from '@services/query-services/channels.query-service';
import { useEarningsCallDates } from '@services/query-services/fmp.query-service';
import { SFEllipsisIcon, SFPlusCircleIcon, SFSearchIcon, SFXMarkIconOutlined } from '@assets/icons';

import AddTickerModal from '@components/settings/add-ticker-modal.component';
import AccordionTable from '@components/general/table/accordion-table.component';
import { useTranslation } from 'react-i18next';

// Component for displaying ticker content
function SubscribedContent({ isLoading, filteredTickers, headers }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box
        p={8}
        textAlign='center'
        data-testid='loading-box'
      >
        <Spinner
          size='lg'
          color='brandPrimary.primary'
          thickness='4px'
        />
      </Box>
    );
  }

  if (filteredTickers.length === 0) {
    return (
      <Box
        p={8}
        textAlign='center'
        layerStyle='section-card'
      >
        <Text
          color='surface.onSurfaceVariant'
          data-testid='no-calls-text'
        >
          {t('earningsCallsPage.yourCompanyIsNot')}
        </Text>
      </Box>
    );
  }

  return (
    <AccordionTable
      tableName='earningsCalls'
      tableData={filteredTickers}
      headers={headers}
      enableExpansion={false}
      containerProps={{
        borderRadius: 'lg',
        overflow: 'hidden',
        border: 'reskin',
        bg: 'white'
      }}
    />
  );
}

export default function EarningsCallsPage() {
  const { t } = useTranslation();

  const addTickerDisclosure = useDisclosure();
  const toast = useStyledToast();
  const [activeTab, setActiveTab] = useState('subscribed');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebouncedProp(searchQuery);

  useSetDocumentTitle('Earnings Calls - FORA');

  // Fetch subscribed tickers from channels API
  const { data: subscribedTickers, isLoading: isLoadingChannels } = useChannels(
    {
      source: 'Earnings_Call',
      has_next_run_at: true
    },
    {
      select: (channels = []) => {
        if (!Array.isArray(channels)) return [];

        return channels
          .map((channel) => {
            if (!channel) return null;

            // Extract ticker symbol from identifiers array
            const symbol = channel.identifiers?.[0] ?? '';
            // Extract company name from channel name (format: "Company Name (SYMBOL)")
            const companyNameMatch = channel.name?.match(/^(.*) \(([^)]+)\)$/);
            const companyName = companyNameMatch?.[1] ?? channel.name ?? '';

            // Get last updated date from channel's updated_at or created_at
            const lastUpdated = new Date(channel.updated_at || channel.created_at || Date.now());

            // For next call, we don't have this data yet, so using a placeholder
            // In a real implementation, this would come from the API
            const nextCall = new Date();
            nextCall.setDate(lastUpdated.getDate() + 90); // Placeholder: 90 days after last update

            return {
              id: channel.id ?? '',
              symbol,
              companyName,
              lastUpdated,
              nextCall,
              channel // Keep the original channel data for reference
            };
          })
          .filter(Boolean); // Remove any null entries
      }
    }
  );

  // Filter tickers based on search query
  const filteredTickers = useMemo(() => {
    if (!subscribedTickers) return [];
    if (!debouncedSearchQuery) {
      return subscribedTickers;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return (subscribedTickers || []).filter(
      (ticker) =>
        (ticker?.symbol || '').toLowerCase().includes(query) ||
        (ticker?.companyName || '').toLowerCase().includes(query)
    );
  }, [debouncedSearchQuery, subscribedTickers]);

  // Extract unique ticker symbols for API calls
  const tickerSymbols = useMemo(() => {
    if (!subscribedTickers) return [];
    return [...new Set(subscribedTickers.map((ticker) => ticker.symbol))].filter(Boolean);
  }, [subscribedTickers]);

  // Use our custom hook to fetch earnings call dates
  const { earningsCallDates, isLoading: isLoadingDates } = useEarningsCallDates(tickerSymbols);

  const { mutateAsync: deleteChannel } = useDeleteChannel();

  // Handle unsubscribe action
  const handleUnsubscribe = (ticker) => {
    deleteChannel(ticker.id, {
      onSuccess: () => {
        toast({
          title: `Unsubscribed from ${ticker.symbol}`,
          status: 'success'
        });
      },
      onError: () => {
        toast({
          title: `Failed to unsubscribe from ${ticker.symbol}`,
          status: 'error'
        });
      }
    });
  };

  // Update ticker data with real dates
  const tickersWithRealDates = useMemo(() => {
    if (!filteredTickers) return [];

    return filteredTickers.map((ticker) => {
      const dates = earningsCallDates[ticker.symbol];

      if (dates) {
        return {
          ...ticker,
          lastUpdated: dates.lastUpdated,
          nextCall: dates.nextCall
        };
      }

      return ticker;
    });
  }, [filteredTickers, earningsCallDates]);

  // Define table headers
  const headers = [
    {
      title: t('common.name'),
      orderBy: 'symbol',
      dir: 'asc',
      width: '2fr',
      render: (ticker) => (
        <Text
          fontWeight='medium'
          color='surface.onSurface'
        >
          {ticker.symbol} ({ticker.companyName})
        </Text>
      )
    },
    {
      title: t('earningsCallsPage.lastUpdated'),
      orderBy: 'lastUpdated',
      dir: 'asc',
      render: (ticker) => (
        <Box color='surface.onSurfaceVariant'>{format(ticker.lastUpdated, 'MMM dd, yyyy')}</Box>
      )
    },
    {
      title: t('earningsCallsPage.nextCall'),
      orderBy: 'nextCall',
      dir: 'asc',
      render: (ticker) => (
        <Box color='surface.onSurfaceVariant'>{format(ticker.nextCall, 'MMM dd, yyyy')}</Box>
      )
    },
    {
      title: '',
      orderBy: '',
      dir: 'asc',
      disableSort: true,
      width: '72px',
      render: (ticker) => (
        <Box
          onClick={(e) => e.stopPropagation()}
          textAlign='center'
          pr={6}
        >
          <Menu
            placement='bottom-end'
            strategy='fixed'
          >
            <MenuButton
              as={IconButton}
              variant='reskinLink'
              bgColor='surface.containerLow'
              icon={
                <SFEllipsisIcon
                  color='surface.outline'
                  boxSize={5}
                />
              }
              onClick={(e) => e.stopPropagation()}
              size='sm'
            />
            <MenuList py={2}>
              <MenuGroup
                display='flex'
                title={t('earningsCallsPage.stockTickerOptions')}
              >
                <MenuItem
                  icon={
                    <Icon
                      as={SFXMarkIconOutlined}
                      boxSize={4}
                    />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsubscribe(ticker);
                  }}
                >
                  {t('earningsCallsPage.unsubscribeYourCompanyFrom')}
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Box>
      )
    }
  ];

  return (
    <Container
      maxW='container.md'
      px={{ base: 4, md: 0 }}
      py={11}
    >
      <Stack gap={6}>
        {/* Header and Tabs */}
        <Tabs
          variant='sourcesTabs'
          index={activeTab === 'subscribed' ? 0 : 1}
          onChange={(index) => setActiveTab(index === 0 ? 'subscribed' : 'unsubscribed')}
        >
          <Flex
            align={{ base: 'flex-start', sm: 'center' }}
            flexDir={{ base: 'column', sm: 'row' }}
            gap={{ base: 1, sm: 4 }}
          >
            <Heading size='md'>{t('earningsCallsPage.earningsCalls')}</Heading>
            <Spacer />
            <Button
              variant='reskinPrimary'
              onClick={addTickerDisclosure.onOpen}
              rightIcon={<SFPlusCircleIcon boxSize='14px' />}
              size='sm'
              fontWeight={500}
            >
              {t('earningsCallsPage.addTicker')}
            </Button>
          </Flex>
        </Tabs>

        <Divider />

        {/* Content */}
        <Flex
          justify='space-between'
          align={{ base: 'flex-start', sm: 'center' }}
          flexDir={{ base: 'column', sm: 'row' }}
          gap={3}
        >
          <Text
            color='surface.onSurfaceVariant'
            fontSize='sm'
          >
            {t('earningsCallsPage.items', { count: filteredTickers.length })}
          </Text>

          <InputGroup
            height='50px'
            maxW={{ base: '100%', sm: '250px' }}
          >
            <Input
              border='reskin'
              bg='transparent'
              placeholder={t('earningsCallsPage.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius='md'
              size='md'
              sx={{
                '&::placeholder': {
                  color: 'surface.outline',
                  fontWeight: 400,
                  opacity: 1
                }
              }}
            />
            <InputRightElement>
              <Icon
                color='surface.onSurfaceVariant'
                mr={5}
                mt={5}
                w={6}
                h={6}
                as={SFSearchIcon}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
        {activeTab === 'subscribed' && (
          <SubscribedContent
            isLoading={isLoadingChannels || (isLoadingDates && tickerSymbols?.length > 0)}
            filteredTickers={tickersWithRealDates}
            headers={headers}
          />
        )}

        {activeTab === 'unsubscribed' && (
          <Box
            p={8}
            textAlign='center'
            layerStyle='section-card'
          >
            <Text color='surface.onSurfaceVariant'>
              {t('earningsCallsPage.theUnsubscribedTabIs')}
            </Text>
          </Box>
        )}
      </Stack>
      <AddTickerModal disclosure={addTickerDisclosure} />
    </Container>
  );
}
