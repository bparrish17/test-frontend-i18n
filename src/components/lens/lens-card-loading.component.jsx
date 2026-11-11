import { HStack, Stack, SkeletonCircle, SkeletonText, Skeleton } from '@chakra-ui/react';

export default function LensCardLoading() {
  return (
    <Stack
      gap={0}
      h='full'
    >
      <Stack
        flexGrow={1}
        px={3}
        py={5}
        gap='14px'
      >
        <SkeletonCircle
          w={6}
          h={6}
        />
        <Skeleton
          h='18px'
          w='75%'
        />
        <Skeleton
          h={4}
          w='25%'
        />
        <SkeletonText
          noOfLines={3}
          skeletonHeight='10px'
          spacing='10px'
          w='full'
        />
      </Stack>
      <HStack
        h='57px'
        px={3}
        py={4}
        borderTop='reskin'
      >
        <SkeletonCircle />
        <Skeleton
          w={40}
          h={4}
        />
      </HStack>
    </Stack>
  );
}
