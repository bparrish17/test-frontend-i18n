import { Box, Text } from '@chakra-ui/react';
import { omit } from 'lodash-es';
import { useFullCards } from '@util/hooks';
import SourceButton from '@components/general/source-button.component.jsx';
import SourceInfo from '@components/lens/source-info.component.jsx';

export function code(props) {
  return (
    <Text
      as='span'
      display='inline-flex'
      minW={4}
      h={4}
      verticalAlign='text-top'
      justifyContent='center'
      alignItems='center'
      mt='3px'
      p='5px'
      cursor='default'
      bgColor='surface.surfaceDim'
      color='surface.onSurfaceVariant'
      {...omit(props, 'node')}
      borderRadius='full'
      fontSize='xs'
    >
      {props.children}
    </Text>
  );
}

export function p(props) {
  return (
    <Box
      as='p'
      mb={4}
    >
      <Text
        as='span'
        display='inline'
        color='surface.onSurfaceVariant'
        variant='body-reg-lg'
        {...omit(props, 'node')}
      >
        {props.children}
      </Text>
    </Box>
  );
}

export function sourcebutton(props) {
  const { fullCards } = useFullCards(props.insight);
  const sourceNumber = [props.children].join('').replace(/[^\d]/g, '').trim();
  const cardId = props?.insight?.sources?.[sourceNumber - 1]?.id;
  const card = fullCards?.[cardId];
  return (
    <SourceButton
      card={{
        referenceId: sourceNumber,
        ...card
      }}
      sourceInfo={card && <SourceInfo fullCard={card} />}
      {...omit(props, ['node', 'insight'])}
    >
      {props.children}
    </SourceButton>
  );
}
