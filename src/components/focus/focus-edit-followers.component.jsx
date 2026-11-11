import { useUserStore } from '@store/app.store';
import { usePeopleOptions } from '@services/query-services/people.query-service';
import CustomSelect from '@components/general/form/custom-select.component';
import FocusFormField from '@components/focus/focus-form-field.component';
import { Center, HStack, Icon, Switch, Text, Tooltip } from '@chakra-ui/react';
import { QuestionIcon } from '@assets/icons';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function FocusEditFollowers({
  value,
  onChange,
  isEdit,
  isBulkRemapChecked,
  setIsBulkRemapChecked,
  allowBulkRemap = true,
  ...selectProps
}) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const { data: peopleOptions } = usePeopleOptions({ not_types: ['Associate'], active: true });

  const filteredPeopleOptions = isEdit
    ? peopleOptions
    : peopleOptions?.filter((p) => p?.value !== user?.id);

  return (
    <FocusFormField label={t('focusEditFollowers.followers')}>
      <CustomSelect
        placeholder={t('focusEditFollowers.addColleaguesPlaceholder')}
        options={filteredPeopleOptions}
        onChange={onChange}
        value={value}
        {...selectProps}
      />
      {allowBulkRemap && (
        <HStack
          gap={3}
          mt={2}
        >
          <Switch
            isChecked={isBulkRemapChecked}
            onChange={(e) => setIsBulkRemapChecked(e.target.checked)}
          />
          <Text fontWeight={600}>{t('focusEditFollowers.reMapAnyMatching')}</Text>
          <Tooltip label={t('focusEditFollowers.ifThisIsOn')}>
            <HelpIcon />
          </Tooltip>
        </HStack>
      )}
    </FocusFormField>
  );
}

const HelpIcon = forwardRef(({ ...rest }, ref) => (
  <Center
    ref={ref}
    border='1px solid'
    color='surface.onSurfaceVariant'
    boxSize={3.5}
    rounded='full'
  >
    <Icon
      as={QuestionIcon}
      boxSize={2.5}
      {...rest}
    />
  </Center>
));
