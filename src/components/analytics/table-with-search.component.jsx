import { HStack, Collapse, useDisclosure } from '@chakra-ui/react';
import { useDebouncedProp } from '@util/hooks';
import InfiniteTable from '@components/general/infinite-table.component';
import SettingsLayout from '@layouts/settings.layout';
import { SearchInput, SearchToggle } from '@components/general/search.component';
import { useTranslation } from 'react-i18next';

export default function TableWithSearch({
  infiniteMeetingsResults,
  pageTitle,
  dataCy,
  query,
  setQuery
}) {
  const { t } = useTranslation();

  const [debouncedQuery] = useDebouncedProp(query);
  const { isOpen: isSearching, onToggle } = useDisclosure();

  return (
    <SettingsLayout
      pageTitle={pageTitle}
      dataCy={dataCy}
      pb={0}
      h='calc(100vh - 68px)'
      px={0}
      titleContainerProps={{ px: 12 }}
    >
      <SearchToggle
        isSearching={isSearching}
        onToggle={onToggle}
        pos='absolute'
        right={12}
        top={5}
      />
      <HStack
        w='full'
        justify='end'
        px={12}
      >
        <Collapse in={isSearching}>
          <SearchInput
            placeholder={t('tableWithSearch.enterSearchQueryPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
          />
        </Collapse>
      </HStack>
      <InfiniteTable
        infiniteQueryResult={infiniteMeetingsResults}
        columnWidths={['150px', '225px', '500px', '350px']}
        searchQuery={debouncedQuery}
      />
    </SettingsLayout>
  );
}
