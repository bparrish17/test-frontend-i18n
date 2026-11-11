import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from '@chakra-ui/react';

/** @typedef {Object} FormInputProps
 * @property {string} id
 * @property {string} label
 * @property {string} errorMsg
 * @property {import('@chakra-ui/react').InputProps['size']} size
 * @property {import('@chakra-ui/react').FormControlProps} formControlProps
 * @property {import('@chakra-ui/react').FormLabelProps} formLabelProps
 * @property {import('@chakra-ui/react').FormErrorMessageProps} formErrorMessageProps
 * @property {import('react-hook-form').UseFormRegisterReturn<any>} registerProps
 *
 *
 * @param {FormInputProps & import('@chakra-ui/react').InputProps} props
 */

const inputStyles = {
  backgroundColor: 'surface.containerLow',
  borderColor: 'surface.outlineVariant'
};

export default function FormInput({
  label,
  errorMsg,
  helperMsg,
  size,
  formControlProps,
  formLabelProps,
  formErrorMessageProps,
  registerProps,
  ...props
}) {
  return (
    <FormControl
      size={size}
      {...formControlProps}
    >
      <Input
        variant='floatingLabel'
        placeholder=''
        {...inputStyles}
        {...props}
        size={size}
        {...registerProps}
      />
      <FormLabel
        pointerEvents='none'
        {...formLabelProps}
        size={size}
      >
        {label}
      </FormLabel>
      <FormErrorMessage
        {...formErrorMessageProps}
        size={size}
      >
        {errorMsg}
      </FormErrorMessage>
      <FormHelperText>{helperMsg}</FormHelperText>
    </FormControl>
  );
}
