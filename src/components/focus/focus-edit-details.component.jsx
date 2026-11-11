import { Input, Textarea } from '@chakra-ui/react';
import FocusFormField from '@components/focus/focus-form-field.component';
import ColorPicker from '@components/general/colorpicker.component.jsx';
import { useTranslation } from 'react-i18next';

export default function FocusEditDetails({
  title,
  setTitle,
  description,
  setDescription,
  color,
  setColor,
  onBlur,
  children
}) {
  const { t } = useTranslation();

  return (
    <>
      <FocusFormField label={t('common.category')}>
        <Input
          placeholder={t('common.category')}
          size='lg'
          value={title}
          onChange={(e) => setTitle(e?.target?.value)}
          onBlur={onBlur}
        />
      </FocusFormField>
      <FocusFormField label={t('common.description')}>
        <Textarea
          rows='5'
          borderRadius='xl'
          bgColor='white'
          placeholder={t('focusEditDetails.addContextToHelpPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e?.target?.value)}
          onBlur={onBlur}
        />
      </FocusFormField>

      <FocusFormField label={t('focusEditDetails.color')}>
        <ColorPicker
          color={color}
          setColor={setColor}
          onClose={onBlur}
        />
      </FocusFormField>
      {children}
    </>
  );
}
