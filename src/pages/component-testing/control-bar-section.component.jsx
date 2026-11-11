import {
  Box,
  Button,
  Checkbox,
  HStack,
  IconButton,
  Input,
  ListItem,
  Stack,
  Text,
  UnorderedList
} from '@chakra-ui/react';
import { addHours, format, set } from 'date-fns';
import { useState } from 'react';
import { omit } from 'lodash-es';

import { CloseIcon } from '@assets/icons';
import ReskinMeetingCardControlBar from '@components/general/card/reskin-meeting-card/reskin-meeting-card-control-bar.component';
import { ReskinMeetingCardContext } from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';

const defaultBot = {
  id: 'ed0b7815-356a-43f0-b5c8-e1f17a1dcd61',
  meeting_participants: [],
  calendar_meetings: [],
  status_changes: [],
  transcription_options: {
    provider: 'gladia_v2',
    gladia_v2: {
      code_switching: true,
      custom_vocabulary: true,
      custom_vocabulary_config: {
        vocabulary: [
          {
            value: 'customer churn'
          },
          {
            value: 'FORA'
          },
          {
            value: 'Nylas'
          },
          {
            value: 'Okareo'
          }
        ]
      }
    }
  },
  num_of_status_changes: 0,
  num_of_transcripts: 43,
  outbound: {
    meeting_url: 'https://us05web.zoom.us/j/123456',
    bot_name: 'FORA Notetaker',
    recording_mode: 'gallery_view_v2',
    recording_mode_options: {
      participant_video_when_screenshare: 'beside',
      start_recording_on: 'call_join'
    },
    real_time_transcription: {
      destination_url: 'https://api.fora.app/recall/bots/callback',
      partial_results: false
    },
    transcription_options: {
      provider: 'gladia_v2',
      gladia_v2: {
        code_switching: true,
        custom_vocabulary: true,
        custom_vocabulary_config: {
          vocabulary: [
            {
              value: 'customer churn'
            },
            {
              value: 'FORA'
            },
            {
              value: 'Nylas'
            },
            {
              value: 'Okareo'
            }
          ]
        }
      }
    },
    chat: {
      on_bot_join: {
        send_to: 'everyone',
        message:
          'FORA is now recording and transcribing this call. To view our privacy policy, visit fora.day.'
      }
    },
    zoom: {
      join_token_url: 'https://www.join_token_url.com',
      require_recording_permission: true,
      request_recording_permission_on_host_join: true
    }
  },
  request: {
    async: true,
    notify: false
  },
  transcripts: [
    {
      speaker: 'Brian Parrish',
      words: [
        {
          text: ' But',
          start_time: 0.49125615,
          end_time: 0.78825617
        },
        {
          text: ' I',
          start_time: 0.79025614,
          end_time: 1.0882561
        },
        {
          text: ' think',
          start_time: 1.0892562,
          end_time: 1.3872561
        },
        {
          text: ' a',
          start_time: 1.3882562,
          end_time: 1.6852561
        },
        {
          text: ' lot',
          start_time: 1.6872562,
          end_time: 1.9842561
        },
        {
          text: ' about',
          start_time: 1.9862561,
          end_time: 2.283256
        },
        {
          text: ' everybody',
          start_time: 2.2852561,
          end_time: 2.582256
        }
      ],
      is_final: true,
      start_time: 0.49125615,
      end_time: 5.587256,
      duration: 5.0959997,
      segment:
        ' But  I  think  a  lot  about  everybody  that  has  poured  their  heart  and  soul  into  the  game.',
      summary: 'Things were discussed here'
    },
    {
      speaker: 'Brian Parrish',
      words: [
        {
          text: ' and',
          start_time: 5.711256,
          end_time: 5.9132557
        },
        {
          text: ' the',
          start_time: 5.914256,
          end_time: 6.1162558
        },
        {
          text: ' show,',
          start_time: 6.117256,
          end_time: 6.319256
        },
        {
          text: ' and',
          start_time: 6.321256,
          end_time: 6.522256
        },
        {
          text: ' I',
          start_time: 6.5242558,
          end_time: 6.725256
        },
        {
          text: ' want',
          start_time: 6.727256,
          end_time: 6.928256
        },
        {
          text: ' to',
          start_time: 6.930256,
          end_time: 7.131256
        },
        {
          text: ' make',
          start_time: 7.133256,
          end_time: 7.3342557
        },
        {
          text: ' sure',
          start_time: 7.336256,
          end_time: 7.537256
        },
        {
          text: ' they',
          start_time: 7.539256,
          end_time: 7.740256
        },
        {
          text: ' are',
          start_time: 7.742256,
          end_time: 7.943256
        },
        {
          text: ' extremely',
          start_time: 7.9452558,
          end_time: 8.1462555
        },
        {
          text: ' proud',
          start_time: 8.148256,
          end_time: 8.349256
        }
      ],
      is_final: true,
      start_time: 5.711256,
      end_time: 9.175256,
      duration: 3.4639997,
      segment:
        ' and  the  show,  and  I  want  to  make  sure  they  are  extremely  proud  of  what  we  do.'
    },
    {
      speaker: 'Brian Parrish',
      words: [
        {
          text: " There's",
          start_time: 156.69926,
          end_time: 157.03625
        },
        {
          text: ' been',
          start_time: 157.03726,
          end_time: 157.37326
        },
        {
          text: ' this',
          start_time: 157.37526,
          end_time: 157.71126
        },
        {
          text: ' interesting',
          start_time: 157.71326,
          end_time: 158.04926
        },
        {
          text: ' conversation',
          start_time: 158.05125,
          end_time: 158.38725
        },
        {
          text: ' around',
          start_time: 158.38925,
          end_time: 158.72527
        },
        {
          text: ' this',
          start_time: 158.72726,
          end_time: 159.06326
        },
        {
          text: ' season',
          start_time: 159.06526,
          end_time: 159.40126
        },
        {
          text: ' about',
          start_time: 159.40326,
          end_time: 159.74326
        }
      ],
      is_final: true,
      start_time: 156.69926,
      end_time: 159.74326,
      duration: 3.043991,
      segment: " There's  been  this  interesting  conversation  around  this  season  about"
    },
    {
      speaker: 'Brian Parrish',
      words: [
        {
          text: " Ellie's",
          start_time: 160.63525,
          end_time: 161.06526
        },
        {
          text: ' trajectory,',
          start_time: 161.06726,
          end_time: 161.49626
        }
      ],
      is_final: true,
      start_time: 160.63525,
      end_time: 165.37926,
      duration: 4.7440033,
      segment: " Ellie's  trajectory,  emotional  trajectory  in  this  season  and  this  idea  of"
    },
    {
      speaker: 'Brian Parrish',
      words: [
        {
          text: ' these',
          start_time: 226.61526,
          end_time: 226.99126
        },
        {
          text: ' crackling',
          start_time: 226.99326,
          end_time: 227.36926
        },
        {
          text: ' moments',
          start_time: 227.37126,
          end_time: 227.74725
        },
        {
          text: ' of',
          start_time: 227.74925,
          end_time: 228.12526
        },
        {
          text: ' beauty',
          start_time: 228.12726,
          end_time: 228.50327
        },
        {
          text: ' that',
          start_time: 228.50526,
          end_time: 228.88126
        },
        {
          text: ' you',
          start_time: 228.88326,
          end_time: 229.25926
        },
        {
          text: ' have',
          start_time: 229.26126,
          end_time: 229.63725
        },
        {
          text: ' in',
          start_time: 229.63925,
          end_time: 230.01526
        },
        {
          text: ' the',
          start_time: 230.01726,
          end_time: 230.39326
        },
        {
          text: ' game.',
          start_time: 230.39526,
          end_time: 230.77126
        }
      ],
      is_final: true,
      start_time: 226.61526,
      end_time: 232.28726,
      duration: 5.671997,
      segment: ' these  crackling  moments  of  beauty  that  you  have  in  the  game.'
    }
  ],
  followups: [
    {
      value:
        'Share positive feedback with Baker and Ashley Johnson regarding their contributions to the characters.'
    },
    {
      value:
        "Reflect on the differences between Pedro's and Tori's portrayals of Joel to understand the nuances of each performance."
    },
    {
      value:
        'Document the key differences observed between the original porch scene and the adapted episode scene.'
    },
    {
      value:
        'Consider the implications of allowing artists to bring their own interpretations to established characters.'
    }
  ],
  speakers_: [
    {
      name: 'Brian Parrish',
      duration: 219.89995,
      behavior: 'Thoughtful, appreciative, and inquisitive.',
      demeanor: 'balanced'
    }
  ],
  topics: [
    {
      title: 'Creative Ownership and Pride in Adaptation',
      details:
        'Brian Parrish expresses the importance of contributors, specifically Baker and Ashley Johnson, feeling proud of their work on the game and show. He emphasizes that the characters will always belong to their creators and hopes Ashley Johnson is proud of the adaptation.',
      speakers: ['Brian Parrish'],
      sentiment: 0.7,
      strategic_vs_tactical: 'strategic'
    },
    {
      title: 'Character Interpretation in Adaptation',
      details:
        "Parrish discusses the differences in portrayal of the character Joel between Pedro and Tori, noting Pedro's more emotional approach. He also analyzes the adaptation process by comparing scenes from the video game and the show.",
      speakers: ['Brian Parrish'],
      sentiment: 0.2,
      strategic_vs_tactical: 'strategic'
    },
    {
      title: 'Directorial Choices and Artistic Freedom',
      details:
        'Parrish describes his approach to directing, including not rewatching the original scene to avoid direct replication and consciously allowing actors to bring their own interpretations to the characters, rather than mimicking previous performances.',
      speakers: ['Brian Parrish'],
      sentiment: 0.5,
      strategic_vs_tactical: 'strategic'
    }
  ],
  recap: {
    headline: 'The Last of Us Adaptation: Balancing Homage and Artistic Freedom',
    sections: [
      {
        title: 'Honoring Original Creators',
        content:
          '* Brian Parrish wants original game and show contributors to be proud of the adaptation.\n* Special mention of Baker and Ashley Johnson, emphasizing characters will always be theirs.'
      },
      {
        title: 'Character Portrayal and Adaptation Choices',
        content:
          "* Parrish analyzed the porch scene, comparing the video game version with the adapted episode.\n* Notes Pedro's Joel as more emotional than Tori's.\n* Parrish consciously avoided replicating specific actions from the original scene to allow artistic freedom."
      },
      {
        title: 'Artistic Interpretation',
        content:
          '* Parrish emphasizes allowing artists to bring their own versions to the characters and conflicts.'
      }
    ]
  },
  tweet:
    "Brian wants Baker and Ashley to be proud of the adaptation and characters. Brian analyzed the porch scene and notes Pedro's Joel is more emotional. Brian kept Joel depiction conversations private. Brian wants artists to bring their own versions.",
  highlights: [
    {
      id: 'core_topic',
      headline: "Joel's different interpretations are brilliant",
      summary:
        "Both versions of Joel are brilliant, with the show's version displaying more vulnerability.",
      evidence: '[00:02:14-00:02:22] Brian Parrish: Brilliant versions of Joel',
      start_time: '00:02:09:00',
      end_time: '00:02:27:00'
    },
    {
      id: 'key_question',
      headline: "Pedro's Joel more emotional?",
      summary: "Brian asks about conversations regarding Pedro's more emotional depiction of Joel.",
      evidence: "[00:01:10-00:01:19] Brian Parrish: Pedro's depiction of Joel more emotional?",
      start_time: '00:01:05:00',
      end_time: '00:01:24:00'
    },
    {
      id: 'outcomes',
      headline: 'Allow artists their own versions',
      summary:
        'The director wanted the actors to create their own versions of the characters and conflicts, rather than copying the original performances, because that is why artists are brought on board in the first place.',
      evidence: '[00:01:51-00:02:03] Brian Parrish: This is their version',
      start_time: '00:01:46:00',
      end_time: '00:02:08:00'
    }
  ],
  tenant: {
    id: '8cff9346-a5fe-42e6-bd20-de3731fe3bfe',
    name: 'FORA'
  },
  creator: {
    id: 'a42ef052-2a95-444e-b09c-5c8b7a10c595',
    name: 'Brian Parrish'
  },
  created_at: 1748533581675,
  updated_at: 1748533933398,
  speakers: {
    'Brian Parrish': 219.8999481201172
  }
};

const defaultMeeting = {
  id: '8328683d20051aeda21c0e57d4bdc32f58c7201d_2n4k3ru9681ibbad1311jjnu7j',
  title: 'Test Meeting',
  url: 'https://us05web.zoom.us/j/12345',
  // start_at: 1748533620000,
  // end_at: 1748537220000,
  status: {
    id: 'a',
    name: 'Accepted'
  },
  bot_id: 'ed0b7815-356a-43f0-b5c8-e1f17a1dcd61',
  bot_attendee: true,
  calendar: {
    id: 'brian@fora.day',
    name: 'brian@fora.day'
  },
  domains: [],
  initiative: {
    id: '886599b4-a4ba-4270-96fc-2a992bc88dac',
    title: 'Catch-all',
    type: 'Focus',
    color: '#FB8C00',
    description:
      "These are meetings that are not related to the FORA's core objectives but are potentially relevant business conversations. Focus on topics discussed as key takeaways and follow-up items.",
    collaborators: [
      {
        id: '102471867973585563286-google',
        name: 'John Bruno'
      },
      {
        id: '4908e3ce-ebb3-4854-a09e-993bc1110784',
        name: 'Johnny Dwyer'
      },
      {
        id: '7525686e-1fd5-4d1f-98ea-1e8485c421f7',
        name: 'Sydney Adamsen'
      },
      {
        id: 'a7c8faa2-1c23-4226-83ac-ec2caba81850',
        name: 'Josh Coe'
      },
      {
        id: 'b092ad15-001e-4b96-bfb9-87a11adaea15',
        name: 'Joseph Essenfeld'
      },
      {
        id: 'd8adc43c-345a-4940-9c00-2b8156967cda',
        name: 'Zack Elias'
      },
      {
        id: 'f6a470f3-cea0-4a18-bce6-a0f1c1d9fb1a',
        name: 'Josh Coe'
      }
    ]
  },
  initiative_match: 'Auto',
  nylas: {
    id: '2n4k3ru9681ibbad1311jjnu7j',
    calendar_id: 'brian@fora.day',
    title: 'Test Meeting',
    when: {
      object: 'timespan',
      start_time: 1748533620,
      end_time: 1748537220,
      start_timezone: 'America/New_York',
      end_timezone: 'America/New_York'
    },
    object: 'event',
    grant_id: '3595786f-9fff-493f-bc09-e21be6142771',
    html_link:
      'https://www.google.com/calendar/event?eid=Mm40azNydTk2ODFpYmJhZDEzMTFqam51N2ogYnJpYW5AZm9yYS5kYXk',
    ical_uid: '2n4k3ru9681ibbad1311jjnu7j@google.com',
    status: 'confirmed',
    visibility: 'default',
    busy: true,
    hide_participants: false,
    read_only: false,
    organizer: {
      name: '',
      email: 'brian@fora.day'
    },
    conferencing: {
      provider: 'Zoom Meeting',
      details: {
        url: 'https://us05web.zoom.us/j/123456'
      }
    },
    participants: [],
    reminders: {
      use_default: true,
      overrides: []
    },
    created_at: 1748533578,
    updated_at: 1748533583
  },
  sensitive: false,
  tenant: {
    id: '8cff9346-a5fe-42e6-bd20-de3731fe3bfe',
    name: 'FORA'
  },
  creator: {
    id: 'a42ef052-2a95-444e-b09c-5c8b7a10c595',
    name: 'Brian Parrish'
  },
  created_at: 1748533579972,
  updated_at: 1748533589661,
  bot: defaultBot
};

const fakeSummary =
  "***Potential Takeaways*** - Brian Parrish wants those involved in the game and show to feel proud of the adaptation, especially Baker and Ashley Johnson. - Parrish analyzed the porch scene adaptation, noting Pedro Pascal's Joel as more emotional than the game's portrayal. - Parrish kept conversations about Joel's depiction private to allow for artistic interpretation, avoiding direct replication of the original scene. - Parrish emphasized the importance of artists bringing their own versions to the characters and conflicts.";

const statusChangeOptions = [
  { label: 'Ready', code: 'ready' },
  { label: 'Joining Call', code: 'joining_call' },
  { label: 'In Waiting Room', code: 'in_waiting_room' },
  { label: 'In Call Not Recording', code: 'in_call_not_recording' },
  { label: 'In Call Recording', code: 'in_call_recording' },
  { label: 'Call Ended', code: 'call_ended' },
  { label: 'Done', code: 'done' },
  { label: 'Done (num_of_summaries = 0)', code: 'done', num_of_summaries: 0 },
  { label: 'Fatal', code: 'fatal' },
  { label: 'Fatal (num_of_summaries = 1)', code: 'fatal', num_of_summaries: 1 },
  { label: 'Recording Acquired', code: 'recording_acquired' },
  { label: 'Highlighted', code: 'highlighted' }
];

export default function ControlBarSection() {
  const [bot, setBot] = useState(defaultBot);
  const [meeting, setMeeting] = useState({
    ...defaultMeeting,
    start_at: new Date(),
    end_at: addHours(new Date(), 1)
  });

  const addStatusChange = (statusChange) => {
    setBot({
      ...bot,
      status_changes: [
        ...bot.status_changes,
        { ...omit(statusChange, 'label'), created_at: new Date() }
      ],
      num_of_status_changes: bot.num_of_status_changes + 1
    });
  };

  const removeStatusChange = (statusChangeIndex) => {
    const updatedStatusChanges = [...bot.status_changes];
    updatedStatusChanges.splice(statusChangeIndex, 1);
    setBot({
      ...bot,
      status_changes: updatedStatusChanges,
      num_of_status_changes: bot.num_of_status_changes - 1
    });
  };

  return (
    <Stack>
      <HStack
        gap={12}
        align='flex-start'
      >
        <Stack flex={1}>
          <Text variant='body-600-sm'>Add Status Changes to Bot</Text>
          {statusChangeOptions?.map((opt) => (
            <Button
              key={opt.value}
              variant='reskinLink'
              size='reskinSm'
              onClick={() => addStatusChange(opt)}
            >
              {opt.label}
            </Button>
          ))}
        </Stack>
        <Stack flex={1}>
          <Text variant='body-600-sm'>Other Bot/Meeting Changes</Text>
          <Checkbox
            size='sm'
            color='surface.onSurfaceVariant'
            isChecked={!!bot?.summary}
            onChange={(e) => setBot({ ...bot, summary: e?.target?.checked ? fakeSummary : null })}
          >
            Has Summary
          </Checkbox>
          <Checkbox
            size='sm'
            color='surface.onSurfaceVariant'
            isChecked={!!meeting?.url}
            onChange={(e) =>
              setMeeting({
                ...meeting,
                url: e?.target?.checked ? 'https://us05web.zoom.us/j/123456' : null
              })
            }
          >
            Has URL
          </Checkbox>
          <HStack>
            <Text fontSize='sm'>Start</Text>
            <Input
              type='time'
              value={format(meeting?.start_at, 'H:mm:ss')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                return setMeeting({ ...meeting, start_at: set(new Date(), { hours, minutes }) });
              }}
            />
          </HStack>
          <HStack>
            <Text fontSize='sm'>End</Text>
            <Input
              type='time'
              value={format(meeting?.end_at, 'H:mm:ss')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                return setMeeting({ ...meeting, end_at: set(new Date(), { hours, minutes }) });
              }}
            />
          </HStack>
          <Button
            variant='reskinPrimary'
            colorScheme='critical'
            size='reskinSm'
            onClick={() => {
              setMeeting({
                ...defaultMeeting,
                start_at: new Date(),
                end_at: addHours(new Date(), 1)
              });
              setBot(defaultBot);
            }}
          >
            Reset All to Defaults
          </Button>
        </Stack>
        <Stack flex={2}>
          <Text variant='body-600-sm'>
            Actions Won&apos;t Really Work Here, Use Buttons to Left to Change State
          </Text>

          <ReskinMeetingCardContext.Provider value={{ meeting, bot }}>
            <Box
              as='button'
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              <ReskinMeetingCardControlBar
                size='lg'
                enableMenu={false}
              />
            </Box>
          </ReskinMeetingCardContext.Provider>
          <Text variant='body-600-sm'>
            {format(meeting?.start_at, 'pp')}&nbsp;-&nbsp;{format(meeting?.end_at, 'pp')}
          </Text>
          <Stack mt={3}>
            {bot?.status_changes?.map((statusChange, idx) => (
              <HStack key={`${statusChange.code}-${statusChange.created_at}`}>
                <IconButton
                  size='reskinXs'
                  variant='reskinLink'
                  px={1.5}
                  isRound
                  icon={<CloseIcon />}
                  onClick={() => removeStatusChange(idx)}
                />
                <Text>{statusChange.code}</Text>
              </HStack>
            ))}
          </Stack>
        </Stack>
      </HStack>
      <Text
        variant='body-600-sm'
        mt={8}
      >
        Notes
      </Text>
      <UnorderedList>
        <ListItem>
          I recommend setting the status changes in the order listed on the left (with the exception
          of pausing) Adjusting out of order wouldn&apos;t necessarily reflect how the statuses come
          through IRL
        </ListItem>
        <ListItem>
          To achieve a &quot;Paused&quot; status, set to &quot;In Call Not Recording&quot; to
          &quot;In Call Recording&quot; back to &quot;In Call Not Recording&quot;
        </ListItem>
        <ListItem>
          &quot;Done&quot; and &quot;Fatal&quot; statuses must be preceded by a &quot;Call
          Ended&quot; status
        </ListItem>
        <ListItem>
          For some reason hitting &quot;Reset All to Defaults&quot; leaves the progress bar active
          for a few seconds before disappearing. No idea why just give it a sec lol
        </ListItem>
      </UnorderedList>
    </Stack>
  );
}

/*

  status_changes: [
    {
      code: 'ready',
      created_at: 1748530918852
    },
    {
      code: 'joining_call',
      created_at: 1748533588956
    },
    {
      code: 'in_waiting_room',
      created_at: 1748533590564
    },
    {
      code: 'in_call_not_recording',
      created_at: 1748533627228
    },
    {
      code: 'recording_permission_allowed',
      created_at: 1748533630435
    },
    {
      code: 'in_call_recording',
      created_at: 1748533630902
    },
    {
      code: 'call_ended',
      sub_code: 'call_ended_by_host',
      created_at: 1748533863900
    },
    {
      code: 'done',
      created_at: 1748533866758
    },
    {
      code: 'recording_acquired',
      created_at: 1748533885859
    },
    {
      code: 'highlighted',
      created_at: 1748533933398
    }
  ],
  */
