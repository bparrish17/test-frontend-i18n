import { Divider, Stack, Button } from '@chakra-ui/react';
import { useState } from 'react';

import ShareTypeRadioGroup from './share-type-radio-group.component';
import ShareSummaryForm from './share-summary-form.component';
import { useBreakpoints } from '@util/hooks';
import { usePDF } from '@react-pdf/renderer';
import analyticsService from '@services/analytics.service';

const pendoShareTypeLabels = {
  web: 'Web Share',
  email: 'Email Share',
  pdf: 'PDF Download'
};

export default function ShareSummary({
  isSensitive,
  attendees = [],
  disclosure,
  children,
  onSubmit,
  isSubmitting,
  pdfDocument,
  pdfTitle,
  enableShareViaWeb = true
}) {
  const [selectedShareType, setSelectedShareType] = useState(enableShareViaWeb ? 'web' : 'email');
  const { isMobile } = useBreakpoints();
  const [pdfInstance] = usePDF({ document: pdfDocument });
  const isPDF = selectedShareType === 'pdf';

  const trackShareAction = () => {
    const eventName = `Meeting Detail | Share Modal | ${pendoShareTypeLabels[selectedShareType]}`;
    analyticsService.trackButtonClick(eventName, {
      shareType: selectedShareType,
      route: window?.location?.pathname
    });
  };

  const handleSubmit = (values) => {
    trackShareAction();
    onSubmit({ ...values, guest: selectedShareType === 'web' });
  };

  const submitProps = isPDF
    ? {
        as: 'a',
        href: pdfInstance?.url,
        download: `${pdfTitle}.pdf`,
        isLoading: pdfInstance?.loading,
        onClick: trackShareAction
      }
    : {
        type: 'submit',
        isLoading: isSubmitting
      };

  return (
    <Stack
      gap={6}
      p={6}
    >
      <ShareTypeRadioGroup
        enableShareViaWeb={enableShareViaWeb}
        value={selectedShareType}
        onChange={setSelectedShareType}
      />
      {children}
      <Divider />
      <ShareSummaryForm
        isPDF={isPDF}
        isSensitive={isSensitive}
        attendees={attendees}
        selectedShareType={selectedShareType}
        onSubmit={handleSubmit}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent='flex-end'
        >
          <Button
            variant='reskinSecondary'
            onClick={disclosure.onClose}
          >
            Cancel
          </Button>
          <Button
            variant='reskinPrimary'
            {...submitProps}
          >
            {selectedShareType === 'pdf' ? 'Download' : 'Send'}
          </Button>
        </Stack>
      </ShareSummaryForm>
    </Stack>
  );
}
