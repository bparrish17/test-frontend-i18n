import { Button, Icon, Stack } from '@chakra-ui/react';

export default function TableOfContents({ sections, closestRefIndex, onSectionClick }) {
  return (
    <Stack gap={5}>
      {sections.map((section, sectionIndex) => (
        <SectionLinkButton
          key={section.name}
          name={section.name}
          icon={section.icon}
          isHighlighted={closestRefIndex === sectionIndex}
          iconProps={section.iconProps}
          onClick={() => onSectionClick(sectionIndex)}
        />
      ))}
    </Stack>
  );
}

function SectionLinkButton({ name, icon, isHighlighted, iconProps, onClick }) {
  return (
    <Button
      variant='link'
      color={isHighlighted ? 'brandPrimary.primary' : 'surface.onSurfaceVariant'}
      fontWeight={500}
      lineHeight={7}
      leftIcon={
        <Icon
          as={icon}
          boxSize={7}
          {...iconProps}
        />
      }
      w='fit-content'
      onClick={onClick}
    >
      {name}
    </Button>
  );
}
