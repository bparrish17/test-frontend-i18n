import { Stack, UnorderedList, ListItem, Flex, Box } from '@chakra-ui/react';
import { omit } from 'lodash-es';
import Markdown from 'react-markdown';

import CopyTextMenu from '@components/general/copy-text-menu.component';

export default function MeetingMarkdown({ children }) {
  return (
    <Stack
      bgColor='surface.containerLowest'
      p={3}
      gap={3}
    >
      <Markdown
        components={{
          p: () => null,
          strong: (props) => props.children,
          em: (props) => props.children,
          ul,
          li
        }}
      >
        {children}
      </Markdown>
    </Stack>
  );
}

function ul(props) {
  return (
    <UnorderedList
      color='surface.onSurfaceVariant'
      fontWeight={500}
      p={2}
      ml='10px'
      fontSize='sm'
      sx={{ 'li:not(:last-child)': { paddingBottom: '12px' } }}
      {...omit(props, 'node')}
    />
  );
}

function li(props) {
  return (
    <ListItem
      {...omit(props, 'node')}
      pb={3}
      color='surface.onSurface'
      _hover={{ fontWeight: 600 }}
      className='group'
    >
      <Flex
        justify='space-between'
        align='flex-start'
      >
        <Box>{props.children}</Box>
        <CopyTextMenu textToCopy={props.children} />
      </Flex>
    </ListItem>
  );
}
