/** @typedef {import('pusher-js').Channel} PusherChannel */

/**
 * https://github.com/summarizator/fora-backend/blob/master/platform-model/src/app/fora/platform/type/PusherEvent.java
 *
 * @typedef {"transcripts" | "status_changes" | "on_batch" |
 *            "on_completion" | "on_error" | "on_evening_digest" |
 *            "on_lens_match" | "on_meeting_initiative_match" |
 *            "on_morning_digest" | "on_new_card" | "on_next_meeting" |
 *            "on_schedule_meeting" | "on_warning" | "on_success" | "on_insight_generated"} PusherEvent
 * */

/** @typedef {"pending" | "running" | "completed" | "error"} PusherRecallChannelStatus
 *  pending - Initial state
 *  running - channel is receiving data
 *  completed - channel has finished receiving data
 *  error - channel has encountered an error
 *
 *  draft: "cancelled" (for meetings that do not expect to receive any Recall data)
 * */
