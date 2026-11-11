/* Client-side types */

// This has to cover all possible statuses
/** @typedef {"done" | "live" | "upcoming"} MeetingTimeStatus */
/** @typedef {"pending" | "running" | "error" | "complete"} MeetingPusherStatus */

/**
 * @typedef {Object} MeetingPageSection
 * @property {boolean} enabled
 * @property {React.RefObject} ref
 * @property {string} name
 * @property {number} order
 */

/**
 * Topic Group
 * @typedef {Object} TopicGroup
 * @property {string} id
 * @property {string} title
 * @property {string} topic_summary
 * @property {{ start: number; end: number }} time
 * @property {string} names
 * @property {Summary[]} summaries
 *
 * Summary
 * @typedef {Object} Summary
 * @property {string} id
 * @property {string} title
 * @property {string[]} contentLines
 * @property {{ start: number; end: number }} time
 *
 * Meeting Transcript
 * @typedef {Object} ParsedMeetingTranscript
 * @property {TopicGroup[]} topicGroups
 * @property {Summary[]} ungroupedSummaries - summaries not associated with topic group
 * @property {Transcript[]} transcripts
 */

/**
 * @typedef {Object} AllMeetingContent
 * @property {Meeting} value
 * @property {Bot} bot
 * @property {Card} card
 */

/**
 * @typedef {Object} PersonOrgStats
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} title
 * @property {string} [avatar_url]
 * @property {string} company_name
 * @property {number} count
 * @property {number} botted
 * @property {number} duration
 *
 * @typedef {Object} PersonOrgStatsParams
 * @property {string} personId
 * @property {string} [domain]
 * @property {number} [days=90]
 * @property {number} [pageSize=10]
 * @property {string} [page]
 * @property {string} [query]
 */
