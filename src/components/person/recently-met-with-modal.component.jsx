import { CloseButton, HStack, Icon, Spacer, Stack, Text, Spinner } from '@chakra-ui/react';

import { pluralized } from '@util/helpers';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { SFTwoPersonOutlinedIcon } from '@assets/icons';
import AccordionTable from '@components/general/table/accordion-table.component';
import StyledModal from '@components/general/modals/styled-modal.component';
import LinkRadio from '@components/general/form/link-radio.component';

/**
 * @typedef {Object} RecentlyMetWithTableModalProps
 * @property {RecentlyMetWithSection[]} sections
 * @property {boolean} isLoading
 * @property {string} onQueryChange
 * @property {string} activeType
 * @property {Function} setActiveType
 * @property {import('@chakra-ui/react').UseDisclosureReturn} disclosure
 *
 * @param {RecentlyMetWithTableModalProps} props
 */
const RecentlyMetWithTableModal = ({ sections, activeType, setActiveType, disclosure }) => {
  const handleTabChange = (newType) => {
    setActiveType(newType);
  };

  const tabOptions = sections
    ?.map((s) => {
      if (!s?.items || s?.items?.length === 0) {
        return null;
      }

      return {
        value: s.type,
        label: s.table?.title || pluralized(s.type, s?.items?.length)
      };
    })
    .filter(Boolean);

  const tableProps = {
    enableExpansion: false,
    headerRowProps: {
      zIndex: 1
    },
    tableRowProps: {
      isDisabled: false
    },
    tableRowContainerProps: {
      py: 2
    },
    containerProps: {
      sx: HIDE_SCROLLBAR,
      overflowX: 'scroll'
    }
  };

  const activeSection = sections?.find((section) => section?.type === activeType);
  const items = activeSection?.items;

  if (!activeSection) {
    return null;
  }

  return (
    <StyledModal
      title='Recently Met With'
      disclosure={disclosure}
      fullscreen
      customHeader={
        <HStack
          color='brandPrimary.onPrimary'
          bgColor='brandPrimary.onContainer'
          p={4}
          gap={4}
          h='full'
        >
          <Icon
            as={SFTwoPersonOutlinedIcon}
            boxSize={10}
          />

          <Stack gap={0}>
            <Text
              fontWeight={500}
              variant='headline-sm'
            >
              Recently Met With
            </Text>
            <Text color='brandPrimary.fixed'>Past 90 days</Text>
          </Stack>
          <Spacer />
          <CloseButton onClick={disclosure.onClose} />
        </HStack>
      }
      modalProps={{
        scrollBehavior: 'inside'
      }}
      modalBodyProps={{
        overflow: 'auto'
      }}
      modalContentProps={{
        mx: 0
      }}
    >
      <Stack
        data-testid='recently-met-with-modal'
        px={{ base: 4, lg: 11 }}
        py={{ base: 6, lg: 11 }}
        justify='space-between'
        gap={6}
      >
        <LinkRadio
          name='agenda-sidebar-filter'
          options={tabOptions}
          value={activeType}
          onChange={handleTabChange}
          radioOptionProps={{
            color: 'surface.outline',
            _checked: {
              textDecor: 'none',
              color: 'surface.onSurface'
            },
            fontWeight: 600,
            fontSize: 'xl'
          }}
          containerProps={{
            pl: {
              base: 4,
              lg: 11
            }
          }}
        />

        {!items ? (
          <Stack
            align='center'
            justify='center'
            py={8}
          >
            <Spinner
              size='lg'
              color='brandPrimary.primary'
            />
            <Text>Loading data...</Text>
          </Stack>
        ) : (
          <AccordionTable
            key={activeSection.type + '-table'}
            tableName='recentlyMetWith'
            tableData={activeSection?.items || []}
            headers={activeSection?.table?.headers || []}
            maxItems={Infinity}
            {...tableProps}
          />
        )}
      </Stack>
    </StyledModal>
  );
};

export default RecentlyMetWithTableModal;
