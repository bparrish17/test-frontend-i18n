import { HStack, IconButton, Stack, Text, Tooltip } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { CloseIcon, SFSparkleStarIcon } from '@assets/icons';
import { useBreakpoints } from '@util/hooks';
import { useTranslation } from 'react-i18next';

/**
 * @typedef {Object} LabelProps
 * @property {Initiative} label
 * @property {boolean} isEditing - enables remove button
 * @property {() => void} onRemove
 * @property {Labeled["match"]} match
 *
 * @param {LabelProps} props
 */
const Label = ({ label, isEditing, onRemove, match = 'Manual', ...props }) => {
  const isGenerated = match === 'Auto';
  const { isDesktop } = useBreakpoints();

  const content = (
    <LabelContent
      label={label}
      isEditing={isEditing}
      onRemove={onRemove}
      isGenerated={isGenerated}
      {...props}
    />
  );

  if (isDesktop) {
    return (
      <LabelTooltip
        label={label}
        isEditing={isEditing}
        isGenerated={isGenerated}
      >
        {content}
      </LabelTooltip>
    );
  }

  return content;
};

const LabelContent = forwardRef(({ label, isEditing, isGenerated, onRemove, ...props }, ref) => {
  return (
    <HStack
      ref={ref}
      data-testid='label-container'
      h={6}
      bgColor='brandSecondary.container'
      color='brandSecondary.onContainer'
      px={2}
      gap={1}
      rounded='lg'
      {...props}
    >
      <Text variant='label-reg-md'>{label?.title}</Text>
      {isEditing && (
        <IconButton
          data-testid='label-remove-button'
          colorScheme='brandSecondary'
          isRound
          boxSize={4}
          size='reskin2xs'
          variant='reskinGhost'
          icon={<CloseIcon boxSize={2} />}
          onClick={onRemove}
        />
      )}
      {!isEditing && isGenerated && <SFSparkleStarIcon data-testid='ai-label-icon' />}
    </HStack>
  );
});

const LabelTooltip = ({ children, label, isEditing, isGenerated }) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      data-testid='label-tooltip'
      isDisabled={isEditing}
      // bgColor='etc.scrim_90'
      // arrowShadowColor='etc.scrim_90'
      color='brandPrimary.onPrimary'
      p={3}
      hasArrow
      borderRadius='md'
      label={
        <Stack>
          <Text variant='title-lighter-sm'>{label?.title}</Text>
          <Text
            variant='label-600-md'
            color='surface.outlineVariant'
          >
            {label?.description}
          </Text>
          <Text
            data-testid='label-tooltip-ai-label'
            variant='label-700-sm'
            color='brandSecondary.primary'
          >
            {isGenerated ? t('label.addedByAi') : t('label.addedByYourTeam')}
          </Text>
        </Stack>
      }
    >
      {children}
    </Tooltip>
  );
};

export default Label;
