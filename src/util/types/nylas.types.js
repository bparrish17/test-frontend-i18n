// https://github.com/nylas/nylas-nodejs/blob/main/src/models/

/** @typedef {"noreply" | "yes" | "no" | "maybe"} NylasParticipantStatus */

/** @typedef {Object} EmailName
 * @property {string} email
 * @property {string} [name]
 */

/** @typedef {Object} NylasParticipant
 * @property {string} email
 * @property {string} name
 * @property {boolean} external - is the participant outside the organization (merged)
 * @property {NylasAttendeeStatus} status
 * @property {string} [comment]
 * @property {string} [phoneNumber]
 */

// https://github.com/nylas/nylas-nodejs/blob/main/src/models/events.ts
/** @typedef {Object} NylasEvent
 * @property {string} id
 * @property {string} grantId
 * @property {'event'} object
 * @property {string} calendarId
 * @property {boolean} busy
 * @property {boolean} readOnly
 * @property {NylasParticipant[]} participants
 * @property {When} when
 * @property {Conferencing} conferencing
 * @property {Visibility} visibility
 * @property {string} [description]
 * @property {string} [location]
 * @property {string} [icalUid]
 * @property {string} [title]
 * @property {string} [htmlLink]
 * @property {boolean} [hideParticipants]
 * @property {Record<string, string>} [metadata]
 * @property {EmailName} [creator]
 * @property {EmailName} [organizer]
 * @property {string[]} [recurrence]
 * @property {Reminders} [reminders]
 * @property {Status} [status]
 * @property {number} [createdAt]
 * @property {number} [updatedAt]
 */
