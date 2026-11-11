import { describe, it, expect, vi } from 'vitest';
import { formatCadenceToCron, formatCronToCadence, getNextRunAt } from '@util/helpers';
import {
  convertFormValuesToChannel,
  convertTeamsFormValuesToChannel,
  convertChannelToFormValues,
  convertTeamsChannelToFormValues
} from '@util/helpers/channel.helpers';
import { isEmpty } from 'lodash-es';

vi.mock('@util/helpers', () => ({
  formatCadenceToCron: vi.fn(),
  formatCronToCadence: vi.fn(),
  getNextRunAt: vi.fn()
}));

const mockCron = '0 0 * * *';
const mockNextRunAt = new Date('2025-04-25T00:00:00Z');
const mockTimezone = 'EST5EDT';

describe('convertFormValuesToChannel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-04-24T12:00:00Z'));
    formatCadenceToCron.mockReturnValue(mockCron);
    getNextRunAt.mockReturnValue(mockNextRunAt);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should convert formValues to the correct channel body', () => {
    const result = convertFormValuesToChannel(
      {
        cadenceInterval: 'daily',
        identifiers: [{ id: 'id1' }, { id: 'id2' }],
        initiative: { value: 'initiative-id' },
        name: 'Test Channel'
      },
      'EST5EDT'
    );
    expect(result).toEqual({
      name: 'Test Channel',
      identifiers: ['id1', 'id2'],
      initiative: { id: 'initiative-id' },
      schedule: mockCron,
      next_run_at: mockNextRunAt.getTime()
    });
    expect(formatCadenceToCron).toHaveBeenCalledWith('daily', 'America/New_York');
    expect(getNextRunAt).toHaveBeenCalledWith('daily', 'America/New_York');
  });
});

const mockFormValues = {
  identifiers: ['id1', 'id2'],
  cadenceInterval: 'daily',
  initiative: { value: 'initiative1' },
  name: 'Test Channel',
  metadata: { channels: {} }
};

describe('convertTeamsFormValuesToChannel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-04-24T12:00:00Z'));
    formatCadenceToCron.mockReturnValue(mockCron);
    getNextRunAt.mockReturnValue(mockNextRunAt);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return non-metadata channel body values', () => {
    const result = convertTeamsFormValuesToChannel(mockFormValues, false, mockTimezone);
    expect(result).toEqual(
      expect.objectContaining({
        name: 'Test Channel',
        initiative: { id: 'initiative1' },
        schedule: mockCron,
        next_run_at: mockNextRunAt.getTime(),
        identifiers: ['id1', 'id2']
      })
    );
  });

  // case where "all future channels" not selected, need to add the higher-level teams' channels
  // to the metadata.channels object
  it('should handle individually selected channels belonging to a team', () => {
    const mockMetadata = {
      channels: {
        id1: ['channel-id1-a', 'channel-id1-b'],
        id2: ['channel-id2-a']
      }
    };
    const result = convertTeamsFormValuesToChannel(
      { ...mockFormValues, metadata: mockMetadata },
      false,
      mockTimezone
    );
    expect(result).toEqual(
      expect.objectContaining({
        identifiers: ['id1', 'id2'],
        metadata: mockMetadata
      })
    );
  });

  // case where "all future channels" selected, we don't want to configure individual channels for the higher-level
  // selected team. In this case we just provide the identifier and don't need to denote which specific channels
  it('if isEdit = false, should remove allChannels from metadata.channels and have empty metadata object for that identifier', () => {
    const mockMetadata = {
      channels: {
        id1: ['channel-id1-a', 'channel-id1-b'],
        id2: ['allChannels', 'channel-id2-a']
      }
    };
    const mockMetadata2 = {
      channels: {
        id1: ['allChannels', 'channel-id1-b'],
        id2: ['allChannels', 'channel-id2-a']
      }
    };
    const result = convertTeamsFormValuesToChannel(
      { ...mockFormValues, metadata: mockMetadata },
      false,
      mockTimezone
    );
    const result2 = convertTeamsFormValuesToChannel(
      { ...mockFormValues, metadata: mockMetadata2 },
      false,
      mockTimezone
    );

    expect(result.metadata.channels.id1).toEqual(mockMetadata.channels.id1);
    expect(result.metadata.channels.hasOwnProperty('id2')).toBe(false);
    expect(isEmpty(result2.metadata.channels)).toBe(true);
  });

  // case where "all future channels" selected, we don't want to configure individual channels for the higher-level
  // selected team. In this case we just provide the identifier and don't need to denote which specific channels
  it('if isEdit = true, should remove allChannels from metadata.channels and have null metadata object for that identifier', () => {
    const mockMetadata = {
      channels: {
        id1: ['channel-id1-a', 'channel-id1-b'],
        id2: ['allChannels', 'channel-id2-a']
      }
    };
    const mockMetadata2 = {
      channels: {
        id1: ['allChannels', 'channel-id1-b'],
        id2: ['allChannels', 'channel-id2-a']
      }
    };
    const result = convertTeamsFormValuesToChannel(
      { ...mockFormValues, metadata: mockMetadata },
      true,
      mockTimezone
    );
    const result2 = convertTeamsFormValuesToChannel(
      { ...mockFormValues, metadata: mockMetadata2 },
      true,
      mockTimezone
    );

    expect(result.metadata.channels.id1).toEqual(mockMetadata.channels.id1);
    expect(result.metadata.channels.id2).toBe(null);
    expect(result2.metadata.channels.id1).toBe(null);
    expect(result2.metadata.channels.id2).toBe(null);
  });
});

const mockChannel = {
  name: 'Test Channel',
  schedule: mockCron,
  initiative: { id: 'initiative1', title: 'Initiative Title' }
};

describe('convertChannelToFormValues', () => {
  it('should convert a channel object to form values correctly', () => {
    formatCronToCadence.mockReturnValue('daily');
    expect(convertChannelToFormValues(mockChannel)).toEqual({
      name: 'Test Channel',
      cadenceInterval: 'daily',
      initiative: { value: 'initiative1', label: 'Initiative Title' }
    });
  });
});

describe('convertTeamsChannelToFormValues', () => {
  beforeEach(() => {
    formatCronToCadence.mockReturnValue('daily');
  });

  it('should return non-metadata channel data to formValues', () => {
    const channel = {
      ...mockChannel,
      identifiers: ['teamId1', 'teamId2']
    };
    const result = convertTeamsChannelToFormValues(channel);
    expect(result).toEqual(
      expect.objectContaining({
        name: 'Test Channel',
        cadenceInterval: 'daily',
        initiative: { value: 'initiative1', label: 'Initiative Title' },
        identifiers: new Set(['teamId1', 'teamId2'])
      })
    );
  });

  it('should add "allChannels" value to metadata.channels if empty property on channel metadata', () => {
    const channel = {
      ...mockChannel,
      metadata: {},
      identifiers: ['teamId1']
    };
    const result = convertTeamsChannelToFormValues(channel);
    expect(result.identifiers).toEqual(new Set(['teamId1']));
    expect(result.metadata.channels.teamId1).toEqual(['allChannels']);
  });

  it('should add specific channel ids to metadata.channels if identifier metadata', () => {
    const channel = {
      ...mockChannel,
      metadata: {
        channels: {
          teamId1: ['team-id1-channel-a', 'team-id1-channel-b']
        }
      },
      identifiers: ['teamId1', 'teamId2']
    };

    const result = convertTeamsChannelToFormValues(channel);
    expect(result.metadata.channels.teamId1).toEqual(['team-id1-channel-a', 'team-id1-channel-b']);
    expect(result.metadata.channels.teamId2).toEqual(['allChannels']);
  });
});
