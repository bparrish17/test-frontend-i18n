import { Flex, Stack, Skeleton, StackDivider, Spacer } from '@chakra-ui/react';

export default function PersonCardSkeleton() {
  return (
    <Stack
      layerStyle='card'
      gap={8}
      px={8}
      py={8}
      divider={<StackDivider style={{ margin: 0 }} />}
      bgColor='white'
      boxShadow='md'
    >
      <Flex gap={4}>
        <Skeleton
          w={20}
          h={20}
        />
        <Stack
          pt={1}
          pb={2}
        >
          <Skeleton
            h={6}
            w='200px'
          />
          <Spacer />
          <Skeleton
            h={3}
            w='100px'
          />
          <Skeleton
            h={3}
            w='80px'
          />
        </Stack>
      </Flex>

      <Stack gap={6}>
        <Skeleton
          h={3}
          w='200px'
        />
        <EmploymentHistoryPositionSkeleton />
        <EmploymentHistoryPositionSkeleton />
      </Stack>
    </Stack>
  );
}

function EmploymentHistoryPositionSkeleton() {
  return (
    <Flex gap={20}>
      <Flex gap={4}>
        <Skeleton
          w={9}
          h={9}
        />
        <Stack gap={2}>
          <Skeleton
            h={3}
            w='100px'
          />
          <Skeleton
            h={3}
            w='150px'
          />
        </Stack>
      </Flex>
      <Stack gap={2}>
        <Skeleton
          h={3}
          w='120px'
        />
        <Skeleton
          h={3}
          w='80px'
        />
      </Stack>
    </Flex>
  );
}
