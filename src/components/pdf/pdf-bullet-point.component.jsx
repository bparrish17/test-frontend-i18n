import { View, Text } from '@react-pdf/renderer';

export default function BulletPoint({ children, style }) {
  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', fontSize: '14px', ...style }}
      wrap={false}
    >
      <Text style={{ marginHorizontal: 6 }}>•</Text>
      <Text wrap={false}>{children}</Text>
    </View>
  );
}
