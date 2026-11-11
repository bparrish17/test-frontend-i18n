import { capitalize } from 'lodash-es';
import { Text, Flex, Image } from '@chakra-ui/react';

import {
  gaugeStrategic,
  gaugeTactical,
  gaugeBoth,
  sentimentPositive,
  sentimentNeutral,
  sentimentNegative
} from '@assets/images/index.js';

export default function MeetingVibe({ topic, level }) {
  const topicImgMap = {
    sentiment: {
      positive: sentimentPositive,
      neutral: sentimentNeutral,
      negative: sentimentNegative
    },
    discussion: {
      strategic: gaugeStrategic,
      both: gaugeBoth,
      tactical: gaugeTactical
    }
  };

  const correctedLevel =
    topic === 'discussion' && level === 'both' ? 'Tactical & Strategic' : capitalize(level);

  return (
    <Flex gap='8px'>
      <Image
        src={topicImgMap[topic]?.[level]}
        alt='Level of Engagement'
        h={8}
      />
      <Text
        variant='label-lg'
        color='brandPrimary.onPrimary'
        style={{
          marginTop: '7px',
          overflow: 'hidden'
        }}
      >{`${correctedLevel} ${capitalize(topic)}`}</Text>
    </Flex>
  );
}
