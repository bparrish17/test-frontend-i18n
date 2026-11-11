import {
  Text,
  Flex,
  HStack,
  Input,
  Heading,
  Button,
  Divider,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useState } from 'react';

import { createManualSlackSummary } from '@services/lambda.service';
import { useSlackChannels } from '@services/query-services/slack.query-service';
import { useUserStore } from '@store/app.store';
import { toSelectOptions, getSummaryLines } from '@util/helpers';
import CenteredLayout from '@layouts/centered.layout';
import { useStyledToast } from '@util/hooks';
import { useTranslation } from 'react-i18next';

// Note: this is temporary page to let Slack authorize as application
export default function ManualDigestPage() {
  const { t } = useTranslation();

  const { data: slackChannelOptions } = useSlackChannels({ select: toSelectOptions('id', 'name') });
  const toast = useStyledToast();
  const user = useUserStore((state) => state?.user);

  const [isGenerating, setIsGenerating] = useState();
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState();

  const handleGenerateDigestClick = async () => {
    setIsGenerating(true);
    await createManualSlackSummary({
      tenant_id: user?.tenants[0]?.id,
      slack_channel_ids: selectedChannels.map((c) => c?.value),
      start_at: new Date(startDate).getTime(),
      end_at: new Date(endDate).getTime()
    })
      .then((resultText) => setResult(getSummaryLines(resultText)))
      .catch((err) => toast({ status: 'error', title: err?.message }))
      .finally(() => setIsGenerating(false));
  };

  return (
    <CenteredLayout
      gap={6}
      py={10}
      data-cy='manual-digest-page'
    >
      <Heading fontSize='24px'>{t('manualDigestPage.summarizeSlackChannels')}</Heading>
      <Text
        color='surface.onSurfaceVariant'
        fontSize='sm'
      >
        {t('manualDigestPage.noteDependingOnThe')}
      </Text>
      <Flex flexDir='column'>
        <Flex gap={1}>
          <Text>{t('manualDigestPage.channels')}</Text>
          <Text
            as='i'
            fontSize='sm'
          >
            {t('manualDigestPage.max3')}
          </Text>
        </Flex>
        <Select
          selectedOptionStyle='check'
          isMulti
          placeholder={t('manualDigestPage.selectChannelsToSummarizePlaceholder')}
          options={slackChannelOptions}
          isOptionDisabled={() => selectedChannels.length >= 3}
          onChange={setSelectedChannels}
        />
      </Flex>
      <HStack gap={6}>
        <Flex flexDir='column'>
          <Text>{t('manualDigestPage.startTime')}</Text>
          <Input
            type='datetime-local'
            value={startDate}
            onChange={(e) => setStartDate(e?.target?.value)}
          />
        </Flex>
        <Text pt={5}>{t('manualDigestPage.to')}</Text>
        <Flex flexDir='column'>
          <Text>{t('manualDigestPage.endTime')}</Text>
          <Input
            type='datetime-local'
            value={endDate}
            onChange={(e) => setEndDate(e?.target?.value)}
          />
        </Flex>
      </HStack>
      <Button
        variant='reskinPrimary'
        size='full'
        isLoading={isGenerating}
        isDisabled={!selectedChannels.length > 0 || !startDate}
        loadingText={<Text variant='content-section-header'>Generating...</Text>}
        onClick={handleGenerateDigestClick}
      >
        <Text variant='content-section-header'>{t('manualDigestPage.createSlackSummary')}</Text>
      </Button>
      {result && (
        <>
          <Divider />
          <Text as='b'>{t('manualDigestPage.summary')} </Text>
          <UnorderedList>
            {result.map((text) => (
              <ListItem key={text}>{text}</ListItem>
            ))}
          </UnorderedList>
        </>
      )}
    </CenteredLayout>
  );
}
