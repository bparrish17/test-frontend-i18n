import { Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import CustomSelect from '@components/general/form/custom-select.component';

/**
 *
 * @param {{ column: Column<any, unknown> }} ColumnFilterProps
 */
export default function ColumnFilter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterOptions } = column.columnDef.meta ?? {};

  return filterVariant === 'select' ? (
    <CustomSelect
      selectProps={{ width: '100%' }}
      placeholder={`Select ${column.columnDef.header}`}
      getOptionLabel={(opt) => opt?.label}
      getOptionValue={(opt) => opt?.value}
      size='sm'
      isMulti={false}
      value={columnFilterValue}
      onChange={column.setFilterValue}
      options={filterOptions}
    />
  ) : (
    <DebouncedInput
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search ${column.columnDef.header}`}
      type='text'
      value={columnFilterValue ?? ''}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

/**
 *
 * @param {{
 *  value: string | number
 *  onChange: (value: string | number) => void
 *  debounce?: number
 * } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>} DebouncedInputProps
 * @returns
 */
function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      size='sm'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
