export function zoomHelpText(isDone, isLoading, zoomRecordingStatus) {
  if (isDone) {
    if (isLoading) {
      return {
        header: 'Zoom Cloud Recording',
        subtext: 'Confirming availability of zoom cloud recording'
      };
    } else {
      if (zoomRecordingStatus?.code === 200) {
        return {
          header: 'Summarize This Meeting',
          subtext: 'This meeting has a Zoom Cloud Recording available. Summarize it now.'
        };
      } else {
        return {
          header: 'Recording Unavailable',
          subtext:
            'This meeting has ended, but no recording is available. Recording must be enabled in Zoom to generate a summary.'
        };
      }
    }
  } else {
    return {
      header: 'Meeting In Progress',
      subtext:
        'This meeting is currently in progress. Once the meeting has ended, FORA can summarize this for you.'
    };
  }
}

// Helper function to determine if we should hide the Cloud Recording component
export function disableCloudRecording(bot, enableCloudRecording, zoomMeetingId, isDone) {
  return !!bot || !enableCloudRecording || !!zoomMeetingId === false || !isDone;
}
