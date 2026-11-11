import { Stack, Flex, Skeleton, SkeletonCircle, HStack } from '@chakra-ui/react';
import { getNumberArray } from '@util/helpers';
import PersonSkeleton from '@components/general/avatar-preview/person-skeleton.component';

export default function AgendaRightRailSkeleton() {
  return (
    <Stack
      gap={11}
      p={11}
    >
      <HStack
        gap={8}
        mb={5}
      >
        <Skeleton
          w='20%'
          h={3}
        />
        <Skeleton
          w='15%'
          h={3}
        />
        <Skeleton
          w='10%'
          h={3}
        />
      </HStack>
      <Stack>
        <Flex gap={2.5}>
          <Skeleton
            w='20%'
            h={3}
          />
          <Stack
            flex={1}
            gap={1}
            pl={5}
          >
            <Skeleton
              w='35%'
              h={3}
            />
            <Skeleton
              w='25%'
              h={3}
            />
            <Skeleton
              w='30%'
              h={3}
            />
          </Stack>
        </Flex>
        <Flex gap={2.5}>
          <Skeleton
            w='22%'
            h={3}
          />
          <Skeleton
            w='15%'
            h={3}
            ml={3}
          />
        </Flex>
      </Stack>
      <PeopleSkeleton />
      <OrganizationSkeleton />
    </Stack>
  );
}

function PeopleSkeleton() {
  return (
    <Stack>
      <Skeleton
        w='15%'
        h={4}
        mt={10}
        mb={5}
      />
      {getNumberArray(5).map((index) => (
        <PersonSkeleton key={index} />
      ))}
    </Stack>
  );
}

function OrganizationSkeleton() {
  return (
    <Stack>
      <Skeleton
        w='25%'
        h={4}
        mt={10}
        mb={5}
      />
      <HStack mb={5}>
        <SkeletonCircle
          w='10%'
          h={10}
        />
        <Stack flex={1}>
          <Skeleton
            w='40%'
            h={3}
          />
          <Skeleton
            w='60%'
            h={2}
          />
        </Stack>
      </HStack>
    </Stack>
  );
}
