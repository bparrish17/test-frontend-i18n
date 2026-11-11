import { Box, Divider, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { keys, map } from 'lodash-es';
import { semanticTokens } from '@styles/semantic-tokens.theme';
import { colors } from '@styles/colors.theme';
import { useTranslation } from 'react-i18next';

export function ColorTokensSection() {
  const { t } = useTranslation();

  return (
    <Stack gap={12}>
      <Flex gap={24}>
        <ColorPaletteSectionGroup heading={t('tokenPaletteSection.general')}>
          {['surface', 'neutral', 'etc'].map((tokenGroupName) => (
            <PaletteStack
              key={tokenGroupName}
              tokenGroupName={tokenGroupName}
              tokenGroup={semanticTokens.colors[tokenGroupName]}
            />
          ))}
        </ColorPaletteSectionGroup>
        <ColorPaletteSectionGroup heading={t('tokenPaletteSection.brand')}>
          {['brandPrimary', 'brandSecondary', 'brandTertiary'].map((tokenGroupName) => (
            <PaletteStack
              key={tokenGroupName}
              tokenGroupName={tokenGroupName}
              tokenGroup={semanticTokens.colors[tokenGroupName]}
            />
          ))}
        </ColorPaletteSectionGroup>
      </Flex>
      <ColorPaletteSectionGroup heading={t('tokenPaletteSection.statusStates')}>
        {['positive', 'caution', 'critical', 'live'].map((tokenGroupName) => (
          <PaletteStack
            key={tokenGroupName}
            tokenGroupName={tokenGroupName}
            tokenGroup={semanticTokens.colors[tokenGroupName]}
          />
        ))}
      </ColorPaletteSectionGroup>

      <ColorPaletteSectionGroup heading={t('tokenPaletteSection.tags')}>
        {keys(semanticTokens.colors)
          .filter((key) => key.toLowerCase().includes('tag'))
          .map((tokenGroupName) => (
            <PaletteStack
              key={tokenGroupName}
              tokenGroupName={tokenGroupName}
              tokenGroup={semanticTokens.colors[tokenGroupName]}
            />
          ))}
      </ColorPaletteSectionGroup>
    </Stack>
  );
}

function ColorPaletteSectionGroup({ heading, children }) {
  return (
    <Stack gap={4}>
      <Heading size='md'>{heading}</Heading>
      <Divider />
      <Flex
        gap={12}
        wrap='wrap'
        mt={2}
      >
        {children}
      </Flex>
    </Stack>
  );
}

export function ColorPaletteSection() {
  return (
    <Flex
      direction='row'
      wrap='wrap'
      gap={12}
    >
      {map(colors, (colorGroup, colorGroupName) => {
        if (colorGroupName !== 'legacyForaBlue') {
          return (
            <PaletteStack
              key={colorGroupName}
              tokenGroup={colorGroup}
              tokenGroupName={colorGroupName}
            />
          );
        } else {
          return null;
        }
      })}
    </Flex>
  );
}

function PaletteStack({ tokenGroup, tokenGroupName }) {
  return (
    <Stack>
      <Text
        fontSize='sm'
        fontWeight={600}
      >
        {tokenGroupName}
      </Text>
      {map(tokenGroup, (tokenColor, tokenName) => (
        <HStack key={tokenName}>
          <Box
            key={`${tokenGroupName}.${tokenName}`}
            w={10}
            h={10}
            border='reskin'
            borderRadius='md'
            bgColor={`${tokenGroupName}.${tokenName}`}
          />
          <Stack gap={0}>
            <Text
              fontSize='xs'
              fontWeight={500}
            >
              {tokenName}
            </Text>
            <Text fontSize='2xs'>{tokenColor}</Text>
          </Stack>
        </HStack>
      ))}
    </Stack>
  );
}
