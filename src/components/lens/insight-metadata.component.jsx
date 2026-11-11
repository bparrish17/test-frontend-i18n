import React from 'react';
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Spacer,
  Stack,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react';
import { InfoIcon } from '@assets/icons';
// import { Link as ReactRouterLink } from 'react-router-dom';
import { useUserStore } from '@store/app.store';
import { useFullCards } from '@util/hooks/index.js';
import { SOURCE_TYPE_TO_LOGO_MAP } from '@util/constants';
import { mapValues, uniq, values } from 'lodash-es';
import { useTranslation } from 'react-i18next';

function InsightMetadata({ insight }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const sources = insight?.sources || {};
  const { fullCards } = useFullCards(insight);

  const sourceTypes = mapValues(fullCards ?? {}, (card) => {
    if (card?.source === 'Channel') {
      return card.source_data?.source || 'Channel';
    }
    return card?.sub_source || '';
  });

  const scrollToSources = () => {
    const sourcesTab = document.getElementById('insight-sources');
    if (sourcesTab) {
      sourcesTab.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <VStack
      borderRadius='lg'
      border='reskin'
      gap={0}
    >
      <Stack
        borderTopRadius='lg'
        padding='12px 24px'
        background='#FEFFFF'
        width='100%'
        direction='row'
        justify='flex-start'
        align='center'
      >
        <Avatar
          src={user?.avatar_url}
          size='md'
          width={11}
          height={11}
          mr={2}
        />
        <Stack
          justify='center'
          align='flex-start'
          spacing='2px'
        >
          <Text variant='title-lighter-md'>
            {t('insightMetadata.foraInsightFor', { name: insight?.person?.name })}
          </Text>
        </Stack>
        <Spacer />
        <Tooltip label={t('insightMetadata.thisInsightPageHas')}>
          <span>
            <Button
              variant='ghost'
              leftIcon={
                <InfoIcon
                  color='surface.outline'
                  style={{ transform: 'scale(1.3)' }}
                />
              }
              p={0}
              minW='auto'
              h='auto'
              sx={{
                _hover: {
                  background: 'none'
                }
              }}
            />
          </span>
        </Tooltip>
      </Stack>
      <Stack
        borderBottomRadius='lg'
        paddingX='24px'
        paddingY='12px'
        direction='row'
        justify='space-between'
        align='center'
        overflow='hidden'
        alignSelf='stretch'
        background='brandPrimary.container'
      >
        <Stack
          direction='row'
          justify='flex-start'
          align='center'
          spacing='12px'
        >
          <Flex
            gap='3'
            maxWidth='116px'
            height='28px'
          >
            {uniq(values(sourceTypes))
              .slice(0, 3)
              .map((sourceType) => {
                const Logo = SOURCE_TYPE_TO_LOGO_MAP[sourceType];
                if (!Logo) return null;

                // For Email or Earnings_Call, use Icon instead of Image
                if (sourceType === 'Email' || sourceType === 'Earnings_Call') {
                  return (
                    <Icon
                      as={Logo}
                      boxSize='6'
                      key={sourceType}
                    />
                  );
                }

                // For all other types, use Image
                return (
                  <Image
                    boxSize='6'
                    src={Logo}
                    alt={`${sourceType} logo`}
                    key={sourceType}
                  />
                );
              })}
          </Flex>

          <Stack
            justify='center'
            align='flex-start'
            spacing='0px'
          >
            <Text
              variant='body-500-md'
              color='brandPrimary.onContainer'
              cursor='pointer'
              onClick={scrollToSources}
              _hover={{
                textDecoration: 'underline'
              }}
            >
              {t('insightMetadata.sources', { count: sources?.length ?? 0 })}
            </Text>
          </Stack>
        </Stack>
        <Spacer />
        {/*<Menu>*/}
        {/*  <MenuButton*/}
        {/*    as={IconButton}*/}
        {/*    variant='reskinGhost'*/}
        {/*    colorScheme='surface'*/}
        {/*    size='reskinMd'*/}
        {/*    px={1.5}*/}
        {/*    isRound*/}
        {/*    icon={*/}
        {/*      <Icon*/}
        {/*        as={HorizontalDotMenuIcon}*/}
        {/*        color='brandPrimary.primary'*/}
        {/*        boxSize={5}*/}
        {/*      />*/}
        {/*    }*/}
        {/*  />*/}
        {/*  <MenuList>*/}
        {/*    <MenuItem*/}
        {/*      as={ReactRouterLink}*/}
        {/*      to='/settings/prompts'*/}
        {/*      icon={<SFSquareAndPencil />}*/}
        {/*    >*/}
        {/*      Edit Lens Settings*/}
        {/*    </MenuItem>*/}
        {/*  </MenuList>*/}
        {/*</Menu>*/}
      </Stack>
    </VStack>
  );
}

export default InsightMetadata;
