import {
  Heading,
  Stack,
  Text,
  HStack,
  Icon,
  Spacer,
  ModalCloseButton,
  Center
} from '@chakra-ui/react';
import { format } from 'date-fns';

import SourceLogo from '@components/general/source-logo.component';
import { SFCalendarIcon } from '@assets/icons';

export default function SectionHeader({
  headline,
  meeting,
  icon = false,
  inModal = false,
  actionIcon,
  headerChildren,
  children,
  ...props
}) {
  return (
    <HStack
      alignItems='flex-start'
      p={3}
      py={6}
      gap={3}
      {...props}
    >
      <Center width={icon ? 6 : 0}>
        {icon && (
          <Icon
            as={icon}
            color='brandPrimary.primary'
            boxSize='22px'
          />
        )}
      </Center>
      <Stack
        pr={{ base: 0, sm: 3 }}
        flex={1}
      >
        <HStack alignItems='flex-start'>
          <Heading size={{ base: 'sm', lg: 'md' }}>{headline}</Heading>
          <Spacer />
          {children}
          {inModal && <ModalCloseButton maxH='80vh' />}
          {actionIcon}
        </HStack>
        {headerChildren}
        {meeting && (
          <Stack direction={{ base: 'column', lg: 'row' }}>
            <HStack>
              {meeting?.type === 'Channel' ? (
                <SourceLogo
                  sourceType={meeting?.type}
                  source={meeting?.source_data}
                  boxSize={{ base: '14px', sm: 4 }}
                  mr={2}
                />
              ) : (
                <Icon
                  as={SFCalendarIcon}
                  color='brandPrimary.primary'
                  boxSize={{ base: '14px', sm: 4 }}
                  mr={2}
                />
              )}
              <Text
                color='brandPrimary.primary'
                fontWeight={500}
                fontSize={{ base: 'xs', sm: 'md' }}
              >
                {meeting.title}
              </Text>
            </HStack>
            {meeting?.start_at && (
              <Text
                color='surface.onSurfaceVariant'
                fontSize={{ base: 'xs', sm: 'md' }}
              >
                {format(meeting.start_at, 'ccc, LLL d h:mm a')}
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </HStack>
  );
}
