/**
 * @typedef {'Slack' | 'Teams' | 'Email' | 'People'} ChannelSource
 */

/**
 * @typedef {object} Channel
 * @property {string} id
 * @property {string} name
 * @property {ChannelSource} source
 * @property {string[]} identifiers
 * @property {Titled} initiative
 * @property {number} next_run_at
 * @property {number} last_run_at
 * @property {string} last_run_status
 * @property {string} last_message
 * @property {string} schedule
 * @property {Named} tenant
 * @property {Named} creator
 * @property {number} created_at
 * @property {number} updated_at
 */
