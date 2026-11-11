import { Box, Button, Heading, HStack, Stack, StackDivider, Text } from '@chakra-ui/react';
import { forwardRef, useState } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useStatsigClient } from '@statsig/react-bindings';

import { useUserStore } from '@store/app.store';
import {
  useDocumentScrollListener,
  useListRefs,
  useSetDocumentTitle,
  useAvatarUpload
} from '@util/hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
  SFClipboardIcon,
  SFClockCheckBadgeIcon,
  SFDeskclockIcon,
  SFEnvelopeOutlined,
  SFEyeIcon
} from '@assets/icons';

import ColumnedLayout from '@layouts/columned.layout';
import TableOfContents from '@components/general/table-of-contents.component';
import SectionHeader from '@components/meeting/section-header.component';
import PersonPreview from '@components/general/avatar-preview/person-preview.component';
import EmailSubscriptionsSection from './email-subscriptions.section';
import TimezoneSection from './timezone.section';
import YourPromptSection from './your-prompt.section';
import AutoSchedulingSection from './auto-scheduling.section';

const sections = [
  {
    name: 'Your Prompt',
    icon: SFClipboardIcon,
    iconProps: { p: 1 }
  },
  {
    name: 'Email Subscriptions',
    icon: SFEnvelopeOutlined,
    iconProps: { p: 1 }
  },
  {
    name: 'Auto Scheduling',
    icon: SFClockCheckBadgeIcon,
    iconProps: { pl: 1, pr: '1px' }
  },
  {
    name: 'Timezone',
    icon: SFDeskclockIcon,
    iconProps: { p: 1 }
  }
];

export default function AccountSettingsPage() {
  const [closestRefIndex, setClosestRefIndex] = useState(0);
  useSetDocumentTitle('Profile Settings');
  const user = useUserStore((state) => state.user);
  const { checkGate } = useStatsigClient();
  const isAutoSchedulingEnabled = checkGate('user-auto-scheduling');
  const queryClient = useQueryClient();
  const { isUploading, handleFileSelect } = useAvatarUpload(queryClient);

  const {
    refs: sectionRefs,
    handleScrollToRef,
    getClosestRefIndex
  } = useListRefs(['your-prompt', 'email-subscriptions', 'auto-scheduling', 'timezone']);
  useDocumentScrollListener(() => setClosestRefIndex(getClosestRefIndex()));

  return (
    <ColumnedLayout
      rightRailContent={
        <Stack
          p={{ base: 4, lg: 11 }}
          gap={7}
        >
          <Text variant='content-section-header'>Contents</Text>
          <TableOfContents
            sections={sections}
            closestRefIndex={closestRefIndex}
            onSectionClick={handleScrollToRef}
          />
        </Stack>
      }
    >
      <Stack
        gap={11}
        p={{ base: 4, lg: 11 }}
      >
        <Heading size='sm'>Profile Settings</Heading>
        {/* Person Header */}
        <HStack
          layerStyle='section-card'
          p={4}
        >
          <PersonPreview
            flex={1}
            size='2xl'
            isLink={false}
            person={user}
            enableAvatarUpload
            onAvatarUpload={handleFileSelect}
            isUploadingAvatar={isUploading}
          />
          <Button
            as={ReactRouterLink}
            to={`/person?email=${user?.email}&id=${user?.id}`}
            variant='reskinLink'
            size='reskinLg'
            leftIcon={<SFEyeIcon color='brandPrimary.primary' />}
          >
            View Your Profile
          </Button>
        </HStack>

        {/* Your Prompt Section */}
        <UserProfilePageSection
          sectionTitle='Your Prompt'
          icon={SFClipboardIcon}
          ref={sectionRefs?.current[0]}
        >
          <YourPromptSection />
        </UserProfilePageSection>

        {/* Email Subscriptions Section */}
        <UserProfilePageSection
          sectionTitle='Email Subscriptions'
          icon={SFEnvelopeOutlined}
          ref={sectionRefs?.current[1]}
        >
          <EmailSubscriptionsSection />
        </UserProfilePageSection>

        {/* Auto Scheduling Section */}
        {isAutoSchedulingEnabled && (
          <UserProfilePageSection
            sectionTitle='Auto Scheduling'
            icon={SFClockCheckBadgeIcon}
            ref={sectionRefs?.current[2]}
          >
            <AutoSchedulingSection />
          </UserProfilePageSection>
        )}

        {/* Timezone Section */}
        <UserProfilePageSection
          sectionTitle='Timezone'
          icon={SFDeskclockIcon}
          ref={sectionRefs?.current[2]}
        >
          <TimezoneSection />
        </UserProfilePageSection>
      </Stack>
    </ColumnedLayout>
  );
}

function _UserProfilePageSection({ sectionTitle, icon, headerChildren, children }, ref) {
  return (
    <Box
      ref={ref}
      data-testid={`${sectionTitle}-section`}
      style={{ scrollMarginTop: '30px' }}
    >
      <Stack
        layerStyle='section-card'
        gap={0}
        divider={<StackDivider style={{ margin: 0 }} />}
      >
        <SectionHeader
          icon={icon}
          headline={sectionTitle}
        >
          {headerChildren}
        </SectionHeader>
        <Stack
          gap={6}
          px={{ base: 4, lg: 11 }}
          py={{ base: 4, lg: 6 }}
        >
          {children}
        </Stack>
      </Stack>
    </Box>
  );
}

const UserProfilePageSection = forwardRef(_UserProfilePageSection);
