# Reskin Card Structure

## A note on actions architecture

`onMeetingActionClick` and `onCardActionClick` have to be managed at the top level because they need to know about the queryKey used to fetch the data rendered by the `ReskinMeetingCard`. By defining at the top level, we can pass in all the queryKey and optimisticUpdateConfig logic we need for that page. I chose to do this instead of just managing individual actions at the meeting level because the designs expected a "radio-like" experience on saving, archiving, rsvping, and sensitivity changing which required optimistic updating. If we instead managing local variables we ran the risk of data being out of sync elsewhere or having a bad user experience.

The `botQueryKey` and `botUpdaterFn` are used to update to identify the location of the bot in the query and how to update it (respectively) from pusher status_change events. This allows us to update that query (e.g. ['meetings', 'agenda', '6/3/2025']) with the new bot values from pusher so that it matches the API when a new API refresh comes through.

Meeting, Bot, and Card data is also passed through into context so the entire tree can have access to the same data without worrying about props getting thrown on. If it gets confusing, hopefully this template can serve as a helpful map when searching for sources of props/data within this card's template tree.

## ReskinMeetingCard

### Parents

Here's the table of the menu items that are shown on each page and under what condition they show up. Typically all the card actions only show up when a card is available and meeting is over (obvi) and the RSVP and Sensitivity meeting options are only available if meeting is upcoming or live.

| Page/Location                 | Change Category | RSVP     | Sensitivity | Remove Fora | Save    | Archive | Copy Link |
| ----------------------------- | --------------- | -------- | ----------- | ----------- | ------- | ------- | --------- |
| Home Page - Right Rail Agenda | yes             | if !done | if !done    | if !done    | if done | if done | yes       |
| Meeting Page                  | yes             | if !done | if !done    | if !done    | if done | if done | yes       |
| Agenda Page                   | yes             | if !done | if !done    | if !done    | if done | if done | yes       |
| Recent Summaries              | tbd             | no       | no          | no          | yes     | yes     | yes       |

### Template structure simplified

```jsx
(
  <ReskinMeetingCard>
    <ReskinMeetingCardContext.Provider {{ meeting, card, bot, onMeetingActionClick, onCardActionClick }}>
      <ReskinCardHeader />
      <ReskinCardBody>
        {...summary}
        {...participants}
      </ReskinCardBody>
      <ReskinMeetingCardControlBar>
        {...meeting control actions}
        <ReskinMeetingMenu>
          // isDone
          <MeetingMenuAfter>
            <ReskinSummaryCardMenu>
              {...card actions}
              <InitiativeSelection /> // have to pass as child to make ReskinSummaryMenu work independently elsewhere
            </ReskinSummaryCardMenu>
          </MeetingMenuAfter>

          // live or before
          <MeetingMenuBeforeDuring>
            <RSVPSelection />
            <SensitivitySelection />
            <InitiativeSelection />
            <RemoveForaAction />
          </MeetingMenuBeforeDuring>
        </ReskinMeetingMenu>
        {...progress bar}
      </ReskinMeetingCardControlBar>
    </ReskinMeetingCardContext.Provider>
  </ReskinMeetingCard>
)

```

## ReskinMeetingCard

### Template structure simplified

```jsx
<ReskinSummaryCard>
  <ReskinCardHeader />
  <ReskinCardBody />
  <ReskinSummaryCardFooter>
    <ReskinSummaryCardMenu>
      // if card is meeting source type
      <InitiativeSelection />
    </ReskinSummaryCardMenu>
  </ReskinSummaryCardFooter>
</ReskinSummaryCard>
```

## Agendacard

Note this also uses the `ReskinmeetingCardContext.Provider` to share needed props with `ReskinMeetingCardControlBar`

### Template structure simplified

```jsx
<AgendaCard>
  <ReskinMeetingCardContext.Provider {{ meeting, card, bot, onMeetingActionClick, onCardActionClick }}>
    {...local header and body stuff}
    <AgendaCardBody />
    <MeetingParticipants />

    // stuff below equal to reskin meeting card
    <ReskinMeetingCardControlBar>
      {...meeting control actions}
      <ReskinMeetingMenu>
        // isDone
        <MeetingMenuAfter>
          <ReskinSummaryCardMenu>
            {...card actions}
            <InitiativeSelection /> // have to pass as child to make ReskinSummaryMenu work independently elsewhere
          </ReskinSummaryCardMenu>
        </MeetingMenuAfter>

        // live or before
        <MeetingMenuBeforeDuring>
          <RSVPSelection />
          <SensitivitySelection />
          <InitiativeSelection />
          <RemoveForaAction />
        </MeetingMenuBeforeDuring>
      </ReskinMeetingMenu>
      {...progress bar}
    </ReskinMeetingCardControlBar>
  </ReskinMeetingCardContext.Provider>
</ReskinSummaryCard>
```
