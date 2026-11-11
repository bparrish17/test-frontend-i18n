import ReactMarkdown from 'react-markdown';
import { Text, UnorderedList, OrderedList } from '@chakra-ui/react';
import { omit } from 'lodash-es';

export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      style={{ letterSpacing: 'wide', color: 'surface.onSurfaceVariant' }}
      components={{ strong, p, ul, ol }}
    >
      {children}
    </ReactMarkdown>
  );
}

function strong(props) {
  return (
    <Text
      as='span'
      color='brandPrimary.primary'
      fontWeight={600}
      {...omit(props, 'node')}
    />
  );
}

function p(props) {
  return <Text {...omit(props, 'node')} />;
}

function ul(props) {
  return (
    <UnorderedList
      color='surface.onSurfaceVariant'
      fontWeight={500}
      ml='10px'
      fontSize='sm'
      // leaving here for now because it is super niche solution to something poorly understood
      //   sx={{ 'li:not(:last-child)': { paddingBottom: '12px' } }}
      {...omit(props, 'node')}
    />
  );
}

function ol(props) {
  return <OrderedList {...omit(props, 'node')} />;
}
