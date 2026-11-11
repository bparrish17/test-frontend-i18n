import { Button, HStack, SimpleGrid, Spacer, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

import PersonPreview from '@components/general/avatar-preview/person-preview.component';
import ContactSourceIcon from '@components/general/contact-source-icon.component';

/**
 * @param {Object} props
 * @param {Person[]} props.people
 * @param {(person: Person) => React.ReactNode} [props.personRightElement]
 * @param {(person: Person) => Object} [props.personPreviewProps]
 * @param {number} [props.initialMaxPeople=6]
 */
export default function ReskinPeopleStack({
  personRightElement,
  personPreviewProps,
  people,
  initialMaxPeople = 6
}) {
  const [maxPeople, setMaxPeople] = useState(initialMaxPeople);
  if (!people?.length) return null;

  return (
    <Stack gap={6}>
      <Text variant='content-section-header'>People</Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 1 }}
        gap={8}
      >
        {people?.slice(0, maxPeople)?.map((person) => (
          <HStack
            key={person?.email}
            maxW='600px'
          >
            <PersonPreview
              size='lg'
              person={person}
              nameProps={{ fontSize: 'md' }}
              titleProps={{ fontSize: 'sm' }}
              avatarBadge={
                <ContactSourceIcon
                  contact={person?.contactProfile}
                  boxSize='21px'
                  position='absolute'
                  bottom={-1.5}
                  left={-1.5}
                />
              }
              {...(personPreviewProps?.(person) ?? {})}
            />
            <Spacer />
            {personRightElement?.({ person })}
          </HStack>
        ))}
      </SimpleGrid>
      {people?.length > maxPeople && !!maxPeople && (
        <Button
          data-testid='see-more-button'
          w='fit-content'
          variant='link'
          color='brandPrimary.primary'
          onClick={() => setMaxPeople(undefined)}
        >
          <Text variant='title-lighter-sm'>See {people?.length - maxPeople} More</Text>
        </Button>
      )}
    </Stack>
  );
}
