import { Icon, HStack, Text, useRadio, useRadioGroup } from '@chakra-ui/react';

import { useBreakpoints } from '@util/hooks';
import { SFEnvelopeIcon, SFSquareArrowUp, SFSquareArrowDown } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export default function ShareTypeRadioGroup({ enableShareViaWeb, ...radioProps }) {
  const { t } = useTranslation();

  const { isMobile } = useBreakpoints();

  const { getRootProps, getRadioProps } = useRadioGroup({ name: 'share-type', ...radioProps });

  return (
    <HStack
      p={4}
      {...getRootProps()}
      bgColor='surface.container'
      borderRadius='xl'
    >
      {enableShareViaWeb && (
        <RadioOption
          label={t('shareTypeRadioGroup.shareViaWeb')}
          value='web'
          icon={SFSquareArrowUp}
          {...getRadioProps({ value: 'web' })}
        />
      )}
      <RadioOption
        label={`${isMobile ? 'Email' : 'Share as email'}`}
        value='email'
        icon={SFEnvelopeIcon}
        {...getRadioProps({ value: 'email' })}
      />
      <RadioOption
        label={`${isMobile ? 'PDF' : 'Download PDF'}`}
        value='pdf'
        icon={SFSquareArrowDown}
        iconSize={4}
        {...getRadioProps({ value: 'pdf' })}
      />
    </HStack>
  );
}

function RadioOption({ label, icon, iconSize, ...props }) {
  const { getInputProps, getRadioProps } = useRadio(props);

  return (
    <HStack
      as='label'
      borderRadius='lg'
      px={3}
      py={1}
      bgColor='surface.surfaceDim'
      color='surface.onSurfaceVariant'
      _checked={{
        bgColor: 'brandPrimary.primary',
        color: 'brandPrimary.onPrimary'
      }}
      cursor='pointer'
      gap={1.5}
      {...getRadioProps()}
    >
      {icon && (
        <Icon
          as={icon}
          boxSize={iconSize || 5}
        />
      )}
      <input {...getInputProps()} />
      <Text
        fontSize='sm'
        fontWeight={500}
      >
        {label}
      </Text>
    </HStack>
  );
}
