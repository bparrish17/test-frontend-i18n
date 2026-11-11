import { Box, Flex, Stack, Switch, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { some } from 'lodash-es';

import CustomSelect from '@components/general/form/custom-select.component';
import { usePeople } from '@services/query-services/people.query-service';
import { filterForaEmailsInOtherTenants } from '@util/helpers';
import { useTranslation } from 'react-i18next';

const hasValidPeople = (peopleArr) => {
  if (!peopleArr?.length > 0) {
    return false;
  } else {
    return some(peopleArr, (personEmail) => personEmail?.length > 0);
  }
};

export default function PeopleFilter({ control, watch, setValue, isViewOnlyMode }) {
  const { t } = useTranslation();

  const people = watch('filters.people');
  const internalPeople = people?.internal;
  const externalPeople = people?.external;
  const domains = people?.domains;
  const notEmpty =
    hasValidPeople(internalPeople) || hasValidPeople(externalPeople) || hasValidPeople(domains);
  const [peopleCache, setPeopleCache] = useState(people);
  const [isChecked, setIsChecked] = useState(notEmpty);
  const [extPeopleInput, setExtPeopleInput] = useState('');

  // requires similar support as existing "select people" autocomplete
  // filter should allow for anyone at the company to be selected
  const { data: internalPeopleOptions } = usePeople(null, {
    select: (people) =>
      filterForaEmailsInOtherTenants(people).map((p) => ({
        value: p?.id,
        label: p?.name?.concat(p?.email ? ` (${p?.email})` : ''),
        ...p
      }))
  });

  const handleSwitchChange = (e) => {
    setIsChecked(e.target.checked);
    setValue('filters.people', e.target.checked ? peopleCache : null, { shouldDirty: true });
  };

  useEffect(() => {
    if (notEmpty) {
      setIsChecked(true);
      setPeopleCache(people);
    }
  }, [notEmpty]);

  return (
    <Flex
      flexDirection='column'
      w='100%'
      gap={4}
    >
      <Flex
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        <Switch
          isChecked={isChecked}
          onChange={handleSwitchChange}
          isDisabled={isViewOnlyMode}
        />
        <Stack
          direction={['column', 'row']}
          justifyContent='space-between'
          w='100%'
          mx='10px'
        >
          <Text
            fontSize='lg'
            variant={isChecked ? 'page-header' : ''}
          >
            {t('common.people')}
          </Text>
          <Text
            fontWeight={400}
            fontSize='sm'
            color='surface.onSurfaceVariant'
            lineHeight={6}
          >
            {t('peopleFilter.filterByInternalAnd')}
          </Text>
        </Stack>
      </Flex>
      {isChecked && (
        <Flex
          flexDir='column'
          gap={4}
        >
          <Controller
            control={control}
            name='filters.people.internal'
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                value={value}
                size='md'
                selectProps={{ width: '100%' }}
                placeholder={t('peopleFilter.addInternalPeoplePlaceholder')}
                options={internalPeopleOptions}
                onChange={onChange}
                isDisabled={isViewOnlyMode}
              />
            )}
          />
          <Box>
            <Controller
              control={control}
              name='filters.people.external'
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  size='md'
                  selectProps={{ width: '100%' }}
                  isCreatable
                  menuIsOpen={false}
                  placeholder={t('peopleFilter.addExternalPeoplePlaceholder')}
                  value={value}
                  onChange={onChange}
                  inputValue={extPeopleInput}
                  onInputChange={(newValue) => setExtPeopleInput(newValue)}
                  onKeyDown={(event) => {
                    if (!extPeopleInput) return;
                    switch (event.key) {
                      case 'Enter':
                      case 'Tab':
                        onChange([...value, { value: extPeopleInput, label: extPeopleInput }]);
                        setExtPeopleInput('');
                        event.preventDefault();
                    }
                  }}
                  isDisabled={isViewOnlyMode}
                />
              )}
            />
            <Text fontSize='xs'>{t('peopleFilter.inputAnEmailThen')}</Text>
          </Box>
        </Flex>
      )}
    </Flex>
  );
}
