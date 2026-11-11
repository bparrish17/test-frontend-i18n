import { Stack, HStack, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { memo } from 'react';
import { generateRandomNumber } from '@util/helpers';

const getRandomWidth = (a, b) => `${generateRandomNumber(a, b)}px`;

function MeetingCardSkeleton() {
  return (
    <Stack
      p={4}
      pr={6}
      gap={2}
    >
      <Skeleton
        w={24}
        h='20px'
      />
      <HStack mt='5px'>
        <SkeletonCircle size={6} />
        <Skeleton
          h='20px'
          w={getRandomWidth(240, 300)}
        />
      </HStack>
      <HStack>
        <SkeletonCircle size={6} />
        <Skeleton
          h='16px'
          w={getRandomWidth(180, 240)}
        />
      </HStack>
      <HStack align='flex-start'>
        <SkeletonCircle size={6} />
        <SkeletonText
          pt={1}
          noOfLines={generateRandomNumber(1, 2)}
          skeletonHeight={3}
          w='full'
        />
      </HStack>
    </Stack>
  );
}

export default memo(MeetingCardSkeleton);
