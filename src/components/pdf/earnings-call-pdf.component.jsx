import { Document, Page, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';

import { createStylesheet, getTokenHex, registerFonts } from '@util/helpers';
import PDFBrandingFooter from './pdf-branding-footer.component';
import PDFBrandingHeader from './pdf-branding-header.component';
import PDFSummaryCard from './pdf-summary-card.component';
import PDFTimeline from './pdf-timeline.component';
import PDFPageDivider from './pdf-page-divider.component';
import { useTranslation } from 'react-i18next';

registerFonts();
const styles = createStylesheet();

export default function EarningsCallPDF({
  card,
  topicGroups,
  earningsCallDate,
  userName,
  tenantName
}) {
  const { t } = useTranslation();

  return (
    <Document
      title={card?.source_data?.title}
      producer={tenantName}
      author={userName}
      creator={userName}
    >
      <Page
        style={styles.page}
        size={[800, 1048]}
      >
        <PDFBrandingHeader title={t('earningsCallPdf.earningsCallSummary')} />
        <View style={styles.contentContainer}>
          {/* Earnings Call Header */}
          <View style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>{card?.source_data?.title}</Text>
            {earningsCallDate && (
              <Text
                style={{ fontSize: '14px', color: getTokenHex(['surface', 'onSurfaceVariant']) }}
              >
                {format(earningsCallDate, 'EEEE MMMM d, yyyy ')}
              </Text>
            )}
          </View>
          <PDFPageDivider />
          <PDFSummaryCard card={card} />
          <PDFPageDivider />
          <PDFTimeline
            title={t('earningsCallPdf.meetingTimeline')}
            topicGroups={topicGroups}
          />
        </View>
        <PDFBrandingFooter />
      </Page>
    </Document>
  );
}
