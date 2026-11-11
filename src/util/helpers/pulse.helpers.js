export function calculateNetSentimentScore(topicsArray) {
  const sum = topicsArray.reduce((result, topic) => {
    return result + Number(topic.sentiment);
  }, 0);
  const average = sum / topicsArray.length;
  if (average > 0.2) {
    return 'positive';
  } else if (average < 0.2 && average > -0.2) {
    return 'neutral';
  } else {
    return 'negative';
  }
}
export function calculateNetStrategicTacticalScore(topicsArray) {
  const counts = topicsArray.reduce((result, topic) => {
    if (!result[topic.strategic_vs_tactical]) {
      result[topic.strategic_vs_tactical] = 0;
    } else {
      result[topic.strategic_vs_tactical]++;
    }
    return result;
  }, {});
  if (counts.tactical > counts.strategic) {
    return 'tactical';
  } else if (counts.tactical === counts.strategic) {
    return 'both';
  } else {
    return 'strategic';
  }
}

export function getHighestAndLowestSentiment(topics) {
  if (!topics || topics.length === 0) {
    return { highest: null, lowest: null };
  }

  let highest = topics[0];
  let lowest = topics[0];

  for (const topic of topics) {
    if (topic.sentiment > highest.sentiment) {
      highest = topic;
    }
    if (topic.sentiment < lowest.sentiment) {
      lowest = topic;
    }
  }

  return { highest, lowest };
}

export const PANEL_DECK_MAP = {
  // internal: ['Topics_S', 'Topics_T']
  // internal: ['Cover']
  internal: ['Cover', 'Summary', 'Sentiment', 'Topics_S', 'Followups', 'Participants']
};
