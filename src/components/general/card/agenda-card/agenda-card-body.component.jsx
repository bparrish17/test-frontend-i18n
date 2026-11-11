import { SFBoltFillIcon } from '@assets/icons';
import { Flex, Icon, Stack, Text } from '@chakra-ui/react';

const MAX_SECTIONS = 3;

export default function AgendaCardBody({ card }) {
  return (
    <Stack
      gap={6}
      mb={2}
    >
      <Text
        fontSize='18px'
        fontWeight={600}
        color='brandPrimary.primary'
      >
        {card?.headline}
      </Text>
      <Stack gap={4}>
        {card?.sections?.slice(0, MAX_SECTIONS)?.map((section) => (
          <Flex
            key={section?.title}
            gap={2}
          >
            <Icon
              as={SFBoltFillIcon}
              color='brandPrimary.primary'
              boxSize={5}
              mt={0.5}
            />
            <Text
              variant='aeonik'
              color='brandPrimary.primary'
              fontWeight={500}
              lineHeight='normal'
              letterSpacing='wide'
            >
              {section?.title}
            </Text>
          </Flex>
        ))}
        {card?.sections?.length > MAX_SECTIONS && (
          <Text
            variant='aeonik'
            color='brandPrimary.primary'
            fontWeight={500}
            fontSize='20px'
            letterSpacing='wide'
            lineHeight={0}
          >
            ...
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
