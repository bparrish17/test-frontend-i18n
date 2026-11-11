import { Flex, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

import PersonPreview from '@components/general/avatar-preview/person-preview.component';
import ContactSourceIcon from '@components/general/contact-source-icon.component';
import TableOfContents from '@components/general/table-of-contents.component';
import LinkRadio from '@components/general/form/link-radio.component';
import { SFBoltFillIcon, SFChecklistIcon, SFListBulletIndentIcon } from '@assets/icons';
import ForaBanner from '@components/general/fora-banner.component';
import DocumentIcon from '@components/general/document-icon.component';
import { useTranslation } from 'react-i18next';

const fakePerson = {
  avatar_url:
    'https://lh3.googleusercontent.com/a-/ALV-UjVxAdV-mL9JHOkoVwA8g3UxYd1goPjByYNkIOpQWXWz2baKH6sq=s96-c',
  company_name: 'FORA',
  name: 'Joseph Essenfeld',
  id: 'b092ad15-001e-4b96-bfb9-87a11adaea15',
  title: 'CEO',
  email: 'joe@fora.day',
  status: 'yes',
  external: false,
  meetingId: '6f9fd79daaf5bbd3d80dd6659934ff52ba0a22b8_4v7pp31li5c3kcuje5fdshs36n',
  isOrganizer: false,
  internalId: 'b092ad15-001e-4b96-bfb9-87a11adaea15',
  first_name: 'Joe',
  organizationName: 'FORA',
  photo_url:
    'https://lh3.googleusercontent.com/a-/ALV-UjVxAdV-mL9JHOkoVwA8g3UxYd1goPjByYNkIOpQWXWz2baKH6sq=s96-c',
  apolloProfile: {
    id: '66f4f0826c498c00019cb69d',
    name: 'Joe Essenfeld',
    first_name: 'Joe',
    email: 'joe@fora.day',
    organization_id: '65b43856d2741c01c660a1ff',
    organization: {
      id: '65b43856d2741c01c660a1ff',
      name: 'FORA',
      website_url: 'https://www.fora.day',
      linkedin_url: 'https://www.linkedin.com/company/fora-day',
      primary_phone: {
        number: '+49 773 1388410',
        source: 'Account'
      },
      phone: '+49 773 1388410',
      linkedin_uid: '101810094',
      founded_year: 2023,
      logo_url:
        'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/67c553e42e064b0001be7fe5/picture',
      primary_domain: 'fora.day',
      industry: 'information technology & services',
      keywords: [
        'meeting summarization',
        'executive insights',
        'qualitative data insights',
        'secure content sharing',
        'communication intelligence',
        'ai notetaking',
        'document summarization',
        'zoom integration',
        'google meet integration',
        'customer success',
        'operational efficiency',
        'sales pipeline management',
        'software development',
        'ai-powered platform',
        'personalized insights',
        'team performance',
        'data analysis',
        'customer retention',
        'customer satisfaction',
        'meeting summaries',
        'project management',
        'performance management',
        'strategic decision-making',
        'data integration',
        'real-time updates',
        'automated alerts',
        'noise reduction',
        'customer feedback',
        'employee onboarding',
        'organizational agility',
        'resource allocation',
        'performance optimization',
        'actionable insights',
        'meeting transcription',
        'meeting recording automation',
        'business intelligence',
        'crm integration',
        'collaborative platform',
        'risk mitigation',
        'data security',
        'cloud solutions',
        'implementation support',
        'customer growth',
        'organizational transparency',
        'communication analysis',
        'operational challenges',
        'flexible notifications',
        'saml-based sso',
        'privacy compliance',
        'continuous improvement',
        'strategic agility',
        'high-priority alerts',
        'user engagement',
        'data migration',
        'data privacy',
        'remote work integration',
        'project tracking',
        'executive preparation',
        'decision-making support',
        'ai chat support',
        'enterprise support',
        'multi-channel communication',
        'information technology & services',
        'data analytics',
        'productivity',
        'enterprise software',
        'enterprises',
        'computer software',
        'b2b',
        'analytics',
        'computer & network security',
        'cloud computing'
      ],
      estimated_num_employees: 24,
      snippets_loaded: true,
      industry_tag_id: '5567cd4773696439b10b0000',
      retail_location_count: 0,
      raw_address: '200 Park Ave S, New York, NY 10003, US',
      street_address: '200 Park Avenue South',
      city: 'New York',
      state: 'New York',
      postal_code: '10003',
      country: 'United States',
      suborganizations: [],
      num_suborganizations: 0,
      seo_description:
        'FORA transforms enterprise meetings and communications into actionable intelligence. Capture institutional knowledge, gain real-time insights, and make better decisions with our AI-powered platform.',
      short_description:
        "Welcome to FORA.\n\nAt FORA, our mission is to empower leadership at every level of your organization with the insights needed to drive productivity, efficiency, and better decision-making. We're not just enhancing how executives lead; we're revolutionizing how businesses operate by harnessing the power of AI to unlock the full potential of your organization.\n\nIn a world where data is abundant but often underutilized, FORA steps in to ensure that every conversation, meeting, and interaction counts. Our platform taps into your calendar, meeting, chat, email, org chart, and CRM data, providing clarity and actionable insights for leaders and teams alike. Whether it's simplifying meetings, boosting productivity, or fostering better relationships within your organization, FORA is designed to help you understand and navigate the complexities of your business with ease.\n\nFORA's customizable lenses deliver personalized insights, enabling leaders at all levels to focus on what truly matters without being bogged down by unnecessary meetings. With our AI-powered summaries, every employee can stay informed and aligned, ensuring that time is spent on the most critical tasks.\n\nWe believe in turning pivotal moments into profitable outcomes, and our solution is built with security and privacy at its core. From simple implementation to robust security measures, FORA is here to support your journey towards a more efficient and productive workplace.\n\nJoin us in transforming leadership and productivity within your organization. Discover how FORA can help you achieve more by visiting fora.day.\n\nLet's make every moment count.",
      funding_events: [],
      technology_names: [
        'AI',
        'Amazon AWS',
        'Android',
        'Basis',
        'Data Storage',
        'Gmail',
        'Google Apps',
        'Google Workspace',
        'Intercom',
        'IoT',
        'Micro',
        'Mobile Friendly',
        'NSOne',
        'Python',
        'React Native',
        'Remote',
        'Render',
        'Reviews'
      ],
      current_technologies: [
        {
          uid: 'ai',
          name: 'AI',
          category: 'Other'
        },
        {
          uid: 'amazon_aws',
          name: 'Amazon AWS',
          category: 'Hosting'
        },
        {
          uid: 'android',
          name: 'Android',
          category: 'Frameworks and Programming Languages'
        },
        {
          uid: 'basis',
          name: 'Basis',
          category: 'Advertising Networks'
        },
        {
          uid: 'data storage',
          name: 'Data Storage',
          category: 'Other'
        },
        {
          uid: 'gmail',
          name: 'Gmail',
          category: 'Email Providers'
        },
        {
          uid: 'google_apps',
          name: 'Google Apps',
          category: 'Other'
        },
        {
          uid: 'google workspace',
          name: 'Google Workspace',
          category: 'Cloud Services'
        },
        {
          uid: 'intercom',
          name: 'Intercom',
          category: 'Support and Feedback'
        },
        {
          uid: 'iot',
          name: 'IoT',
          category: 'Other'
        },
        {
          uid: 'micro',
          name: 'Micro',
          category: 'Other'
        },
        {
          uid: 'mobile_friendly',
          name: 'Mobile Friendly',
          category: 'Other'
        },
        {
          uid: 'nsone',
          name: 'NSOne',
          category: 'Domain Name Services'
        },
        {
          uid: 'python',
          name: 'Python',
          category: 'Frameworks and Programming Languages'
        },
        {
          uid: 'react native',
          name: 'React Native',
          category: 'Frameworks and Programming Languages'
        },
        {
          uid: 'remote',
          name: 'Remote',
          category: 'Other'
        },
        {
          uid: 'render',
          name: 'Render',
          category: 'Other'
        },
        {
          uid: 'reviews',
          name: 'Reviews',
          category: 'Customer Reviews'
        }
      ]
    },
    photo_url:
      'https://media.licdn.com/dms/image/v2/D4E03AQEEVa94xM5BbA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728661136085?e=2147483647&v=beta&t=9zGA6tlyegctt5qxfNgydImkqXXhAQwdkltZnItWG5Y',
    title: 'Chief Executive Officer',
    headline: 'CEO / Founder'
  }
};

const fakeToCSections = [
  {
    name: 'Summary',
    icon: SFChecklistIcon,
    iconProps: { p: 1 }
  },
  {
    name: 'Topic Analysis',
    icon: SFBoltFillIcon,
    iconProps: { p: 1 }
  },
  {
    name: 'Meeting Timeline',
    icon: SFListBulletIndentIcon,
    iconProps: { px: '2.5px' }
  }
];

export default function CustomComponentsSection() {
  const { t } = useTranslation();

  const [agendaFilter, setAgendaFilter] = useState('overview');
  return (
    <Flex
      gap={12}
      wrap='wrap'
    >
      <Stack gap={8}>
        <Text fontWeight={600}>{t('customComponentsSection.personPreview')}</Text>
        <PersonPreviewItem
          label={t('customComponentsSection.small')}
          size='sm'
        />
        <PersonPreviewItem label={t('customComponentsSection.default')} />
        <PersonPreviewItem
          label={t('customComponentsSection.large')}
          size='lg'
        />
        <PersonPreviewItem
          label={t('customComponentsSection.xl')}
          size='xl'
        />
        <PersonPreviewItem
          label={t('customComponentsSection.n2xl')}
          size='2xl'
        />
        <PersonPreviewItem
          label={t('customComponentsSection.wWrap')}
          variant='card'
        />
        <PersonPreviewItem
          label={t('customComponentsSection.wBadge')}
          avatarBadge={
            <ContactSourceIcon
              contact={{ source: 'Salesforce' }}
              boxSize='21px'
              position='absolute'
              bottom={-1.5}
              left={-1.5}
            />
          }
        />
      </Stack>
      <Stack gap={8}>
        <Text fontWeight={600}>{t('customComponentsSection.tableOfContents')}</Text>
        <TableOfContents sections={fakeToCSections} />
      </Stack>
      <Stack gap={8}>
        <Text fontWeight={600}>{t('customComponentsSection.navigationTabs')}</Text>
        <LinkRadio
          name='agenda-sidebar-filter'
          options={[
            { value: 'overview', label: t('customComponentsSection.overview') },
            { value: 'people', label: t('customComponentsSection.people') },
            { value: 'organizations', label: t('customComponentsSection.orgs') }
          ]}
          value={agendaFilter}
          onChange={setAgendaFilter}
          containerProps={{ alignSelf: 'flex-start' }}
        />
      </Stack>
      <Stack gap={8}>
        <Text fontWeight={600}>{t('customComponentsSection.documentIcons')}</Text>
        <SimpleGrid
          columns={3}
          rowGap={3}
        >
          <DocumentIcon extension='pdf' />
          <DocumentIcon extension='doc' />
          <DocumentIcon extension='docx' />
          <DocumentIcon extension='xls' />
          <DocumentIcon extension='xlsx' />
          <DocumentIcon extension='csv' />
          <DocumentIcon extension='txt' />
        </SimpleGrid>
      </Stack>
      <Stack gap={8}>
        <Text fontWeight={600}>{t('customComponentsSection.banner')}</Text>
        <ForaBanner />
      </Stack>
    </Flex>
  );
}

function PersonPreviewItem({ label, ...props }) {
  return (
    <HStack gap={6}>
      <Text
        as='span'
        minW={12}
      >
        {label}
      </Text>
      <PersonPreview
        person={fakePerson}
        flex={1}
        {...props}
      />
    </HStack>
  );
}
