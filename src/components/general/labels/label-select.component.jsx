import { Text, useDisclosure } from '@chakra-ui/react';
import { chakraComponents } from 'chakra-react-select';
import { useState } from 'react';

import { useIsUserType } from '@util/hooks';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import CustomSelect from '@components/general/form/custom-select.component';
import LabelFormModal from '@components/general/modals/label-form-modal.component';
import Label from './label.component';
import { useTranslation } from 'react-i18next';

/**
 *
 * @param {import('chakra-react-select').ReactSelectBaseProps} selectProps
 * @returns
 */
export default function LabelSelect({ value, onChange, shouldAutoFocus = true, ...selectProps }) {
  const { t } = useTranslation();

  const isAdmin = useIsUserType('Admin');
  const [newLabel, setNewLabel] = useState(null);
  const createLabelDisclosure = useDisclosure();

  const { data: labelOptions, refetch } = useInitiatives({
    type: 'Label',
    has_archived_at: false,
    sort: 'title.keyword'
  });

  return (
    <>
      <CustomSelect
        // eslint-disable-next-line
        autoFocus={shouldAutoFocus}
        isCreatable={isAdmin}
        isClearable={false}
        size='md'
        placeholder={t('labelSelect.addLabelsPlaceholder')}
        options={labelOptions}
        getOptionValue={(opt) => opt?.id}
        getOptionLabel={(opt) => {
          // for whatever reason can't do `formatCreateLabel` with custom option labels
          return opt?.__isNew__ ? `Create New Label "${opt?.value}"` : opt?.title;
        }}
        onCreateOption={createLabelDisclosure.onOpen}
        value={value}
        onChange={onChange}
        onInputChange={(inputValue) => {
          if (inputValue?.length > 0) {
            setNewLabel({ title: inputValue });
          }
        }}
        components={{
          MultiValue: ({ data, removeProps }) => (
            <Label
              label={data}
              match={data?.match}
              isEditing
              onRemove={(e) => {
                e.stopPropagation();
                removeProps.onClick();
              }}
              m={1}
            />
          ),
          NoOptionsMessage
        }}
        {...selectProps}
      />
      <LabelFormModal
        disclosure={createLabelDisclosure}
        refetch={refetch}
        selectedLabel={newLabel}
        onCreateLabel={(label) => onChange([...value, label])}
      />
    </>
  );
}

function NoOptionsMessage(props) {
  return (
    <chakraComponents.NoOptionsMessage {...props}>
      <Text fontSize='sm'>
        No labels found, contact your admin to create &quot;{props.selectProps?.inputValue}&quot;
      </Text>
    </chakraComponents.NoOptionsMessage>
  );
}
