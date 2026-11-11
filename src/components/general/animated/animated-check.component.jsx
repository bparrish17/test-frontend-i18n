import { Center } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function AnimatedCheckIcon({ ...props }) {
  const [firstLineComplete, setFirstLineComplete] = useState(false);

  return (
    <Center {...props}>
      <motion.svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 12 12'
      >
        <motion.line
          fill='none'
          stroke='#3266E3'
          strokeWidth='2'
          strokeLinecap='square'
          x1='1.5'
          y1='6.5'
          x2='4'
          y2='9'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
          whileInView={{ pathLength: 1 }}
          onAnimationComplete={() => setFirstLineComplete(true)}
        />
        {firstLineComplete && (
          <motion.line
            fill='none'
            stroke='#3266E3'
            strokeWidth='2'
            strokeLinecap='square'
            x1='4'
            y1='9'
            x2='10.5'
            y2='2.5'
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            whileInView={{ pathLength: 0.8 }}
          />
        )}
      </motion.svg>
    </Center>
  );
}

export default () => <AnimatedCheckIcon />;
