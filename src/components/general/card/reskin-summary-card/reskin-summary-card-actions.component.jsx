import { Button, Flex, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';

import { useBreakpoints } from '@util/hooks';
import {
  SFBookmarkFilledIcon,
  SFBookmarkIcon,
  SFEyeIcon,
  SFEyeSlashIcon,
  SFSquareArrowUp
} from '@assets/icons';
import ShareMeetingModal from '@components/meeting/share-meeting-modal.component';

const CardActions = ({
  card,
  onCardActionClick,
  isHovering,
  isMobile,
  showBody,
  shareMeetingDisclosure
}) => {
  return (
    <HStack
      minH={6}
      align='end'
      justify={{ base: 'initial', md: 'flex-end' }}
      gap={{ base: 2, md: 1 }}
      // py={2}
      w={{ base: 'full', md: 'unset' }}
      mx={{ base: -1, md: null }}
      // my={-1} // icon btns while hovered are 32px while container needs to be 24px, retrofit margin to fit design
    >
      {(isHovering || isMobile || (!isMobile && !showBody)) && (
        <>
          {card?.source === 'Meeting' && (
            <ShareMeetingModal
              meeting={card?.source_data}
              bot={{ id: card?.source_data?.bot_id }}
              showSharedSummary
              customDisclosure={shareMeetingDisclosure}
              openButton={
                <CardAction
                  icon={<SFSquareArrowUp boxSize={5} />}
                  label='Share'
                />
              }
            />
          )}
          <CardAction
            icon={card?.preferred ? <SFBookmarkFilledIcon /> : <SFBookmarkIcon />}
            label={card?.preferred ? 'Saved' : 'Save'}
            onClick={() => onCardActionClick('save', !card?.preferred, card)}
          />
          <CardAction
            icon={card?.archived ? <SFEyeIcon boxSize={5} /> : <SFEyeSlashIcon boxSize={5} />}
            label={card?.archived ? 'Unarchive' : 'Archive'}
            showLabelOnMobile={false}
            ml={{ base: 'auto', md: 0 }}
            onClick={() => onCardActionClick('archive', !card?.archived, card)}
          />
        </>
      )}
    </HStack>
  );
};

function CardAction({ icon, label, showLabelOnMobile = true, onClick, ...containerProps }) {
  const { isMobile } = useBreakpoints();
  const sharedProps = {
    variant: 'reskinGhost',
    colorScheme: 'surface',
    size: 'reskinSm',
    onClick
  };

  return (
    <Tooltip
      label={label}
      isDisabled={isMobile || !label}
      openDelay={500}
      hasArrow
    >
      <Flex
        alignItems='center'
        {...containerProps}
      >
        {isMobile && showLabelOnMobile ? (
          <Button
            {...sharedProps}
            leftIcon={icon}
            iconSpacing={1}
            px={2}
          >
            <Text variant='body-lighter-md'>{label}</Text>
          </Button>
        ) : (
          <IconButton
            {...sharedProps}
            px={1}
            isRound
            icon={icon}
          />
        )}
      </Flex>
    </Tooltip>
  );
}

export default CardActions;
