import { Circle, Flex, Text } from '@chakra-ui/react';
import { Link as ReactRouterLink, useLocation } from 'react-router-dom';
import { useLatestInsight } from '@services/query-services/insights.query-service';
import { getCardSourceLink } from '@util/helpers';
import PrivateLabel from '@components/general/private-label.component';
import SourceLogo from '@components/general/source-logo.component';

export default function SourceModalHeader({ card }) {
  const shouldShowCircle = card?.referenceId || !card?.initiative?.title;
  const sourceLink = getCardSourceLink(card);
  const location = useLocation();
  const { data: insight } = useLatestInsight(card?.initiative?.id, 'Lens');

  return (
    <Flex
      alignItems='center'
      gap={3}
    >
      {shouldShowCircle && (
        <Circle
          size={5}
          alignSelf='flex-start'
          bg='brandPrimary.primary'
          color='brandPrimary.onPrimary'
          fontSize='sm'
          fontWeight={600}
        >
          {card?.referenceId}
        </Circle>
      )}
      <Flex
        flex={1}
        gap={2}
        flexWrap='wrap'
      >
        {card?.initiative?.title && (
          <Text
            as='span'
            variant='title-sm'
            whiteSpace='nowrap'
            {...(insight ? { as: ReactRouterLink, to: `/insights/${insight?.id}` } : {})}
          >
            {card.initiative.title}
          </Text>
        )}
        {card?.source && (
          <>
            <Text
              as='span'
              variant='title-sm'
              color='brandPrimary.fixed'
              whiteSpace='nowrap'
            >
              was discussed at
            </Text>
            <Flex
              alignItems='center'
              gap={2}
              {...(location.pathname !== sourceLink ? { as: ReactRouterLink, to: sourceLink } : {})}
            >
              <SourceLogo
                sourceType={card?.source}
                subSource={card?.sub_source}
                source={card?.source_data}
                tags={card?.tags}
                boxSize={4}
              />
              <Text
                as='span'
                variant='title-sm'
              >
                {card?.source_data?.title}
              </Text>
              {card?.source_data?.sensitive && <PrivateLabel dark />}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
