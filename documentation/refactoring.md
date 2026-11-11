### Meeting statuses

#### Motivation

Newer designs communicate real-time data to user in greater detail and in different places/pages, therefore we might consider a more streamlined approach to getting the needed data

#### Notes

List of statuses used in UI (6/19/24):

- Not Scheduled
- Scheduled
- Missing Link
- Recording
- Paused
- Removed
- Processing
- Summarized

```jsx
return {
  botWasScheduled: !!bot?.id,
  recordingWasStarted: hasAnyStatusChangeOf('in_call_recording'),
  botIsInMeeting: recordingWasStarted || hasAnyStatusChangeOf('in_call_not_recording'),
  isLive,
  isOnPause,
  isActivelyRecording: isLive && !isOnPause,
  hasTranscripts: bot?.num_of_transcripts > 0,
  startedRecordingAt: getFirstStatusChangeOf('in_call_recording')?.created_at ?? null,
  endedRecordingAt,
  isCallEnded, // reskin todo: add separate check for isCallEnded vs isDone since it may not account for bot being gone
  botWasKicked: hasAnyStatusChangeOf('bot_received_leave_call'),
  botWasNeverAdmitted: hasAnySubCodeOf('call_ended', 'timeout_exceeded_waiting_room'),
  isRecordingAcquired: hasAnyStatusChangeOf('recording_acquired'),
  wasSummarized: !!bot?.summary,
  didNotGenerate: differenceInMinutes(new Date(), endedRecordingAt) > 10
};
```

I think we could simplify `useMeetingBotStatuses` to only return a tagged union of statuses used in UI. Currently most of these flags exist only to compose "Status Bar/Recording Controls".

```js
const MeetingBotStatus = Object.freeze({
  NotScheduled,
  Scheduled,
  MissingLink,
  Recording,
  Paused,
  Removed,
  Processing,
  Summarized
});

const MeetingTimeStatus = Object.freeze({
  Upcoming,
  Live,
  Done
});
```

Another way around it would probably be creating a `useMeetingBotStatus` which will return said tagged union/enum, and renaming `useMeetingBotStatuses` to something else, which will handle all the additional data.
