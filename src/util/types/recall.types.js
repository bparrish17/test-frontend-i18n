/** @typedef {"ready" | "joining_call" | "in_waiting_room" |
 *            "participant_in_waiting_room" | "in_call_not_recording" |
 *            "recording_permission_allowed" | "recording_permission_denied" |
 *            "in_call_recording" | "call_ended" | "recording_done" | "done" |
 *            "fatal" | "analysis_done" | "analysis_failed" | "media_expired"} RecallStatusCode */

/**
 * @typedef {object} RawTranscriptWord
 * @property {string} text
 * @property {number} start_time
 * @property {number} end_time
 */

/**
 * @typedef {object} RawTranscript
 * @property {string} speaker
 * @property {RawTranscriptWord[]} words
 * @property {boolean} is_final
 * @property {number} start_time
 * @property {number} end_time
 * @property {number} duration
 * @property {string} segment
 */
