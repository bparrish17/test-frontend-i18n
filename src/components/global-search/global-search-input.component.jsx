import { Box, Flex, Spacer, Input, Icon } from '@chakra-ui/react';
import { CloseIcon, SearchIconBold } from '@assets/icons';
import { useGlobalSearchStore } from '@store/app.store';
import { useBreakpointValue, useIsUserType } from '@util/hooks';

export default function GlobalSearchInput({
  globalSearchQuery,
  showIcon,
  children,
  ...containerProps
}) {
  const {
    input,
    setInput,
    inputRef,
    isInputFocused,
    setIsInputFocused,
    isExpanded,
    setIsExpanded
  } = useGlobalSearchStore();
  const pushRecentSearch = useGlobalSearchStore((state) => state.pushRecentSearch);
  const isExecutiveOrAdmin = useIsUserType('Executive', 'Admin');

  const handleInput = (e) => {
    const val = e?.target?.value;
    setInput(val);
    setIsExpanded(val?.length > 0);
  };

  const handleClearClick = (e) => {
    e?.stopPropagation();
    setInput('');
    setIsExpanded(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      pushRecentSearch(input);
    }
  };

  const placeholderText = useBreakpointValue({
    base: 'Search your organizational data',
    lg: isExecutiveOrAdmin
      ? 'Find Lens Insights, Summaries, Meetings, People & Companies...'
      : 'Find Summaries, Meetings, People & Companies...'
  });

  return (
    <Box
      borderRadius='xl'
      w='full'
      bgColor={isInputFocused ? 'white' : 'whiteAlpha.200'}
      border='solid 1px'
      borderColor={isInputFocused ? 'surface.outlineVariant' : 'transparent'}
      boxShadow={(isExpanded || isInputFocused) && 'xl'}
      {...containerProps}
    >
      <Flex
        px={{ base: 3, lg: '14px' }}
        gap={{ base: 2, lg: 3 }}
        alignItems='center'
        w='full'
        py={{ base: 2, lg: '10px' }}
      >
        {showIcon && (
          <Icon
            as={SearchIconBold}
            color={isInputFocused ? 'surface.onSurfaceVariant' : 'brandPrimary.onPrimary'}
            cursor='pointer'
            onClick={() => inputRef.current?.focus()}
          />
        )}
        <Input
          ref={inputRef}
          variant='unstyled'
          minH='fit-content'
          value={input}
          color={
            isInputFocused
              ? 'surface.onSurfaceVariant'
              : { base: 'surface.onSurfaceVariant', lg: 'brandPrimary.onPrimary' }
          }
          placeholder={isInputFocused ? placeholderText : ''}
          onChange={handleInput}
          onFocus={() => {
            setIsInputFocused(true);
            setIsExpanded(globalSearchQuery?.length > 0);
          }}
          onKeyDown={handleKeyDown}
        />
        {isInputFocused && input?.length > 0 && (
          <>
            <Spacer />
            <CloseIcon
              cursor='pointer'
              onClick={handleClearClick}
            />
          </>
        )}
      </Flex>
      {children}
    </Box>
  );
}
