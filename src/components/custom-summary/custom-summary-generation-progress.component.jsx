import { Box, Button, Collapse, Heading, HStack, Progress, Stack, Text } from '@chakra-ui/react';
import { useMotionTemplate, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

import { MotionBox } from '@components/general/motion-box.component';
import { CustomSummaryStep } from './custom-summary-shared-ui.component';
import { useTranslation } from 'react-i18next';

export default function SummaryGenerationProgress({
  progress,
  setProgress,
  progressSpring,
  proceed,
  isGenerated,
  saveAndClose
}) {
  const { t } = useTranslation();

  // For smooth progress animation
  const progressWidth = useMotionTemplate`${progressSpring}%`;

  const [speedMod, setSpeedMod] = useState(0.04); // 0 < speedMod <= 1
  const [delayMod, setDelayMod] = useState(0.2);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const secondsToAllowSaveAndClose = 20;
  const [isSavingAndClosing, setIsSavingAndClosing] = useState(false);

  // Once progress reaches the key, the speed will be multiplied by the value (and delay divided by it)
  let thresholdMods = {
    10: 5,
    40: 0.8,
    42: 2,
    50: 2,
    70: 0.7,
    78: 2,
    90: 0.6,
    95: 0.9
  };

  // Randomize threshold mods
  Object.keys(thresholdMods).forEach((key) => {
    const offset = Math.random() - 0.5;
    const newKey = Math.floor(parseInt(key) + offset * 10).toString();
    if (key === newKey) {
      return;
    }

    thresholdMods = { ...thresholdMods, [newKey]: thresholdMods[key] + offset };
    delete thresholdMods[key];
  });

  const thresholdSeen = new Map();

  useEffect(() => {
    if (progressSpring >= 99) {
      return;
    }

    progressSpring.set(progress);

    // Intervals are constantly changing
    const delayMs = Math.random() * 3000 * delayMod;
    const interval = setInterval(() => {
      const progressInt = Math.floor(progress);

      // Apply threshold mods only when the progress reaches the key for the first time
      if (thresholdMods[progressInt] && !thresholdSeen.has(progressInt)) {
        setSpeedMod(speedMod * thresholdMods[progressInt]);
        setDelayMod(delayMod / thresholdMods[progressInt]);
        thresholdSeen.set(progressInt, true);
      }

      // Slows down as it approaches 100%
      const increment = Math.random() * (100 - progress) * speedMod;
      setProgress(Math.min(progress + increment, 100));
    }, delayMs);

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    if (isGenerated) {
      proceed();
    }
  }, [isGenerated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Additional increment?
  useEffect(() => {
    const interval = setInterval(() => {
      if (progressSpring.get() >= 99) {
        clearInterval(interval);
        return;
      }

      setSpeedMod(speedMod * 2);
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CustomSummaryStep>
      <Text
        fontWeight={600}
        fontSize='lg'
      >
        {t('customSummaryGenerationProgress.generatingSummary')}
      </Text>
      <Text
        color='surface.onSurfaceVariant'
        lineHeight='10'
      >
        FORA is generating your personal summary for you. <br /> This typically takes 10 seconds to
        a few minutes.
      </Text>
      <Box
        rounded='full'
        w='full'
        bgColor='brandPrimary.container'
      >
        <MotionBox style={{ width: progressWidth }}>
          <Progress
            size='md'
            hasStripe
            isAnimated
            value={100}
            rounded='full'
            colorScheme='brand_blue'
          />
        </MotionBox>
      </Box>
      <Collapse in={secondsElapsed >= secondsToAllowSaveAndClose}>
        <HStack
          justify='space-between'
          bgColor='brandPrimary.container'
          rounded='lg'
          p={4}
        >
          <Text color='brandPrimary.onContainer'>
            {t('customSummaryGenerationProgress.thisIsTakingLonger')}
          </Text>
          <Button
            isLoading={isSavingAndClosing}
            minW='fit-content'
            variant='reskinPrimary'
            onClick={() => {
              setIsSavingAndClosing(true);
              saveAndClose();
            }}
          >
            {t('customSummaryGenerationProgress.saveClose')}
          </Button>
        </HStack>
      </Collapse>
    </CustomSummaryStep>
  );
}

export function ProgressBarTesting() {
  const { t } = useTranslation();

  const [instances, setInstances] = useState([0]);

  const addInstance = () => {
    setInstances([...instances, instances.length]);
  };

  const removeInstance = (index) => {
    setInstances(instances.filter((_, i) => i !== index));
  };

  return (
    <Stack gap={8}>
      <Heading size='lg'>{t('customSummaryGenerationProgress.progressBar')}</Heading>
      {instances.map((i) => (
        <Box
          key={i}
          position='relative'
        >
          <ProgressBarTestInstance />
          <Button
            position='absolute'
            top={2}
            right={2}
            size='sm'
            onClick={() => removeInstance(i)}
          >
            {t('customSummaryGenerationProgress.remove')}
          </Button>
        </Box>
      ))}
      <Button
        alignSelf='start'
        w='fit-content'
        onClick={addInstance}
      >
        {t('customSummaryGenerationProgress.addProgressBar')}
      </Button>
    </Stack>
  );
}

function ProgressBarTestInstance() {
  const { t } = useTranslation();

  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressSpring = useSpring(progress, { stiffness: 1000, damping: 100 });
  const [isGenerated, setIsGenerated] = useState(false);
  const proceed = () => {};
  const goBack = () => setIsGenerated(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (progressSpring.get() >= 99) {
        clearInterval(interval);
        return;
      }

      setElapsed(elapsed + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [elapsed]);

  return (
    <Stack>
      <HStack>
        <Text>elapsed: {elapsed.toFixed(2)}s</Text>
        <Text>progress: {progress.toFixed(2)}</Text>
        <Text>progressSpring: {progressSpring.get().toFixed(2)}</Text>
        <Text>
          isGenerated:{' '}
          {isGenerated
            ? t('customSummaryGenerationProgress.true')
            : t('customSummaryGenerationProgress.false')}
        </Text>
        <Button
          onClick={() => setIsGenerated(!isGenerated)}
          variant='reskinOutline'
        >
          {t('customSummaryGenerationProgress.togglegenerated')}
        </Button>
      </HStack>
      <SummaryGenerationProgress
        progress={progress}
        setProgress={setProgress}
        progressSpring={progressSpring}
        proceed={proceed}
        goBack={goBack}
        isGenerated={isGenerated}
      />
    </Stack>
  );
}
