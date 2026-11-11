import {
  Avatar,
  AvatarGroup,
  Button,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useQueryParam } from 'use-query-params';

import { pluralized } from '@util/helpers';
import { PEOPLE_ORG_STATS_PAGE_SIZE } from '@util/constants';
import PersonPreview from '@components/general/avatar-preview/person-preview.component';
import { DotSeparatedText, PersonSectionHeader } from './person.shared.component';
import RecentlyMetWithTableModal from './recently-met-with-modal.component';
import { useTranslation } from 'react-i18next';

const personPreviewStyle = {
  layerStyle: 'reskin-card',
  border: 'none'
};

/**
 * @typedef {Object} RecentlyMetWithProps
 * @property {RecentlyMetWithSection[]} sections
 * @property {Function} onQueryChange
 * @property {string} [headerTitle='Recently Met With']
 * @property {Object} tableName
 * @property {number} numOfDays
 * @property {boolean} isLoading
 *
 * @param {RecentlyMetWithProps} props
 */
export default function RecentlyMetWith({ sections, numOfDays, isLoading }) {
  const tableName = 'recentlyMetWith';
  const sortParamKey = tableName + 'Sort';
  const sortParamValue = '3|desc'; // 4th header descending
  const setSortParam = useQueryParam(sortParamKey)[1];
  const [activeType, setActiveType] = useState('person');

  const disclosure = useDisclosure();
  const modalDisclosure = {
    ...disclosure,
    onClose: () => {
      disclosure.onClose();
      setActiveType(null);
      setSortParam(null);
    }
  };

  const handleViewMore = (initialType) => {
    modalDisclosure.onOpen();
    setActiveType(initialType);
    setSortParam(sortParamValue);
  };

  if (!sections || !sections.length > 0) {
    return null;
  }

  return (
    <Stack
      w='full'
      gap={8}
    >
      {sections?.map((section) => (
        <Section
          key={`${section?.type}-section`}
          {...section}
          isLoading={isLoading}
          handleViewMore={handleViewMore}
          numOfDays={numOfDays}
        />
      ))}
      <RecentlyMetWithTableModal
        sections={sections}
        isLoading={isLoading}
        activeType={activeType}
        setActiveType={setActiveType}
        disclosure={modalDisclosure}
      />
    </Stack>
  );
}

/** @param {RecentlyMetWithSection} props */
const Section = ({
  items,
  type,
  title,
  maxItems,
  itemPreview,
  avatarStack,
  isLoading,
  numOfDays,
  handleViewMore
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Stack>
      <PersonSectionHeader
        title={title}
        numOfDays={numOfDays}
      />
      <SimpleGrid
        columns={[1, 2]}
        gap={2}
      >
        {items?.slice(0, maxItems).map((item) => {
          const { key, ...rest } = itemPreview(item);
          return (
            <ItemPreview
              {...rest}
              type={type}
              key={key}
            />
          );
        })}
      </SimpleGrid>
      <AvatarStack
        items={items}
        isLoading={isLoading}
        initialType={type}
        maxItemsDisplayed={maxItems}
        maxAvatarsToShow={avatarStack?.maxAvatars}
        maxNameChars={avatarStack?.maxNameChars}
        handleViewMore={handleViewMore}
      />
    </Stack>
  );
};

const ItemPreview = ({ item, type, ...props }) => {
  return (
    <PersonPreview
      data-testid={`${type}-avatar`}
      size='sm'
      key={item?.email}
      person={item}
      variant='card'
      additionalText={
        <DotSeparatedText
          mt={1}
          testid={`${type}-stats-dot-separated`}
          strings={[pluralized('recorded meeting', item?.botted)]}
        />
      }
      textStackProps={{
        gap: !item?.title ? 0 : 1
      }}
      titleProps={{ display: !item?.title ? 'none' : 'block' }}
      titleContainerProps={{ flexDir: 'column' }}
      {...personPreviewStyle}
      {...props}
    />
  );
};

const AvatarStack = ({
  items,
  maxItemsDisplayed = Infinity,
  maxAvatarsToShow = 5,
  initialType,
  handleViewMore,
  ...props
}) => {
  const { t } = useTranslation();

  if (!items || items?.length <= maxItemsDisplayed) {
    return null;
  }

  return (
    <Button
      variant='link'
      onClick={() => handleViewMore(initialType)}
      role='group'
      w='fit-content'
      p={3}
      gap={2}
    >
      <AvatarGroup
        size='sm'
        max={maxAvatarsToShow}
        sx={{ '&>.chakra-avatar__excess': { display: 'none' } }}
        {...props}
      >
        {items?.slice(maxItemsDisplayed)?.map((item) => (
          <Avatar
            key={item?.email || item?.name}
            name={item?.name}
            src={item?.avatar_url}
          />
        ))}
      </AvatarGroup>
      <Text
        variant='label-md'
        color='brandPrimary.primary'
        textDecor={{ base: 'underline', md: 'none' }}
        _groupHover={{ textDecoration: 'underline' }}
      >
        {t('recentlyMetWith.viewTop', { PEOPLE_ORG_STATS_PAGE_SIZE })}
      </Text>
    </Button>
  );
};
