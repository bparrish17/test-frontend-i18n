import { HStack, Spacer } from '@chakra-ui/react';
import ReskinCalendar from './reskin-calendar.component';

/**
 * @typedef {Object} ReskinMobileStickyNavProps
 * @property {React.ReactNode} children
 * @property {Date | number} date
 * @property {Function} setDate
 * @property {boolean} [showCalendar=true]
 *
 *
 * @param {ReskinMobileStickyNavProps} props
 */
export default function ReskinMobileStickyNav({ children, date, setDate, showCalendar = true }) {
  return (
    <HStack
      bgColor='brandPrimary.primary'
      position='sticky'
      top='-1px'
      p={3}
      borderTop='1px solid'
      borderColor='#0F3CA8'
      zIndex='sticky'
    >
      {children}
      <Spacer />
      {showCalendar && (
        <ReskinCalendar
          date={date ?? null}
          setDate={setDate}
          triggerProps={{ color: 'white' }}
        />
      )}
    </HStack>
  );
}
