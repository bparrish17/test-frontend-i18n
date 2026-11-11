import { AnimatePresence } from 'framer-motion';
import { MotionBox } from './motion-box.component';

export default function ContentFadeSwitcher({
  flag,
  contentIfTrue,
  contentIfFalse,
  duration = 0.1
}) {
  return (
    <AnimatePresence exitBeforeEnter>
      {flag ? (
        <MotionBox
          key='trueContent'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          {contentIfTrue}
        </MotionBox>
      ) : (
        <MotionBox
          key='falseContent'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          wait
        >
          {contentIfFalse}
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
