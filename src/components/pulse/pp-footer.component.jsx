import { Flex, Text, LinkOverlay, Button } from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { get } from 'lodash-es';
import { usePulseStore } from '@store/pulse.store';
import { useDocumentVisibility } from 'ahooks/es';
import { useEffect } from 'react';
import { useBreakpoints } from '@util/hooks/index.js';

function PulsePanelFooter({
  anchor,
  panel,
  variant = 'dark',
  ctaText,
  countPath,
  countLabel = 'Items'
}) {
  const firstTextColor = variant === 'dark' ? '#789DF1' : '#123790';
  const nextTextColor = variant === 'dark' ? '#A6B3C4' : '#516179';
  const count = get(panel, countPath, 0);
  const { isMobile } = useBreakpoints();
  const documentVisibility = useDocumentVisibility();
  const setIsPaused = usePulseStore((state) => state.setIsPaused);

  useEffect(() => {
    if (documentVisibility === 'hidden') {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [documentVisibility, setIsPaused]);

  const inner = (
    <>
      <Text
        variant='body-sm'
        color={firstTextColor}
        textAlign='center'
      >
        {ctaText}
      </Text>
      <Text
        pb={2}
        variant='label-lg'
        color={nextTextColor}
        textAlign='center'
      >
        {' '}
        {count} {countLabel}
      </Text>
      <Flex
        marginBottom='10px'
        justifyContent='center'
        alignItems='center'
      >
        {isMobile && <FaChevronDown color={nextTextColor} />}
      </Flex>
    </>
  );

  return (
    <Flex
      onClick={() => setIsPaused(true)}
      zIndex='overlay'
      justifyContent='center'
      alignItems='center'
    >
      {isMobile ? (
        <LinkOverlay
          isExternal
          href={`/meeting/${panel?.source_data?.id}#${anchor}`}
        >
          {inner}
        </LinkOverlay>
      ) : (
        <Button
          height='58px'
          borderRadius='16px'
          bg='rgba(103, 123, 152, 0.15)'
          display='flex'
          flexDirection='column'
          pt='14px'
          mb='24px'
          onClick={() => {
            // include query params if needed
            if (anchor.includes('?')) {
              window.open(`/meeting/${panel?.source_data?.id}${anchor}`, '_blank');
            } else {
              window.open(`/meeting/${panel?.source_data?.id}#${anchor}`, '_blank');
            }
          }}
        >
          {inner}
        </Button>
      )}
    </Flex>
  );
}

export default PulsePanelFooter;
