import { describe, it, expect, vi } from 'vitest';
import {
  totalPeopleWithAccess,
  sharingDisabled,
  totalViews,
  viewsAndViewers,
  sanitizeView
} from '@util/helpers/privacy.helpers';

import { formatViewDate } from '@util/helpers/datetime.helpers';

vi.mock('@util/helpers/datetime.helpers', () => ({
  formatViewDate: vi.fn()
}));

describe('totalPeopleWithAccess', () => {
  it('returns num_of_participants if isSensitive is true', () => {
    const accessStats = { num_of_participants: 10, num_of_collaborators: 5, num_of_managers: 2 };
    const result = totalPeopleWithAccess(accessStats, true);
    expect(result).toBe(10);
  });

  it('returns the sum of all accessStats values if isSensitive is false', () => {
    const accessStats = { num_of_participants: 10, num_of_collaborators: 5, num_of_managers: 2 };
    const result = totalPeopleWithAccess(accessStats, false);
    expect(result).toBe(17); // 10 + 5 + 2
  });

  it('handles empty accessStats gracefully', () => {
    const accessStats = {};
    const result = totalPeopleWithAccess(accessStats, false);
    expect(result).toBe(0);
  });

  it('returns undefined if isSensitive is true but num_of_participants is missing', () => {
    const accessStats = { num_of_collaborators: 5, num_of_managers: 2 };
    const result = totalPeopleWithAccess(accessStats, true);
    expect(result).toBeUndefined();
  });
});

describe('sharingDisabled', () => {
  it('returns true is isSensitive', () => {
    const accessStats = { num_of_shares: 2 };
    const result = sharingDisabled(accessStats, true);
    expect(result).toBe(true);
  });

  it('returns true if num_of_shares is 0', () => {
    const accessStats = { num_of_shares: 0 };
    const result = sharingDisabled(accessStats, false);
    expect(result).toBe(true);
  });

  it('returns false if num_of_shares is > 0', () => {
    const accessStats = { num_of_shares: 1 };
    const result = sharingDisabled(accessStats, false);
    expect(result).toBe(false);
  });
});

describe('totalViews', () => {
  it('should return the correct sum of counts when views array is valid', () => {
    const views = [
      { id: 1, count: 5 },
      { id: 2, count: 3 },
      { id: 3, count: 8 }
    ];
    expect(totalViews(views)).toBe(16); // 5 + 3 + 8
  });

  it('should return 0 for an empty views array', () => {
    const views = [];
    expect(totalViews(views)).toBe(0);
  });

  it('should handle views array with a single object', () => {
    const views = [{ id: 1, count: 10 }];
    expect(totalViews(views)).toBe(10);
  });

  it('should handle views array where count values are 0', () => {
    const views = [
      { id: 1, count: 0 },
      { id: 2, count: 0 }
    ];
    expect(totalViews(views)).toBe(0); // 0 + 0
  });

  it('should ignore extra fields in the objects and only sum count', () => {
    const views = [
      { id: 1, count: 5, name: 'View A' },
      { id: 2, count: 7, name: 'View B' }
    ];
    expect(totalViews(views)).toBe(12); // 5 + 7
  });

  it('should return 0 if undefined', () => {
    const views = undefined;
    expect(totalViews(views)).toBe(0);
  });
});

describe('viewsAndViewers', () => {
  const viewsByCalls = [
    {
      id: 'zack@fora.day',
      name: 'Zack Elias',
      avatar_url:
        'https://lh3.google.com/ao/AHP4FtkloTguZHutZlebR1y5dXkjYpb-ouBXuVq_LGigG1UKcyzYrYBntImoSe1E6og_Vi8c=s96-c',
      count: 4,
      created_at: 1734708575015
    },
    {
      id: 'vinnie@fora.day',
      name: 'Vinnie Vendemia',
      avatar_url:
        'https://lh3.googleusercontent.com/a/ACg8ocLKIfZNxrfZq05I7i3vFlZedJNgt4ZJsp5CM1gt48x3Ct_nIaM=s96-c',
      count: 2,
      created_at: 1734709328350
    },
    {
      id: 'system@fora.app',
      count: 21,
      created_at: 1734709328595
    },
    {
      id: 'shared-user@gmail.com',
      count: 2,
      created_at: 1734709183675
    }
  ];

  const sharedEmails = ['shared-user@gmail.com'];

  it('should exclude system emails and shared emails by default', () => {
    const result = viewsAndViewers(viewsByCalls, sharedEmails);
    expect(result.views).toEqual([
      {
        id: 'vinnie@fora.day',
        name: 'Vinnie Vendemia',
        avatar_url:
          'https://lh3.googleusercontent.com/a/ACg8ocLKIfZNxrfZq05I7i3vFlZedJNgt4ZJsp5CM1gt48x3Ct_nIaM=s96-c',
        count: 2,
        created_at: 1734709328350
      },
      {
        id: 'zack@fora.day',
        name: 'Zack Elias',
        avatar_url:
          'https://lh3.google.com/ao/AHP4FtkloTguZHutZlebR1y5dXkjYpb-ouBXuVq_LGigG1UKcyzYrYBntImoSe1E6og_Vi8c=s96-c',
        count: 4,
        created_at: 1734708575015
      }
    ]);
    expect(result.viewsCount).toBe(6); // Total count of the two filtered views
    expect(result.viewersCount).toBe(2); // Two unique emails
  });

  it('should include only shared emails when includeShared is true', () => {
    const result = viewsAndViewers(viewsByCalls, sharedEmails, true);
    expect(result.views).toEqual([
      {
        id: 'shared-user@gmail.com',
        count: 2,
        created_at: 1734709183675
      }
    ]);
    expect(result.viewsCount).toBe(2); // Count of the shared user
    expect(result.viewersCount).toBe(1); // One unique email
  });

  it('should handle empty views array', () => {
    const result = viewsAndViewers([], sharedEmails);
    expect(result.views).toEqual([]);
    expect(result.viewsCount).toBe(0);
    expect(result.viewersCount).toBe(0);
  });

  it('should handle no sharedEmails provided', () => {
    const result = viewsAndViewers(viewsByCalls, []);
    expect(result.views).toEqual([
      {
        id: 'vinnie@fora.day',
        name: 'Vinnie Vendemia',
        avatar_url:
          'https://lh3.googleusercontent.com/a/ACg8ocLKIfZNxrfZq05I7i3vFlZedJNgt4ZJsp5CM1gt48x3Ct_nIaM=s96-c',
        count: 2,
        created_at: 1734709328350
      },
      {
        // technically not a "shared-user" since not included in the sharedEmails
        id: 'shared-user@gmail.com',
        count: 2,
        created_at: 1734709183675
      },
      {
        id: 'zack@fora.day',
        name: 'Zack Elias',
        avatar_url:
          'https://lh3.google.com/ao/AHP4FtkloTguZHutZlebR1y5dXkjYpb-ouBXuVq_LGigG1UKcyzYrYBntImoSe1E6og_Vi8c=s96-c',
        count: 4,
        created_at: 1734708575015
      }
    ]);
    expect(result.viewsCount).toBe(8);
    expect(result.viewersCount).toBe(3);
  });

  it('should handle includeShared when no sharedEmails provided', () => {
    const result = viewsAndViewers(viewsByCalls, [], true);
    expect(result.views).toEqual([]);
    expect(result.viewsCount).toBe(0);
    expect(result.viewersCount).toBe(0);
  });

  it('should exclude system emails regardless of shared logic', () => {
    const result = viewsAndViewers(viewsByCalls, sharedEmails, true);
    const systemEmailIncluded = result.views.some((view) => view.id === 'system@fora.app');
    expect(systemEmailIncluded).toBe(false);
  });

  it('should return empty array if undefined', () => {
    const result = viewsAndViewers(undefined, []);
    expect(result).toEqual([]);
  });
});

describe('sanitizeView', () => {
  it('should return sanitized data with values from foraPerson', () => {
    formatViewDate.mockReturnValue('Today, 12:22 PM');

    const view = { id: '123', created_at: 1736270216179 };
    const foraPerson = { name: 'Fora User', avatar_url: 'fora-avatar.png' };
    const apolloPerson = { name: 'Apollo User', photo_url: 'apollo-avatar.png' };

    const result = sanitizeView(view, foraPerson, apolloPerson);

    expect(result).toEqual({
      name: 'Fora User',
      avatar_url: 'fora-avatar.png',
      date: 'Today, 12:22 PM'
    });
    expect(formatViewDate).toHaveBeenCalledWith(1736270216179);
  });

  it('should fallback to apolloPerson values if foraPerson values are not available', () => {
    formatViewDate.mockReturnValue('Today, 12:22 PM');

    const view = { id: '123', created_at: 1736270216179 };
    const foraPerson = null;
    const apolloPerson = { name: 'Apollo User', photo_url: 'apollo-avatar.png' };

    const result = sanitizeView(view, foraPerson, apolloPerson);

    expect(result).toEqual({
      name: 'Apollo User',
      avatar_url: 'apollo-avatar.png',
      date: 'Today, 12:22 PM'
    });
    expect(formatViewDate).toHaveBeenCalledWith(1736270216179);
  });

  it('should fallback to view values if neither foraPerson nor apolloPerson values are available', () => {
    formatViewDate.mockReturnValue('Today, 12:22 PM');

    const view = { id: '123', created_at: 1736270216179, avatar_url: 'view-avatar.png' };
    const foraPerson = null;
    const apolloPerson = null;

    const result = sanitizeView(view, foraPerson, apolloPerson);

    expect(result).toEqual({
      name: '123',
      avatar_url: 'view-avatar.png',
      date: 'Today, 12:22 PM'
    });
    expect(formatViewDate).toHaveBeenCalledWith(1736270216179);
  });

  it('should handle missing fields gracefully', () => {
    formatViewDate.mockReturnValue('Today, 12:22 PM');

    const view = {};
    const foraPerson = null;
    const apolloPerson = null;

    const result = sanitizeView(view, foraPerson, apolloPerson);

    expect(result).toEqual({
      name: undefined,
      avatar_url: undefined,
      date: 'Today, 12:22 PM'
    });
    expect(formatViewDate).toHaveBeenCalledWith(undefined);
  });
});
