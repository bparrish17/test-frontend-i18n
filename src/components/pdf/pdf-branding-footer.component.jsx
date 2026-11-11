import { View, Text, Link } from '@react-pdf/renderer';
import { getTokenHex } from '@util/helpers';
import { useTranslation } from 'react-i18next';

export default function PDFBrandingFooter() {
  const { t } = useTranslation();

  return (
    <View
      fixed
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 80,
        paddingVertical: 24,
        backgroundColor: getTokenHex(['surface', 'containerLow']),
        color: getTokenHex(['surface', 'onSurfaceVariant'])
      }}
      wrap={false}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '581px',
          fontSize: '11px'
        }}
        render={({ pageNumber, totalPages }) =>
          pageNumber === totalPages && (
            <>
              <Text style={{ color: 'black', fontWeight: 'semibold' }}>
                {t('pdfBrandingFooter.foraConnectedIntelligenceAt')}
              </Text>
              <Text>{t('pdfBrandingFooter.thisMeetingSummaryGives')}</Text>
              <Text>{t('pdfBrandingFooter.insightsTailoredToYour')}</Text>
              <Link
                src='https://fora.day/'
                style={{
                  fontWeight: 'semibold',
                  color: getTokenHex(['brandPrimary', 'primary']),
                  textDecoration: 'none'
                }}
              >
                <Text>{t('pdfBrandingFooter.learnMore')}</Text>
              </Link>
            </>
          )
        }
      />
      <Text
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        style={{ fontSize: '11px' }}
      />
    </View>
  );
}
