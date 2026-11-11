import { SFTwoBuildings } from '@assets/icons';
import { Box, HStack, Text } from '@chakra-ui/react';

import PersonPreview from '@components/general/avatar-preview/person-preview.component';
import {
  buildOrgLink,
  capitalizeFullString,
  formatDurationWithUnits,
  pluralized
} from '@util/helpers';

const personPreviewStyle = {
  layerStyle: 'reskin-card',
  border: 'none'
};

const nameHeader = (type) => ({
  title: 'Name',
  orderBy: 'name',
  dir: 'asc',
  width: '1fr',
  props: {
    minW: '150px',
    avatarVariant: type === 'organization' ? null : 'grayscale'
  },
  render: (entity, header) => {
    const disabledLinkProps = {
      as: Text,
      _hover: {},
      color: 'surface.onSurface'
    };
    const personContainerProps = {
      ...(!entity?.id && !entity?.email && disabledLinkProps)
    };
    const organizationContainerProps = {
      ...(!entity?.id && disabledLinkProps),
      to: buildOrgLink({ id: entity?.id, email: entity?.email })
    };
    const containerProps =
      type === 'organization' ? organizationContainerProps : personContainerProps;

    return (
      <PersonPreview
        size='sm'
        key={entity?.email}
        person={entity}
        titleProps={{ display: 'none' }}
        titleContainerProps={{ flexDir: 'column', display: 'none' }}
        style={personPreviewStyle}
        alignItems='center'
        {...(type === 'organization' ? { fallbackIcon: <SFTwoBuildings /> } : {})}
        {...header.props}
        {...containerProps}
      />
    );
  }
});

const numberOfMeetingsHeader = {
  title: 'Number of Meetings',
  orderBy: 'count',
  dir: 'asc',
  width: '1fr',
  props: {
    minWidth: '200px'
  },
  render: (entity, header) => (
    <Text
      fontSize='11px'
      color='surface.onSurfaceVariant'
      textAlign='left'
      _firstLetter={{ textTransform: 'uppercase' }}
      {...header.props}
    >
      {pluralized('recorded meeting', entity?.botted)}
    </Text>
  )
};

const titleHeader = (title, type) => ({
  title,
  orderBy: 'title',
  dir: 'asc',
  width: '1fr',
  props: {
    minW: '150px'
  },
  render: (entity, header) => {
    return (
      <Text
        fontSize='11px'
        color='surface.onSurfaceVariant'
        textAlign='left'
        _firstLetter={{ textTransform: 'uppercase' }}
        {...header.props}
      >
        {type === 'organization' ? capitalizeFullString(entity.title) : entity.title}
      </Text>
    );
  }
});

export const peopleHeaders = [
  nameHeader('person'),
  {
    title: 'Company',
    orderBy: 'company_name',
    dir: 'asc',
    width: '1fr',
    props: {
      minW: '150px'
    },
    render: (person, header) => (
      <Text
        fontSize='11px'
        color='surface.onSurfaceVariant'
        textAlign='left'
        textTransform='capitalize'
        {...header.props}
      >
        {person?.company_name}
      </Text>
    )
  },
  titleHeader('Title', 'person'),
  numberOfMeetingsHeader,
  {
    title: 'Total Time Met',
    orderBy: 'duration',
    dir: 'asc',
    width: '1fr',
    props: {
      minW: '150px'
    },
    render: (person, header) => (
      <Text
        fontSize='11px'
        color='surface.onSurfaceVariant'
        textAlign='left'
        _firstLetter={{ textTransform: 'uppercase' }}
        {...header.props}
      >
        {formatDurationWithUnits(person?.duration, {
          minUnit: 'minutes',
          maxUnit: 'days'
        })}
        &nbsp;total
      </Text>
    )
  }
];

export const companiesHeaders = [
  nameHeader('organization'),
  titleHeader('Industry', 'organization'),
  numberOfMeetingsHeader,
  {
    title: 'Last Met',
    orderBy: 'duration',
    dir: 'asc',
    width: 'auto',
    props: {
      minW: '100px'
    },
    render: (company, header) => (
      <Text
        fontSize='11px'
        color='surface.onSurfaceVariant'
        textAlign='left'
        {...header.props}
      >
        {formatDurationWithUnits(company.duration, {
          maxUnit: 'days',
          minUnit: ['hours', 'minutes', 'seconds']
        })}{' '}
        ago
      </Text>
    )
  }
];

export const PersonSectionHeader = ({
  firstName,
  type,
  title,
  timeframe,
  numOfDays,
  showOwnership = true,
  ...props
}) => (
  <HStack {...props}>
    <Text
      variant='body-reg'
      fontWeight={600}
    >
      {title ?? `${firstName}${showOwnership ? "'s" : ''} ${type}`}
    </Text>
    <Text
      color='surface.onSurfaceVariant'
      whiteSpace='nowrap'
    >
      {timeframe ?? `Past ${numOfDays} days`}
    </Text>
  </HStack>
);

export const DotSeparatedText = ({ strings, testid, textProps, ...props }) => {
  if (!strings?.length) return null;

  return (
    <Box
      data-testid={testid}
      display='inline-flex'
      flexWrap='wrap'
      gap={1}
      {...props}
    >
      {strings.map((string, index) => (
        <Box
          key={`${string}-${index}`}
          as='span'
          display='inline-flex'
          whiteSpace='nowrap'
        >
          {index > 0 && (
            <Text
              as='span'
              mr={1}
              {...textProps}
            >
              •
            </Text>
          )}
          <Text
            as='span'
            whiteSpace='nowrap'
            {...textProps}
          >
            {string}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
