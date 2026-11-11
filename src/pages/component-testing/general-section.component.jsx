import {
  Avatar,
  Box,
  Divider,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Tag,
  Text
} from '@chakra-ui/react';
import { map } from 'lodash-es';
import { useState } from 'react';

import { avatarTheme } from '@styles/component-themes/avatar.theme';
import { tagTheme } from '@styles/component-themes/tag.theme';
import { useTranslation } from 'react-i18next';

export default function GeneralSection() {
  const { t } = useTranslation();

  const [tagColorScheme, setTagColorScheme] = useState('surface');

  return (
    <Flex
      direction='row'
      wrap='wrap'
      gap={12}
    >
      <Item title={t('generalSection.divider')}>
        <Divider />
      </Item>
      <Item title={t('generalSection.avatar')}>
        {map({ ...avatarTheme.sizes, md: {}, lg: {}, xl: {} }, (_sizeProps, size) => (
          <Flex
            key={size}
            mb={1}
            align='center'
            gap={2}
          >
            <Text
              as='span'
              fontWeight={500}
            >
              {size}
            </Text>
            <Avatar
              size={size}
              src='https://external-preview.redd.it/0UF4Gqxwe330DKxNz1_GpmkwIDX0e_TyJdXbbkDVm78.jpg?auto=webp&s=5274a519198bd315bd9eb50c2cee0d9a7e0e8126'
            />
          </Flex>
        ))}
      </Item>
      <Item
        title={t('generalSection.tag')}
        flexProps={{ direction: 'column', wrap: 'nowrap' }}
      >
        <Box mb={6}>
          <Tag
            variant='label'
            size='xl'
          >
            {t('generalSection.labelVariantForForms')}
          </Tag>
        </Box>
        <RadioGroup
          size='sm'
          onChange={setTagColorScheme}
          value={tagColorScheme}
          mb={6}
        >
          <HStack>
            <Radio
              size='sm'
              value='brandPrimary'
            >
              {t('generalSection.brand')}
            </Radio>
            <Radio
              size='sm'
              value='caution'
            >
              {t('generalSection.caution')}
            </Radio>
            <Radio
              size='sm'
              value='critical'
            >
              {t('generalSection.critical')}
            </Radio>
          </HStack>
        </RadioGroup>
        <Flex
          mb={1}
          align='center'
          justify='flex-end'
          gap={2}
          fontWeight={500}
          textAlign='end'
        >
          <Box w={40} />
          <Text flex={1}>{t('generalSection.solid')}</Text>
          <Text flex={1}>{t('generalSection.subtle')}</Text>
          <Text flex={1}>{t('generalSection.new')}</Text>
        </Flex>
        {map({ sm: {}, md: {}, lg: {}, ...tagTheme.sizes }, (_sizeProps, size) => (
          <Flex
            key={size}
            mb={1}
            align='center'
            gap={2}
          >
            <Text
              as='span'
              fontWeight={500}
            >
              {size}
            </Text>
            <Spacer />
            {['solid', 'subtle', 'new'].map((variant) => (
              <Tag
                size={size}
                variant={variant}
                colorScheme={tagColorScheme}
                key={`${size}-${variant}`}
              >
                {variant === 'new' ? t('generalSection.new') : t('generalSection.howdyPartner')}
              </Tag>
            ))}
          </Flex>
        ))}
      </Item>
    </Flex>
  );
}

function Item({ title, flexProps = {}, children }) {
  return (
    <Stack minW='500px'>
      <Text variant='body-600-md'>{title}</Text>
      <Flex
        layerStyle='section-card'
        direction='row'
        wrap='wrap'
        gap={4}
        p={8}
        {...flexProps}
      >
        {children}
      </Flex>
    </Stack>
  );
}
