import { View, Text } from '@react-pdf/renderer';
import BulletPoint from './pdf-bullet-point.component';
import { PDFTimelineIcon } from '@assets/icons';

export default function PDFTimeline({ title, topicGroups }) {
  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginLeft: '2px' }}>
        <PDFTimelineIcon />
        <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>{title}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {topicGroups?.map((topicGroup) => (
          <View
            key={topicGroup?.transcriptIndex}
            style={{ gap: '8px' }}
          >
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', paddingBottom: '6px' }}>
                {topicGroup?.title}
              </Text>
            </View>
            {topicGroup?.summaries?.map((summary) => (
              <BulletPoint
                key={summary?.transcriptIndex}
                style={{ gap: '8px' }}
              >
                {summary?.title}
              </BulletPoint>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
