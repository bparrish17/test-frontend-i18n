import { Card, CardBody, Text, Box, Button } from '@chakra-ui/react';
import FacePile from '@components/general/face-pile.jsx';

function PulseLaunchCard({ meeting, onCardClicked }) {
  return (
    <Button
      minWidth='150px'
      width='150px'
      height='200px'
      padding={0}
      onClick={() => {
        onCardClicked(meeting);
      }}
    >
      <Card
        bgGradient={
          meeting?.source_data?.high_priority
            ? 'linear(to-t, #01016E 0%, #CC3D4D 100%)'
            : 'linear(to-t, #01016E 0%, #2967ea 100%)'
        }
        width='100%'
        height='100%'
      >
        {meeting.read_at && (
          <Box
            borderRadius='8px'
            position='absolute'
            top={0}
            left={0}
            width='100%'
            height='100%'
            bg='rgba(255, 255, 255, 0.3)'
            zIndex={1}
          />
        )}
        <CardBody>
          <Text
            // border="1px solid red"
            position='absolute'
            left='9px'
            top='12px'
            textAlign='left'
            mr='9px'
            color='#FEFFFF'
            variant='title-bolder-sm'
            whiteSpace='normal'
            overflowWrap='break-word'
          >
            {meeting.source_data.title}
          </Text>

          <Box
            position='absolute'
            left='9px'
            bottom='11px'
          >
            <FacePile
              faces={meeting.source_data.participants}
              size='xsmall'
            />
          </Box>
        </CardBody>
      </Card>
    </Button>
  );
}

export default PulseLaunchCard;
