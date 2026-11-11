# Conventions for App-Wide Theming and Style Defaults

## Styles

### Colors

Use `semantic-tokens.theme.js` values **ALWAYS**

Use `surface` for almost all main gray/black variations.

`neutral` isn't really used yet but Josh requested it... leaving it here for now

If configuring component variants to work with `colorScheme` you might have to map the values to their respective darkness integer. E.g. `colorScheme` may expect a color with `<color>.100` -> `<color>.1000` values. If that's the case you can either update the theme to accept our semantic token sets or you can provide the root `colors.theme.js` like `brand_blue`, `brand_light_blue`, etc.

To see the full palettes laid out, go to [Component Testing](https://app.fora.day/component-testing) -> Color Tokens, Color Palettes

Check out

### Widths, Heights, Padding, Margin, Spacing, Font Sizes, Radii, etc.

We follow all default sizing of Chakra almost to a tee, with some additions. We've added some intermediate values that don't exist by default (e.g. 11) for 44px. For a helpful reference, use this [spreadsheet](https://docs.google.com/spreadsheets/d/1ARY0FapUk1trsRcNNq6N2z_0QJt0NGwfymhqUlc4zOM/edit?gid=0#gid=0)

If a value exists on this chart, then it should be used. Pixel values should not be used unless:

- it's an intermediate value that doesn't make sense for the chart ratio (4px to 1rem)
- it's a weirdly specific Figma defined value (like decimals)
- (obvi) if it's not a Chakra element and these values aren't accepted, or it's in the sx/css props

### Borders

We almost exclusively use the borders defined in `theme.js`

- `reskin`: solid, 1px, surface.outlineVariant
- `reskinDark`: solid, 1px, surface.outline
- `thick`: solid, 2px, surface.outlineVariant

If defining your own borders, `outlineVariant` is almost always the default value

### Additional Styles

- If using a style regularly and it doesn't merit a full component, `layerStyles` are a helpful option. For example, we regularly have a main page section card with the same border radius, background, etc. For that you can use `layerStyle='section-card'` on a `Stack` or `Box` to apply.

<br>

## Components

### Icon

In pretty much all Figma designs since the summer redesign we've been using SF symbols. These values need to be added manually as SVGs into the repo. When pasting in the repo,

- update the `svg` element to be chakra-ui's `Icon`
- update the root `Icon` element's fill to be `currentColor`
- remove fill from any child svg rects/paths
- make sure the `Icon` width and height values are "18px" instead of like {18}
- make sure at the bottom of the `Icon` props you have {...props}

Because all SF Icons are already wrapped in the Chakra `Icon` component, you don't need to do `<Icon as={SFIconHere}` as it's redundant. Any other icons you will have to do `<Icon as={IconName}>`.

However, moving forward SF Icons should be used in 95%+ of use cases. If it's not in the repo, you can add it from figma.

### Text

Figma uses variants to encapsulate a set of styling. These variants are all listed in `text.theme.js`. If a theme is on the figma, then just add it e.g.

```jsx
<Text variant='body-600-sm'>quick brown fox</Text>
```

Variants don't typically include color, so colors should be provided separately, e.g.

```jsx
<Text
  variant='body-600-sm'
  color='surface.onSurfaceVariant'
>
  quick brown fox
</Text>
```

If variants is not yet added to our text theme feel free to add it

The color `surface.onSurface` is by default and should not need to be declared unless overwriting a container's font color.

If text is a child of a `Box` or other Chakra element, you don't need to wrap the child text inside it's own `Text` component. Instead you can just use the `textStyle` prop and pass the text variant, e.g.

```jsx
<Box textStyle='body-600-sm'>shawty get low</Box>
```

If using manual text styling, follow these guidelines:

- `color`: from `semantic-tokens.theme.js` ONLY
- `fontWeight`: integer value, e.g. `fontWeight={500}` (400 is default)
- `fontSize`: `2xs | xs | sm | md | lg | xl`

### Heading

Heading sizes that match figma headings are configured in the `heading.theme.js` file. The variants however are a bit out of sorts as of right now.

### Button

Use the `reskin` prefixed variants and sizes. The default variants (primary, secondary, ghost, link) have not yet been overwritten since we have not gotten to it yet. The default sizes have not been updated to our sizing. Note that the `reskinLink` variant doesn't reflect a link-style appearance in the same way that the default does. If you provide a color scheme that matches one of the root properties in `semantic-tokens.theme.js` it'll automatically configure colors. e.g.

```jsx
<Button
  size='reskinMd'
  variant='reskinPrimary'
  colorScheme='brandTertiary'
>
  click me
</Button>
```

Default colorScheme is `brandPrimary`

See configurations in [Component Testing](https://app.fora.day/component-testing) -> Button section for more examples/configurations.

### Toasts and Alerts

`Toast` and `Alert` components have been configured to leverage our color schemes relative to the "status" of the pop up. e.g.

```jsx
<Alert
  status='warning'
  variant='subtle'
>
  road work ahead? uh yeah i sure HOPE it does
</Alert>
```

will apply the `caution` color theme with lighter container colors

### Selects

We are going to try and use `CustomSelect` moving forward. It requires a bit more configuration but is way more flexible and can match what design asks of us. I've asked design to keep the variations somewhat consistent, and have added respective `size` options to use in most cases. If one is added, we should add it as a size.

You can reference the "Developer" -> "React Select Playground" page in Fora Admin to get descriptions of all the components that make up custom select and how to style them.

### All Other Components

Before custom-styling something PLEASE check in the [Component Testing Page](https://app.fora.day/component-testing), the theme file for that component, or other instances. If your needed size/variant already exists please add it to the them file and update the other instance retroactively.
