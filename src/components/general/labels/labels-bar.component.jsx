import {
  Button,
  Collapse,
  Flex,
  HStack,
  Spacer,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { keyBy, sortBy } from 'lodash-es';

import { calculateVisibleLabelsCount } from '@util/helpers';
import { useUserStore } from '@store/app.store';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import Label from './label.component';
import LabelsModal from '../modals/labels-modal.component';
import { useTranslation } from 'react-i18next';

const buttonProps = {
  isRound: true,
  size: 'xs',
  variant: 'reskinGhost',
  colorScheme: 'surface',
  whiteSpace: 'nowrap'
};

const LabelsBar = ({ meeting, card, modalDisclosure, children }) => {
  const { t } = useTranslation();

  const user = useUserStore((state) => state?.user);
  const isGuest = user?.isGuest;
  const disclosure = useDisclosure();
  modalDisclosure = modalDisclosure ?? disclosure;
  const labels = sortBy(meeting?.labels ?? card?.labels ?? [], 'title');

  const selectLabels = useCallback((allLabels) => keyBy(allLabels, 'id'), []);

  const { data: allLabels } = useInitiatives(
    {
      type: 'Label',
      has_archived_at: false
    },
    { select: selectLabels }
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(labels.length);
  const containerRef = useRef();
  const resizeObserverRef = useRef();

  const calculateVisibleCount = useCallback(() => {
    return calculateVisibleLabelsCount({
      labels,
      containerRef
    });
  }, [labels.length, containerRef]);

  useEffect(() => {
    if (isExpanded) {
      setVisibleCount(labels.length);
      return;
    }

    if (labels.length === 0) {
      setVisibleCount(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      const newCount = calculateVisibleCount();
      setVisibleCount(newCount);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [labels.length, isExpanded, calculateVisibleCount]);

  const handleResize = useCallback(() => {
    if (isExpanded) return;

    const newCount = calculateVisibleCount();
    setVisibleCount(newCount);
  }, [calculateVisibleCount, isExpanded]);

  useEffect(() => {
    if (!containerRef.current || isExpanded) {
      return;
    }

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [handleResize, isExpanded]);

  const enrichedLabels = useMemo(
    () =>
      labels.map((label) => ({
        ...label,
        ...allLabels?.[label?.id]
      })),
    [labels, allLabels]
  );

  const hiddenCount = labels.length - visibleCount;

  if (isGuest) {
    return null;
  }

  return (
    <Stack
      w='full'
      p={2}
    >
      {labels?.length > 0 && (
        <Collapse
          in={isExpanded}
          startingHeight={24}
        >
          <Flex
            data-testid='labels-container'
            w='full'
            ref={containerRef}
            align='center'
            gap={2}
            flexWrap='wrap'
          >
            {enrichedLabels.map((label) => (
              <Label
                key={label?.id}
                label={label}
                match={label?.match}
              />
            ))}
          </Flex>
        </Collapse>
      )}

      <HStack minH={7}>
        {(isExpanded || hiddenCount > 0) && (
          <Button
            {...buttonProps}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Text variant='label-reg-md'>
              {isExpanded ? t('labelsBar.viewLess') : `+${hiddenCount} more`}
            </Text>
          </Button>
        )}

        <Button
          {...buttonProps}
          onClick={modalDisclosure?.onOpen}
        >
          <Text variant='label-reg-md'>
            {labels?.length > 0 ? t('labelsBar.editLabels') : t('labelsBar.addALabel')}
          </Text>
        </Button>
        <Spacer />
        {children}
      </HStack>

      <LabelsModal
        meeting={meeting}
        card={card}
        disclosure={modalDisclosure}
      />
    </Stack>
  );
};

export default LabelsBar;
