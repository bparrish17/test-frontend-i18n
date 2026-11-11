import { Document, Page, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { map } from 'lodash-es';

import { createStylesheet, getTokenHex, registerFonts } from '@util/helpers';
import PDFBrandingFooter from './pdf-branding-footer.component';
import PDFBrandingHeader from './pdf-branding-header.component';
import PDFSummaryCard from './pdf-summary-card.component';
import PDFTimeline from './pdf-timeline.component';
import { PDFCheckIcon, PDFClockCircleIcon } from '@assets/icons';
import PDFPageDivider from './pdf-page-divider.component';
import { useTranslation } from 'react-i18next';

registerFonts();

const styles = createStylesheet();

const FollowupItem = ({ content }) => (
  <View
    wrap={false}
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '18px',
      justifyContent: 'flex-start'
    }}
  >
    <PDFCheckIcon />
    <Text style={{ fontSize: '14px' }}>{content}</Text>
  </View>
);

const FollowupsSection = ({ title, followupItems, icon }) => (
  <>
    <View style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '90%' }}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginLeft: '2px' }}>
        {icon}
        <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>{title}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: '5px' }}>
        {followupItems.map((item) => (
          <FollowupItem
            key={item}
            content={item}
          />
        ))}
      </View>
    </View>
    <PDFPageDivider />
  </>
);

export default function MeetingPDF({ meeting, bot, topicGroups, userName, tenantName }) {
  const { t } = useTranslation();

  const followupItems = bot?.followups?.length
    ? map(bot?.followups, 'value')
    : getFollowupItems(bot?.summary);

  return (
    <Document
      title={`${meeting?.title} - ${format(meeting?.start_at, 'PP')}`}
      producer={tenantName}
      author={userName}
      creator={userName}
    >
      <Page
        style={styles.page}
        size={[800, 1048]}
      >
        {/* Branding Header */}
        <PDFBrandingHeader title={t('meetingPdf.meetingSummary')} />

        <View style={styles.contentContainer}>
          {/* Meeting Header */}
          <View style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>{meeting?.title}</Text>
            <Text style={{ fontSize: '14px', color: getTokenHex(['surface', 'onSurfaceVariant']) }}>
              {format(meeting?.start_at, 'cccc, LLLL d, h:mm')}-
              {format(meeting?.end_at, 'h:mm aaa')}
            </Text>
          </View>
          <PDFPageDivider />
          <PDFSummaryCard card={bot?.recap} />
          <PDFPageDivider />
          {followupItems?.length > 0 && (
            <FollowupsSection
              title={t('meetingPdf.potentialFollowups')}
              icon={<PDFClockCircleIcon />}
              followupItems={followupItems}
            />
          )}
          <PDFTimeline
            title={t('meetingPdf.meetingTimeline')}
            topicGroups={topicGroups}
          />
        </View>
        {/* Empty element at height of footer to prevent content from getting wrapped by the bottom of the page and cut off */}
        {/* <View style={{ width: '100%', height: '189px' }} /> */}

        <PDFBrandingFooter />
      </Page>
    </Document>
  );
}

function getFollowupItems(summary) {
  const followupsSection = summary?.split('\n\n')[1];
  if (!followupsSection) return [];

  const followupsListText = followupsSection?.replace('***Potential Followups***', '')?.split('- ');
  return followupsListText.slice(1);
}
