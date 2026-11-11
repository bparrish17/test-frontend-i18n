import { View, Text } from '@react-pdf/renderer';
import { getTokenHex } from '@util/helpers';
import PDFFORALogo from './pdf-fora-logo.component';

export default function PDFBrandingHeader({ title }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 44,
        width: '100%',
        paddingHorizontal: 80,
        paddingVertical: 28,
        backgroundColor: getTokenHex(['brandPrimary', 'primaryFixedDim']),
        color: getTokenHex(['brandPrimary', 'onPrimary'])
      }}
    >
      <PDFFORALogo />
      <Text style={{ fontSize: '16px', fontWeight: 500 }}>{title}</Text>
    </View>
  );
}
