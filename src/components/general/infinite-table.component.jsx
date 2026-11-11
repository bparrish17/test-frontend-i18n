import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import _ from 'lodash';

import { useIsElementVisible } from '@util/hooks';
import { MotionBox } from './motion-box.component';
import { useTranslation } from 'react-i18next';

/**
 * @typedef {object} InfiniteTableProps
 * @property {import('@tanstack/react-query').UseInfiniteQueryResult} infiniteQueryResult
 * @property {string[]} columnWidths
 * @property {string} caption
 * @property {import('@chakra-ui/react').TableContainerProps} [props]
 *
 * @param {InfiniteTableProps} props
 */
export default function InfiniteTable({
  infiniteQueryResult,
  columnWidths,
  caption,
  searchQuery,
  ...props
}) {
  const { t } = useTranslation();

  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = infiniteQueryResult;

  const tableContainerRef = useRef();
  const endOfScrollRef = useRef();
  const isVisible = useIsElementVisible(endOfScrollRef, 600);
  const [scrollTop, setScrollTop] = useState(100);

  useEffect(() => {
    if (isVisible && fetchNextPage) {
      fetchNextPage();
    }
  }, [isVisible, fetchNextPage]);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery]);

  const camelCaseToTitleCase = (str) =>
    str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
      return str.toUpperCase();
    });

  const keys = _.keys(searchResults?.pages[0]?.data[0] ?? {});

  return (
    <TableContainer
      ref={tableContainerRef}
      w='full'
      h='full'
      overflowX='auto'
      overflowY='scroll'
      border='reskin'
      pb={64}
      position='relative'
      {...props}
    >
      <HorizontalScrollShadows
        containerRef={tableContainerRef}
        setScrollTop={setScrollTop}
      />
      <Table
        w='full'
        __css={{ tableLayout: 'fixed' }}
      >
        <TableCaption ref={endOfScrollRef}>{caption}</TableCaption>
        <Thead
          as={motion.thead}
          position='sticky'
          top={0}
          outline='1px solid'
          outlineColor='surface.outlineVariant'
          bg='surface.containerLowest'
          animate={{
            boxShadow:
              scrollTop > 1 ? '0px 8px 24px rgba(0, 0, 0, 0.04)' : '0px 0px 0px rgba(0, 0, 0, 0)'
          }}
        >
          <Tr>
            {/* {isLoading &&
              [...Array(skeletonColumns)].map((_value, index) => (
                <Th key={`skeleton-header-${index}`} w={columnWidths[index]}>
                  <Skeleton w={24} h={4} />
                </Th>
              ))} */}
            {keys?.map((key, index) => {
              return (
                <Th
                  key={key}
                  w={columnWidths[index]}
                  borderRight='1px dotted'
                >
                  {camelCaseToTitleCase(key)}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {/* {(isLoading || !searchResults?.pages) &&
            [...Array(skeletonRows)].map((_value, index) => {
              return (
                <TRow
                  key={`skeleton-row-${index}`}
                  values={Array(skeletonColumns).fill(<Skeleton w={16} h={4} />)}
                  columnWidths={columnWidths}
                />
              );
            })} */}
          {searchResults?.pages?.map((page) => {
            return page?.data?.map((row, rowIdx) => {
              return (
                <TRow
                  key={`row-${rowIdx}`}
                  values={Object.values(row)}
                  columnWidths={columnWidths}
                />
              );
            });
          })}
        </Tbody>
      </Table>
      {isFetchingNextPage ? (
        <Center
          py={6}
          w='full'
        >
          <Spinner />
        </Center>
      ) : (
        <Center h={24} />
      )}
      {!hasNextPage && !isLoading && <Center pb={5}>{t('infiniteTable.endOfResults')}</Center>}
    </TableContainer>
  );
}

function TRow({ values, columnWidths }) {
  return (
    <Tr
      sx={{
        '&>td:not(last-child)': {
          borderRight: 'reskin'
        }
      }}
    >
      {values?.map((value, index) => {
        return (
          <Td
            py={2}
            fontSize='sm'
            key={`cell-${index}`}
            w={columnWidths[index]}
            overflow='hidden'
            whiteSpace='nowrap'
            textOverflow='ellipsis'
          >
            {value}
          </Td>
        );
      })}
    </Tr>
  );
}

function HorizontalScrollShadows({ containerRef, setScrollTop }) {
  const shadowWidth = 100; // px
  const shadowHeight = useMotionValue(0);
  const leftShadowX = useMotionValue(0);
  const rightShadowX = useMotionValue(0);
  const leftShadowOpacity = useMotionValue(0);
  const rightShadowOpacity = useMotionValue(0);

  const leftShadowSpringOpacity = useSpring(leftShadowOpacity);
  const rightShadowSpringOpacity = useSpring(rightShadowOpacity);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const tableContainer = containerRef.current;

    function placeShadows() {
      setScrollTop(tableContainer.scrollTop + 1);
      shadowHeight.set(tableContainer.scrollTop + tableContainer.clientHeight);
      leftShadowX.set(tableContainer.scrollLeft);
      rightShadowX.set(tableContainer.scrollLeft + tableContainer.clientWidth - shadowWidth);

      if (tableContainer.scrollLeft === 0) {
        leftShadowOpacity.set(0);
      } else {
        leftShadowOpacity.set(1);
      }

      if (tableContainer.scrollLeft + tableContainer.clientWidth >= tableContainer.scrollWidth) {
        rightShadowOpacity.set(0);
      } else {
        rightShadowOpacity.set(1);
      }
    }

    const observer = new ResizeObserver(placeShadows);
    observer.observe(tableContainer);

    tableContainer.addEventListener('scroll', placeShadows);

    placeShadows();

    return () => {
      tableContainer.removeEventListener('scroll', placeShadows);
      observer.disconnect();
    };
  }, [containerRef.current]);

  const boxStyles = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    w: `${shadowWidth}px`,
    zIndex: 'overlay',
    pointerEvents: 'none'
  };

  return (
    <>
      <MotionBox
        {...boxStyles}
        style={{ x: leftShadowX, height: shadowHeight, opacity: leftShadowSpringOpacity }}
        bgGradient='linear(to-r, rgba(0, 0, 0, 0.1) 0%, rgba(0,0,0,0) 100%)'
      />
      <MotionBox
        {...boxStyles}
        style={{ x: rightShadowX, height: shadowHeight, opacity: rightShadowSpringOpacity }}
        bgGradient='linear(to-l, rgba(0, 0, 0, 0.1) 0%, rgba(0,0,0,0) 100%)'
      />
    </>
  );
}
