export const PULSE_DECK_DATA = {
  PulseDeck: {
    creator: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    type: 'Meeting',
    shared: [
      {
        email: 'jane.smith@example.com',
        shared_at: '2023-10-01T12:00:00Z'
      }
    ],
    high_priority: false,
    source_data: {
      Meeting: {
        title: 'Q3 Review Meeting',
        startDate: '2023-09-10',
        endDate: '2023-09-10',
        participants: ['John Doe', 'Jane Smith', 'Emily Johnson']
      }
    },
    panels: [
      // {
      //   type: 'Cover',
      //   source: 'Meeting',
      //   source_data: {
      //     meeting: {
      //       title: 'Q3 Review Meeting',
      //       quick_summary: 'Revenue growth, employee morale, and more',
      //       start_date: '2023-02-20T10:00:00.000Z',
      //       end_date: '2023-02-20T11:00:00.000Z',
      //       is_high_priority: false,
      //       participants: [
      //         {
      //           "avatar_url": "https://media.licdn.com/dms/image/v2/C4E03AQFI5UHNbHha9g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1583254003242?e=2147483647&v=beta&t=ZlUMr_8pU8fz33os4aTWgTBb_SwiVOxW7hTXx6LLwr0",
      //           "duration": 639.3102645874023,
      //           "company_name": "FORA",
      //           "name": "John Bruno",
      //           "title": "Head of Revenue & Operations",
      //           "email": "john@fora.day",
      //           "status": "yes",
      //           "external": false
      //         },
      //         {
      //           "avatar_url": "https://media.licdn.com/dms/image/v2/C4E03AQFI5UHNbHha9g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1583254003242?e=2147483647&v=beta&t=ZlUMr_8pU8fz33os4aTWgTBb_SwiVOxW7hTXx6LLwr0",
      //           "duration": 264.96067810058594,
      //           "company_name": "IDG",
      //           "name": "Steven Dube",
      //           "title": "Regional Lead, IT Operations",
      //           "email": "sdube@idc.com",
      //           "status": "noreply",
      //           "external": true
      //         },
      //         {
      //           "avatar_url": "https://media.licdn.com/dms/image/v2/C4E03AQFI5UHNbHha9g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1583254003242?e=2147483647&v=beta&t=ZlUMr_8pU8fz33os4aTWgTBb_SwiVOxW7hTXx6LLwr0",
      //           "duration": 264.96067810058594,
      //           "company_name": "IDG",
      //           "name": "Steven Dube",
      //           "title": "Regional Lead, IT Operations",
      //           "email": "sdube@idc.com",
      //           "status": "noreply",
      //           "external": true
      //         },
      //         {
      //           "avatar_url": "https://media.licdn.com/dms/image/v2/C4E03AQFI5UHNbHha9g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1583254003242?e=2147483647&v=beta&t=ZlUMr_8pU8fz33os4aTWgTBb_SwiVOxW7hTXx6LLwr0",
      //           "duration": 264.96067810058594,
      //           "company_name": "IDG",
      //           "name": "Steven Dube",
      //           "title": "Regional Lead, IT Operations",
      //           "email": "sdube@idc.com",
      //           "status": "noreply",
      //           "external": true
      //         },
      //         {
      //           "avatar_url": "https://media.licdn.com/dms/image/C4E03AQHdK72YMGD1Cw/profile-displayphoto-shrink_200_200/0/1516165725200?e=2147483647&v=beta&t=zi6sQG8Kf6LzB0bX_KOvC1vBJ16nVCQEprUov0f5XiE",
      //           "duration": 206.31998777389526,
      //           "company_name": "IDC",
      //           "name": "Hugh Ujhazy",
      //           "title": "Vice President Research Operations",
      //           "email": "hujhazy@idc.com",
      //           "status": "yes",
      //           "external": true
      //         }
      //       ]
      //     },
      //     bot: {
      //       net_sentiment_score: 'positive',
      //       net_strategic_tactical_score: 'strategic'
      //     },
      //     card: {
      //       headline: 'Internal Team reviewed IDG Priorities'
      //     }
      //   }
      // },
      {
        type: 'Summary',
        source: 'Meeting',
        source_data: {
          background_image:
            'https://images.unsplash.com/photo-1676316698468-a907099ad5bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
          meeting: {
            id: '7e1077ecda6d9c757ff9350a73b08880b7846600_2qbecv22to4urr7rvjt4nasetn_20241029T150000Z',
            title: 'This is the summary slide',
            quick_summary: 'Revenue growth, employee morale, and more',
            start_date: '2023-02-20T10:00:00.000Z',
            end_date: '2023-02-20T11:00:00.000Z',
            is_high_priority: false
          },
          card: {
            headline:
              'A pilot project to automate report writing and enhance analyst productivity is set for November completion.',
            call_to_action: 'Call to Action Text Here',
            sections: [
              {
                title:
                  'The project aims to streamline data collection, improve customer interaction tracking, and generate client-facing summaries.',
                description: 'An overview of the revenue growth last quarter.'
              }
            ]
          }
        }
      }
      // {
      //   type: 'Sentiment',
      //   source: 'Meeting',
      //   source_data: {
      //     call_to_action: 'Call to Action Text Here 2',
      //     bot: {
      //       topics: [
      //         {
      //           title: 'Revenue Growth',
      //           details: 'Revenue increased by 15%',
      //           sentiment_score: 10
      //         },
      //         {
      //           title: 'Employee Morale',
      //           details: 'Slight decline in employee satisfaction',
      //           sentiment_score: -5
      //         },
      //         {
      //           title: 'Market Expansion',
      //           details: 'Discussion on entering new markets',
      //           sentiment_score: 5
      //         },
      //         {
      //           title: 'Team Restructuring',
      //           details: 'Optimization of team roles',
      //           sentiment_score: 5
      //         }
      //       ]
      //     }
      //   }
      // },
      // {
      //   type: 'Topics',
      //   source: 'Meeting',
      //   source_data: {
      //     call_to_action: 'Call to Action Text Here 3',
      //     bot: {
      //       topics: [
      //         {
      //           title: 'Revenue Growth',
      //           details: 'Revenue increased by 15%',
      //           strategic_vs_tactical: 'strategic'
      //         },
      //         {
      //           title: 'Employee Morale',
      //           details: 'Slight decline in employee satisfaction',
      //           strategic_vs_tactical: 'tactical'
      //         },
      //         {
      //           title: 'Market Expansion',
      //           details: 'Discussion on entering new markets',
      //           strategic_vs_tactical: 'strategic'
      //         },
      //         {
      //           title: 'Team Restructuring',
      //           details: 'Optimization of team roles',
      //           strategic_vs_tactical: 'tactical'
      //         }
      //       ]
      //     }
      //   }
      // },
      // {
      //   type: 'Followups',
      //   source: 'Meeting',
      //   source_data: {
      //     call_to_action: 'Call to Action Text Here 2',
      //     followups: [
      //       'Schedule follow-up meeting',
      //       'Finalize budget proposals',
      //       'Review employee feedback',
      //       'Update team roles',
      //       'Prepare for Q4 planning',
      //       'Send out meeting notes',
      //       'Review market expansion plans',
      //       'Finalize revenue projections'
      //     ]
      //   }
      // },
      // {
      //   type: 'Participants',
      //   source: 'Meeting',
      //   source_data: {
      //     call_to_action: 'Call to Action Text Here 7',
      //     meeting: {
      //       title: 'Q3 Review Meeting',
      //       quick_summary: 'Revenue growth, employee morale, and more',
      //       start_date: '2023-02-20T10:00:00.000Z',
      //       end_date: '2023-02-20T11:00:00.000Z',
      //       participants: ['John Doe', 'Jane Smith', 'Emily Johnson']
      //     },
      //     bot: {
      //       speaker_times: [
      //         {
      //           name: 'John Doe',
      //           time_spoken: '15 minutes',
      //           speaker_summary: 'Spoke about revenue growth and market expansion.',
      //           strategic_vs_tactical: 'strategic'
      //         },
      //         {
      //           name: 'Jane Smith',
      //           time_spoken: '10 minutes',
      //           speaker_summary: 'Discussed employee morale and team restructuring.',
      //           strategic_vs_tactical: 'balanced'
      //         },
      //         {
      //           name: 'Emily Johnson',
      //           time_spoken: '5 minutes',
      //           speaker_summary: 'Reviewed team roles and follow-up tasks.',
      //           strategic_vs_tactical: 'tactical'
      //         }
      //       ]
      //     }
      //   }
      // }
    ]
  }
};
