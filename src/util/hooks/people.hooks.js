import { useConst, useToast } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { first, keyBy, map, partition, uniq } from 'lodash-es';
import { subDays } from 'date-fns';

import {
  useMeetings,
  useOrganizationsStats,
  usePeopleStats
} from '@services/query-services/meetings.query-service';
import {
  useApolloOrganizationsByDomains,
  useApolloPerson
} from '@services/query-services/apollo.query-service';
import { useCardSubSources } from '@services/query-services/cards.query-service';
import { usePersonById, usePatchPerson } from '@services/query-services/people.query-service';
import { useContacts } from '@services/query-services/contacts.query-service';
import { useUserStore } from '@store/app.store';
import { BOT_ATTENDEE_EMAILS, PEOPLE_ORG_STATS_PAGE_SIZE } from '@util/constants';

import NylasService from '@services/nylas.service';
import S3Bucket from '@services/s3bucket.service';
const nylasService = NylasService.getInstance();

export const usePersonData = (id, email) => {
  const user = useUserStore((state) => state?.user);
  const tenant = useUserStore((state) => state?.tenant);

  const isExec = user?.type === 'Executive';
  const isInvalidPerson = !email && !id;
  const personIsCurrentUser = email === user?.email;

  const numOfDays = 90;
  const dateRange = useDateRange(numOfDays);

  const { data: foraPerson, isInitialLoading: isForaPersonLoading } = usePersonById(id, {
    enabled: !!id,
    retry: false
  });

  const isUserAuthorizedForInternalCalls = foraPerson?.tenants?.some((t) => t.id === tenant?.id);

  const {
    personStats,
    peopleStats,
    isPeopleStatsLoading,
    isExternalPeopleStatsLoading,
    organizationsStats,
    isOrganizationsStatsLoading,
    organizations
  } = useRecentlyMetWith(id, email, {
    queryEnabled: false,
    days: numOfDays,
    isUserAuthorizedForInternalCalls
  });

  const { data: apolloPerson, isInitialLoading: isApolloPersonLoading } = useApolloPerson(email, {
    enabled: !!email
  });

  const { data: contact, isInitialLoading: isContactLoading } = useContacts(
    { email },
    {
      enabled: !!email,
      select: first
    }
  );

  const { data: personSummarySources } = useCardSubSources(
    {
      ...(isUserAuthorizedForInternalCalls ? { personId: id } : {}),
      email
    },
    {
      enabled: !!email || !!id
    }
  );

  const {
    externalMeetings: personExternalMeetings,
    internalMeetings: personInternalMeetings,
    isPersonMeetingsLoading
  } = usePersonMeetings(email, dateRange);

  const isLoading =
    (isExec && isPersonMeetingsLoading) ||
    (!!foraPerson && isPeopleStatsLoading) ||
    (!foraPerson && isExternalPeopleStatsLoading) ||
    isOrganizationsStatsLoading ||
    isApolloPersonLoading ||
    isForaPersonLoading;

  const isPersonLoading =
    (isApolloPersonLoading && !!email) ||
    (isForaPersonLoading && !!id) ||
    (isContactLoading && !!email);

  return {
    isInvalidPerson,
    personIsCurrentUser,
    isPersonLoading,
    foraPerson,
    contact,
    apolloPerson,
    employmentHistoryOrgs: [], // rip?
    peopleStats,
    personStats,
    personSummarySources,
    personExternalMeetings,
    personInternalMeetings,
    organizationsStats,
    organizations,
    numOfDays,
    isLoading,
    dateRange
  };
};

export const useEnrichedOrganizationsStats = (domain) => {
  const pageSize = PEOPLE_ORG_STATS_PAGE_SIZE + 1;
  const { data: organizationsStatsRaw, isInitialLoading: isOrganizationsStatsLoading } =
    useOrganizationsStats({ domain, pageSize }, { enabled: !!domain, retry: false });

  const { organizationsStats: allOrganizationsStats } =
    useEnrichOrganizationsStats_(organizationsStatsRaw);

  const organizationStats = allOrganizationsStats?.find((org) => org.email === domain);

  return { organizationStats, allOrganizationsStats, isOrganizationsStatsLoading };
};

export const buildStatsRequestBody = ({
  id,
  email,
  query,
  domain,
  page,
  pageSize,
  days,
  queryEnabled,
  isUserAuthorizedForInternalCalls
}) => {
  const defaultBody = {
    pageSize,
    days: days || 90,
    ...(queryEnabled && query?.length > 0 && { query }),
    ...(page && { page })
  };

  const externalPersonBasedBody = {
    ...defaultBody,
    email
  };

  const internalPersonBasedBody = {
    ...defaultBody,
    email
    // personId: id
  };

  const domainBasedBody = {
    ...defaultBody,
    domain
  };

  if (id && isUserAuthorizedForInternalCalls) {
    return internalPersonBasedBody;
  } else if (email) {
    return externalPersonBasedBody;
  } else if (domain) {
    return domainBasedBody;
  } else {
    return defaultBody;
  }
};

// local hooks

const useEnrichOrganizationsStats_ = (organizationsStatsRaw) => {
  const orgDomains = uniq(map(organizationsStatsRaw, 'email'));

  const { data: organizations, isInitialLoading: isOrgsLoading } = useApolloOrganizationsByDomains(
    orgDomains,
    { enabled: !!organizationsStatsRaw && orgDomains.length > 0 }
  );

  const organizationsDomainMap = keyBy(organizations, 'primary_domain');

  const organizationsStats = organizationsStatsRaw?.map((organizationStat) => {
    const organization = organizationsDomainMap[organizationStat.email];

    return {
      ...organizationStat,
      ...organization
    };
  });

  return { organizationsStats, isOrgsLoading, organizations };
};

const useDateRange = (daysBack = 90) => {
  const today = useConst(new Date());
  const to = useConst(() => today.getTime());
  const from = subDays(today, daysBack).getTime();

  return { from, to };
};

/**
 * @param {number} id
 * @param {string} email
 * @param {object} [options]
 * @param {boolean} [options.queryEnabled=false]
 * @param {string} [options.query='']
 * @param {number} [options.days=90]
 * @param {number} [options.pageSize=10]
 * @param {boolean} [options.isUserAuthorizedForInternalCalls=false]
 */
export const useRecentlyMetWith = (id, email, options = {}) => {
  const user = useUserStore((state) => state.user);
  const {
    queryEnabled = false,
    query = '',
    days = 90,
    pageSize = PEOPLE_ORG_STATS_PAGE_SIZE + 1,
    isUserAuthorizedForInternalCalls = false
  } = options;

  const peopleRequestBody = buildStatsRequestBody({
    id,
    email,
    query,
    days,
    queryEnabled,
    pageSize,
    isUserAuthorizedForInternalCalls
  });
  const organizationsRequestBody = { ...peopleRequestBody, pageSize };

  const { data: peopleStatsRaw, isInitialLoading: isPeopleStatsLoading } = usePeopleStats(
    peopleRequestBody,
    { enabled: !!id || !!email }
  );

  let personStats;
  const peopleStats = peopleStatsRaw?.filter((personStat) => {
    if ((id && personStat?.id === id) || personStat?.email === email) {
      personStats = personStat;
      return false;
    }
    return true;
  });

  const { data: organizationsStatsRaw, isInitialLoading: isOrganizationsStatsLoading } =
    useOrganizationsStats(organizationsRequestBody, {
      enabled: !!id,
      select: (orgs) =>
        orgs?.filter((org) => {
          const userOrg = user?.apollo_profile.organization?.primary_domain;
          return org?.email !== userOrg;
        })
    });

  const { organizationsStats, organizations, isOrgsLoading } =
    useEnrichOrganizationsStats_(organizationsStatsRaw);

  return {
    personStats,
    peopleStats,
    isPeopleStatsLoading,

    organizationsStats,
    isOrganizationsStatsLoading,
    organizations,
    isOrgsLoading
  };
};

const usePersonMeetings = (email, { from = 0, to = 0 }) => {
  const meetingsSearchBody = useMemo(
    () => ({
      start_at_from: from,
      start_at_to: to,
      nylas_participant_emails: [email],
      pageSize: 100
    }),
    [email, from, to]
  );

  const { data: personMeetings, isInitialLoading: isPersonMeetingsLoading } = useMeetings(
    meetingsSearchBody,
    { enabled: !!email }
  );

  const [externalMeetings, internalMeetings] = useMemo(() => {
    if (!personMeetings) {
      return [[], []];
    }

    return partition(personMeetings, (meeting) =>
      meeting?.nylas?.participants?.some(
        (p) => p.external && !BOT_ATTENDEE_EMAILS.includes(p.email)
      )
    );
  }, [personMeetings]);

  return {
    externalMeetings,
    internalMeetings,
    isPersonMeetingsLoading
  };
};

export const usePatchPersonFromDetailsPage = () => {
  const { mutateAsync: patchPerson } = usePatchPerson();

  return async (id, values, toast, setIsSubmitting) => {
    await patchPerson(
      { id, ...values },
      {
        onSuccess: async (updatedPerson) => {
          if (!updatedPerson.active && updatedPerson.nylas_account_id) {
            try {
              await nylasService.deleteNylasGrant(updatedPerson.nylas_account_id, true);
            } catch (err) {
              console.error(
                `Failed to delete Nylas grant for user ${updatedPerson.id}`,
                err?.response?.data?.errors[0]
              );
            }
          }
          toast?.({
            title: 'User updated successfully',
            status: 'success',
            duration: 9000,
            isClosable: true
          });
        },
        onError: (err) => {
          if (setIsSubmitting) {
            setIsSubmitting(false);
          }
          toast?.({
            title: `Failed to update user: ${err?.response?.data?.errors[0]}`,
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        }
      }
    );
  };
};

export const useAvatarUpload = (queryClient) => {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const user = useUserStore((state) => state.user);
  const tenant = useUserStore((state) => state.tenant);
  const setUser = useUserStore((state) => state.setUser);
  const { mutateAsync: patchPerson } = usePatchPerson();

  const uploadAvatar = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setIsUploading(true);

    try {
      const s3Bucket = new S3Bucket('fora-avatars', {
        queryClient,
        user,
        tenant
      });

      // Create custom file key with tenant-id/user-id format
      const fileExtension = file.name.split('.').pop();
      const customFileKey = `${tenant.id}/${user.id}.${fileExtension}`;

      // Upload file to S3
      await s3Bucket.uploadFile(file, {
        fileKey: customFileKey,
        fileName: file.name
      });

      // Construct the S3 URL
      const avatarUrl = `https://fora-avatars.s3.amazonaws.com/${customFileKey}`;

      // Update user's avatar_url in the backend
      await patchPerson({
        id: user.id,
        avatar_url: avatarUrl
      });

      // Update local user state
      setUser({
        ...user,
        avatar_url: avatarUrl
      });

      toast({
        title: 'Profile photo updated',
        description: 'Your profile photo has been successfully updated',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload your profile photo. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  return {
    isUploading,
    uploadAvatar,
    handleFileSelect
  };
};
