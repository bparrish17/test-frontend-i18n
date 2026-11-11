import {
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ScaleFade,
  useDisclosure
} from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import { CloseIcon, SearchIcon } from '@assets/icons';

// just a "default" horizontal wrapper over the search input and toggle
function Search({ value, setValue, placeholder, inputProps = {} }) {
  const { isOpen: isSearching, onToggle } = useDisclosure({ defaultIsOpen: !!value });
  return (
    <HStack>
      <ScaleFade in={isSearching}>
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
          placeholder={placeholder}
          isSearching={isSearching}
          {...inputProps}
        />
      </ScaleFade>
      <SearchToggle
        isSearching={isSearching}
        onToggle={onToggle}
      />
    </HStack>
  );
}

/**
 * @typedef {object} SearchToggleProps
 * @property {boolean} isSearching
 * @param {...import('@chakra-ui/react').IconButtonProps} [props]
 *
 * @param {SearchToggleProps} props
 */
function SearchToggle({ isSearching, onToggle, ...props }) {
  return (
    <IconButton
      size='md'
      icon={<SearchIcon fontSize='21px' />}
      isRound
      variant='ghost'
      color={isSearching ? 'brandPrimary.onPrimary' : 'surface.onSurfaceVariant'}
      bgColor={isSearching ? 'brandPrimary.primary' : 'transparent'}
      onClick={onToggle}
      {...props}
    />
  );
}

function SearchInput({ value, onChange, onClear, placeholder, isSearching, ...inputProps }) {
  const searchInputRef = useRef();

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  return (
    <InputGroup
      size='lg'
      {...inputProps}
    >
      <Input
        ref={searchInputRef}
        fontSize='md'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <InputRightElement
        w={{ base: 'unset', md: 'initial' }}
        pr={{ base: 3, md: 0 }}
      >
        {value?.length > 0 && (
          <Icon
            cursor='pointer'
            onClick={onClear}
            as={CloseIcon}
          />
        )}
      </InputRightElement>
    </InputGroup>
  );
}

export default Search;
export { SearchToggle, SearchInput };
