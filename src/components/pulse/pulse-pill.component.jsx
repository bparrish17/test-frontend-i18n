import { Text, Flex, Box } from '@chakra-ui/react';
import { cloneElement } from 'react';
import { gaugeBoth, gaugeStrategic, gaugeTactical } from '@assets/images/index.js';
import { capitalize } from 'lodash-es';
import { useTranslation } from 'react-i18next';

function PulsePill({ icon, text, variant = 'neutral', level, topic }) {
  const { t } = useTranslation();

  const variantStyles = {
    neutral: {
      iconColor: '#AAC1F5',
      textColor: '#AAC1F5',
      background: 'rgba(19, 83, 236, 0.15)'
    },
    positive: {
      iconColor: '#00A376',
      textColor: '#0F5A4D',
      background: 'rgba(0, 163, 118, 0.30)'
    },
    negative: {
      iconColor: '#F04755',
      textColor: '#79313E',
      background: 'rgba(240, 71, 85, 0.30)'
    },
    primary: {
      iconColor: 'brandTertiary.primary',
      textColor: '#463C89',
      background: 'rgba(126, 94, 255, 0.15)'
    }
  };

  const topicImgMap = {
    discussion: {
      strategic: gaugeStrategic,
      both: gaugeBoth,
      balanced: gaugeBoth,
      tactical: gaugeTactical
    }
  };

  const correctedLevel =
    topic === 'discussion' && level === 'both' ? 'Tactical & Strategic' : capitalize(level);

  if (topic === 'discussion') {
    icon = (
      <Box
        as='img'
        src={topicImgMap[topic]?.[level]}
        alt={t('pulsePill.levelOfEngagementAlt')}
        h={5}
      />
    );
    text = correctedLevel;
  }

  const styles = variantStyles[variant];

  return (
    <Flex
      style={{
        minHeight: '32px',
        width: 'fit-content',
        padding: '6px 8px',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '8px',
        background: styles.background
      }}
    >
      <Box color={styles.iconColor}>{cloneElement(icon, { fill: styles.iconColor })}</Box>
      <Text
        variant='body-sm'
        style={{ color: styles.textColor }}
      >
        {text}
      </Text>
    </Flex>
  );
}

export default PulsePill;
