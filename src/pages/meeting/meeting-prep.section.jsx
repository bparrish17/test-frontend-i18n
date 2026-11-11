import { SimpleGrid, Text, Stack, Divider } from '@chakra-ui/react';
import { map, size } from 'lodash-es';
import Markdown from '@components/general/markdown.component';
import { useState } from 'react';

import { useBreakpoints } from '@util/hooks';
import { SFClipboardIcon } from '@assets/icons';
import SectionHeader from '@components/meeting/section-header.component';
import OrganizationPreview from '@components/general/avatar-preview/organization-preview.component';
import MeetingPageSection from '@pages/meeting/section.component';
import MeetingPersonPreview from '@components/general/avatar-preview/meeting-person-preview.component';
import { useTranslation } from 'react-i18next';

export default function MeetingPrepSection({
  meetingPrepSection,
  attendeesSection,
  meeting,
  attendees,
  organizations,
  hideHeader = false
}) {
  const { t } = useTranslation();

  const { preparation } = meeting;
  const organizer = attendees?.find((attendee) => attendee.isOrganizer);
  const external = attendees?.filter((attendee) => attendee.external && !attendee.isOrganizer);
  const internal = attendees?.filter((attendee) => !attendee.external && !attendee.isOrganizer);
  const organizationSize = size(organizations);
  const { isMobile } = useBreakpoints();
  const [isViewingMore, setIsViewingMore] = useState(false);

  const showOtherParticipants = () => {
    if (isMobile) {
      return isViewingMore;
    }

    return true;
  };

  return (
    <MeetingPageSection
      id='meeting-prep'
      section={meetingPrepSection}
      hideHeader={hideHeader}
      gap={0}
    >
      <Stack
        gap={0}
        layerStyle='section-card'
      >
        <SectionHeader
          headline='Meeting Prep'
          icon={SFClipboardIcon}
        />
        <Divider style={{ margin: 0 }} />
        {preparation && (
          <>
            <Stack
              p={6}
              gap={3}
            >
              <Markdown>{preparation}</Markdown>
            </Stack>
            <Divider style={{ margin: 0 }} />
          </>
        )}
        <Stack
          p={{ base: 4, md: 10 }}
          gap={6}
          ref={attendeesSection.ref}
        >
          {size(attendees) > 0 && (
            <Stack gap={6}>
              <Stack gap={6}>
                <Text variant='content-section-header'>{t('meetingPrepSection.organizer')}</Text>
                <MeetingPersonPreview
                  variant='meeting-prep'
                  person={organizer}
                />
              </Stack>
              {isMobile && !isViewingMore && (
                <Text
                  color='brandPrimary.primary'
                  fontWeight={600}
                  letterSpacing='tight'
                  textOverflow='ellipsis'
                  onClick={() => {
                    setIsViewingMore(true);
                  }}
                >
                  View {size(attendees)} attendees
                </Text>
              )}
              {showOtherParticipants() && (
                <SimpleGrid
                  columns={isMobile ? 1 : 2}
                  spacing={{ sm: 3, md: 6 }}
                >
                  {internal?.length > 0 && (
                    <Stack gap={6}>
                      <Text variant='content-section-header'>
                        {t('meetingPrepSection.internal')}
                      </Text>
                      {internal?.map((attendee) => (
                        <MeetingPersonPreview
                          key={attendee?.email}
                          variant='meeting-prep'
                          person={attendee}
                        />
                      ))}
                    </Stack>
                  )}
                  {isMobile && <br />}
                  {external?.length > 0 && (
                    <Stack gap={6}>
                      <Text variant='content-section-header'>
                        {t('meetingPrepSection.external')}
                      </Text>
                      {external?.map((attendee) => (
                        <MeetingPersonPreview
                          key={attendee?.email}
                          variant='meeting-prep'
                          person={attendee}
                        />
                      ))}
                    </Stack>
                  )}
                </SimpleGrid>
              )}{' '}
            </Stack>
          )}
          {organizationSize > 0 && (
            <>
              <Text variant='content-section-header'>{t('meetingPrepSection.organizations')}</Text>
              <SimpleGrid
                columns={isMobile ? 1 : 2}
                spacing={6}
              >
                {map(organizations, (organization) => (
                  <OrganizationPreview
                    size='sm'
                    key={organization?.id}
                    organization={organization}
                    attendeeCount={organization.meetings[meeting?.id]}
                    variant='card'
                    border='reskin'
                    fontSize='sm'
                    bgColor='surface.containerLow'
                  />
                ))}
                {organizationSize === 1 && <></>}
              </SimpleGrid>
            </>
          )}
        </Stack>
      </Stack>
    </MeetingPageSection>
  );
}
