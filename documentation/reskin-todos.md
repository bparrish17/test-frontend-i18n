## Meeting Actions

#### General Todos

- remove old meeting card
- `transcript.helpers.js`

  - `parseRawTranscripts` (PUNT)
    - change to not use reduce and instead just run a forEach on all the transcripts

- `meeting.hooks.js`

  - talk to K about adding vs scheduling vs unscheduling vs removing
  - `useMeetingLiveProgress`
    - check that isCallEnded is accounted for and close progress bar
  - `useParsedMeetingTranscript`
    - move ungroupedSummaries adding on `isLive` from that hook to the `parseMeetingTranscript` helper so that the getBotTranscripts query can use it? That use case doesn't need it, maybe there's a good way to segment the two out
  - get rid of `useMeetingManagementActions` entirely?

- replay stuff:
  - in the meeting page if it's replay, just have all of the management functions write fake shit to the query cache?
    - for example if you hit pause, write "in_call_not_recording" to the status_changes
    - have a whole fake meeting control bar if it's a replay?

#### Issues

ex: [Joe and Erica Weekly Check In](http://localhost:5173/bot-live-test/6f9fd79daaf5bbd3d80dd6659934ff52ba0a22b8_0geau741gkecovn6bm2cd3j72c_20240612T210000Z)

```json
[
  {
    "code": "joining_call",
    "created_at": 1718226001063
  },
  {
    "code": "in_waiting_room",
    "created_at": 1718226004091
  },
  {
    "code": "call_ended",
    "sub_code": "timeout_exceeded_waiting_room",
    "created_at": 1718227204294
  },
  {
    "code": "done",
    "created_at": 1718227204295
  }
]
```

- Status bar says "Fora is Scheduled" and is live
- Todo: make sure when recording is done and call ended that the progress bar reflects that
  - if "joining_call" => "in_waiting_room" => nothing then it's a "Fora notetaker was not admitted to call"
- ensure bot statuses with code 'call_ended' with separate sub codes are accounted for by `isCallEnded`
- clean up logic with AddForaModal overlapping with `useAddFora`

## Global Search

A lot of the previous functionality with the global search store got simplified by the new design, but I didn't necessarily clean it up in the way that's expected. Let's remove items from the app store that don't need to be shared across components and simplify this code in general
