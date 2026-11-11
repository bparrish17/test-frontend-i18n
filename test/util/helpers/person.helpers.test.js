import { describe, it, vi, expect, beforeEach } from 'vitest';
import { addDigestConfigToNewUser } from '@util/helpers/person.helpers';
import { patch } from '@services/query-services/default.query-service';

vi.mock('@services/query-services/default.query-service', () => ({
  patch: vi.fn()
}));

describe('addDigestConfigToNewUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('is DST', () => {
    beforeEach(() => {
      // Freeze time to April 24, 2025 (DST)
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-04-24T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call patch with morning and evening times if both digest_configs are nil', async () => {
      const user = {
        id: 'user-1',
        time_zone_id: 'EST5EDT',
        tenants: [
          {
            id: 'tenant-1'
          }
        ],
        digest_configs: {
          morning: null,
          evening: null
        }
      };

      await addDigestConfigToNewUser(user);

      expect(patch).toHaveBeenCalledTimes(1);
      expect(patch).toHaveBeenCalledWith({
        model: 'people',
        id: 'user-1',
        body: {
          digest_configs: {
            morning: { time_of_day: 660 },
            evening: { time_of_day: 1380 },
            last_minute_prep: false
          }
        }
      });
    });

    it('should use tenant timezone if user timezone is undefined', async () => {
      const user = {
        id: 'user-1',
        time_zone_id: null,
        tenants: [
          {
            id: 'tenant-1',
            time_zone_id: 'America/Los_Angeles'
          }
        ],
        digest_configs: {
          morning: null,
          evening: null
        }
      };

      await addDigestConfigToNewUser(user);

      expect(patch).toHaveBeenCalledTimes(1);
      expect(patch).toHaveBeenCalledWith({
        model: 'people',
        id: 'user-1',
        body: {
          digest_configs: {
            morning: { time_of_day: 840 },
            evening: { time_of_day: 120 },
            last_minute_prep: false
          }
        }
      });
    });
  });

  describe('is not DST', () => {
    beforeEach(() => {
      // Freeze time to Jan 24, 2025 (no DST)
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-24T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call patch with morning and evening times if both digest_configs are nil', async () => {
      const user = {
        id: 'user-1',
        time_zone_id: 'EST5EDT',
        tenants: [
          {
            id: 'tenant-1'
          }
        ],
        digest_configs: {
          morning: null,
          evening: null
        }
      };

      await addDigestConfigToNewUser(user);

      expect(patch).toHaveBeenCalledTimes(1);
      expect(patch).toHaveBeenCalledWith({
        model: 'people',
        id: 'user-1',
        body: {
          digest_configs: {
            morning: { time_of_day: 720 },
            evening: { time_of_day: 0 },
            last_minute_prep: false
          }
        }
      });
    });

    it('should use tenant timezone if user timezone is undefined', async () => {
      const user = {
        id: 'user-1',
        time_zone_id: null,
        tenants: [
          {
            id: 'tenant-1',
            time_zone_id: 'America/Los_Angeles'
          }
        ],
        digest_configs: {
          morning: null,
          evening: null
        }
      };

      await addDigestConfigToNewUser(user);

      expect(patch).toHaveBeenCalledTimes(1);
      expect(patch).toHaveBeenCalledWith({
        model: 'people',
        id: 'user-1',
        body: {
          digest_configs: {
            morning: { time_of_day: 900 },
            evening: { time_of_day: 180 },
            last_minute_prep: false
          }
        }
      });
    });
  });

  it('should NOT call patch if digest_configs already has morning or evening', async () => {
    const user = {
      id: 'user-2',
      time_zone_id: 'America/New_York',
      tenants: [
        {
          id: 'tenant-1'
        }
      ],
      digest_configs: {
        morning: { time_of_day: 480 },
        evening: null
      }
    };

    await addDigestConfigToNewUser(user);

    expect(patch).not.toHaveBeenCalled();
  });
});
