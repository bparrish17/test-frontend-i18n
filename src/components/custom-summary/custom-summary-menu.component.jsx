import {
  Box,
  Stack,
  Button,
  Divider,
  HStack,
  Icon,
  useDisclosure,
  Menu,
  MenuList,
  MenuButton,
  TagLeftIcon,
  Spacer
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@store/app.store';

import { SFPlusCircleFilledIcon, SFBookPagesOutlinedIcon } from '@assets/icons';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import { useBreakpointValue } from '@util/hooks';
import analyticsService from '@services/analytics.service';

import CustomSummaryPill from '@components/custom-summary/custom-summary-pill.component';
import CustomSummaryMenuHeader from '@components/custom-summary/custom-summary-menu-header.component';
import CustomSummaryChat from './custom-summary-chat.component';

const MAX_VISIBLE_TEMPLATES = 10;

export default function CustomSummaryMenu({ meeting, allCards }) {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const menuDisclosure = useDisclosure();
  const lensSearchBody = {
    type: 'Lens',
    tags: ['template'],
    creator_id: user?.id
  };
  const { data: allLenses } = useInitiatives(lensSearchBody);

  // Extract all initiative IDs from allCards
  const initiativeIds = allCards?.map((card) => card.initiative?.id);

  // // Filter allLenses to exclude any lens with an ID matching an initiative ID
  const filteredLenses = allLenses?.filter((lens) => !initiativeIds?.includes(lens.id));
  const visibleLenses = showAll ? filteredLenses : filteredLenses?.slice(0, MAX_VISIBLE_TEMPLATES);
  const noCustomSummaries = !filteredLenses?.length;

  const [showCustomSummaryChat, setShowCustomSummaryChat] = useState(false);

  const initialSourceData = [
    { id: meeting?.linked?.id || meeting?.id, type: 'Meeting', title: meeting?.title },
    { ...allCards[0], type: 'Card', title: `Original Summary of ${meeting?.title}` }
  ];

  const showChatHandler = () => {
    analyticsService.trackButtonClick('Custom Summary Template Create Button Clicked', {
      meetingId: meeting?.id
    });
    return setShowCustomSummaryChat(true);
  };

  return (
    <Box>
      <Menu
        isOpen={menuDisclosure.isOpen}
        onClose={menuDisclosure.onClose}
        placement='bottom-end'
      >
        <MenuButton
          role='button'
          variant='reskinPrimary'
          size='reskinXs'
          as={Button}
          onClick={menuDisclosure.onToggle}
          rightIcon={
            <Icon
              as={SFPlusCircleFilledIcon}
              color='brandPrimary.onPrimary'
              boxSize={4}
            />
          }
        >
          Templates
        </MenuButton>
        <MenuList
          p={0}
          w={{ base: 350, md: 500, lg: 550, xl: 650 }}
          placement='bottom-start'
        >
          <Stack gap={0}>
            <HStack gap={0}>
              <CustomSummaryMenuHeader
                icon={
                  <Box
                    position='relative'
                    display='inline'
                    pl={3}
                    pt={1}
                  >
                    <TagLeftIcon
                      m={0}
                      boxSize={30}
                      color='brandPrimary.primary'
                      as={SFBookPagesOutlinedIcon}
                    />
                    <Box
                      position='absolute'
                      bottom='0'
                      right='0'
                      width='12px'
                      height='12px'
                      bgColor='brandPrimary.onPrimary'
                      display='inline'
                      m={0}
                      p={0}
                      borderRadius={50}
                    >
                      <Icon
                        as={SFPlusCircleFilledIcon}
                        color='brandPrimary.primary'
                        boxSize={4}
                        position='absolute'
                        top='-1px'
                        left='-1px'
                        m={0}
                      />
                    </Box>
                  </Box>
                }
                heading='Create a template'
                subtext='Chat with FORA to build a template for this and similar meetings.'
              />
              <Spacer />
              <Button
                fontWeight={500}
                fontSize='xs'
                variant='reskinPrimary'
                w={150}
                mr={3}
                onClick={showChatHandler}
              >
                Chat to Create
              </Button>
            </HStack>
            <Divider hidden={noCustomSummaries} />
            <Stack
              gap={0}
              hidden={noCustomSummaries}
            >
              <HStack gap={0}>
                <CustomSummaryMenuHeader
                  icon={
                    <Box
                      position='relative'
                      display='inline'
                      pl={3}
                      pt={1}
                    >
                      <TagLeftIcon
                        m={0}
                        boxSize={30}
                        color='brandPrimary.primary'
                        as={SFBookPagesOutlinedIcon}
                      />
                    </Box>
                  }
                  heading='Apply a template'
                  subtext='Use a saved template to quickly format your meeting summary.'
                />
                <Spacer />
                <Button
                  fontWeight={500}
                  fontSize='xs'
                  variant='reskinOutline'
                  colorScheme='surface'
                  w={150}
                  mr={3}
                  onClick={() => navigate('/settings/manage-templates?templatesSort=1|desc')}
                >
                  {useBreakpointValue({ base: 'Manage', sm: 'Manage Templates' })}
                </Button>
              </HStack>
              <Box
                w='full'
                pl={3}
                pt={1}
                pb={3}
                pr={3}
              >
                <Box w='full'>
                  {visibleLenses?.map((lens) => (
                    <CustomSummaryPill
                      key={lens?.id}
                      size='sm'
                      lens={lens}
                      meeting={meeting}
                      disclosure={menuDisclosure}
                    />
                  ))}

                  {filteredLenses?.length > MAX_VISIBLE_TEMPLATES && (
                    <Button
                      size='xs'
                      onClick={() => setShowAll(!showAll)}
                      variant='link'
                      color='brandPrimary.primary'
                      px={2}
                      m={1}
                    >
                      {showAll ? 'View Less' : 'View More'}
                    </Button>
                  )}
                </Box>
              </Box>
            </Stack>
          </Stack>
        </MenuList>
      </Menu>
      {showCustomSummaryChat ? (
        <CustomSummaryChat
          initialSourceData={initialSourceData}
          setShowCustomSummaryChat={setShowCustomSummaryChat}
        />
      ) : (
        ''
      )}
    </Box>
  );
}
