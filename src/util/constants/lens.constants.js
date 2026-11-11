import {
  SFBookPagesOutlinedIcon,
  SFPieChartIcon,
  SFChatBubblesIconOutlined,
  SFLineChartIcon,
  SFDollarSignIcon,
  SFCustomersIcon,
  SFGaugeIcon,
  SFCalendarIcon,
  SFLensIcon,
  SFLockedIconOutlined,
  SFTwoBuildings
} from '@assets/icons';

// lens templates will use quotes in nonstandard ways
/* eslint-disable quotes */
// reskin todo: add constants.js file to sonar ignore paths if possible
export const LENS_TEMPLATES = [
  {
    lens_title: 'Start Blank',
    description: 'A clean slate template for crafting your custom Lens from scratch.',
    icon: 'lens',
    lens_config: {
      match_prompt: '',
      explanatory_prompt: '',
      high_priority_examples_prompt: '',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 1
    }
  },
  {
    lens_title: 'Project Progress',
    description: 'Track milestones, risks, and key deliverables for specific initiatives.',
    icon: 'calendar',
    lens_config: {
      match_prompt:
        'Please report on the latest developments concerning the delivery of <INSERT_PROJECT_NAME_HERE>. Who are the key stakeholders, and what are they most excited about? How often do they change their mind? Is there anything occurring that would put the project at risk? <LIST SOME DETAILS ABOUT THE PROJECT HERE>',
      explanatory_prompt:
        'INSERT_PROJECT_NAME_HERE is an essential deliverable for us to <HIT OUR REVENUE TARGET, DELIVER ON A KEY CUSTOMER COMMIT, OR ANOTHER GOAL > ',
      high_priority_examples_prompt: 'Highlight key risks to our delivery date of <DATE>',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 7
    }
  },
  {
    lens_title: 'Customer Feedback',
    description: 'Monitor customer interactions and sentiment for analysis.',
    icon: 'customers',
    lens_config: {
      match_prompt: `How have conversations with clients been going? Are clients encountering technical or usability issues with the platform? If a customer is having an issue, please mention that customer's organization by name.`,
      explanatory_prompt:
        'I want to understand the quality of the experience provided to customers and identify steps we could take to improve the process.',
      high_priority_examples_prompt: '',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 1
    }
  },
  {
    lens_title: 'Meeting Pulse',
    description: 'Understand what occurs at your company in real time.',
    icon: 'compass',
    lens_config: {
      match_prompt:
        'Please summarize what happens in meetings across the company. In particular, I am looking for <X Y Z>',
      explanatory_prompt:
        'As a senior executive, it is my duty to ensure that people at my organization are collaborating efficiently and performing effectively. To that end, I would like to stay on top of how things across the company progress.',
      high_priority_examples_prompt: '',
      min_similarity_score: 0.01
    },
    insight_config: {
      duration_days: 1
    }
  },
  {
    lens_title: 'Performance Tracker',
    description: 'Evaluate the effectiveness of key individuals in your organization.',
    icon: 'compass',
    lens_config: {
      match_prompt:
        'What is <INSERT NAME> working on? How is it being received by the team? What are the positives and negatives?',
      explanatory_prompt: `I am reviewing <INSERT NAME>'s performance and would like to track accordingly.`,
      high_priority_examples_prompt: '',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 14
    }
  },
  {
    lens_title: 'Meeting Informational Readout',
    description: 'Gather information to be read out to the attendees of a specific meeting.',
    icon: 'book',
    lens_config: {
      match_prompt:
        'Please provide recent information for us to review during the weekly "<INSERT MEETING NAME>" meeting. Things like <INSERT INFO RELEVANT TO AGENDA ITEMS> are paramount things to include. Thanks!',
      explanatory_prompt:
        'Every week the "<INSERT MEETING NAME>" meeting is hosted by the <TEAM NAME> team. The goal of the meeting is <INSERT GOAL>. We would like to ease dissemination of this information in the form of these updates.',
      high_priority_examples_prompt: '',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 7
    }
  },
  {
    lens_title: 'New Employee Onboarding',
    description:
      'Get a new employee up to speed with customized need-to-know content based on their role',
    icon: 'compass',
    lens_config: {
      match_prompt:
        'I have just been hired as the <INSERT ROLE> for <COMPANY NAME>. Please get me up to speed. What should I know before getting started?',
      explanatory_prompt:
        'I would like to hit the ground running as I get spun up in my new role. If I can make an impact of then everyone at the company will earn a big bonus - and the first step toward that goal is to understand what our strong and weak points are.',
      high_priority_examples_prompt: '',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 1
    }
  },
  {
    lens_title: 'Sources of Strategic Tension',
    description: 'Identify and understand various disagreements.',
    icon: 'chat-bubbles',
    lens_config: {
      match_prompt:
        'What do people tend to discuss vigorously during meetings? Which topics inspire passion and active discussion? Please prefer recent conversations that focus on strategy. Please be specific about the actual flashpoints that arise in discussion and remember to include the date and title of the meetings where they occur.',
      explanatory_prompt:
        'Disagreement over strategy is a sign of a healthy company culture, and fully understanding the arguments put forth by different perspectives can lead to a better overall strategy.',
      high_priority_examples_prompt: '',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 7
    }
  },
  {
    lens_title: 'UX Feedback',
    description: 'Understand how people are responding to the experience of your site.',
    icon: 'customers',
    lens_config: {
      match_prompt:
        'What are the most common design-related issues mentioned in user feedback during meetings? Are there recurring themes or patterns in user feedback that suggest areas for design improvement? Which design features or changes discussed in meetings have had the most positive impact on user satisfaction? What design elements are frequently cited in meetings as contributing to user frustration or dissatisfaction? Focus on feedback from key user segments such as new users, executive users, and enterprise clients. Additionally, prioritize insights from sales meetings and customer support interactions.',
      explanatory_prompt:
        'The goal is to gain a deeper understanding of how different design features impact user experience and to identify trends in user feedback. By analyzing these insights, we aim to prioritize design improvements that enhance user satisfaction and address any recurring issues.',
      high_priority_examples_prompt:
        'High-priority updates include any significant changes in user feedback trends, such as frequent mentions of specific design issues. Report on which design features have had the most negative impact on user satisfaction.',
      min_similarity_score: 0.36
    },
    insight_config: {
      duration_days: 7
    }
  }
];
/* eslint-enable quotes */

export const VISIBILITY_OPTIONS = [
  {
    icon: SFCustomersIcon,
    value: 'Collaborators',
    label: 'Followers Only'
  },
  {
    icon: SFLockedIconOutlined,
    value: 'Owner',
    label: 'Only Me'
  },
  {
    icon: SFTwoBuildings,
    value: 'Tenant',
    label: 'Everyone'
  }
];

export const DURATION_OPTIONS = [
  {
    value: 1,
    label: 'Every Day'
  },
  {
    value: 7,
    label: 'Every 7 Days'
  },
  {
    value: 14,
    label: 'Every 14 Days'
  },
  {
    value: 30,
    label: 'Every 30 Days'
  }
];

export const COLOR_OPTIONS = [
  {
    value: '#2563EB',
    label: 'Blue'
  },
  {
    value: '#058BBD',
    label: 'Teal'
  },
  {
    value: '#099579',
    label: 'Emerald'
  },
  {
    value: '#CA8A04',
    label: 'Gold'
  },
  {
    value: '#EA580C',
    label: 'Sunset'
  },
  {
    value: '#DE2260',
    label: 'Fuchsia'
  },
  {
    value: '#9333EA',
    label: 'Magenta'
  },
  {
    value: '#6640E9',
    label: 'Amethyst'
  }
];

export const ICON_MAPPING = {
  book: {
    icon: SFBookPagesOutlinedIcon,
    label: 'Book'
  },
  'pie-chart': {
    icon: SFPieChartIcon,
    label: 'Pie Chart'
  },
  calendar: {
    icon: SFCalendarIcon,
    label: 'Calendar'
  },
  'chat-bubbles': {
    icon: SFChatBubblesIconOutlined,
    label: 'Messages'
  },
  'line-chart': {
    icon: SFLineChartIcon,
    label: 'Line Chart'
  },
  'dollar-sign': {
    icon: SFDollarSignIcon,
    label: 'Dollar Sign'
  },
  customers: {
    icon: SFCustomersIcon,
    label: 'Customers'
  },
  compass: {
    icon: SFGaugeIcon,
    label: 'Gauge'
  },
  lens: {
    icon: SFLensIcon,
    label: 'Default'
  }
};

export const SIMILARITY_SCORE_TIER_MAP = {
  0.01: 0,
  0.285: 25,
  0.36: 50,
  0.4: 75,
  0.45: 100
};

export const AUTOMATCH_SIMILARITY_SCORE = 0.36;
export const NEVERMATCH_SIMILARITY_SCORE = 1;

export const SUB_SOURCE_FORM_VALUES = [
  'Meeting',
  'Slack_Digest',
  'Email_Thread',
  'Earnings_Call',
  'Teams_Digest'
];

export const MEETING_SUB_SOURCES = [
  'Google_Meeting',
  'Teams_Meeting',
  'Webex_Meeting',
  'Zoom_Meeting'
];
