import { HStack, Text, Icon, Image } from '@chakra-ui/react';
import { cloneElement } from 'react';

import { MailIcon, SFDollarSignCircleIcon, ZoomLogoIcon, SFPlayCircleIcon } from '@assets/icons';
import { GoogleMeetLogo, OutlookLogo, SlackLogo, TeamsLogo, GmailLogo } from '@assets/images';
import { getDocumentMetadataFromCard } from '@util/helpers';

import DocumentIcon from '@components/general/document-icon.component';

function LogoWrapper({ logo, text, color, children, includeText, logoProps }) {
  const logoChild = children ?? (
    <Icon
      as={logo}
      fontSize='xl'
      color={color}
    />
  );
  const logoChildWithProps = cloneElement(logoChild, logoProps);

  return includeText ? (
    <HStack
      fontSize='xs'
      p={0}
    >
      {logoChildWithProps}
      <Text>{text}</Text>
    </HStack>
  ) : (
    logoChildWithProps
  );
}

/* ---------------------------
 * Helper: Meeting source logo
 * --------------------------- */
function renderMeetingLogo({ sourceData, tags, includeText, logoProps }) {
  const url = sourceData?.url ?? '';

  if (url.includes('meet.google')) {
    return (
      <LogoWrapper
        includeText={includeText}
        logoProps={logoProps}
        text='Google Meet'
      >
        <Image
          src={GoogleMeetLogo}
          alt='Google Meet Logo'
          h={5}
        />
      </LogoWrapper>
    );
  }
  if (url.includes('teams.microsoft.com')) {
    return (
      <LogoWrapper
        includeText={includeText}
        logoProps={logoProps}
        text='Microsoft Teams'
      >
        <Image
          src={TeamsLogo}
          alt='Microsoft Teams Logo'
          h={5}
        />
      </LogoWrapper>
    );
  }
  if (tags?.includes('meeting_upload')) {
    return (
      <LogoWrapper
        includeText={includeText}
        logoProps={logoProps}
        text='Meeting Upload'
        logo={SFPlayCircleIcon}
      />
    );
  }
  return (
    <LogoWrapper
      includeText={includeText}
      logoProps={logoProps}
      text='Zoom'
      logo={ZoomLogoIcon}
    />
  );
}

/* ---------------------------
 * Helper: Bot source logo
 * --------------------------- */
function renderBotLogo({ subSource, includeText, logoProps }) {
  if (subSource !== 'Earnings_Call') return null;

  return (
    <LogoWrapper
      includeText={includeText}
      logoProps={logoProps}
      text='Earnings Call'
    >
      <Icon
        as={SFDollarSignCircleIcon}
        fontSize='md'
        color='brandPrimary.primary'
        mt={0.5}
      />
    </LogoWrapper>
  );
}

/* ---------------------------
 * Helper: Channel source logo
 * --------------------------- */
function renderChannelLogo({ sourceData, tags, includeText, logoProps }) {
  const channelType = sourceData?.source;

  // Handle Slack and Teams via a simple map
  const logoMap = {
    Slack: { src: SlackLogo, alt: 'Slack Logo', h: 4, text: 'Slack' },
    Teams: { src: TeamsLogo, alt: 'Teams Logo', h: 4, text: 'Microsoft Teams' }
  };

  if (logoMap[channelType]) {
    const { src, alt, h, text } = logoMap[channelType];
    return (
      <LogoWrapper
        includeText={includeText}
        logoProps={logoProps}
        text={text}
      >
        <Image
          src={src}
          alt={alt}
          h={h}
        />
      </LogoWrapper>
    );
  }

  if (channelType === 'Document') {
    const { extension } = getDocumentMetadataFromCard({ tags });
    return extension ? (
      <LogoWrapper
        includeText={includeText}
        logoProps={logoProps}
        text='Document'
      >
        <DocumentIcon extension={extension} />
      </LogoWrapper>
    ) : null;
  }

  if (channelType === 'Email') {
    const id = sourceData?.id ?? '';
    if (id.includes('outlook.com')) {
      return (
        <LogoWrapper
          includeText={includeText}
          logoProps={logoProps}
          text='Outlook'
        >
          <Image
            src={OutlookLogo}
            alt='Microsoft Outlook Logo'
            h={4}
          />
        </LogoWrapper>
      );
    }
    if (id.includes('gmail.com')) {
      return (
        <LogoWrapper
          includeText={includeText}
          logoProps={logoProps}
          text='Gmail'
        >
          <Image
            src={GmailLogo}
            alt='Gmail Logo'
            h={3}
          />
        </LogoWrapper>
      );
    }

    return (
      <LogoWrapper
        includeText={includeText}
        logoProps={logoProps}
        text='Email'
      >
        <Icon
          as={MailIcon}
          fontSize='md'
        />
      </LogoWrapper>
    );
  }

  return null;
}

/* ---------------------------
 * Main Component
 * --------------------------- */
export default function SourceLogo(props) {
  const { source: sourceData, subSource, sourceType, tags, includeText, ...logoProps } = props;

  switch (sourceType) {
    case 'Meeting':
      return renderMeetingLogo({ sourceData, tags, includeText, logoProps });
    case 'Bot':
      return renderBotLogo({ subSource, includeText, logoProps });
    case 'Channel':
      return renderChannelLogo({ sourceData, tags, includeText, logoProps });
    default:
      return null;
  }
}
