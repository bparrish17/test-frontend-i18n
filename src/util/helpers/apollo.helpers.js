import { pick } from 'lodash-es';

export function keyApolloProfilesByEmails(apolloProfiles) {
  return apolloProfiles.reduce(
    (acc, apolloProfile) => ({
      ...acc,
      [apolloProfile.email]: pick(apolloProfile, [
        'id',
        'name',
        'first_name',
        'email',
        'organization_id',
        'organization',
        'photo_url',
        'title',
        'headline'
      ])
    }),
    {}
  );
}

export const isExternalToUser = ({ user, foraPerson, apolloPerson, email }) => {
  if (!user || !email) {
    return true;
  }

  // if we only have email and no user, use domain to determine if external
  const domain = (email) => email.split('@')[1];
  if (!foraPerson && domain(email) !== domain(user?.email)) {
    return true;
  }

  if (user?.tenants[0]?.id === foraPerson?.tenants[0]?.id) {
    return false;
  }

  return user?.apolloProfile?.organization?.id !== apolloPerson?.organization?.id;
};

/** @returns {string|null} */
export const getOrgDescription = (organization, type = 'short') => {
  if (!organization) {
    return null;
  }

  const description =
    organization.description ??
    organization.short_description ??
    organization.seo_description ??
    null;

  if (type === 'short' && organization?.short_description) {
    return organization.short_description;
  }

  if (type === 'seo' && organization?.seo_description) {
    return organization.seo_description;
  }

  return description;
};

export const buildOrgLink = ({ domain, id }) => {
  if (!domain) {
    return null;
  }

  let orgLink = '/organization?domain=' + domain;
  if (id) {
    orgLink += '&id=' + id;
  }
  return orgLink;
};
