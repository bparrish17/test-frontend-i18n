import { Text, HStack, Spacer, Stack } from '@chakra-ui/react';

/**
 * @typedef {Object} MeetingPageSectionProps
 * @property {MeetingPageSection} section
 * @property {React.ReactNode} children
 *
 * @param {MeetingPageSectionProps} props
 */
export default function MeetingPageSection({
  section,
  hideHeader = false,
  headerProps = {},
  headerChildren,
  children,
  gap = 8,
  ...containerProps
}) {
  if (!section?.enabled) {
    return null;
  }

  const { ref, order, name } = section;

  return (
    <Stack
      order={order}
      ref={ref}
      gap={gap}
      {...containerProps}
    >
      {!hideHeader && (
        <HStack {...headerProps}>
          <Text
            variant='content-section-header'
            color='surface.onSurfaceVariant'
          >
            {name}
          </Text>
          <Spacer />
          {headerChildren}
        </HStack>
      )}
      {children}
    </Stack>
  );
}
