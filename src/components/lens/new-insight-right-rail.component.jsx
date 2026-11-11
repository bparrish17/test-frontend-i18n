import { Stack, Text } from '@chakra-ui/react';
import AboutThisLens from './about-this-lens.component';

import InsightMetadata from './insight-metadata.component';
import { useInfinitePreviousInsights } from '@util/hooks';
import InsightList from './insight-list.component';
import { useTranslation } from 'react-i18next';

export default function NewInsightRightRail({ lens, insight }) {
  const { t } = useTranslation();

  const { previousInsightsRes, isFetching } = useInfinitePreviousInsights(insight);
  const previousInsights = previousInsightsRes?.pages?.flatMap((page) => page?.data || []);
  return (
    <Stack
      gap={8}
      p={8}
      w='full'
    >
      <Stack gap={4}>
        <Text
          mt={2}
          color='surface.onSurfaceVariant'
          variant='label-caps-600-lg'
        >
          {t('newInsightRightRail.aboutThisLens')}
        </Text>
        <AboutThisLens lens={lens} />
      </Stack>

      <InsightMetadata
        lens={lens}
        insight={insight}
      />

      <Stack
        py={6}
        gap={10}
      >
        <InsightList
          insights={previousInsights}
          isLoading={isFetching}
        />
      </Stack>
    </Stack>
  );
}
