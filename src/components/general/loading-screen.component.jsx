import React, { useEffect, useRef, useState, memo } from 'react';
import { Heading, Image, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ForaLogoWhite } from '@assets/images';
import { MotionBox } from './motion-box.component';

const LoadingScreen = ({ title }) => {
  const titleRef = useRef();
  const [isTitleEllipsisPresent, setIsTitleEllipsisPresent] = useState(false);

  useEffect(() => {
    const checkForEllipsis = () => {
      const element = titleRef.current;
      if (!element) return;

      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.fontSize = window.getComputedStyle(element).fontSize;
      span.style.fontFamily = window.getComputedStyle(element).fontFamily;
      span.style.fontWeight = window.getComputedStyle(element).fontWeight;
      span.style.whiteSpace = 'nowrap';
      span.innerText = title || '';

      document.body.appendChild(span);
      const textWidth = span.offsetWidth;
      document.body.removeChild(span);

      const containerWidth = element.offsetWidth;
      const hasEllipsis = textWidth > containerWidth;

      setIsTitleEllipsisPresent(hasEllipsis);
    };

    const timeoutId = setTimeout(checkForEllipsis, 50);

    window.addEventListener('resize', checkForEllipsis);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkForEllipsis);
    };
  }, [title, titleRef?.current]);

  return (
    <MotionBox
      data-testid='loading-screen'
      pos='relative'
      display='flex'
      alignItems='center'
      justifyContent='center'
      h='full'
      w='full'
      willChange='opacity'
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{
          position: 'relative',
          width: '96px',
          height: '96px',
          borderRadius: '24px',
          padding: '0 12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 4
          }}
          style={{
            willChange: 'transform',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(#0F3CA8 26%, #1353EC 51%, #7E5EFF 100%)',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            zIndex: 0
          }}
        />
        <Image
          src={ForaLogoWhite}
          alt='fora brand logo'
          zIndex={2}
        />
      </motion.div>
      <VStack
        w='full'
        pos='absolute'
        bottom={12}
        px={3}
      >
        <Text
          variant='label-md'
          textTransform='uppercase'
          color='surface.outline'
        >
          Loading
        </Text>
        <MotionBox
          display='flex'
          justify='center'
          align='center'
          minH={11}
          initial={{ opacity: 0 }}
          animate={{ opacity: title ? 1 : 0 }}
          transition='0.3s'
        >
          <Heading
            ref={titleRef}
            h='fit-content'
            maxW='540px'
            textAlign='center'
            fontSize='md'
            noOfLines={2}
            color='surface.onSurfaceVariant'
            mr={isTitleEllipsisPresent ? 2 : 0}
          >
            {title}
          </Heading>
        </MotionBox>
      </VStack>
    </MotionBox>
  );
};

export default memo(LoadingScreen);
