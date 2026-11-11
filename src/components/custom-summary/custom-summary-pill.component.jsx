import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGenerateCard } from '@services/query-services/cards.query-service';
import { useUserStore } from '@store/app.store';
import analyticsService from '@services/analytics.service';

import { meetingIdWithBot } from '@util/helpers/meetings.helpers';

export default function CustomSummaryPill(props) {
  const setGeneratingSummary = useUserStore((state) => state?.setGeneratingSummary);
  const { mutateAsync: generateCard } = useGenerateCard({});
  const navigate = useNavigate();

  const applyCustomSummary = async () => {
    const meetingId = meetingIdWithBot(props?.meeting);
    analyticsService.trackButtonClick('Custom Summary Template Apply Existing Button Clicked', {
      meetingId,
      templateId: props.lens?.id
    });
    await generateCard({ meetingId, initiativeId: props?.lens?.id });

    setGeneratingSummary({
      meetingId,
      lensId: props?.lens?.id,
      initiativeTitle: props?.lens?.title,
      generating: true
    });

    // push with state to maintain pill logic
    navigate(location.pathname, { state: { lensId: props?.lens?.id } });
    props.disclosure.onClose();
  };

  return (
    <Box
      borderRadius='lg'
      fontSize='xs'
      fontWeight={500}
      px={2}
      py='3px'
      bgColor='surface.surface'
      color='surface.onSurfaceVariant'
      cursor='pointer'
      h={6}
      m={1}
      maxW='240px'
      display='inline-flex'
      whiteSpace='nowrap'
      onClick={applyCustomSummary}
      layerStyle='ellipsis-text'
    >
      <Text layerStyle='ellipsis-text'>{props.lens.title}</Text>
    </Box>
  );
}
