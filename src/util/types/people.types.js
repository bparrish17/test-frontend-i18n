/**
 *
 *
 * @typedef {object} DigestConfig
 * @property {number} time_of_day
 *
 * @typedef {object} DigestConfigs
 * @property {DigestConfig} morning
 * @property {DigestConfig} evening
 * @property {boolean} last_minute_prep
 *
 * @typedef {object} Person
 * @property {string} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} name
 * @property {string} title
 * @property {string} location
 * @property {string[]} departments
 * @property {Named} manager
 * @property {string} type
 * @property {string} context
 * @property {Named[]} tenants
 * @property {DigestConfigs} digest_configs
 * @property {string} nylas_account_id
 * @property {{ zoom_oauth_credential_id: string }} recall_config
 * @property {string} avatar_url
 * @property {string} slack_channel
 * @property {string} time_zone_id
 * @property {string} external_id
 * @property {boolean} active
 * @property {string} created_at
 * @property {string} updated_at
 *
 * @typedef {Object} OrgPerson
 * @property {Person} value
 * @property {Person} manager
 * @property {Person[]} peers
 * @property {Person[]} reports
 */

/**
 * @typedef {Object} RecentlyMetWithSection
 * @property {string} title
 * @property {PersonOrgStats[]} items
 * @property {number} [maxItems=4]
 * @property {string} type
 * @property {Object} [itemPreview]
 * @property {Function} [itemPreview.render]
 * @property {PersonOrgStats} [itemPreview.item]
 * @property {Object} [avatarStack]
 * @property {number} [avatarStack.maxAvatars=5]
 * @property {number} [avatarStack.maxNameChars=3]
 * @property {Object} table
 * @property {Object[]} table.headers
 * @property {import('@tanstack/react-query').UseInfiniteQueryResult<PersonOrgStats[]>} table.infiniteQuery
 * @property {PersonOrgStats[]} table.tableData
 * @property {Object} [table.props]
 */
