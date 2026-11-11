import Markdown from 'react-markdown';
import { Box, Text, OrderedList, UnorderedList, ListItem } from '@chakra-ui/react';
import { omit } from 'lodash';

export const MessageContent = ({ content }) => (
  <Box>
    <Markdown
      style={{ letterSpacing: 'wide', color: 'surface.onSurfaceVariant' }}
      components={{
        h1: (props) => (
          <Text
            as='h1'
            mb={4}
            lineHeight='1.6'
            {...omit(props, 'node')}
          >
            {props.children}
          </Text>
        ),
        h2: (props) => (
          <Text
            as='h2'
            mb={4}
            lineHeight='1.6'
            {...omit(props, 'node')}
          >
            {props.children}
          </Text>
        ),
        h3: (props) => (
          <Text
            as='h3'
            mb={4}
            lineHeight='1.6'
            {...omit(props, 'node')}
          >
            {props.children}
          </Text>
        ),
        p: (props) => (
          <Text
            as='p'
            mb={4}
            lineHeight='1.6'
            {...omit(props, 'node')}
          >
            {props.children}
          </Text>
        ),
        ol: (props) => (
          <OrderedList
            spacing={2}
            ml={4}
            mb={4}
            {...omit(props, 'node')}
          >
            {props.children}
          </OrderedList>
        ),
        ul: (props) => (
          <UnorderedList
            spacing={2}
            ml={4}
            mb={4}
            {...omit(props, 'node')}
          >
            {props.children}
          </UnorderedList>
        ),
        li: (props) => (
          <ListItem
            mb={2}
            {...omit(props, 'node')}
          >
            {props.children}
          </ListItem>
        ),
        strong: (props) => (
          <Text
            as='span'
            color='brandPrimary.primary'
            fontWeight={600}
            {...omit(props, 'node')}
          />
        )
      }}
    >
      {content?.trim()}
    </Markdown>
  </Box>
);

export default MessageContent;
