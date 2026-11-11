import {
  Select,
  chakraComponents,
  CreatableSelect as ChakraCreatableSelect
} from 'chakra-react-select';
import { SFXMarkIconOutlined } from '@assets/icons';

const MultiValueRemove = (props) => {
  return (
    <chakraComponents.MultiValueRemove {...props}>
      <SFXMarkIconOutlined
        boxSize='13px'
        color='surface.onSurfaceVariant'
      />
    </chakraComponents.MultiValueRemove>
  );
};

// Custom MultiValueLabel component
const MultiValueLabel = (props) => {
  const { selectProps, data } = props;

  // Use getValueLabel if defined, otherwise fallback to getOptionLabel
  const customLabel = selectProps?.getValueLabel
    ? selectProps.getValueLabel(data)
    : selectProps.getOptionLabel(data);

  return (
    <chakraComponents.MultiValueLabel {...props}>{customLabel}</chakraComponents.MultiValueLabel>
  );
};

const ClearIndicator = (props) => {
  return (
    <chakraComponents.ClearIndicator {...props}>
      <SFXMarkIconOutlined
        color='surface.onSurfaceVariant'
        boxSize={6}
        p={1}
      />
    </chakraComponents.ClearIndicator>
  );
};

const sharedStyles = {
  control: {
    borderColor: 'surface.outlineVariant'
  },
  option: {
    _hover: {
      bgColor: 'brandPrimary.container'
    },
    _selected: {
      bgColor: 'brandPrimary.primary'
    }
  },
  groupHeading: {
    px: 2.5,
    textStyle: 'label-caps-reg-lg'
  },
  placeholder: { color: 'surface.outline', p: 0.5 },
  clearIndicator: { borderRadius: 'full' },
  multiValue: {
    backgroundColor: 'surface.containerHigh'
  },
  multiValueLabel: {
    color: 'surface.onSurfaceVariant'
  },
  loadingIndicator: {
    spinnerSize: 'sm'
  }
};

const mergeStyles =
  (component, customStyles = {}) =>
  (baseStyles) => ({ ...baseStyles, ...(sharedStyles[component] ?? {}), ...customStyles });

const sizeStyles = {
  // Small
  sm: () => ({
    control: mergeStyles('control', { fontSize: 'md', minH: 8 }),
    placeholder: mergeStyles('placeholder', { ml: 1, textStyle: 'body-500-sm' }),
    input: mergeStyles('input', { ml: 1 }),
    groupHeading: mergeStyles('groupHeading'),
    valueContainer: mergeStyles('valueContainer', { px: 2.5, fontSize: 'sm' }),
    clearIndicator: mergeStyles('clearIndicator'),
    singleValue: mergeStyles('singleValue', {
      color: 'surface.onSurfaceVariant',
      fontWeight: 500
    }),
    multiValueLabel: mergeStyles('multiValueLabel', { fontSize: 'xs', fontWeight: 500 }),
    option: mergeStyles('option', { fontSize: 'sm', fontWeight: 500, h: 7, my: 1 })
  }),

  // Medium Size
  md: () => ({
    control: mergeStyles('control', { fontSize: 'md', minH: 10 }),
    placeholder: mergeStyles('placeholder', { ml: 1, textStyle: 'body-500-sm' }),
    input: mergeStyles('input', { ml: 1 }),
    groupHeading: mergeStyles('groupHeading'),
    valueContainer: mergeStyles('valueContainer', { px: 2.5, fontSize: 'sm' }),
    clearIndicator: mergeStyles('clearIndicator'),
    singleValue: mergeStyles('singleValue', {
      color: 'surface.onSurfaceVariant',
      fontWeight: 500
    }),
    multiValueLabel: mergeStyles('multiValueLabel', { fontSize: 'xs', fontWeight: 500 }),
    option: mergeStyles('option', { fontSize: 'sm', fontWeight: 500 })
  }),

  // Large Size
  lg: (controlProps) => ({
    control: mergeStyles('control', {
      padding: '13px 16px',
      borderRadius: 'xl',
      ...controlProps
    }),
    placeholder: mergeStyles('placeholder', { textStyle: 'body-500-lg', lineHeight: 7 }),
    input: mergeStyles('input', { fontSize: 'sm', lineHeight: 7 }),
    groupHeading: mergeStyles('groupHeading'),
    multiValue: mergeStyles('multiValue', {
      margin: 0,
      py: 1,
      px: 1.5,
      borderRadius: 'base'
    }),
    multiValueLabel: mergeStyles('multiValueLabel', {
      padding: 0,
      fontWeight: 500,
      fontSize: 'sm'
    }),
    valueContainer: mergeStyles('valueContainer', {
      padding: 0,
      paddingRight: 2.5,
      gap: 2.5
    }),
    option: mergeStyles('option', {
      fontSize: 'md',
      fontWeight: 400,
      lineHeight: 'normal'
    }),
    menuList: mergeStyles('menuList', { borderRadius: 'xl', maxHeight: '155px' }),
    clearIndicator: mergeStyles('clearIndicator'),
    dropdownIndicator: mergeStyles('dropdownIndicator', { ml: 0 }),
    noOptionsMessage: mergeStyles('noOptionsMessage', { fontSize: 'md' }),
    loadingMessage: mergeStyles('loadingMessage', { fontSize: 'md' }),
    loadingIndicator: mergeStyles('loadingIndicator')
  })
};

/**
 * Custom Extension of the chakra-react-select
 * - can customize react-select with chakra styles and variables/theming
 * - for changing styles add to the chakraStyles prop with one of the options listed in the react-select docs:
 *   https://react-select.com/components#adjusting-the-styling
 * - for altering components entirely, pass into the components prop
 *   - make sure to define these outside the scope of your component for rendering
 */
export default function CustomSelect({
  placeholder,
  options,
  chakraStyles,
  components,
  onChange,
  size = 'lg',
  value = [],
  isCreatable = false,
  autoFocus = false,
  isMulti = true,
  controlProps = {},
  ...selectProps
}) {
  const Component = isCreatable ? ChakraCreatableSelect : Select;

  const handleCreate = (inputValue) => {
    const newOption = { label: inputValue, name: inputValue, id: 'custom', email: inputValue };
    onChange([...value, newOption]); // Add the new option to the selected values
  };

  const additionalProps = isCreatable ? { onCreateOption: handleCreate } : {};

  return (
    <Component
      value={value}
      useBasicStyles
      isMulti={isMulti}
      placeholder={placeholder}
      options={options}
      onChange={onChange}
      size={size}
      components={{
        MultiValueRemove,
        MultiValueLabel, // Add the custom label component here
        ClearIndicator,
        LoadingIndicator: (props) => (
          <chakraComponents.LoadingIndicator
            {...props}
            spinnerSize={size === 'lg' ? 'sm' : 'xs'}
            speed='0.7s'
          />
        ),
        DropdownIndicator: null,
        ...components
      }}
      focusBorderColor='brandPrimary.primary'
      // eslint-disable-next-line
      autoFocus={autoFocus}
      chakraStyles={{ ...sizeStyles[size](controlProps), ...chakraStyles }}
      {...additionalProps}
      {...selectProps}
    />
  );
}
