import { Box, Divider, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { map } from 'lodash-es';
import { headingTheme } from '@styles/component-themes/heading.theme';
import { textTheme } from '@styles/component-themes/text.theme';
import { useTranslation } from 'react-i18next';

export default function TextSection() {
  const { t } = useTranslation();

  return (
    <HStack gap={12}>
      <Stack flex={1}>
        <Text fontWeight={600}>{t('textSection.textVariants')}</Text>
        <Divider />
        {map(textTheme.variants, (variantProps, variantName) => (
          <Box
            key={variantName}
            bgColor={variantProps.color?.includes('onPrimary') ? 'black' : 'initial'}
          >
            <Text {...variantProps}>{variantName}</Text>
          </Box>
        ))}
      </Stack>
      <Stack
        flex={1}
        alignSelf='flex-start'
        gap={12}
      >
        <Stack>
          <Text fontWeight={600}>{t('textSection.headingSizes')}</Text>
          <Divider />
          {map(headingTheme.sizes, (sizeProps, sizeName) => (
            <Heading
              key={sizeName}
              {...sizeProps}
              textTransform='capitalize'
            >
              {t('textSection.headingSize', { sizeName })}
            </Heading>
          ))}
        </Stack>
        <Stack>
          <Text fontWeight={600}>{t('textSection.headingVariants')}</Text>
          <Divider />
          {map(headingTheme.variants, (variantProps, variantName) => (
            <Heading
              key={variantName}
              {...variantProps()}
              textTransform='capitalize'
            >
              {t('textSection.headingVariant', { variantName })}
            </Heading>
          ))}
        </Stack>
      </Stack>
    </HStack>
  );
}
