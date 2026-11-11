import {
  UnorderedList,
  ListItem,
  Flex,
  Icon,
  Heading,
  Text,
  HStack,
  List,
  Stack,
  Spacer
} from '@chakra-ui/react';
import Markdown from 'react-markdown';
import { omit } from 'lodash-es';

import { LightningFillThickIcon, SFEllipsisIcon } from '@assets/icons';
import { getDocumentMetadataFromCard } from '@util/helpers';

import MeetingPageSection from '@pages/meeting/section.component';
import CopyTextMenu from '@components/general/copy-text-menu.component';

/** @param {Card["supporting_data"]} supportingData */
const parseSupportingData = (supportingData) => {
  if (!supportingData) {
    return {};
  }

  let heading = supportingData[0].value;
  const content = supportingData
    .slice(1)
    .filter((item) => item.value !== '**undefined**')
    .map((item) => item.value)
    .join('\n\n')
    .replace(/`/g, ''); // Removes all backticks

  // "**undefined**".indexOf('undefined') === 2
  const undefinedStringIndex = heading.indexOf('undefined');

  // Means "undefined" is at the beginning of the string
  // Less chance of it being a valid word in the title
  if (undefinedStringIndex !== -1 && undefinedStringIndex < 4) {
    heading = null;
  }

  return { heading, content };
};

/** @param {{section: MeetingPageSection, card: Card}} */
export default function DetailedSummarySection({ section, card }) {
  const { heading, content } = parseSupportingData(card?.supporting_data);
  const documentTitle = getDocumentMetadataFromCard(card).name;

  return (
    <MeetingPageSection section={section}>
      <Stack
        py={6}
        px={3}
        layerStyle='section-card'
      >
        <SummaryHeading
          wordBreak='break-all'
          supportingData={content}
        >
          {heading ?? documentTitle}
        </SummaryHeading>
        <Markdown
          components={{
            ul,
            li,
            h1,
            h2
          }}
        >
          {content}
        </Markdown>
      </Stack>
    </MeetingPageSection>
  );
}

function SummaryHeading({ supportingData, ...props }) {
  return (
    <Flex
      justify='space-between'
      align='flex-start'
      gap={4}
    >
      {props.children && (
        <Heading
          size='md'
          pb={3}
          pl={3}
          {...omit(props, 'node')}
        >
          {props.children}
        </Heading>
      )}
      <Spacer />
      <CopyTextMenu
        textToCopy={supportingData}
        hoverButton={false}
        menuButtonProps={{
          size: 'sm',
          mt: -1,
          icon: <SFEllipsisIcon boxSize={5} />
        }}
      />
    </Flex>
  );
}

function h1(props) {
  return (
    <Heading
      size='sm'
      mt={2}
    >
      {props.children}
    </Heading>
  );
}

function h2(props) {
  return (
    <HStack
      align='flex-start'
      py={3}
    >
      <Icon
        as={LightningFillThickIcon}
        boxSize='18px'
        m={1}
        color='brandPrimary.primary'
      />
      <Text fontWeight={500}>{props.children}</Text>
    </HStack>
  );
}

function ul(props) {
  return (
    <UnorderedList
      pl={10}
      ml={1}
      {...omit(props, 'node')}
    />
  );
}

function li(props) {
  return (
    <List>
      <ListItem
        {...omit(props, 'node')}
        fontSize='sm'
        pb={1}
      >
        <Text
          fontWeight={400}
          color='surface.onSurfaceVariant'
        >
          {props.children}
        </Text>
      </ListItem>
    </List>
  );
}
