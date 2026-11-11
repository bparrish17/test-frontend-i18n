import { Text, Flex, HStack, Image, Heading } from '@chakra-ui/react';
import { format } from 'date-fns';
import { formatCronToHumanReadable } from '@util/helpers';
import { useTranslation } from 'react-i18next';

export default function DigestCard({ digest, logo, children, gap = 1 }) {
  const { t } = useTranslation();

  const scheduleString = formatCronToHumanReadable(digest?.schedule, digest?.next_run_at);
  const isDisabled = !digest?.next_run_at;

  return (
    <Flex
      flexDir='column'
      gap='18px'
      p={6}
      bgColor='white'
      border='reskin'
      rounded='xl'
      w='full'
    >
      <Text
        fontWeight={500}
        fontSize='sm'
        color='brandPrimary.primary'
      >
        {digest?.initiative?.title}
      </Text>
      <HStack gap={5}>
        <Image
          src={logo}
          alt={t('digestCard.slackLogoAlt')}
          h='54px'
        />
        <Flex
          flexDir='column'
          gap={2}
        >
          <Heading fontSize='24px'>{digest?.name}</Heading>
          {digest?.created_at && (
            <Text
              fontSize='sm'
              color='surface.onSurfaceVariant'
            >
              Started on {format(new Date(digest.created_at), 'MM/dd/yyyy')},
              {isDisabled ? t('digestCard.disabled') : ` updated ${scheduleString}`}
            </Text>
          )}
        </Flex>
      </HStack>
      <Flex
        flexDir='column'
        gap={gap}
        p={4}
        border='reskin'
        rounded='xl'
      >
        {children}
      </Flex>
    </Flex>
  );
}
