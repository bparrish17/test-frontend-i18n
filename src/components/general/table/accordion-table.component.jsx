import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Stack,
  Text
} from '@chakra-ui/react';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { capitalize, orderBy, uniqueId } from 'lodash-es';
import { ChevronDownIcon, ExpandVerticalIcon } from '@assets/icons';
import analyticsService from '@services/analytics.service';
import { useTranslation } from 'react-i18next';

const resultLeftPadding = {
  base: 2.5,
  md: 12
};

/**
 * @typedef {Object} TableHeader
 * @property {string} title
 * @property {'asc' | 'desc'} dir - sort direction
 * @property {string} orderBy - data key to sort by
 * @property {boolean} [disableSort] - whether column is sortable
 * @property {boolean} [active] - whether column is currently sorted
 * @property {object} [props] - styling props for header
 * @property {string} [width] - width value for column (e.g. "100px", "2fr")
 * @property {(row: object, header: TableHeader) => JSX.Element} render - component to render in cells
 *
 * @typedef {Object} AccordionTableProps
 * @property {boolean} enableExpansion - whether rows can expand
 * @property {string} [tableName] - Label for tracking and URL params
 * @property {any[]} tableData - data to display in table
 * @property {React.ReactNode|Function} [panelChildren] - Component for accordion panel
 * @property {TableHeader[]} headers - column configuration
 * @property {number} [maxItems] - Max items before "View More"
 * @property {object} [tableRowProps] - Props for row component
 * @property {object} [tableRowContainerProps] - Props for row container
 * @property {object} [headerRowProps] - Props for header row
 * @property {object} [containerProps] - Props for table container
 *
 * @param {AccordionTableProps} props
 */
const AccordionTable = forwardRef(
  (
    {
      enableExpansion,
      tableName = '',
      tableData,
      panelChildren,
      headers,
      maxItems,
      tableRowProps = {},
      tableRowContainerProps = {},
      headerRowProps = {},
      containerProps = {},
      expandedRows = [],
      onExpansionChange
    },
    ref
  ) => {
    const { t } = useTranslation();

    const [sortedTableData, setSortedTableData] = useState([]);
    const [dataIndex, setDataIndex] = useState();
    const [maxDisplayedItems, setMaxDisplayedItems] = useState(maxItems);
    const [curDataIndex, setCurDataIndex] = useState();
    const [tableHeaders, setTableHeaders] = useState(headers);

    // Use expandedRows prop instead of internal openArr state
    const openArr = expandedRows;

    useImperativeHandle(ref, () => {
      return {
        expandAllRows: () => {
          if (sortedTableData && sortedTableData.length > 0) {
            const itemsToExpand = maxDisplayedItems || sortedTableData.length;
            const newOpenArr = [...Array(Math.min(itemsToExpand, sortedTableData.length)).keys()];
            onExpansionChange?.(newOpenArr);
          }
        },
        collapseAllRows: () => {
          onExpansionChange?.([]);
        },
        isAllExpanded: () => {
          if (!sortedTableData || sortedTableData.length === 0) return false;
          const itemsToExpand = maxDisplayedItems || sortedTableData.length;
          return (
            openArr.length === Math.min(itemsToExpand, sortedTableData.length) && openArr.length > 0
          );
        }
      };
    });

    const generateColumnTemplate = () => {
      const columns = tableHeaders.map((header) => {
        return header.width ?? header.props?.minW ?? '1fr';
      });

      if (enableExpansion && panelChildren) {
        columns.push('40px');
      }

      return columns.join(' ');
    };

    const columnTemplate = generateColumnTemplate();

    useEffect(() => {
      const URLObj = new URL(decodeURIComponent(location.href));
      if (URLObj.searchParams.get(`${tableName}Sort`)) {
        const initSort = URLObj.searchParams.get(`${tableName}Sort`)?.split('|');
        setDataIndex([parseInt(initSort[0]), initSort[1]]);
      } else {
        setDataIndex([0, 'asc']);
      }
    }, [tableName]);

    useEffect(() => {
      if (
        !dataIndex ||
        !tableHeaders ||
        tableHeaders.length === 0 ||
        dataIndex[0] >= tableHeaders.length
      ) {
        if (tableData) setSortedTableData([...tableData]);
        return;
      }

      const nextDataIndex = dataIndex[0];
      setSortedTableData(
        orderBy(tableData, tableHeaders[nextDataIndex].orderBy, [tableHeaders[nextDataIndex].dir])
      );
    }, [dataIndex, tableData, tableHeaders]);

    useEffect(() => {
      if (
        !dataIndex ||
        !tableHeaders ||
        tableHeaders.length === 0 ||
        dataIndex[0] >= tableHeaders.length
      ) {
        return;
      }
      const nextDataIndex = dataIndex[0];
      const nextDir = dataIndex[1];
      const newHeaders = tableHeaders.map((header, index) => ({
        ...header,
        active: index === nextDataIndex,
        dir: index === nextDataIndex ? nextDir || header.dir : 'asc'
      }));

      if (curDataIndex !== undefined && curDataIndex === nextDataIndex && !nextDir) {
        newHeaders[curDataIndex].dir = newHeaders[curDataIndex].dir === 'asc' ? 'desc' : 'asc';
      } else if (nextDataIndex !== curDataIndex && curDataIndex !== undefined) {
        if (newHeaders[curDataIndex]) newHeaders[curDataIndex].dir = 'asc';
      }

      setTableHeaders(newHeaders);
      setCurDataIndex(nextDataIndex);
    }, [dataIndex]);

    useEffect(() => {
      setMaxDisplayedItems(maxItems || tableData?.length || 0);
    }, [maxItems, tableData]);

    const onViewMoreClick = () => {
      const newMax = sortedTableData?.length;
      setMaxDisplayedItems(newMax);
      if (openArr.length === (maxDisplayedItems || 0) && (maxDisplayedItems || 0) < newMax) {
        onExpansionChange?.([...Array(newMax).keys()]);
      }
    };

    const handleToggleAll = () => {
      const itemsToConsider = Math.min(
        maxDisplayedItems || sortedTableData.length,
        sortedTableData.length
      );
      if (openArr.length < itemsToConsider) {
        onExpansionChange?.([...Array(itemsToConsider).keys()]);
      } else {
        onExpansionChange?.([]);
      }
    };

    const handleItemToggle = (index) => {
      const newOpenArr = [...openArr];
      const itemIndexInOpenArr = newOpenArr.indexOf(index);
      if (itemIndexInOpenArr === -1) {
        newOpenArr.push(index);
      } else {
        newOpenArr.splice(itemIndexInOpenArr, 1);
      }
      onExpansionChange?.(newOpenArr);
    };

    return (
      <Stack
        layerStyle='section-card'
        gap={0}
        {...containerProps}
      >
        <Accordion
          allowMultiple
          minW='min-content'
          index={openArr}
          borderRadius='inherit'
          sx={{
            '&>*:nth-of-type(2)': {
              borderTop: 'none',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit'
            },
            '&>*:last-child': {
              borderBottom: 'none',
              borderBottomLeftRadius: 'inherit',
              borderBottomRightRadius: 'inherit'
            }
          }}
        >
          <AccordionItem
            borderTopRadius='inherit'
            border='none'
            borderBottom='reskin'
            bgColor='surface.containerLow'
            key='topic header'
            position='sticky'
            top={0}
            zIndex={1}
            {...headerRowProps}
          >
            <Grid
              py={3}
              pr={{ base: 0, sm: 3 }}
              pl={resultLeftPadding}
              w='full'
              gap={4}
              templateColumns={columnTemplate}
              alignItems='center'
            >
              {tableHeaders.map((header, index) => (
                <GridItem
                  key={header?.key ?? header.title}
                  {...(header?.props ?? {})}
                >
                  <HStack
                    onClick={() =>
                      !header.disableSort &&
                      setDataIndex([index, tableHeaders[index].dir === 'asc' ? 'desc' : 'asc'])
                    }
                    width='fit-content'
                    cursor={header.disableSort ? 'default' : 'pointer'}
                    data-testid={`header-${header.title}`}
                  >
                    <Text
                      color={header?.active ? 'brandPrimary.primary' : 'surface.onSurfaceVariant'}
                      letterSpacing={2}
                      fontSize='xs'
                      fontWeight={header?.active ? '600' : '500'}
                      textTransform='uppercase'
                    >
                      {header.title}
                    </Text>
                    <Icon
                      hidden={header.disableSort}
                      as={ChevronDownIcon}
                      boxSize={4}
                      color={header?.active ? 'brandPrimary.primary' : 'surface.outline'}
                      style={{
                        transform: `rotate(${
                          header?.active && header?.dir === 'desc' ? '0' : '180'
                        }deg)`
                      }}
                      data-testid='header-sort-icon'
                    />
                  </HStack>
                </GridItem>
              ))}
              {enableExpansion && panelChildren && (
                <GridItem>
                  <Flex
                    w='25px'
                    as='button'
                    alignItems='center'
                    onClick={handleToggleAll}
                    data-testid='expand'
                  >
                    <Icon
                      as={ExpandVerticalIcon}
                      fill={openArr.length === 0 ? 'surface.outline' : 'surface.onSurface'}
                      boxSize='25px'
                    />
                  </Flex>
                </GridItem>
              )}
            </Grid>
          </AccordionItem>
          {sortedTableData?.slice(0, maxDisplayedItems)?.map((tableRow, i) => (
            <DataRowAccordionItem
              key={uniqueId(`${tableName}-row-`)}
              enableExpansion={enableExpansion}
              panelChildren={panelChildren}
              headers={tableHeaders}
              tableName={tableName}
              tableRow={tableRow}
              index={i}
              itemCallback={() => handleItemToggle(i)}
              tableRowProps={tableRowProps}
              tableRowContainerProps={tableRowContainerProps}
              columnTemplate={columnTemplate}
            />
          ))}
        </Accordion>

        {sortedTableData?.length > (maxDisplayedItems || 0) && (
          <Center py={6}>
            <Text
              cursor='pointer'
              color='brandPrimary.primary'
              data-testid='view-more'
              onClick={onViewMoreClick}
            >
              {t('accordionTable.viewMore')}
            </Text>
          </Center>
        )}
      </Stack>
    );
  }
);

const DataRowAccordionItem = ({
  enableExpansion,
  headers,
  tableRow,
  tableName,
  panelChildren,
  index,
  itemCallback,
  tableRowProps,
  tableRowContainerProps,
  columnTemplate
}) => {
  const handleAccordionClick = () => {
    const eventName = `${capitalize(tableName)} Accordion Header Click`;
    analyticsService.trackButtonClick(eventName, {
      tableName,
      route: window?.location?.pathname,
      topic: tableRow
    });
  };

  return (
    <AccordionItem
      borderTop='reskin'
      bgColor='surface.surfaceBright'
      data-testid={`accordion-item-${index}`}
      isDisabled={!enableExpansion}
      {...tableRowProps}
    >
      {enableExpansion ? (
        <AccordionButton
          pl={resultLeftPadding}
          py={0}
          onClick={() => {
            handleAccordionClick();
            itemCallback();
          }}
          sx={{
            cursor: enableExpansion && panelChildren ? 'pointer' : 'default',
            _hover:
              enableExpansion && panelChildren
                ? { background: 'light_material.100' }
                : { background: 'unset' }
          }}
          w='full'
        >
          <Grid
            w='full'
            py={3}
            gap={4}
            templateColumns={columnTemplate}
            alignItems='center'
            {...tableRowContainerProps}
          >
            {headers?.map((header) => (
              <GridItem
                key={`row-${index}-column-${header?.key ?? header.title}`}
                overflow='hidden'
                textOverflow='ellipsis'
                {...(header?.props ?? {})}
              >
                {header?.render(tableRow, header)}
              </GridItem>
            ))}
            {enableExpansion && panelChildren && (
              <GridItem>
                <AccordionIcon
                  w={5}
                  color='surface.outlineVariant'
                  data-testid='accordion-icon-expand'
                />
              </GridItem>
            )}
          </Grid>
        </AccordionButton>
      ) : (
        <Grid
          w='full'
          py={3}
          pr={3}
          pl={resultLeftPadding}
          gap={4}
          templateColumns={columnTemplate}
          alignItems='center'
          {...tableRowContainerProps}
        >
          {headers?.map((header) => (
            <GridItem
              key={`row-${index}-column-${header.title}`}
              overflow='hidden'
              textOverflow='ellipsis'
              textAlign='left'
              {...(header?.props ?? {})}
            >
              {header?.render(tableRow, header)}
            </GridItem>
          ))}
        </Grid>
      )}
      {enableExpansion && panelChildren && (
        <AccordionPanel
          pl={resultLeftPadding}
          fontSize='sm'
          color='surface.onSurfaceVariant'
          data-testid='accordion-panel-expand'
          pb={4}
        >
          {typeof panelChildren === 'function' ? panelChildren(tableRow) : panelChildren}
        </AccordionPanel>
      )}
    </AccordionItem>
  );
};

export default AccordionTable;
