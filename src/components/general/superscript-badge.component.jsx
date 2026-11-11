import { Box, Text } from '@chakra-ui/react';

/**
 * Badge has a different concept in Chakra, so this was taken from MUI and repurposed for our use case
 * @see {@link https://github.com/fis-components/material-ui/blob/master/src/badge.jsx}
 */
export default function SuperscriptBadge({
  badgeContent,
  bgColor = 'legacyForaBlue',
  color = 'white',
  children,
  topOffset = 0,
  rightOffset = 0,
  ...containerProps
}) {
  return (
    <Box
      display='inline-block'
      position='relative'
      {...containerProps}
    >
      {children}
      <Text
        w={5}
        h={5}
        as='span'
        display='flex'
        alignItems='center'
        justifyContent='center'
        position='absolute'
        top={0 + topOffset}
        right={0 + rightOffset}
        borderRadius='50%'
        bgColor={bgColor}
        color={color}
        variant='content-section-header'
        letterSpacing={0}
      >
        {badgeContent}
      </Text>
    </Box>
  );
}
