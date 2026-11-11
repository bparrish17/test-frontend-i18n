import { ChevronLeftIcon, ChevronRightIcon } from '@assets/icons';
import { Box, HStack, IconButton, Stack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useTranslation } from 'react-i18next';

const paginatorIconBtnProps = {
  variant: 'ghost',
  size: 'xs',
  color: 'brandPrimary.primary',
  rounded: 'full',
  fontSize: 'md'
};

const InsightCarousel = ({ children }) => {
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const itemsPerPage = useBreakpointValue({ base: 1, md: 2 });

  const totalPages = Math.ceil(children.length / itemsPerPage);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalPages - 1));
  };

  const getVisibleChildren = () => {
    const start = currentIndex * itemsPerPage;
    return children.slice(start, start + itemsPerPage);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <VStack
      spacing={4}
      width='full'
      {...swipeHandlers}
    >
      <Box
        position='relative'
        width='full'
        overflow='hidden'
      >
        <AnimatePresence
          initial={false}
          custom={direction}
          exitBeforeEnter
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <Stack>
              {getVisibleChildren().map((child, index) => (
                <VStack
                  key={index}
                  flex='1'
                  width='full'
                  spacing={4}
                >
                  {child}
                </VStack>
              ))}
            </Stack>
          </motion.div>
        </AnimatePresence>
      </Box>
      <HStack
        spacing={4}
        alignItems='center'
        fontSize='sm'
        fontWeight={500}
        color='brandPrimary.primary'
        textStyle='aeonik'
        alignSelf='flex-end'
      >
        <IconButton
          aria-label={t('insightCarousel.previousAriaLabel')}
          icon={<ChevronLeftIcon />}
          onClick={handlePrev}
          isDisabled={currentIndex === 0}
          {...paginatorIconBtnProps}
        />
        <Text
          as='span'
          variant='aeonik'
        >
          {currentIndex + 1} of {totalPages}
        </Text>
        <IconButton
          aria-label={t('insightCarousel.nextAriaLabel')}
          icon={<ChevronRightIcon />}
          onClick={handleNext}
          isDisabled={currentIndex >= totalPages - 1}
          {...paginatorIconBtnProps}
        />
      </HStack>
    </VStack>
  );
};

export default InsightCarousel;
