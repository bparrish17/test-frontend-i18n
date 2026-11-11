import { useState, useEffect } from 'react';
import { SFLensIcon, EyeIcon } from '@assets/icons';
import { Button, Stack, HStack, Icon, Text, SimpleGrid, Divider } from '@chakra-ui/react';
import StyledModal from '@components/general/modals/styled-modal.component';
import ReskinMeetingCard from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import Lottie from 'lottie-react';
import animation from '@assets/animations/lottie/home-page-empty-no-insights.json';
import { useTranslation } from 'react-i18next';

export default function PreviewLensSourcesModal({
  disclosure,
  isDisabled,
  generateSourcesPreview
}) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [previewSources, setPreviewSources] = useState([]);
  const animationContainerStyle = {
    height: '90px',
    width: '90px',
    marginLeft: '-18px'
  };

  useEffect(() => {
    // reskin todo: why pass this down from 3 layers above? Pretty sure this component can handle it
    async function getPreviewSources() {
      setIsLoading(true);
      const { data: preview } = await generateSourcesPreview();
      setPreviewSources(preview);
      setIsLoading(false);
    }
    if (!isDisabled && disclosure.isOpen) {
      getPreviewSources();
    }
    if (!disclosure.isOpen) {
      setPreviewSources([]);
    }
  }, [disclosure.isOpen]);

  return (
    <>
      <Button
        variant='reskinSecondary'
        size='reskinLg'
        colorScheme='brandPrimary'
        fontSize='md'
        fontWeight={600}
        isDisabled={isDisabled}
        onClick={disclosure.onOpen}
        leftIcon={
          <Icon
            as={EyeIcon}
            boxSize={5}
          />
        }
      >
        {t('previewLensSourcesModal.previewSources')}
      </Button>
      <StyledModal
        disclosure={disclosure}
        title={
          <HStack>
            <Icon
              as={SFLensIcon}
              color='white'
              boxSize={8}
            />
            <Text>{t('previewLensSourcesModal.previewLensSources')}</Text>
          </HStack>
        }
        modalProps={{ scrollBehavior: 'inside' }}
        modalContentProps={{ w: { base: '660px', '2xl': '900px' } }}
        modalBodyProps={{ p: '25' }}
        modalHeaderProps={{
          bgColor: 'brandPrimary.onContainer',
          color: 'brandPrimary.container'
        }}
        modalCloseButtonProps={{ color: 'brandPrimary.onPrimary' }}
      >
        <Stack>
          <Text>{t('previewLensSourcesModal.basedOnYourLens')}</Text>
          {!isLoading && <Divider />}
          {!isLoading && <Text fontWeight={700}>{t('previewLensSourcesModal.lensSources')}</Text>}
          <SimpleGrid
            columns={2}
            spacing={8}
          >
            {isLoading && (
              <Lottie
                animationData={animation}
                style={animationContainerStyle}
              />
            )}
            {previewSources.map((card) => (
              <ReskinMeetingCard
                key={card.id}
                meeting={card.source_data}
                enableControlBar={false}
                enableBody={false}
                enableParticipants={false}
              />
            ))}
            {!isLoading && !previewSources.length && (
              <Text>{t('previewLensSourcesModal.noGoodHistoricalMatches')}</Text>
            )}
          </SimpleGrid>
        </Stack>
      </StyledModal>
    </>
  );
}
