import { addSeconds, differenceInSeconds } from 'date-fns';
import { last, trim, pick, lastIndexOf } from 'lodash-es';

import { formatMeetingDuration } from '@util/helpers';

function injectTransitionsIntoTranscript(transitions, transcript, recordingStartTime) {
  transcript.forEach((segment) => {
    segment.absolute_start_time = addSeconds(recordingStartTime, segment.start_time);
  });

  return [...transcript, ...transitions].sort((a, b) => {
    return new Date(a.absolute_start_time) - new Date(b.absolute_start_time);
  });
}

const formatTransitionDuration = (transition) =>
  formatMeetingDuration(transition.to, transition.absolute_start_time);

/********************************************************************************
 * Raw Transcript => { transcripts, topicGroups, ungroupedSummaries } parsing
 ********************************************************************************/

/**
 * Parses raw transcripts and converts them to readable transcript "lines" by their speaker and creates
 * topic groups and summaries for
 * @param {RawTranscript[]} rawTranscripts
 * @returns {ParsedMeetingTranscript}
 *
 * reskin todo: just make this a forEach?
 */
export function parseRawTranscripts(
  rawTranscripts,
  transcriptStartTime,
  recordingPausedSegments,
  parseTopicGroups = false
) {
  if (rawTranscripts?.length) {
    const injectedTranscript = injectTransitionsIntoTranscript(
      recordingPausedSegments,
      rawTranscripts,
      transcriptStartTime
    );

    return injectedTranscript?.reduce(
      (acc, rawTranscript) => {
        if (rawTranscript.transition) {
          acc.transcripts.push({
            start_time: differenceInSeconds(rawTranscript.absolute_start_time, transcriptStartTime),
            end_time: differenceInSeconds(rawTranscript.to, transcriptStartTime),
            speaker: 'Paused',
            transition: true,
            message: `FORA was paused for ${formatTransitionDuration(rawTranscript)}`
          });
        } else {
          const lastTranscript = last(acc.transcripts);
          // if equal to last speaker, add new message on to the last
          if (rawTranscript?.speaker === lastTranscript?.speaker) {
            const newMessage = `${lastTranscript?.message} ${rawTranscript?.segment}`;
            acc.transcripts[acc.transcripts.length - 1] = {
              ...pick(lastTranscript, ['start_time', 'end_time', 'speaker']),
              message: newMessage
            };
          } else if (rawTranscript.speaker && rawTranscript.segment) {
            acc.transcripts.push({
              ...pick(rawTranscript, ['start_time', 'end_time', 'speaker']),
              message: rawTranscript.segment
            });
          }
        }

        const transcript = { ...rawTranscript, index: lastIndexOf(acc.transcripts) };
        if (parseTopicGroups) {
          if (transcript.todos || transcript.todos_title) {
            // if theres a new topic group, summaries are now grouped and ungroupedSummaries are removed from list
            const topicGroup = createTopicGroup(
              transcript,
              transcriptStartTime,
              acc.ungroupedSummaries,
              acc.topicGroups
            );
            acc.ungroupedSummaries = [];
            acc.topicGroups.push(topicGroup);
          } else if (transcript.title && transcript.summary) {
            const summary = createSummary(
              transcript,
              transcriptStartTime,
              acc.ungroupedSummaries,
              acc.topicGroups
            );
            acc.ungroupedSummaries.push(summary);
          }
        }
        return acc;
      },
      {
        transcripts: [],
        topicGroups: [],
        ungroupedSummaries: []
      }
    );
  } else {
    return {
      transcripts: [],
      topicGroups: [],
      ungroupedSummaries: []
    };
  }
}

export function getPreviousItemEndTime(itemArr, transcriptStartTime) {
  return last(itemArr)?.time?.end ?? new Date(transcriptStartTime);
}

function createSummary(transcript, transcriptStartTime, ungroupedSummaries, topicGroups) {
  const lastItemArr = ungroupedSummaries?.length > 0 ? ungroupedSummaries : topicGroups;
  return {
    transcriptIndex: transcript?.index,
    // eslint-disable-next-line
    title: trim(transcript.title.replaceAll(/[*\/]/g, ''), '"'),
    contentLines: getSummaryLines(transcript.summary),
    time: {
      rawStart: last(lastItemArr)?.time?.rawEnd ?? 0,
      start: getPreviousItemEndTime(lastItemArr, transcriptStartTime),
      rawEnd: transcript?.end_time,
      end: addSeconds(transcriptStartTime, transcript.end_time)
    }
  };
}

function createTopicGroup(transcript, transcriptStartTime, ungroupedSummaries, topicGroups) {
  return {
    transcriptIndex: transcript?.index,
    title: trim(transcript.todos_title.replaceAll('*', ''), '"'),
    topic_summary: transcript.todos,
    time: {
      rawStart: last(topicGroups)?.time?.rawEnd ?? 0,
      start: getPreviousItemEndTime(topicGroups, transcriptStartTime),
      rawEnd: transcript?.end_time,
      end: addSeconds(transcriptStartTime, transcript.start_time)
    },
    summaries: [
      ...ungroupedSummaries,
      createSummary(transcript, transcriptStartTime, ungroupedSummaries, topicGroups)
    ]
  };
}

export function getSummaryLines(input) {
  let formattedSummary = input.replaceAll('Meeting Recap:', '');
  if (formattedSummary.includes('- ')) {
    formattedSummary = formattedSummary.replace(/\s-/g, '* ');
  }

  let summaryLines = [formattedSummary];

  if (formattedSummary.includes('* ')) {
    formattedSummary = formattedSummary.split('* ');
    formattedSummary.shift();

    summaryLines = formattedSummary;
  }
  return summaryLines;
}

/**
 * @param {Bot} bot
 * @returns {Map<string, { duration:number, behavior: string }>} map speaking to their speaking duration in decimal minutes
 */
export const getSpeakerTimesMap = (bot) => {
  const speakerMap = new Map();

  if (!bot) {
    return speakerMap;
  }

  let speakers = [];
  if (bot?.speakers_) {
    speakers = bot.speakers_;
  } else if (bot?.speakers) {
    speakers = Object.entries(bot.speakers).map(([key, value]) => ({
      name: key,
      duration: value
    }));
  }

  for (const speaker of speakers) {
    const duration = parseFloat((speaker?.duration / 60).toFixed(1));

    // try to find name displayed in attendees list
    // or default to speaker name used in videoconference
    const attendeeName =
      bot?.transcripts?.find((transcript) => transcript.speaker === speaker.name)?.participant
        ?.name || speaker.name;

    if (duration) {
      speakerMap.set(attendeeName, { duration, behavior: speaker.behavior });
    }
  }

  return speakerMap;
};

/**
 * @param {Person & { duration: number }} a
 * @param {Person & { duration: number }} b
 */
const sortPeopleBySpeakerTimes = (a, b) => {
  const hasA = a.duration > 0;
  const hasB = b.duration > 0;

  if (hasA && !hasB) return -1;
  if (!hasA && hasB) return 1;

  if (hasA && hasB) {
    return b.duration - a.duration || a.name?.localeCompare(b.name) || 0;
  }

  return a.name?.localeCompare(b.name) || 0;
};

export const mergeAttendeesWithSpeakers = (attendees, speakerMap) => {
  if (!attendees) {
    return [];
  }

  const people = [];
  const processedSpeakers = new Set();

  // merge existing attendees with speaker data
  for (const attendee of attendees) {
    const speakerData = speakerMap.get(attendee.name);
    people.push({
      ...attendee,
      duration: speakerData?.duration || 0,
      behavior: speakerData?.behavior || attendee.behavior
    });

    if (speakerData) {
      processedSpeakers.add(attendee.name);
    }
  }

  // add speakers not in attendees list
  for (const [name, speakerData] of speakerMap) {
    if (!processedSpeakers.has(name)) {
      people.push({
        name,
        duration: speakerData.duration,
        behavior: speakerData.behavior
      });
    }
  }

  return people.sort(sortPeopleBySpeakerTimes);
};
