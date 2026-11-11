import { describe, it, expect } from 'vitest';
import { zoomHelpText, disableCloudRecording } from '@util/helpers/zoom.helpers';

describe('zoomHelpText', () => {
  it('returns "Meeting In Progress" when meeting is not done', () => {
    const result = zoomHelpText(false, false, null);
    expect(result).toEqual({
      header: 'Meeting In Progress',
      subtext:
        'This meeting is currently in progress. Once the meeting has ended, FORA can summarize this for you.'
    });
  });

  it('returns "Confirming availability" when meeting is done and loading', () => {
    const result = zoomHelpText(true, true, null);
    expect(result).toEqual({
      header: 'Zoom Cloud Recording',
      subtext: 'Confirming availability of zoom cloud recording'
    });
  });

  it('returns "Summarize This Meeting" when done, not loading, and code is 200', () => {
    const result = zoomHelpText(true, false, { code: 200 });
    expect(result).toEqual({
      header: 'Summarize This Meeting',
      subtext: 'This meeting has a Zoom Cloud Recording available. Summarize it now.'
    });
  });

  it('returns "Recording Unavailable" when done, not loading, and code is not 200', () => {
    const result = zoomHelpText(true, false, { code: 3001 });
    expect(result).toEqual({
      header: 'Recording Unavailable',
      subtext:
        'This meeting has ended, but no recording is available. Recording must be enabled in Zoom to generate a summary.'
    });
  });

  it('returns "Recording Unavailable" when done, not loading, and zoomRecordingStatus is null', () => {
    const result = zoomHelpText(true, false, null);
    expect(result).toEqual({
      header: 'Recording Unavailable',
      subtext:
        'This meeting has ended, but no recording is available. Recording must be enabled in Zoom to generate a summary.'
    });
  });
});

describe('disableCloudRecording', () => {
  it('returns true if bot is present', () => {
    expect(disableCloudRecording({ id: '123456' }, true, '123', false)).toBe(true);
  });

  it('returns true if enableCloudRecording is false', () => {
    expect(disableCloudRecording(false, false, '123', false)).toBe(true);
  });

  it('returns true if zoomMeetingId is falsy (null)', () => {
    expect(disableCloudRecording(false, true, null, false)).toBe(true);
  });

  it('returns true if zoomMeetingId is falsy (empty string)', () => {
    expect(disableCloudRecording(false, true, '', false)).toBe(true);
  });

  it('returns true if isDone is false', () => {
    expect(disableCloudRecording(false, true, '123', false)).toBe(true);
  });

  it('returns false when all conditions are good', () => {
    expect(disableCloudRecording(undefined, true, '123', true)).toBe(false);
  });

  it('returns true if multiple hiding conditions are true', () => {
    expect(disableCloudRecording(true, false, '', true)).toBe(true);
  });
});
