import { Stack, Skeleton, SkeletonCircle, HStack } from '@chakra-ui/react';

export default function PersonSkeleton() {
  return (
    <HStack>
      <SkeletonCircle
        w={10}
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
  );
}
