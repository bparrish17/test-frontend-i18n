import { ExclamationCircleIcon, ExpandIcon, SFLensIcon } from '@assets/icons';
import {
  Box,
  Divider,
  HStack,
  Icon,
  Stack,
  TagLeftIcon,
  TagRightIcon,
  Text,
  VStack
} from '@chakra-ui/react';
import { useMemo, memo, useState } from 'react';
import { useStatsigClient } from '@statsig/react-bindings';

import { ICON_MAPPING } from '@util/constants';
import SectionHeader from '@components/meeting/section-header.component';
import SourceModal from '@components/general/modals/source-modal.component';
import SourceModalHeader from '@components/general/modals/source-modal-header.component';
import SourceModalSubheader from '@components/general/modals/source-modal-subheader.component';
import { useTranslation } from 'react-i18next';

export default function RelevantLenses({ cards }) {
  const { t } = useTranslation();

  const [maxLenses, setMaxLenses] = useState(4);
  const cardsSlice = useMemo(() => cards?.slice(0, maxLenses), [cards, maxLenses]);

  return (
    <Stack
      layerStyle='section-card'
      pb={10}
      gap={0}
    >
      <SectionHeader
        headline='Insights from FORA Lenses'
        icon={SFLensIcon}
      />
      <Box
        display='flex'
        width='100%'
        px={11}
        py={4}
        alignItems='center'
        gap={2}
      >
        <Text
          variant='content-section-header'
          textTransform='uppercase'
          letterSpacing={3}
          fontWeight='400'
          whiteSpace='nowrap'
        >
          {`Relevant Lens${cards.length === 1 ? '' : 'es'}`}
        </Text>
        <Divider m={3} />
      </Box>

      <Box
        display='grid'
        gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        px={11}
        gap={5}
      >
        {cardsSlice.map((card) => {
          return (
            <SourceModal
              card={card}
              key={card?.initiative?.id}
              headerContent={<SourceModalHeader card={card} />}
              subheaderContent={<SourceModalSubheader card={card} />}
            >
              <LensBox card={card} />
            </SourceModal>
          );
        })}
      </Box>

      {cards?.length > maxLenses && (
        <Text
          onClick={() => setMaxLenses(undefined)}
          mt={10}
          mx='auto'
          color='brandPrimary.primary'
          cursor='pointer'
        >
          {t('relevantLenses.viewMore')}
        </Text>
      )}
    </Stack>
  );
}

// the onClick below isn't passed in as a prop but is required to open the SourceModal. No idea why
const LensBox = memo(({ card, onClick }) => {
  const initiativeIcon = card?.initiative?.icon || 'lens';
  const { checkGate } = useStatsigClient();
  const enableHighPriority = checkGate('high-priority-cards');
  const isHighPriority = !!card?.high_priority;

  return (
    <Box
      onClick={onClick}
      bgColor='brandPrimary.primary'
      p={4}
      borderRadius={20}
      color='brandPrimary.onPrimary'
      cursor='pointer'
      transition='300ms ease-in-out'
      _hover={{ bgColor: 'brandPrimary.primaryDim' }}
    >
      <VStack
        justifyContent='space-between'
        h='100%'
        role='group'
      >
        <HStack
          justifyContent='space-between'
          w='100%'
        >
          <Box
            position='relative'
            display='inline'
            p='7px'
            borderRadius={100}
            mr={1}
            bgColor='brandPrimary.primaryDim'
          >
            <TagLeftIcon
              m={0}
              boxSize='24px'
              color='brandPrimary.onPrimary'
              as={ICON_MAPPING[initiativeIcon]?.icon}
            />
            {enableHighPriority && isHighPriority && (
              <Box
                position='absolute'
                bottom='0'
                right='0'
                width='14px'
                height='14px'
                bgColor='surface.containerLowest'
                display='inline'
                m={0}
                p={0}
                borderRadius={50}
              >
                <Icon
                  as={ExclamationCircleIcon}
                  color='brandTertiary.primary'
                  boxSize={4}
                  position='absolute'
                  top='-1px'
                  left='-1px'
                  m={0}
                />
              </Box>
            )}
          </Box>
          <Text
            flexGrow='1'
            fontWeight={600}
            fontSize='16px'
            mr='auto'
          >
            {card?.initiative?.title || ''}
          </Text>
          <TagRightIcon
            as={ExpandIcon}
            opacity='0.5'
            transition='300ms ease-in-out'
            _groupHover={{ opacity: '1' }}
          />
        </HStack>
        <Text
          fontSize='14px'
          fontWeight='600'
          lineHeight='24px'
        >
          {card.headline}
        </Text>
      </VStack>
    </Box>
  );
});
