import {
  Flex,
  Stack,
  Text,
  Heading,
  Icon,
  Show,
  Spacer,
  HStack,
  Collapse,
  Tag,
  Tooltip
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useState } from 'react';

import { SFEyeIcon, SFLockIcon } from '@assets/icons';
import SourceModal from '@components/general/modals/source-modal.component';
import ReskinCardBodyBulletPoints from './reskin-card-body-bullet-points.component';
import { useTranslation } from 'react-i18next';

export default function ReskinCardBody({
  card,
  titleLink,
  children,
  isLensSourceCard = false,
  enableCollapse = false
}) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  if (!enableCollapse) {
    return (
      <Body
        card={card}
        titleLink={titleLink}
        isLensSourceCard={isLensSourceCard}
      >
        {children}
      </Body>
    );
  }

  return (
    <>
      {!isOpen && (
        <HStack
          bgColor='brandPrimary.container'
          color='brandPrimary.primary'
          onClick={() => setIsOpen(true)}
          p={3}
          userSelect='none'
          cursor='pointer'
        >
          <Icon
            as={SFEyeIcon}
            color='brandPrimary.primary'
            boxSize={6}
          />
          <Text
            fontSize='sm'
            fontWeight='medium'
          >
            {t('reskinCardBody.previewSharedSummary')}
          </Text>
        </HStack>
      )}
      <Collapse
        in={isOpen}
        animateOpacity
      >
        <Stack
          maxH={44}
          overflowY='scroll'
        >
          <Body
            card={card}
            titleLink={titleLink}
            showBulletPoints
            isLensSourceCard={isLensSourceCard}
          >
            {children}
          </Body>
        </Stack>
      </Collapse>
    </>
  );
}

function Body({ card, titleLink, showBulletPoints = false, isLensSourceCard = false, children }) {
  const { t } = useTranslation();

  const cardTitle = card?.headline ?? card?.title;

  return (
    <Stack
      p={3}
      gap={2}
      cursor='pointer'
      as={ReactRouterLink}
      to={titleLink}
      state={{ lensId: card?.initiative?.id }}
      data-testid='reskin-body-stack'
    >
      {cardTitle &&
        (isLensSourceCard ? (
          <SourceModal
            card={card}
            titleToInsight={false}
          >
            {/* state & to props dont seem to work here, use navigate instead */}
            <Heading size='md'>{cardTitle}</Heading>
          </SourceModal>
        ) : (
          <Heading size='md'>{cardTitle}</Heading>
        ))}
      <Stack>
        {isLensSourceCard ? (
          <SourceModal
            card={card}
            titleToInsight={false}
          >
            <ReskinCardBodyBulletPoints
              card={card}
              showBulletPoints={showBulletPoints}
            />
          </SourceModal>
        ) : (
          <ReskinCardBodyBulletPoints
            card={card}
            showBulletPoints={showBulletPoints}
          />
        )}
      </Stack>
      <HStack>
        {children}
        <Spacer />
        {!isLensSourceCard && card?.initiative && (
          <Show
            above='md'
            ssr={false}
          >
            <Flex alignSelf='flex-end'>
              <Text
                as='span'
                color='surface.onSurfaceVariant'
              >
                {t('reskinCardBody.in')}
              </Text>
              <Text
                color={card?.initiative?.color}
                textStyle='aeonik'
                letterSpacing='wide'
                textTransform='uppercase'
                fontWeight={500}
              >
                {card?.initiative?.title}
              </Text>
            </Flex>
          </Show>
        )}
        {isLensSourceCard && card.source_data?.sensitive && <PrivateTagWithTooltip />}
      </HStack>
    </Stack>
  );
}

const PrivateTagWithTooltip = () => {
  const { t } = useTranslation();

  return (
    <Tooltip
      hasArrow
      label={t('reskinCardBody.privateMeetingsAreOnly')}
    >
      <Tag color='brandPrimary.primary'>
        <SFLockIcon boxSize='16px' />
        <Text
          variant='content-section-header'
          color='brandPrimary.primary'
        >
          {t('reskinCardBody.private')}
        </Text>
      </Tag>
    </Tooltip>
  );
};
