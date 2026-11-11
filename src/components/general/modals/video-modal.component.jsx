import {
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  Stack,
  Box,
  HStack,
  IconButton,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  Fade,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Popover,
  PopoverTrigger,
  PopoverContent,
  CircularProgress
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import ReactPlayer from 'react-player';

import { useBotVideoUrl, useDownloadVideo } from '@services/query-services/bots.query-service';
import { useBreakpointValue, useMeetingBotStatuses } from '@util/hooks';
import { formatVideoTime } from '@util/helpers';
import {
  SFCollapseVideo,
  SFDownloadOutlined,
  SFExpandVideo,
  SFPauseFilled,
  SFPlayFilled,
  SFVolume,
  SFVolumeMute
} from '@assets/icons';
import VideoModalTranscript from '@components/general/modals/video-modal-transcript.component';
import { useTranslation } from 'react-i18next';

// temporary for non-existent dark mode color tokens used in design
const darkSurface = '#1c2736';

const controlBarButtonProps = {
  size: 'xs',
  variant: 'ghost',
  isRound: true,
  colorScheme: 'surface',
  _hover: { opacity: 0.7 }
};

export default function VideoModal({ meeting, bot, disclosure }) {
  const { t } = useTranslation();

  const playerRef = useRef(null);
  const isReady = useRef(false);
  const [time, setTime] = useQueryParam('time', withDefault(NumberParam, 0));
  const [duration, setDuration] = useQueryParam('duration', withDefault(NumberParam, 0));
  const defaultIsFullscreen = useBreakpointValue({ lg: true, xl: false });
  const hasVideoUrlInMeeting = !!meeting?.videoUrl;
  const { data: video } = useBotVideoUrl(bot?.id, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
    enabled: !hasVideoUrlInMeeting
  });

  // Use videoUrl from meeting if available, otherwise from the API response
  const videoUrl = meeting?.videoUrl || video?.url;

  const { wasSummarized } = useMeetingBotStatuses(bot);
  const [playing, setPlaying] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [lastPositiveVolume, setLastPositiveVolume] = useState(0.8); // for unmuting back to original volume
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(defaultIsFullscreen);
  const { downloading, downloadProgress, download } = useDownloadVideo();

  useEffect(() => {
    // if selecting a time from transcript, meeting page will provide time value in nav bar
    // once video and ref are available, jump to that spot in the meeting
    if (time && videoUrl && isReady?.current) {
      handleTimeClick(time);
    }
  }, [videoUrl, isReady?.current]);

  const handlePausePlayClick = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setTime(Math.floor(state?.playedSeconds), 'replaceIn');
    }
  };

  const handleSeekChangeStart = () => {
    setSeeking(true);
  };

  const handleSeekChange = (value) => {
    setTime(Math.floor((value / 100) * duration), 'replaceIn');
  };

  const handleSeekChangeEnd = (value) => {
    setSeeking(false);
    playerRef?.current?.seekTo(value / 100);
  };

  const handleVolumeChange = (value) => {
    const newVolume = value / 100;
    setVolume(newVolume);
    if (value > 0) {
      setLastPositiveVolume(newVolume);
    }
  };

  const handlePlaybackRateChange = (newRate) => {
    setPlaybackRate(newRate);
  };

  const handleTimeClick = (time) => {
    playerRef?.current?.seekTo(time);
    setPlaying(true);
  };

  // keeping padding at a 0.5625 ensures the aspect ratio of the video is preserved regardless of page width
  const fullscreenPx = useMemo(() => {
    const ratio = (window.innerHeight - 48) / window.innerWidth; // adjust for control bar height
    const videoRatio = 0.5625;
    const px = videoRatio - ratio;
    return px > 0 ? `${px * 100}%` : 'unset';
  }, [window.innerHeight, window.innerWidth]);

  return (
    <Modal
      isOpen={disclosure?.isOpen}
      onClose={() => {
        setIsFullscreen(false);
        disclosure.onClose();
      }}
      size={isFullscreen ? 'full' : undefined}
    >
      {/* bgColor: light_material.1000 @ 90%  */}
      <ModalOverlay
        bgColor='rgba(17, 22, 31, 0.9)'
        opacity={0.9}
      />
      <ModalContent
        minW={wasSummarized ? '85vw' : '65vw'}
        h={isFullscreen ? '100vh' : '80vh'}
        display='flex'
        flexDir='row'
        borderRadius='lg'
      >
        <Stack
          gap={0}
          flex={{ base: 2, '3xl': 3 }}
        >
          <Box
            flex={1}
            bgColor='black'
            borderTopLeftRadius='lg'
            borderTopRightRadius={!wasSummarized && 'lg'}
            position='relative'
            w='auto'
            h='auto'
            px={!wasSummarized && isFullscreen && fullscreenPx}
            maxH='calc(100vh - 48px)'
            __css={{
              'div > video': {
                position: 'absolute',
                marginTop: 'auto',
                top: 0,
                left: 0,
                borderTopLeftRadius: 'inherit',
                borderTopRightRadius: !wasSummarized && 'inherit'
              }
            }}
          >
            <ReactPlayer
              ref={playerRef}
              style={{
                borderTopLeftRadius: 'inherit',
                paddingTop: '56.25%',
                position: 'relative'
              }}
              width='100%'
              height='100%'
              url={videoUrl}
              volume={volume}
              playbackRate={playbackRate}
              playing={playing}
              onProgress={handleProgress}
              onDuration={(v) => setDuration(Math.floor(v), 'replaceIn')}
              onReady={() => {
                isReady.current = true;
              }}
            />
            <Fade in={!playing}>
              <Box
                w='100%'
                h='100%'
                borderTopLeftRadius='lg'
                position='absolute'
                bgColor='rgb(0 0 0 / 65%)'
                top={0}
                left={0}
              >
                <Stack
                  gap='3px'
                  mx={6}
                  my={6}
                >
                  <Text
                    fontSize='lg'
                    color='surface.surface'
                  >
                    {meeting?.title}
                  </Text>
                  <Text
                    fontSize='13px'
                    color='surface.outline'
                  >
                    {format(meeting?.start_at, 'eeee, MMMM d')}
                  </Text>
                </Stack>
              </Box>
            </Fade>
          </Box>
          <Box
            position='relative'
            h={1}
          >
            <Slider
              top={-4}
              p={0}
              value={(time / duration) * 100}
              onChange={handleSeekChange}
              onChangeStart={handleSeekChangeStart}
              onChangeEnd={handleSeekChangeEnd}
            >
              <SliderTrack
                zIndex={2}
                bgColor='transparent'
                borderRadius='none'
              >
                <SliderFilledTrack borderRadius='none' />
              </SliderTrack>
              <SliderThumb
                zIndex={2}
                w={3}
                h={3}
              />
            </Slider>
          </Box>
          <HStack
            h={12}
            px={6}
            bgColor={darkSurface}
            color='surface.surface'
            borderBottomLeftRadius='7px' // idk why but the 8px/lg radius looks cut off on this :(
            borderBottomRightRadius={!wasSummarized && '7px'}
          >
            <IconButton
              {...controlBarButtonProps}
              icon={playing ? <SFPauseFilled /> : <SFPlayFilled />}
              onClick={handlePausePlayClick}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                {...controlBarButtonProps}
                icon={
                  <Text
                    as='span'
                    fontSize='sm'
                  >
                    {playbackRate}x
                  </Text>
                }
              />
              <MenuList minW='unset'>
                <MenuOptionGroup
                  title={t('videoModal.playbackSpeed')}
                  type='radio'
                  value={`${playbackRate}`}
                  onChange={handlePlaybackRateChange}
                >
                  <MenuItemOption value='0.5'>0.5</MenuItemOption>
                  <MenuItemOption value='0.75'>0.75</MenuItemOption>
                  <MenuItemOption value='1'>{t('videoModal.normal')}</MenuItemOption>
                  <MenuItemOption value='1.25'>1.25</MenuItemOption>
                  <MenuItemOption value='1.5'>1.5</MenuItemOption>
                  <MenuItemOption value='2'>2</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Box w={6} />
            <Spacer />
            <Flex
              gap={1}
              color='surface.outline'
            >
              <Text color='surface.surface'>{formatVideoTime(time, duration)}</Text>
            </Flex>
            <Spacer />
            <Popover
              returnFocusOnClose={false}
              placement='top'
              closeOnBlur={false}
              trigger='hover'
            >
              <PopoverTrigger>
                <IconButton
                  {...controlBarButtonProps}
                  mt={0.5}
                  icon={volume === 0 ? <SFVolumeMute boxSize={4} /> : <SFVolume boxSize={4} />}
                  onClick={() => setVolume(volume === 0 ? lastPositiveVolume : 0)}
                />
              </PopoverTrigger>
              <PopoverContent
                w='unset'
                px={2}
                py={4}
                borderRadius='full'
                bgColor={darkSurface}
                border='none'
              >
                <Slider
                  orientation='vertical'
                  p={0}
                  minH={32}
                  value={volume * 100}
                  onChange={handleVolumeChange}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb
                    w={3}
                    h={3}
                  />
                </Slider>
              </PopoverContent>
            </Popover>
            <IconButton
              {...controlBarButtonProps}
              mb={!downloading && 0.5}
              icon={<SFDownloadOutlined />}
              isLoading={downloading}
              _disabled={downloading && { opacity: 1 }}
              spinner={
                <CircularProgress
                  value={downloadProgress}
                  size={4}
                />
              }
              onClick={() =>
                download(videoUrl, `${meeting?.title}_${format(meeting?.start_at, 'P')}`)
              }
            />
            <IconButton
              {...controlBarButtonProps}
              icon={isFullscreen ? <SFCollapseVideo /> : <SFExpandVideo />}
              onClick={() => setIsFullscreen(!isFullscreen)}
            />
          </HStack>
        </Stack>

        {/* transcript */}
        {wasSummarized && (
          <VideoModalTranscript
            meeting={meeting}
            bot={bot}
            progress={time}
            duration={duration}
            onTimeClick={handleTimeClick}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
