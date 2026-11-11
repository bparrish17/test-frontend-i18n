import {
  Flex,
  HStack,
  Spacer,
  Text,
  Spinner,
  StackDivider,
  IconButton,
  useDisclosure,
  Collapse,
  Grid,
  GridItem,
  Divider,
  Stack,
  Icon,
  VStack,
  Heading
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  useArchiveInitiative,
  useInitiatives
} from '@services/query-services/initiatives.query-service';
import { useIsUserType, useMutationToast, useSetDocumentTitle } from '@util/hooks';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  HorizontalDotMenuIcon,
  PlusIcon,
  EmptyCollectionIcon
} from '@assets/icons';

import FocusMetadata from '@components/focus/focus-metadata.component';
import StyledLink from '@components/general/styled-link.component';
import Dropdown from '@components/general/dropdown.component';
import CreateFocusSuccessModal from '@components/create-focus/create-focus-success-modal.component';
import Search from '@components/general/search.component';
import CenteredLayout from '@layouts/centered.layout';
import ActionPopover from '@components/general/action-popover.component';
import { useTranslation } from 'react-i18next';

export default function FocusesPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('All Focuses - FORA');
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const [query, setQuery] = useState('');
  const focusesQueryLive = {
    type: 'Focus',
    title: '',
    has_archived_at: false,
    optimisticUpdateValue: query || null
  };
  const { data: focusesLive = [], isLoading: isLoadingLive } = useInitiatives(focusesQueryLive);
  const focusesQueryArchived = {
    type: 'Focus',
    title: '',
    has_archived_at: true,
    optimisticUpdateValue: query + 1 || null
  };
  const { data: focusesArchived = [], isLoading: isLoadingArchived } =
    useInitiatives(focusesQueryArchived);
  const isExecutiveUser = useIsUserType('Executive', 'Admin');
  const { mutate: archiveFocus } = useArchiveInitiative({
    optimisticUpdateConfig: { enabled: true, type: 'id' }
  });
  const { onSuccess: onDeleteFocusSuccess, onError: onDeleteFocusError } = useMutationToast(
    'focus',
    'update'
  );
  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose
  } = useDisclosure();
  const actionPopoverDisclosure = useDisclosure();

  let focuses = [];
  const isLoading = isLoadingLive || isLoadingArchived;
  if (!isLoading) {
    focuses = [...focusesLive, ...focusesArchived];
  }

  const menuItems = (focus) => {
    const menuItems = [
      {
        name: 'Edit Category',
        hasDivider: isExecutiveUser,
        onClick: () => navigate(`/focuses/${focus?.id}/settings`)
      }
    ];
    if (isExecutiveUser) {
      menuItems.push({
        name: !focus?.archived_at ? 'Archive Category' : 'Restore Category',
        props: { color: 'critical.primary' },
        onClick: () => {
          archiveFocus(
            { id: focus?.id, value: !focus?.archived_at },
            {
              onSuccess: (e) => {
                onDeleteFocusSuccess(e);
                setQuery(new Date());
              },
              onError: (e) => {
                onDeleteFocusError(e);
                setQuery(new Date());
              }
            }
          );
        }
      });
    }
    return menuItems;
  };

  useEffect(() => {
    if (locationState?.isFocusCreated) {
      onSuccessModalOpen();
      setTimeout(() => {
        window.history.replaceState({}, document.title);
        onSuccessModalClose();
      }, 3000);
    }
  }, [locationState]);

  return (
    <CenteredLayout
      data-cy='focuses-page'
      flexDir='column'
      p={9}
      mx='auto'
      position='relative'
      mb={{ base: 12, sm: 6 }}
    >
      <Grid
        templateColumns='repeat(3, 1fr)'
        mb={3}
      >
        <GridItem
          placeSelf='center'
          colStart={2}
        >
          <Heading size='md'>{t('focusesPage.categories')}</Heading>
        </GridItem>

        <GridItem colStart={3}>
          <HStack
            w='full'
            justify='end'
          >
            <Search
              placeholder={t('focusesPage.searchCategoriesPlaceholder')}
              value={query}
              setValue={setQuery}
            />
            {isExecutiveUser && (
              <ActionPopover
                preActionBody='Add a category'
                disclosure={{ ...actionPopoverDisclosure, isOpen: focuses?.length === 0 }}
                styles={{ popover: { placement: 'bottom' }, content: { border: 'none', mt: 2 } }}
              >
                <IconButton
                  icon={<PlusIcon size='21px' />}
                  rounded='full'
                  onClick={() => navigate('/focuses/create')}
                />
              </ActionPopover>
            )}
          </HStack>
        </GridItem>
      </Grid>
      <Divider />
      {isLoading && (
        <Spinner
          size='lg'
          alignSelf='center'
          mt={6}
        />
      )}
      {!isLoading && (
        <Stack divider={<StackDivider style={{ margin: 0 }} />}>
          {focuses?.length > 0 ? (
            focuses?.map((focus) => {
              return (
                <FocusItem
                  key={focus?.id}
                  focus={focus}
                  menuItems={menuItems}
                />
              );
            })
          ) : (
            <VStack
              w='full'
              mt={6}
              gap={4}
            >
              <Icon
                as={EmptyCollectionIcon}
                w={12}
                h={12}
                color='surface.onSurfaceVariant'
              />
              <Text textAlign='center'>
                Focuses will appear here. <br />{' '}
                {isExecutiveUser ? t('focusesPage.addACategoryTo') : t('focusesPage.toAddTheFirst')}
              </Text>
            </VStack>
          )}
        </Stack>
      )}
      <CreateFocusSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={onSuccessModalClose}
        focus={locationState}
      />
    </CenteredLayout>
  );
}

function FocusItem({ focus, menuItems }) {
  const { isOpen: isDescriptionOpen, onToggle: onDescriptionToggle } = useDisclosure();
  const isExecutiveUser = useIsUserType('Executive', 'Admin');

  return (
    <Flex
      flexDir='column'
      w='full'
      pb={4}
      pt={2}
    >
      <HStack mb={2}>
        {isExecutiveUser ? (
          <StyledLink
            fontSize='md'
            color={focus?.archived_at ? 'surface.outline' : 'surface.onSurface'}
            fontWeight={600}
            to={`/focuses/${focus?.id}/settings`}
          >
            {focus?.title}
          </StyledLink>
        ) : (
          <Text
            fontWeight={700}
            color={focus?.archived_at ? 'surface.outline' : 'surface.onSurface'}
          >
            {focus?.title}
          </Text>
        )}

        <IconButton
          variant='unstyled'
          icon={isDescriptionOpen ? <ChevronUpIcon size='18px' /> : <ChevronDownIcon size='18px' />}
          color='surface.onSurfaceVariant'
          onClick={onDescriptionToggle}
        />
        <Spacer />
        <Dropdown
          variant='default'
          menuItems={menuItems(focus)}
          icon={<HorizontalDotMenuIcon size='24px' />}
          triggerButtonProps={{ variant: 'ghost', color: 'surface.onSurfaceVariant' }}
        />
      </HStack>
      <Collapse in={isDescriptionOpen}>
        <Text
          fontSize='sm'
          mb={4}
        >
          {focus?.description}
        </Text>
      </Collapse>
      <FocusMetadata focus={focus} />
    </Flex>
  );
}
