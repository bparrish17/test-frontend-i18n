import { Stack, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { Card } from '@components/general/card/card-structure';

export default function SummaryCardSkeleton() {
  return (
    <Card
      w='full'
      pt='18px'
      p={6}
      gap={10}
      rounded={{ base: 'none', sm: '2xl' }}
    >
      <Stack gap={4}>
        <Skeleton
          w={40}
          h='18px'
        />
        <Skeleton
          w='60%'
          h={6}
        />
      </Stack>

      <Stack gap={5}>
        <Skeleton
          w='70%'
          h={4}
        />
        <Skeleton
          w='70%'
          h={4}
        />
        <Skeleton
          w='70%'
          h={4}
        />
      </Stack>
      <HStack
        alignItems='center'
        gap={4}
      >
        <SkeletonCircle />
        <Skeleton
          w={64}
          h={4}
        />
      </HStack>
    </Card>
  );
}
