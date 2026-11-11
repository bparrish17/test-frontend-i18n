import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useBoolean,
  useDisclosure,
  Alert,
  AlertDescription,
  HStack
} from '@chakra-ui/react';
import { useMemo, useRef, useEffect } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import {
  CloseIcon,
  MenuIcon,
  SearchIcon,
  SFCalendarIcon,
  SFClockIcon,
  SFGearIcon,
  SFHomeIcon,
  SFLensIcon,
  SFQuestionMarkCircleFilled,
  SFXMarkIconOutlined,
  SFAddCircleFilledIcon,
  SFExclamationMarkTriangleOutlined,
  SFInfoIcon
} from '@assets/icons';
import { ForaLogoWhite } from '@assets/images';
import CreateMeetingModal from '@components/meeting/create-meeting-modal.component';
import GlobalSearchInput from '@components/global-search/global-search-input.component';
import GlobalSearchResults from '@components/global-search/global-search-results.component';
import { useGlobalSearchStore, useUserStore } from '@store/app.store';
import { NOTION_SUPPORT_URL } from '@util/constants';
import { capitalizeFullString } from '@util/helpers';
import { useIsUserType, useSetFullMobileVH } from '@util/hooks';
import { useGlobalSearchState } from '@util/hooks/global-search.hooks';
import ForaBanner from '@components/general/fora-banner.component';
import { useGlobalSettings } from '@services/query-services/global-settings.query-service';
import { evaluateOutageMessageVisibility } from '@util/helpers/global-settings.helpers';
import { useTranslation } from 'react-i18next';

export default function MobileHeader() {
  const { t } = useTranslation();

  const user = useUserStore((state) => state?.user);
  const tenant = useUserStore((state) => state.tenant);
  const outageMessageVisibility = useUserStore((state) => state.outageMessageVisibility);
  const getOutageMessageVisibility = useUserStore((state) => state.getOutageMessageVisibility);
  const setOutageMessageVisibility = useUserStore((state) => state.setOutageMessageVisibility);

  const isGuest = !!user?.isGuest;
  const { isOpen, onOpen, onClose, onToggle: toggleIsOpen } = useDisclosure();
  const [isSearching, { toggle: toggleIsSearching }] = useBoolean(false);
  const inputRef = useGlobalSearchStore((state) => state?.inputRef);
  const isExecutiveUser = useIsUserType('Executive');

  const addForaModalDisclosure = useDisclosure();

  const { data: globalSettings } = useGlobalSettings({}, { enabled: !!(user && !isGuest) });

  const feConfig = tenant?.fe_config || {};

  const hideOutageMessage = () => {
    const outageMessageVisibility = {
      hidden: true,
      lastMessage: globalSettings?.outage_message
    };
    setOutageMessageVisibility(outageMessageVisibility);
  };

  useEffect(() => {
    // gets outageMessageVisibility from local storage
    getOutageMessageVisibility();
  }, []);

  const navItems = useMemo(() => {
    const guestItems = [{ to: '/', label: t('mobileHeader.home'), icon: SFHomeIcon }];
    const userItems = [
      {
        to: 'home',
        icon: SFHomeIcon,
        disabled: !isExecutiveUser || !(feConfig?.home_enabled ?? true)
      },
      {
        to: 'lenses',
        icon: SFLensIcon,
        disabled: !isExecutiveUser || !(feConfig?.lenses_enabled ?? true)
      },
      { to: 'agenda', icon: SFCalendarIcon, disabled: !(feConfig?.agenda_enabled ?? true) },
      {
        to: 'summaries',
        icon: SFClockIcon,
        label: t('mobileHeader.latest'),
        disabled: !(feConfig?.summaries_enabled ?? true)
      },
      {
        disclosure: addForaModalDisclosure,
        icon: SFAddCircleFilledIcon,
        label: t('mobileHeader.addForaToA'),
        disabled: !(feConfig?.add_menu_enabled ?? true)
      }
    ].filter((n) => !n.disabled);

    return isGuest ? guestItems : userItems;
  }, [isExecutiveUser, isGuest, feConfig]);

  const resultsWrapperRef = useRef();
  const {
    globalSearchQuery,
    handleViewAllClick,
    globalSearchQueryResult,
    pushQueryToRecentSearches
  } = useGlobalSearchState();
  useSetFullMobileVH(resultsWrapperRef, 72);

  const handleResultClick = () => {
    pushQueryToRecentSearches();
    toggleIsSearching();
    onClose();
  };

  const notAssociate = user?.type !== 'Associate';
  return (
    <>
      {globalSettings?.outage_message &&
        evaluateOutageMessageVisibility(outageMessageVisibility, globalSettings) && (
          <Alert
            status='warning'
            justifyContent='space-between'
          >
            <HStack>
              <SFExclamationMarkTriangleOutlined />
              <AlertDescription>{globalSettings?.outage_message}</AlertDescription>
            </HStack>
            <Button
              size='sm'
              variant='reskinOutline'
              colorScheme='caution'
              onClick={() => hideOutageMessage()}
            >
              {t('mobileHeader.close')}
            </Button>
          </Alert>
        )}{' '}
      <Box position='relative'>
        <Flex
          as='header'
          position='sticky'
          w='full'
          align='center'
          justify={notAssociate ? 'space-between' : 'center'}
          px={2}
          py={2}
          h={20}
          bgColor={isSearching ? 'surface.surface' : 'brandPrimary.onContainer'}
          zIndex='modal'
        >
          <CreateMeetingModal
            disclosure={addForaModalDisclosure}
            modalContentProps={{ h: '100%', borderRadius: 'none', m: 0 }}
            onClose={onClose}
          />
          {notAssociate && (
            <IconButton
              variant='reskinGhost'
              color={isSearching ? 'brandPrimary.primary' : 'white'}
              size='lg'
              icon={
                <Icon
                  as={isOpen ? CloseIcon : MenuIcon}
                  boxSize='25px'
                />
              }
              isRound
              onClick={() => {
                isSearching ? toggleIsSearching() : toggleIsOpen();
              }}
            />
          )}
          {isSearching ? (
            <GlobalSearchInput
              globalSearchQuery={globalSearchQuery}
              pr={0}
              mr={3}
            />
          ) : (
            <Image
              src={ForaLogoWhite}
              h={4}
            />
          )}
          {isGuest ? (
            <Link
              href='https://fora.day/product'
              target='_blank'
            >
              <IconButton
                variant='reskinGhost'
                icon={
                  <SFInfoIcon
                    boxSize='28px'
                    color='brandPrimary.onPrimary'
                  />
                }
              />
            </Link>
          ) : (
            !isSearching &&
            notAssociate && (
              <IconButton
                variant='reskinGhost'
                color={isSearching ? 'brandPrimary.primary' : 'white'}
                size='lg'
                icon={
                  <Icon
                    as={SearchIcon}
                    boxSize='28px'
                  />
                }
                isRound
                onClick={() => {
                  isSearching ? onClose() : onOpen();
                  toggleIsSearching();
                  setTimeout(() => {
                    inputRef?.current?.focus();
                  }, 0);
                }}
              />
            )
          )}
        </Flex>
        {isOpen &&
          (isSearching ? (
            <Box
              ref={resultsWrapperRef}
              position='absolute'
              zIndex='overlay'
              bg='white'
              top='72px'
              w='100vw'
              h='calc(100vh - 72px)'
              overflowY='scroll'
              left={0}
            >
              <GlobalSearchResults
                globalSearchQuery={globalSearchQuery}
                handleResultClick={handleResultClick}
                handleViewAllClick={(destination) => {
                  toggleIsSearching();
                  onClose();
                  handleViewAllClick(destination);
                }}
                globalSearchQueryResult={globalSearchQueryResult}
              />
            </Box>
          ) : (
            <Stack
              position='fixed'
              top={20}
              w='full'
              h='calc(100dvh - 80px)'
              px={4}
              py={6}
              bgColor={isSearching ? 'surface.surface' : 'brandPrimary.onContainer'}
              zIndex='modal'
            >
              <Stack gap={6}>
                <Heading
                  size='sm'
                  color='brandPrimary.onPrimary'
                  ml={3}
                  lineHeight={7}
                >
                  Hi, {user?.first_name ?? user?.name?.split(' ')[0]}
                </Heading>
                {navItems.map((navItem) => (
                  <MenuButton
                    key={`nav-item-${navItem.to}`}
                    {...navItem}
                    onClick={onClose}
                  />
                ))}
                {/* reskin todo: add "Add" menu here */}
              </Stack>
              <Spacer />
              {isGuest && <ForaBanner mini />}
              <Divider
                style={{ margin: 0 }}
                borderColor='brandPrimary.inverse'
              />
              <SimpleGrid
                w='full'
                columns={2}
                spacing={3}
                mt={3}
              >
                {/*
              <MenuButton
                to={null}
                onClick={() => null}
                label={user?.name ?? user?.email}
                leftIcon={
                  <Avatar size="sm" src={user?.avatar_url} name={user?.name ?? user?.email} />
                }
              />
              */}
                {!isGuest && (
                  <MenuButton
                    to='settings'
                    icon={SFGearIcon}
                    onClick={onClose}
                  />
                )}
                <MenuButton
                  to={NOTION_SUPPORT_URL}
                  label={t('mobileHeader.support')}
                  icon={SFQuestionMarkCircleFilled}
                  target='_blank'
                  rel='noreferrer'
                />
                <MenuButton
                  to='logout'
                  label={t('mobileHeader.signOut')}
                  icon={SFXMarkIconOutlined}
                  onClick={onClose}
                />
              </SimpleGrid>
            </Stack>
          ))}
      </Box>
    </>
  );
}

function MenuButton({ to, icon: NavIcon, label, onClick, disclosure, ...props }) {
  return (
    <Button
      data-testid='menu-button'
      as={ReactRouterLink}
      variant='link'
      to={to}
      color='white'
      justifyContent='flex-start'
      fontSize='lg'
      iconSpacing={3}
      leftIcon={NavIcon ? <NavIcon boxSize='31px' /> : null}
      px={3}
      py={1.5}
      h={12}
      _active={{ color: 'white' }}
      {...props}
      onClick={disclosure ? disclosure.onOpen : onClick}
    >
      <Text>{label ?? capitalizeFullString(to)}</Text>
    </Button>
  );
}
