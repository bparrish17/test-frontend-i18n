import { IconButton } from '@chakra-ui/react';
import { FilterIcon } from '@assets/icons';
import SuperscriptBadge from '@components/general/superscript-badge.component';

export default function FeedFiltersToggle({
  isFilterMenuOpen,
  hasActiveFilters,
  activeFilterCount,
  onToggleFilterMenu
}) {
  const filterButtonProps = isFilterMenuOpen
    ? {
        variant: 'outline',
        color: 'legacyForaBlue',
        bgColor: 'white'
      }
    : {
        variant: 'ghost',
        color: hasActiveFilters ? 'legacyForaBlue' : 'surface.onSurfaceVariant '
      };

  const FilterButton = () => (
    <IconButton
      size='lg'
      icon={<FilterIcon fontSize='24px' />}
      isRound
      {...filterButtonProps}
      onClick={onToggleFilterMenu}
    />
  );

  if (activeFilterCount > 0) {
    return (
      <SuperscriptBadge
        badgeContent={activeFilterCount}
        rightOffset={-1.5}
      >
        <FilterButton
          isFilterMenuOpen={isFilterMenuOpen}
          hasActiveFilters={hasActiveFilters}
          onToggleFilterMenu={onToggleFilterMenu}
        />
      </SuperscriptBadge>
    );
  } else {
    return <FilterButton />;
  }
}
