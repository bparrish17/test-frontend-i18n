import { Stack, Box, Text, HStack, Icon } from '@chakra-ui/react';
import { useState } from 'react';

import {
  GaugeBalancedIcon,
  GaugeStrategicIcon,
  GaugeTacticalIcon,
  SFBoltFillIcon
} from '@assets/icons';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { translateSentiment } from '@util/helpers/meetings.helpers';
import AccordionTable from '@components/general/table/accordion-table.component';
import SectionHeader from './section-header.component';

const sentimentTypeIcon = (val) => {
  if (val === 'tactical') {
    return GaugeTacticalIcon;
  } else if (val === 'strategic') {
    return GaugeStrategicIcon;
  } else {
    return GaugeBalancedIcon;
  }
};

const headers = [
  {
    title: 'Topics',
    orderBy: 'title',
    dir: 'asc',
    width: '1fr',
    props: {
      minW: '100px'
    },
    render: (topic) => (
      <Text
        fontSize='sm'
        fontWeight='medium'
        textAlign='left'
        color='surface.onSurface'
      >
        {topic.title}
      </Text>
    )
  },
  {
    title: 'Type',
    orderBy: 'strategic_vs_tactical',
    dir: 'asc',
    width: 'auto',
    props: {
      minW: {
        base: '75px',
        md: '90px',
        lg: '125px'
      }
    },
    render: (topic) => (
      <HStack>
        <Icon as={sentimentTypeIcon(topic?.strategic_vs_tactical)} />
        <Text
          fontSize='11px'
          color='surface.onSurfaceVariant'
          _firstLetter={{ textTransform: 'uppercase' }}
        >
          {topic?.strategic_vs_tactical}
        </Text>
      </HStack>
    )
  },
  {
    title: 'Sentiment',
    orderBy: 'sentiment',
    dir: 'asc',
    width: 'auto',
    props: {
      minW: {
        base: '80px',
        md: '125px',
        lg: '150px'
      }
    },
    render: (topic) => {
      const sentimentObj = translateSentiment(topic?.sentiment);
      return (
        <Box
          py={1.5}
          px={2.5}
          borderRadius='md'
          bgColor={sentimentObj.bgColor}
          color={sentimentObj.color}
          w='fit-content'
        >
          <Text
            w={{ base: 'min-content', md: 'auto' }}
            variant='label-reg-md'
          >
            {sentimentObj.copy}
          </Text>
        </Box>
      );
    }
  }
];

export default function Topics({ topics }) {
  const [expandedRows, setExpandedRows] = useState([]);
  return (
    <Stack
      layerStyle='section-card'
      gap={0}
    >
      <SectionHeader
        headline='Topic Analysis'
        icon={SFBoltFillIcon}
      />
      <AccordionTable
        tableName='topic'
        tableData={topics}
        headers={headers}
        maxItems={4}
        enableExpansion
        expandedRows={expandedRows}
        onExpansionChange={setExpandedRows}
        panelChildren={(topic) => topic?.details}
        containerProps={{
          border: 'none',
          borderTop: 'reskin',
          borderTopRadius: 0,
          overflow: 'auto',
          sx: HIDE_SCROLLBAR
        }}
        // todo: can make the bottom 2 props defaults on the accordion table?
      />
    </Stack>
  );
}
