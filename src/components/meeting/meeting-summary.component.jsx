import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  UnorderedList
} from '@chakra-ui/react';
import Markdown from '@components/general/markdown.component';
import { useRef, useState } from 'react';

import { isCustomSummary } from '@util/helpers/initiatives.helpers';
import { useUserStore } from '@store/app.store';
import { useDeleteCard } from '@services/query-services/cards.query-service';
import { LightningFillThickIcon, SFEllipsisIcon, SFTrashIcon } from '@assets/icons';
import SectionHeader from './section-header.component';
import StyledLink from '@components/general/styled-link.component';
import CardSection from '@pages/meeting/card-section.component';
import { useStatsigClient } from '@statsig/react-bindings';
import HighPriorityExplanation from '@components/general/high-priority-explanation.component';
import analyticsService from '@services/analytics.service';
import { useTranslation } from 'react-i18next';

export default function MeetingSummary({
  card,
  // meeting,
  enabled = true,
  headerChildren,
  menuChildren,
  showMenu = true,
  headerProps = {}, // *
  hideCustomSummaryStuff,
  onDeleteFinished,
  ...props
  // both of these props can likely be removed once the meeting summaries are updated to match the new designs (3/13/2025)
}) {
  const { t } = useTranslation();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { checkGate } = useStatsigClient();
  const enableHighPriority = checkGate('high-priority-cards');

  const user = useUserStore((state) => state.user);

  const trackOpen = () => {
    analyticsService.trackMenuClick('Personal Summary Section Overflow Menu Click', {
      meetingId: card?.meetingId,
      userId: user?.id,
      route: window?.location?.pathname
    });
  };

  if (!enabled) {
    return null;
  }

  return (
    <Stack
      layerStyle='section-card'
      gap={0}
      {...props}
    >
      {headerChildren}
      <SectionHeader
        headline={card?.headline}
        headerChildren={
          card?.initiative?.type === 'Lens' &&
          !isCustomSummary(card?.initiative) && (
            <Text
              color='surface.onSurfaceVariant'
              fontSize='sm'
              my={1}
            >
              {t('meetingSummary.thisIsACurated')}
              <StyledLink to={`/lenses/${card?.initiative?.id}/edit`}>
                {card?.initiative?.title}
              </StyledLink>
            </Text>
          )
        }
        pb={3}
        {...headerProps}
      >
        {showMenu && (
          <Menu closeOnSelect={false}>
            <MenuButton
              as={IconButton}
              onClick={trackOpen}
              variant='reskinGhost'
              colorScheme='surface'
              size='reskinMd'
              px={2}
              mt={-1}
              isRound
              icon={
                <Icon
                  as={SFEllipsisIcon}
                  boxSize={4}
                  color='brandPrimary.primary'
                />
              }
            />
            <MenuList>{menuChildren}</MenuList>
          </Menu>
        )}
      </SectionHeader>
      {enableHighPriority && card?.high_priority && card?.high_priority_explanation && (
        <HighPriorityExplanation
          card={card}
          rounded='xl'
          mx={12}
          my={3}
        />
      )}
      <Stack
        pb={3}
        gap={0}
      >
        {card?.sections?.map((section) =>
          card?.initiative?.type === 'Lens' ? (
            <CardSection
              key={section?.title}
              title={section?.title}
              icon={LightningFillThickIcon}
            >
              <Box
                fontWeight={500}
                fontSize='sm'
                color='surface.onSurfaceVariant'
                pl={9}
                lineHeight={6}
              >
                <Markdown>{section?.content}</Markdown>
              </Box>
            </CardSection>
          ) : (
            <CardSection
              key={section?.title}
              title={section?.title}
              icon={LightningFillThickIcon}
            >
              <UnorderedList
                color='surface.onSurfaceVariant'
                fontWeight={400}
                fontSize='sm'
                pl={10}
                ml={1}
              >
                {section?.content
                  ?.split('* ')
                  .slice(1)
                  ?.map((item) => {
                    return (
                      <ListItem
                        key={item}
                        sx={{ '&:not(:last-child)': { paddingBottom: '1px' } }}
                      >
                        <Markdown>{item.replace('\\n', '')}</Markdown>
                      </ListItem>
                    );
                  })}
              </UnorderedList>
            </CardSection>
          )
        )}
      </Stack>
      {!hideCustomSummaryStuff && card?.initiative?.tags?.includes('template') && (
        <>
          <HStack
            pb={3}
            pr={3}
            justify='flex-end'
          >
            <IconButton
              onClick={() => setIsConfirmingDelete(true)}
              rounded='md'
              h={8}
              variant='reskinWhite'
              icon={
                <Icon
                  as={SFTrashIcon}
                  color='surface.onSurfaceVariant'
                  boxSize={4}
                />
              }
              px={2}
            />
          </HStack>
          <SummaryDeletion
            card={card}
            isConfirmingDelete={isConfirmingDelete}
            setIsConfirmingDelete={setIsConfirmingDelete}
            onDeleteFinished={onDeleteFinished}
          />
        </>
      )}
    </Stack>
  );
}

const SummaryDeletion = ({ card, isConfirmingDelete, setIsConfirmingDelete, onDeleteFinished }) => {
  const { t } = useTranslation();

  const cancelRef = useRef();
  const { mutateAsync: deleteSummary, isLoading: isDeleting } = useDeleteCard();

  const onClose = () => setIsConfirmingDelete(false);

  const onConfirmDelete = async () => {
    await deleteSummary(card?.id);
    setIsConfirmingDelete(false);
    onDeleteFinished();
  };

  return (
    <AlertDialog
      isOpen={isConfirmingDelete}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize='lg'
            fontWeight='bold'
          >
            {t('meetingSummary.deleteSummary')}
          </AlertDialogHeader>
          <AlertDialogBody>{t('meetingSummary.areYouSureYou')}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant='reskinSecondary'
              ref={cancelRef}
              onClick={onClose}
            >
              {t('meetingSummary.cancel')}
            </Button>
            <Button
              color='white'
              bgColor='critical.primary'
              isLoading={isDeleting}
              onClick={onConfirmDelete}
              ml={3}
            >
              {t('meetingSummary.delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

/*
const PrivacyInfo = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          icon={<SFInfoIcon boxSize={4} color="surface.onSurfaceVariant" />}
          rounded="full"
          variant="ghost"
          size="sm"
          w="fit-content"
          _hover={{ bgColor: 'surface.containerLow' }}
        />
      </PopoverTrigger>
      <PopoverContent bgColor="etc.scrim90">
        <PopoverArrow bgColor="etc.scrim90" />
        <PopoverBody>
          <Text fontWeight={500} fontSize="xs" color="surface.surfaceDim">
            All of your information is private, and we do not use this feedback to train our models.
            Review our privacy policy{' '}
            <StyledLink
              textDecoration="underline"
              color="brandPrimary.onPrimary"
              fontWeight={600}
              href="https://fora.day/privacy"
            >
              here
            </StyledLink>
            .
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
*/
