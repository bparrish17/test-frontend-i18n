import { describe, it, expect } from 'vitest';
import { isExternalToUser, getOrgDescription, buildOrgLink } from '@util/helpers/apollo.helpers';

const internalEmail = 'joe@fora.day';
const externalEmail = 'mark@bissell-accounting.com';
const foraPerson = { tenants: [{ id: 'internal-1' }] };
const apolloPerson = { organization: { id: 'external-1' } };

describe('isExternalToUser', () => {
  it('should return true by default if user is not provided', () => {
    const user = undefined;
    const email = externalEmail;

    const result = isExternalToUser({ user, foraPerson, apolloPerson, email });
    expect(result).toBe(true);
  });

  it('should return true by default if email is not provided', () => {
    const user = { email: internalEmail };
    const email = undefined;

    const result = isExternalToUser({ user, foraPerson, apolloPerson, email });
    expect(result).toBe(true);
  });
});

describe('getOrgDescription', () => {
  const shortDescription = 'An organization';
  const seoDescription = 'The organization';

  const defaultOrganization = {
    id: 1,
    short_description: shortDescription,
    seo_description: seoDescription
  };

  it('should return correct description based on provided type parameter', () => {
    const result = getOrgDescription(defaultOrganization, 'seo');
    expect(result).toBe(seoDescription);

    const result2 = getOrgDescription(defaultOrganization, 'short');
    expect(result2).toBe(shortDescription);
  });

  it('should default to short_description if available', () => {
    const result = getOrgDescription(defaultOrganization);
    expect(result).toBe(shortDescription);
  });

  it('should default to seo_description if short_description is not available', () => {
    const result = getOrgDescription({ ...defaultOrganization, short_description: null });
    expect(result).toBe(seoDescription);
  });

  it('should return null if no description is available', () => {
    const result = getOrgDescription({
      ...defaultOrganization,
      short_description: null,
      seo_description: null
    });
    expect(result).toBe(null);
  });
});

describe('buildOrgLink', () => {
  it('returns null if domain is empty', () => {
    const result = buildOrgLink({ domain: '', id: '1' });
    expect(result).toBeNull();
  });

  it('returns link with domain param', () => {
    const result = buildOrgLink({ domain: 'fora.day' });
    expect(result).toBe('/organization?domain=fora.day');
  });

  it('returns link with id param when provided', () => {
    const result = buildOrgLink({ domain: 'fora.day', id: '1' });
    expect(result).toBe('/organization?domain=fora.day&id=1');
  });
});
