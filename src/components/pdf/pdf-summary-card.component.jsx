import { View, Text } from '@react-pdf/renderer';
import { getSummaryLines } from '@util/helpers';
import BulletPoint from './pdf-bullet-point.component';
import { PDFBoltIcon } from '@assets/icons';

export default function PDFSummaryCard({ card }) {
  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Text style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '4px' }}>
        {card?.headline ?? card?.title}
      </Text>
      {card?.sections?.map((section) => (
        <View
          key={section?.title}
          style={{ gap: '4px' }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', gap: '18px' }}>
            <PDFBoltIcon />
            <Text style={{ fontSize: '16px', fontWeight: 'semibold' }}>{section.title}</Text>
          </View>
          <View style={{ paddingLeft: '24px', paddingTop: '12px', gap: '12px' }}>
            {getSummaryLines(section?.content)?.map((contentLine) => (
              <BulletPoint key={contentLine}>{contentLine}</BulletPoint>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
