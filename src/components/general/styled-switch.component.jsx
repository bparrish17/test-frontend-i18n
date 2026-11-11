import { Text, useToken } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

// reskin todo: use external state
export default function StyledSwitch({ checkedText = 'On', uncheckedText = 'Off', ...props }) {
  const [checked, setChecked] = useState(false);
  const [
    brandPrimary,
    brandOnPrimary,
    surfaceContainerHigh,
    surfaceOnSurfaceVariant,
    surfaceSurface,
    surfaceOutline
  ] = useToken('colors', [
    'brandPrimary.primary',
    'brandPrimary.onPrimary',
    'surface.containerHigh',
    'surface.onSurfaceVariant',
    'surface.surface',
    'surface.outline'
  ]);

  const padding = 4;
  const width = 90;
  const height = 32;

  return (
    <motion.div
      style={{
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: `${width}px`,
        height: `${height}px`,
        padding: `${padding}px`,
        backgroundColor: checked ? brandPrimary : surfaceContainerHigh,
        color: checked ? brandPrimary : surfaceSurface,
        cursor: 'pointer',
        borderRadius: 9999,
        transition: 'all 0.3s',
        border: `1px solid ${checked ? brandPrimary : surfaceOutline}`
      }}
      onClick={() => setChecked(!checked)}
      {...props}
    >
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: checked ? width / 2 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: `${width / 2 - padding * 2}px`,
          height: '24px',
          backgroundColor: checked ? brandOnPrimary : surfaceOnSurfaceVariant,
          borderRadius: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text
          fontSize='12px'
          fontWeight={600}
          lineHeight='0'
        >
          {checked ? checkedText : uncheckedText}
        </Text>
      </motion.div>
    </motion.div>
  );
}
