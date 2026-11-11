import { Stack, Text, Button, HStack, MenuList, Tooltip } from '@chakra-ui/react';
import pluralize from 'pluralize';

import {
  SFUnlockIcon,
  SFPaperPlaneIcon,
  SFCustomersFilledIcon,
  SFBuildingsIcon,
  SFLockIcon
} from '@assets/icons';

import { useIsUserType } from '@util/hooks';
import { totalPeopleWithAccess, sharingDisabled } from '@util/helpers/privacy.helpers';

const disabledStyles = { opacity: 0.5 };

export default function PrivacyMenuList({
  isSensitive,
  accessStats,
  toggleMeetingSensitivity,
  modalDisclosure,
  isLoadingMeeting,
  isMeetingParticipant
}) {
  let hasSensitivityPermission = false;
  if (useIsUserType('Executive', 'Admin')) {
    hasSensitivityPermission = true;
  } else if (isMeetingParticipant) {
    hasSensitivityPermission = true;
  }

  const totalAccessCount = totalPeopleWithAccess(accessStats, isSensitive);

  return (
    <MenuList
      p={0}
      w='330px'
      placement='bottom'
    >
      <Stack gap={0}>
        <Stack p={3}>
          <Text
            variant='content-section-header'
            color='surface.onSurfaceVariant'
            fontSize='xs'
            fontWeight={500}
          >
            Meeting Access
          </Text>
          <Text
            color='surface.onSurfaceVariant'
            fontSize='xs'
            fontWeight={400}
          >
            {totalAccessCount} {pluralize('person', totalAccessCount)}{' '}
            {pluralize('has', totalAccessCount)} access to this page
          </Text>
        </Stack>
        <Stack
          p={2}
          ml={3}
          mr={3}
          mb={3}
          rounded='md'
          bgColor='surface.containerLow'
        >
          <HStack>
            <SFCustomersFilledIcon
              boxSize='16px'
              color='brandPrimary.primary'
            />
            <Text
              color='surface.onSurfaceVariant'
              fontSize='xs'
              fontWeight={600}
            >
              {accessStats?.num_of_participants} meeting invitees
              {accessStats?.num_of_managers > 0 &&
                !isSensitive &&
                ` and ${accessStats.num_of_managers} ${
                  accessStats.num_of_managers === 1 ? 'manager' : 'managers'
                }`}
            </Text>
          </HStack>
          <HStack style={isSensitive ? disabledStyles : {}}>
            <SFBuildingsIcon
              boxSize='16px'
              color='brandPrimary.primary'
            />
            <Text
              color='surface.onSurfaceVariant'
              fontSize='xs'
              fontWeight={600}
            >
              {isSensitive
                ? 'No organizational access'
                : accessStats?.num_of_collaborators === 0
                ? 'Available to users with organizational access'
                : `${accessStats?.num_of_collaborators} with organizational access`}
            </Text>
          </HStack>
          <HStack style={sharingDisabled(accessStats, isSensitive) ? disabledStyles : {}}>
            <SFPaperPlaneIcon
              boxSize='16px'
              color='brandPrimary.primary'
            />
            <Text
              color='surface.onSurfaceVariant'
              fontSize='xs'
              fontWeight={600}
            >
              {sharingDisabled(accessStats, isSensitive)
                ? 'No sharing recipients'
                : `${accessStats?.num_of_shares} sharing recipients`}
            </Text>
          </HStack>
        </Stack>
        <Tooltip
          label='You do not have permissions to change this'
          isDisabled={hasSensitivityPermission}
        >
          <Button
            ml={3}
            mr={3}
            mb={3}
            w='55%'
            alignSelf='flex-end'
            variant='reskinSecondary'
            size='reskinMd'
            fontWeight={400}
            onClick={isSensitive ? toggleMeetingSensitivity : modalDisclosure?.onOpen}
            isDisabled={!hasSensitivityPermission || isLoadingMeeting}
          >
            <HStack
              gap={1}
              pl={0}
              ml={0}
              justifyContent='center'
              alignItems='center'
              w='100%'
            >
              {' '}
              {/* Ensure layout adapts */}
              {isSensitive ? (
                <SFUnlockIcon
                  boxSize='16px'
                  color='brandPrimary.primary'
                />
              ) : (
                <SFLockIcon
                  boxSize='16px'
                  color='brandPrimary.primary'
                />
              )}
              <Text
                fontSize='10px'
                lineHeight='1'
              >
                {isSensitive ? 'Enable organizational access' : 'Make private to invitees only'}
              </Text>
            </HStack>
          </Button>
        </Tooltip>
      </Stack>
    </MenuList>
  );
}
