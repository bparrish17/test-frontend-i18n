import React, { Children } from 'react';
import { HStack, Stack, Text, Icon, Spacer } from '@chakra-ui/react';
import CopyTextMenu from '@components/general/copy-text-menu.component';

export default function CardSection({ title, icon, children, ...containerProps }) {
  // reskin todo: can use Markdown component for this?
  const extractText = (element) => {
    let textContent = '';

    const traverse = (node) => {
      if (typeof node === 'string') {
        textContent += `- ${node}`;
      } else if (node?.props?.children) {
        Children.forEach(node.props.children, traverse);
      }
    };

    traverse(element);
    return textContent;
  };

  return (
    <Stack
      borderRadius='lg'
      p={3}
      gap={3}
      {...containerProps}
    >
      <HStack
        className='group'
        align='flex-start'
      >
        <Icon
          as={icon}
          boxSize='18px'
          m={1}
          color='brandPrimary.primary'
        />
        <Text fontWeight={500}>{title}</Text>
        <Spacer />
        <CopyTextMenu textToCopy={extractText(children)} />
      </HStack>
      {children}
    </Stack>
  );
}
