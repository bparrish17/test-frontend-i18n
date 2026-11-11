import React from 'react';
import {
  Badge,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  useToast,
  VStack
} from '@chakra-ui/react';
import AccordionTable from '@components/general/table/accordion-table.component';
import { formatDistanceToNow, formatISO } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, InfoIcon } from '@assets/icons';
import { useFeatureGatesWithAccess } from '@store/feature-gates.store';
import buildInfo from '@root/build-helpers/build-info.json';
import { useTranslation } from 'react-i18next';

/**
 * A component that displays all feature gates in the application using AccordionTable.
 * Fetches gates from the Statsig Console API and displays their configuration.
 * Code usage status is derived from build-time information.
 *
 * @returns {JSX.Element} FeatureGatesTable component
 */
const FeatureGatesTable = () => {
  const { t } = useTranslation();

  const [areAllRowsExpanded, setAreAllRowsExpanded] = React.useState(false);
  const [expandedRows, setExpandedRows] = React.useState([]);
  const toast = useToast();

  const getBadgeColorScheme = (passPercentage) => {
    if (passPercentage === 100) return 'green';
    if (passPercentage === 0) return 'red';
    return 'yellow';
  };

  const getFormattedTargetValue = (targetValue) => {
    if (Array.isArray(targetValue)) {
      return targetValue.join(', ');
    }
    return targetValue;
  };

  const {
    data: featureGates,
    isLoading,
    error,
    refetch: refreshGates
  } = useFeatureGatesWithAccess();

  const flagUsageDetailsMap = React.useMemo(() => {
    const map = new Map();
    if (buildInfo.featureFlagUsage) {
      buildInfo.featureFlagUsage.forEach((item) => {
        map.set(item.name, {
          frontendCodeStatus: item.frontendCodeStatus || 'Unknown',
          serverlessCodeStatus: item.serverlessCodeStatus || 'N/A'
        });
      });
    }
    return map;
  }, []);

  const apiKey = import.meta.env.VITE_STATSIG_CONSOLE_KEY;
  const projectId = import.meta.env.VITE_STATSIG_PROJECT_ID;

  // Define the mapping for combined code usage status display
  const codeUsageDisplayMap = {
    // FE: Yes
    Yes_Yes: { text: 'BOTH', colorScheme: 'purple' },
    Yes_Commented: { text: 'FE | SLS-C', colorScheme: 'blue' }, // FE active is dominant
    Yes_No: { text: 'FE', colorScheme: 'blue' },
    Yes_NA: { text: 'FE', colorScheme: 'blue' }, // Treat N/A for SLS as if SLS is No

    // FE: Commented
    Commented_Yes: { text: 'FE-C | SLS', colorScheme: 'teal' }, // SLS active is dominant
    Commented_Commented: { text: 'BOTH-C', colorScheme: 'gray' },
    Commented_No: { text: 'FE-C', colorScheme: 'orange' },
    Commented_NA: { text: 'FE-C', colorScheme: 'orange' }, // Treat N/A for SLS as if SLS is No

    // FE: No
    No_Yes: { text: 'SLS', colorScheme: 'teal' },
    No_Commented: { text: 'SLS-C', colorScheme: 'yellow' },
    No_No: { text: 'NO', colorScheme: 'red' },
    No_NA: { text: 'NO', colorScheme: 'red' }, // Treat N/A for SLS as if SLS is No

    // FE: N/A (e.g. flag from serverless artifact not in Statsig API list)
    NA_Yes: { text: 'SLS', colorScheme: 'teal' },
    NA_Commented: { text: 'SLS-C', colorScheme: 'yellow' },
    NA_No: { text: 'NO', colorScheme: 'red' }, // Should ideally not happen if SLS data is clean
    NA_NA: { text: 'N/A', colorScheme: 'gray' } // Both unknown or data missing
  };
  const defaultDisplay = { text: 'N/A', colorScheme: 'gray' };

  const gatesArray = featureGates
    ? Object.entries(featureGates).map(([name, gateData]) => {
        const usageDetails = flagUsageDetailsMap.get(name) || {
          frontendCodeStatus: 'Unknown',
          serverlessCodeStatus: 'N/A'
        };

        let feStatusNormalized = usageDetails.frontendCodeStatus;
        if (feStatusNormalized === 'Unknown') feStatusNormalized = 'No';
        let slsStatusNormalized = usageDetails.serverlessCodeStatus;
        if (slsStatusNormalized === 'Unknown' || slsStatusNormalized === 'N/A')
          slsStatusNormalized = 'NA';
        const lookupKey = `${feStatusNormalized || 'No'}_${slsStatusNormalized || 'NA'}`;
        const display = codeUsageDisplayMap[lookupKey] || defaultDisplay;

        return {
          ...gateData,
          name,
          frontendCodeStatus: usageDetails.frontendCodeStatus,
          serverlessCodeStatus: usageDetails.serverlessCodeStatus,
          codeUsageDisplayText: display.text
        };
      })
    : [];

  const tableHeaders = [
    {
      title: t('common.name'),
      orderBy: 'name',
      dir: 'asc',
      active: true,
      props: { minW: '200px', flex: 2 },
      render: (gate) => (
        <Text
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard
              .writeText(gate.name)
              .then(() => {
                toast({
                  title: t('featureGatesTable.copiedToClipboard'),
                  description: `"${gate.name}" has been copied.`,
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                  position: 'top'
                });
              })
              .catch((err) => {
                console.error('Failed to copy text: ', err);
                toast({
                  title: t('featureGatesTable.copyFailed'),
                  description: t('featureGatesTable.couldNotCopyText'),
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                  position: 'top'
                });
              });
          }}
          cursor='pointer'
          _hover={{ textDecoration: 'underline', color: 'brandPrimary.500' }}
          title={`Click to copy "${gate.name}"`}
        >
          {gate.name}
        </Text>
      )
    },
    {
      title: t('featureGatesTable.status'),
      orderBy: 'isEnabled',
      dir: 'desc',
      props: { minW: '120px', flex: 1 },
      render: (gate) => {
        let colorScheme = gate.isEnabled ? 'green' : 'red';
        let statusText = gate.status || (gate.isEnabled ? 'Enabled' : 'Disabled');

        if (
          (gate.status && gate.status.toUpperCase() === 'ARCHIVED') ||
          (gate.entityStatus && gate.entityStatus.toUpperCase() === 'ARCHIVED')
        ) {
          colorScheme = 'gray';
          statusText = 'Archived';
        }

        return <Badge colorScheme={colorScheme}>{statusText}</Badge>;
      }
    },
    {
      title: t('featureGatesTable.codeUsage'),
      orderBy: 'codeUsageDisplayText',
      dir: 'asc',
      props: { minW: '130px', flex: 1 },
      render: (gate) => {
        let feStatusNormalized = gate.frontendCodeStatus;
        if (feStatusNormalized === 'Unknown') feStatusNormalized = 'No';

        let slsStatusNormalized = gate.serverlessCodeStatus;
        if (slsStatusNormalized === 'Unknown' || slsStatusNormalized === 'N/A')
          slsStatusNormalized = 'NA';

        const lookupKey = `${feStatusNormalized || 'No'}_${slsStatusNormalized || 'NA'}`;
        const display = codeUsageDisplayMap[lookupKey] || defaultDisplay;

        const feStatusText = gate.frontendCodeStatus || 'N/A';
        const slsStatusText = gate.serverlessCodeStatus || 'N/A';

        const getStatusDescription = (status) => {
          if (status === 'Yes') return 'Usage Found';
          if (status === 'No') return 'Not Found';
          if (status === 'Commented') return 'Commented Out';
          if (status === 'N/A') return 'Not Applicable';
          return status; // Default to the status itself if not explicitly mapped
        };

        const tooltipLabel = `fora-frontend: ${getStatusDescription(
          feStatusText
        )} | fora-serverless: ${getStatusDescription(slsStatusText)}`;

        return (
          <Tooltip label={tooltipLabel}>
            <Badge
              fontSize='0.8em'
              colorScheme={display.colorScheme}
              variant='subtle'
            >
              {display.text}
            </Badge>
          </Tooltip>
        );
      }
    },
    {
      title: t('featureGatesTable.activity'),
      orderBy: 'checksPerHour',
      dir: 'desc',
      props: { minW: '120px', flex: 1 },
      render: (gate) => (
        <HStack>
          <Text>{gate.checksPerHour || 0}</Text>
          <Text
            color='surface.onSurfaceVariant'
            fontSize='sm'
          >
            {t('featureGatesTable.checksHr')}
          </Text>
        </HStack>
      )
    },
    {
      title: t('featureGatesTable.lastModified'),
      orderBy: 'lastModifiedTime',
      dir: 'desc',
      props: { minW: '180px', flex: 1.5 },
      render: (gate) => (
        <Tooltip
          label={
            gate.lastModifiedTime
              ? formatISO(gate.lastModifiedTime)
              : t('featureGatesTable.unknown')
          }
        >
          <Text>
            {gate.lastModifiedTime
              ? formatDistanceToNow(gate.lastModifiedTime, { addSuffix: true })
              : t('featureGatesTable.unknown')}
          </Text>
        </Tooltip>
      )
    },
    {
      title: t('featureGatesTable.yourAccess'),
      orderBy: 'yourAccess',
      dir: 'desc',
      props: { minW: '150px', flex: 1 },
      render: (gate) => (
        <Badge colorScheme={gate.yourAccess ? 'green' : 'red'}>
          {gate.yourAccess ? t('featureGatesTable.enabled') : t('featureGatesTable.disabled')}
        </Badge>
      )
    }
  ];

  const renderPanelContent = (gate) => {
    return (
      <VStack
        align={{ base: 'stretch' }}
        spacing={4}
        pt={2}
        pb={4}
      >
        {gate.description && (
          <Box>
            <Text
              fontWeight='medium'
              mb={1}
            >
              {t('featureGatesTable.description')}
            </Text>
            <Text
              color='surface.onSurfaceVariant'
              fontSize='sm'
            >
              {gate.description}
            </Text>
          </Box>
        )}

        <Box>
          <Text
            fontWeight='medium'
            mb={1}
          >
            {t('featureGatesTable.rules')}
          </Text>
          {gate.rules && gate.rules.length > 0 ? (
            <Box
              p={3}
              bg='container.surfaceContainerLowest'
              borderRadius='md'
              borderWidth='1px'
              borderColor='surface.outlineVariant'
              overflowX='auto'
              maxH='300px'
              overflowY='auto'
              maxWidth='4xl'
            >
              {gate.rules.map((rule, index) => (
                <Box
                  key={rule.name || rule.id || `rule-${index}-${rule.passPercentage}`}
                  mb={index < gate.rules.length - 1 ? 3 : 0}
                  pb={index < gate.rules.length - 1 ? 3 : 0}
                  borderBottomWidth={index < gate.rules.length - 1 ? '1px' : '0px'}
                  borderColor='surface.outline'
                >
                  <HStack
                    mb={1}
                    justifyContent='space-between'
                  >
                    <Text
                      fontWeight='bold'
                      fontSize='sm'
                    >
                      {rule.name || `Rule ${index + 1}`}
                    </Text>
                    <Badge colorScheme={getBadgeColorScheme(rule.passPercentage)}>
                      {t('featureGatesTable.pass', { passPercentage: rule.passPercentage })}
                    </Badge>
                  </HStack>

                  {rule.conditions && rule.conditions.length > 0 ? (
                    <Box
                      pl={2}
                      mt={2}
                    >
                      {rule.conditions.map((condition, cIdx) => (
                        <Box
                          key={`condition-${condition.type}-${cIdx}`}
                          mb={2}
                        >
                          <HStack
                            spacing={2}
                            alignItems='baseline'
                            mb={1}
                          >
                            <Text
                              fontSize='xs'
                              color='surface.onSurfaceVariant'
                              fontWeight='medium'
                            >
                              {t('featureGatesTable.type')}
                            </Text>
                            <Code
                              fontSize='xs'
                              variant='outline'
                            >
                              {condition.type}
                            </Code>
                          </HStack>
                          {condition.targetValue && (
                            <HStack
                              spacing={2}
                              alignItems='baseline'
                            >
                              <Text
                                fontSize='xs'
                                color='surface.onSurfaceVariant'
                                fontWeight='medium'
                              >
                                {t('featureGatesTable.target')}
                              </Text>
                              <Code
                                fontSize='xs'
                                variant='outline'
                                whiteSpace='pre-wrap'
                                wordBreak='break-all'
                              >
                                {getFormattedTargetValue(condition.targetValue)}
                              </Code>
                            </HStack>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Text
                      fontStyle='italic'
                      fontSize='sm'
                      color='surface.onSurfaceVariant'
                      mt={1}
                    >
                      {t('featureGatesTable.noConditionsDefined')}
                    </Text>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Text
              fontStyle='italic'
              fontSize='sm'
              color='surface.onSurfaceVariant'
            >
              {t('featureGatesTable.noRulesDefined')}
            </Text>
          )}
        </Box>

        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 2 }}
          spacingX={4}
          spacingY={3}
          mt={3}
          alignItems='start'
        >
          <Box>
            <Text fontWeight='medium'>{t('featureGatesTable.created')}</Text>
            <Tooltip
              label={
                gate.createdTime ? formatISO(gate.createdTime) : t('featureGatesTable.unknown')
              }
            >
              <Text
                color='surface.onSurfaceVariant'
                fontSize='sm'
                noOfLines={1}
                title={
                  gate.createdTime
                    ? formatDistanceToNow(gate.createdTime, { addSuffix: true })
                    : t('featureGatesTable.unknown')
                }
              >
                {gate.createdTime
                  ? formatDistanceToNow(gate.createdTime, { addSuffix: true })
                  : t('featureGatesTable.unknown')}
              </Text>
            </Tooltip>
            <Text
              fontSize='xs'
              color='surface.outline'
              noOfLines={1}
              title={gate.creatorName || t('featureGatesTable.unknown')}
            >
              {gate.creatorName || t('featureGatesTable.unknown')}
            </Text>
          </Box>

          <Box>
            <Text fontWeight='medium'>{t('featureGatesTable.version')}</Text>
            <Text
              color='surface.onSurfaceVariant'
              fontSize='sm'
            >
              {gate.version || 1}
            </Text>
          </Box>

          <Box>
            <Text fontWeight='medium'>{t('featureGatesTable.idType')}</Text>
            <Text
              color='surface.onSurfaceVariant'
              fontSize='sm'
              noOfLines={1}
              title={gate.idType || t('featureGatesTable.unknown')}
            >
              {gate.idType || t('featureGatesTable.unknown')}
            </Text>
          </Box>

          <Box>
            {projectId && (
              <Tooltip label={t('featureGatesTable.viewInStatsigConsole')}>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    window.open(
                      `https://console.statsig.com/${projectId}/gates/${gate.name.toLowerCase()}`,
                      '_blank'
                    );
                  }}
                  leftIcon={
                    <Icon
                      as={ExternalLinkIcon}
                      boxSize={3}
                    />
                  }
                >
                  {t('featureGatesTable.viewInStatsig')}
                </Button>
              </Tooltip>
            )}
          </Box>
        </SimpleGrid>
      </VStack>
    );
  };

  // Update areAllRowsExpanded based on expandedRows state
  React.useEffect(() => {
    const isAllExpanded = expandedRows.length === gatesArray.length && gatesArray.length > 0;
    setAreAllRowsExpanded(isAllExpanded);
  }, [expandedRows, gatesArray.length]);

  const handleToggleAllRows = () => {
    if (areAllRowsExpanded) {
      setExpandedRows([]);
      setAreAllRowsExpanded(false);
    } else {
      const allIndices = Array.from({ length: gatesArray.length }, (_, i) => i);
      setExpandedRows(allIndices);
      setAreAllRowsExpanded(true);
    }
  };

  return (
    <Box>
      <Flex
        align='center'
        mb={4}
        justifyContent='space-between'
      >
        <Heading size='md'>{t('featureGatesTable.nonArchivedFeatureGates')}</Heading>
        <HStack spacing={2}>
          <Button
            size='sm'
            variant='outline'
            onClick={handleToggleAllRows}
            leftIcon={areAllRowsExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            isDisabled={isLoading || gatesArray.length === 0}
          >
            {areAllRowsExpanded
              ? t('featureGatesTable.collapseAll')
              : t('featureGatesTable.expandAll')}
          </Button>
          <Button
            size='sm'
            colorScheme='brand'
            onClick={refreshGates}
            isLoading={isLoading}
            leftIcon={isLoading ? <Spinner size='xs' /> : null}
            isDisabled={!apiKey}
          >
            {t('featureGatesTable.refresh')}
          </Button>
        </HStack>
      </Flex>

      {!apiKey && (
        <Box
          mb={4}
          p={2}
          bg='yellow_system.100'
          color='yellow_system.800'
          borderRadius='md'
        >
          <Text>{t('featureGatesTable.noStatsigConsoleApi')}</Text>
        </Box>
      )}

      {!projectId && (
        <Box
          mb={4}
          p={2}
          bg='yellow_system.100'
          color='yellow_system.800'
          borderRadius='md'
        >
          <Text>{t('featureGatesTable.noStatsigProjectId')}</Text>
        </Box>
      )}

      {error && (
        <Box
          mb={4}
          p={2}
          bg='red_system.100'
          color='red_system.800'
          borderRadius='md'
        >
          <Text>Error: {error.toString()}</Text>
        </Box>
      )}

      {gatesArray.length === 0 ? (
        <Box
          p={5}
          borderWidth='1px'
          borderRadius='md'
          bg='container.surfaceContainerLowest'
          textAlign='center'
        >
          {isLoading ? <Spinner /> : <Text>{t('featureGatesTable.noFeatureGatesFound')}</Text>}
        </Box>
      ) : (
        <AccordionTable
          enableExpansion
          tableName='featureGates'
          tableData={gatesArray}
          headers={tableHeaders}
          panelChildren={renderPanelContent}
          expandedRows={expandedRows}
          onExpansionChange={setExpandedRows}
          containerProps={{
            borderWidth: '1px',
            borderRadius: 'lg',
            overflow: 'hidden'
          }}
          headerRowProps={{
            sx: {
              '& > div': {
                paddingLeft: '24px !important',
                paddingRight: '16px !important'
              }
            }
          }}
          tableRowContainerProps={{
            sx: {
              gap: '2 !important',
              '& > div': {
                paddingLeft: '24px !important',
                paddingRight: '16px !important'
              }
            }
          }}
        />
      )}

      <Flex
        justify='space-between'
        mt={4}
        color='surface.onSurfaceVariant'
        fontSize='sm'
      >
        <Text>{t('featureGatesTable.totalGates', { length: gatesArray.length })}</Text>

        <HStack spacing={2}>
          <Icon
            as={InfoIcon}
            fontSize='xs'
          />
          <Text>{t('featureGatesTable.dataRefreshedByStatsig')}</Text>
        </HStack>
      </Flex>
    </Box>
  );
};

export default FeatureGatesTable;
