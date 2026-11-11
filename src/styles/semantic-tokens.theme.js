// it's recommended to not use the raw colors below, but instead the mapped tokens (like surface.surface)
export const semanticTokens = {
  colors: {
    /****************************************************
     * GENERAL
     ****************************************************/
    surface: {
      containerLowest: 'light_material.0',
      containerLow: 'light_material.25',
      container: 'light_material.50',
      containerHigh: 'light_material.75',
      containerHighest: 'light_material.100',

      surface: 'light_material.50',
      surfaceDim: 'light_material.100',
      surfaceBright: 'light_material.0',
      onSurface: 'light_material.1000',
      onSurfaceVariant: 'light_material.600',
      inverseSurface: 'light_material.900',
      inverseOnSurface: 'light_material.200',
      outline: 'light_material.500',
      outlineVariant: 'light_material.150'
    },
    neutral: {
      primary: 'neutral.500',
      primaryDim: 'neutral.550',
      primaryDimmer: 'neutral.600',
      onPrimary: 'neutral.0',
      containerLow: 'neutral.25',
      container: 'neutral.50',
      containerHigh: 'neutral.100',
      onContainer: 'neutral.700',
      inverse: 'neutral.400',
      onSurface: 'neutral.850',
      fixed: 'neutral.300',
      outline: 'neutral.450',
      outlineVariant: 'neutral.250'
    },
    etc: {
      whiteFixed: '#FFFFFF',
      blackFixed: '#000000',
      shadow: 'scrim.100',
      scrim_10: 'scrim.100',
      scrim_30: 'scrim.300',
      scrim_50: 'scrim.500',
      scrim_70: 'scrim.700',
      scrim_90: 'scrim.900'
    },
    /****************************************************
     * BRAND
     ****************************************************/
    brandPrimary: {
      primary: 'brand_blue.500',
      primaryDim: 'brand_blue.550',
      primaryDimmer: 'brand_blue.600',
      onPrimary: 'brand_blue.0',
      containerLow: 'brand_blue.25',
      container: 'brand_blue.50',
      containerHigh: 'brand_blue.100',
      onContainer: 'brand_blue.700',
      inverse: 'brand_blue.400',
      onSurface: 'brand_blue.850',
      fixed: 'brand_blue.300',
      outline: 'brand_blue.450',
      outlineVariant: 'brand_blue.250'
    },
    brandSecondary: {
      primary: 'brand_light_blue.500',
      primaryDim: 'brand_light_blue.550',
      primaryDimmer: 'brand_light_blue.600',
      onPrimary: 'brand_light_blue.0',
      containerLow: 'brand_light_blue.25',
      container: 'brand_light_blue.50',
      containerHigh: 'brand_light_blue.100',
      onContainer: 'brand_light_blue.700',
      inverse: 'brand_light_blue.400',
      onSurface: 'brand_light_blue.850',
      fixed: 'brand_light_blue.300',
      outline: 'brand_light_blue.450',
      outlineVariant: 'brand_light_blue.250'
    },
    brandTertiary: {
      primary: 'brand_purple.500',
      primaryDim: 'brand_purple.550',
      primaryDimmer: 'brand_purple.600',
      onPrimary: 'brand_purple.0',
      containerLow: 'brand_purple.25',
      container: 'brand_purple.50',
      containerHigh: 'brand_purple.100',
      onContainer: 'brand_purple.700',
      inverse: 'brand_purple.400',
      onSurface: 'brand_purple.850',
      fixed: 'brand_purple.300',
      outline: 'brand_purple.450',
      outlineVariant: 'brand_purple.250'
    },
    /****************************************************
     * STATUS / STATE COLORS
     ****************************************************/
    positive: {
      primary: 'green_system.500',
      primaryDim: 'green_system.550',
      primaryDimmer: 'green_system.600',
      onPrimary: 'green_system.0',
      containerLow: 'green_system.25',
      container: 'green_system.50',
      containerHigh: 'green_system.100',
      onContainer: 'green_system.700',
      inverse: 'green_system.400',
      onSurface: 'green_system.850',
      fixed: 'green_system.300',
      outline: 'green_system.450',
      outlineVariant: 'green_system.250'
    },
    critical: {
      primary: 'red_system.500',
      primaryDim: 'red_system.550',
      primaryDimmer: 'red_system.600',
      onPrimary: 'red_system.0',
      containerLow: 'red_system.25',
      container: 'red_system.50',
      containerHigh: 'red_system.100',
      onContainer: 'red_system.700',
      inverse: 'red_system.400',
      onSurface: 'red_system.850',
      fixed: 'red_system.300',
      outline: 'red_system.450',
      outlineVariant: 'red_system.250'
    },
    caution: {
      primary: 'yellow_system.500',
      primaryDim: 'yellow_system.550',
      primaryDimmer: 'yellow_system.600',
      onPrimary: 'yellow_system.0',
      containerLow: 'yellow_system.25',
      container: 'yellow_system.50',
      containerHigh: 'yellow_system.100',
      onContainer: 'yellow_system.700',
      inverse: 'yellow_system.400',
      onSurface: 'yellow_system.850',
      fixed: 'yellow_system.300',
      outline: 'yellow_system.450',
      outlineVariant: 'yellow_system.250'
    },
    live: {
      // note: this palette is a mini version of critical
      // I kept it separate in the case that there is a change in the future where
      // "critical" and "live" reds separate again
      primary: 'red_system.500',
      primaryDim: 'red_system.550',
      primaryDimmer: 'red_system.600',
      onPrimary: 'red_system.0',
      container: 'red_system.50'
    },
    /****************************************************
     * TAGS
     ****************************************************/
    goldTag: {
      primary: 'gold_tag.500',
      onPrimary: 'gold_tag.0',
      containerLow: 'gold_tag.25',
      container: 'gold_tag.50',
      containerHigh: 'gold_tag.100'
    },
    sunsetTag: {
      primary: 'sunset_tag.500',
      onPrimary: 'sunset_tag.0',
      containerLow: 'sunset_tag.25',
      container: 'sunset_tag.50',
      containerHigh: 'sunset_tag.100'
    },
    tealTag: {
      primary: 'teal_tag.500',
      onPrimary: 'teal_tag.0',
      containerLow: 'teal_tag.25',
      container: 'teal_tag.50',
      containerHigh: 'teal_tag.100'
    },
    magentaTag: {
      primary: 'magenta_tag.500',
      onPrimary: 'magenta_tag.0',
      containerLow: 'magenta_tag.25',
      container: 'magenta_tag.50',
      containerHigh: 'magenta_tag.100'
    },
    fuchsiaTag: {
      primary: 'fuchsia_tag.500',
      onPrimary: 'fuchsia_tag.0',
      containerLow: 'fuchsia_tag.25',
      container: 'fuchsia_tag.50',
      containerHigh: 'fuchsia_tag.100'
    },
    emeraldTag: {
      primary: 'emerald_tag.500',
      onPrimary: 'emerald_tag.0',
      containerLow: 'emerald_tag.25',
      container: 'emerald_tag.50',
      containerHigh: 'emerald_tag.100'
    },
    blueTag: {
      primary: 'blue_tag.500',
      onPrimary: 'blue_tag.0',
      containerLow: 'blue_tag.25',
      container: 'blue_tag.50',
      containerHigh: 'blue_tag.100'
    }
  }
};
