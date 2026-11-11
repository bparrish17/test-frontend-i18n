import { HStack, Stack, Skeleton, SkeletonCircle, Spacer } from '@chakra-ui/react';
import { getNumberArray } from '@util/helpers';

export default function RightRailSkeleton() {
  return (
    <Stack p={6}>
      <HStack>
        <Skeleton
          w='15%'
          h={4}
        />
        <Skeleton
          w='15%'
          h={4}
        />
        <Skeleton
          w='15%'
          h={4}
        />
        <Spacer />
        <Skeleton
          w='10%'
          h={4}
        />
      </HStack>
      <Skeleton
        w='40%'
        h={4}
        mt={10}
        mb={5}
      />
      <HStack mb={5}>
        <Skeleton
          w='4%'
          h={4}
        />
        <Skeleton
          w='30%'
          h={4}
        />
      </HStack>
      <HStack mb={5}>
        <Skeleton
          w='4%'
          h={4}
        />
        <Skeleton
          w='40%'
          h={4}
        />
      </HStack>
      <HStack mb={5}>
        <Skeleton
          w='4%'
          h={4}
        />
        <Skeleton
          w='20%'
          h={4}
        />
      </HStack>
      <HStack mb={5}>
        <Skeleton
          w='4%'
          h={4}
        />
        <Skeleton
          w='24%'
          h={4}
        />
      </HStack>
      <HStack mb={5}>
        <Skeleton
          w='4%'
          h={4}
        />
        <Skeleton
          w='28%'
          h={4}
        />
      </HStack>
      <Skeleton
        w='15%'
        h={4}
        mt={10}
        mb={5}
      />
      {getNumberArray(3).map((index) => (
        <HStack
          mb={5}
          key={index}
        >
          <SkeletonCircle
            w='4%'
            h={4}
          />
          <Stack flex={1}>
            <Skeleton
              w='17%'
              h={3}
            />
            <Skeleton
              w='24%'
              h={2}
            />
          </Stack>
        </HStack>
      ))}
    </Stack>
  );
}
