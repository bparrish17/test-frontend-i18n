import {
  Stack,
  Text,
  Image,
  Box,
  AspectRatio,
  Skeleton,
  Spacer,
  IconButton,
  HStack
} from '@chakra-ui/react';
import { memo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { useMeetingPageStore } from '@store/app.store';
import { formatVideoTime } from '@util/helpers/datetime.helpers';
import { useBreakpointValue, useMeetingManagementActions } from '@util/hooks';
import { ForaLogoWhite } from '@assets/images';
import { SFPlayFilled } from '@assets/icons';
import VideoModal from '@components/general/modals/video-modal.component';
import { useTranslation } from 'react-i18next';

function VideoThumbnail({ meeting, bot, thumbnailQueryResult, ...props }) {
  const { t } = useTranslation();

  const {
    data: videoThumbnailData,
    isLoading: isVideoThumbnailLoading,
    isError: isVideoThumbnailError
  } = thumbnailQueryResult || { data: {}, isLoading: false, isError: false };
  const [, setSearchParams] = useSearchParams();
  const hasVideoUrlInMeeting = !!meeting?.videoUrl;

  // fetch time from URL
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const time = urlParams.get('time') || 0;

  const { showViewVideoButton, onViewVideoClick } = useMeetingManagementActions(meeting, bot);
  const videoDisclosure = useMeetingPageStore((state) => state.videoDisclosure);
  const openVideoInNewWindow = useBreakpointValue({ base: true, lg: false });

  const insufficentData = !meeting || !bot || (!hasVideoUrlInMeeting && !videoThumbnailData);

  if (
    !showViewVideoButton ||
    insufficentData ||
    isVideoThumbnailError ||
    (!videoThumbnailData && !isVideoThumbnailLoading)
  ) {
    return null;
  }

  if (isVideoThumbnailLoading) {
    return (
      <AspectRatio
        ratio={16 / 9}
        {...props}
      >
        <Skeleton
          w='full'
          rounded='lg'
        />
      </AspectRatio>
    );
  }

  const { thumbnail, videoDuration } = videoThumbnailData;

  if (!thumbnail) {
    return null;
  }

  return (
    <>
      <AspectRatio
        onClick={() => {
          setSearchParams({ time }, { replace: true });
          openVideoInNewWindow ? onViewVideoClick() : videoDisclosure.onOpen(bot?.id);
        }}
        ratio={16 / 9}
        {...props}
      >
        <Box
          userSelect='none'
          role='group'
          position='relative'
          w='full'
          h='auto'
          rounded='lg'
          _hover={{
            cursor: 'pointer'
          }}
        >
          <Box
            position='absolute'
            top='30%'
            left={0}
            h='70%'
            w='full'
            bgGradient='linear(to-t, #02030677, #02030600)'
          />
          <Box
            position='absolute'
            top={0}
            left={0}
            h='full'
            w='full'
            bgColor='#1D4ED8'
            mixBlendMode='multiply'
          />
          <Image
            mixBlendMode='multiply'
            opacity={0.5}
            src={thumbnail}
            alt={t('videoThumbnail.videoThumbnailAlt')}
            w='full'
          />
          <Stack
            p={{ base: 4, md: 2, lg: 3, xl: 4 }}
            position='absolute'
            top={0}
            left={0}
            w='full'
            h='full'
          >
            <IconButton
              position='absolute'
              top='50%'
              left='50%'
              transform='translate(-50%, -50%)'
              isRound
              icon={<SFPlayFilled />}
              bgColor='blackAlpha.600'
              _groupHover={{
                bgColor: 'brandPrimary.primary'
              }}
            />
            <Image
              pointerEvents='none'
              w='30%'
              maxW='67px'
              src={ForaLogoWhite}
              alt={t('videoThumbnail.foraLogoAlt')}
            />
            <Spacer />
            <HStack
              align='end'
              pointerEvents='none'
            >
              <Text
                noOfLines={2}
                lineHeight={1}
                fontSize={{ base: 'xl', md: 'md', lg: 'lg', xl: 'xl', '2xl': '2xl' }}
                color='white'
                fontWeight={600}
              >
                {meeting.title}
              </Text>
              <Spacer />
              <Text
                color='brandPrimary.onPrimary'
                fontSize='xs'
                bgColor='blackAlpha.600'
                px={1.5}
                py={0.5}
                rounded='md'
                minW='fit-content'
              >
                {formatVideoTime(time, videoDuration)}
              </Text>
            </HStack>
          </Stack>
        </Box>
      </AspectRatio>
      {videoDisclosure.isOpen && (
        <VideoModal
          meeting={meeting}
          bot={bot}
          disclosure={videoDisclosure}
        />
      )}
    </>
  );
}

export default memo(VideoThumbnail);
