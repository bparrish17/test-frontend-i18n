/**
 * ApolloPerson
 * @typedef {object} ApolloPerson
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} name
 * @property {string} linkedin_url
 * @property {string} title
 * @property {string} photo_url
 * @property {string} headline
 * @property {string} email
 * @property {string} state
 * @property {string} city
 * @property {string} country
 * @property {string} organization_id
 * @property {ApolloOrganization} organization
 * @property {EmploymentItem[]} employment_history
 * @property {string[]} departments
 * @property {string[]} subdepartments
 * @property {string[]} functions
 * @property {string} seniority
 */

/**
 * @typedef {object} ApolloOrganization
 * @property {string} id
 * @property {string} name
 * @property {string} linkedin_url
 * @property {ApolloPhone} primary_phone
 * @property {string[]} languages
 * @property {string} phone
 * @property {string} linkedin_uid
 * @property {string} logo_url
 * @property {string} industry
 * @property {string[]} keywords
 * @property {number} estimated_num_employees
 * @property {boolean} snippets_loaded
 * @property {string} industry_tag_id
 * @property {number} retail_location_count
 * @property {string} raw_address
 * @property {string} street_address
 * @property {string} city
 * @property {string} state
 * @property {string} postal_code
 * @property {string} country
 * @property {} suborganizations
 * @property {number} num_suborganizations
 * @property {string} seo_description
 * @property {string} short_description
 * @property {number} total_funding
 * @property {string} total_funding_printed
 * @property {string} latest_funding_round_date
 * @property {string} latest_funding_stage
 * @property {ApolloFundingEvent[]} funding_events
 * @property {} technology_names
 * @property {} current_technologies
 */

/**
 * @typedef {object} ApolloEmploymentItem
 * @property {string} _id
 * @property {boolean} current
 * @property {string} organization_id
 * @property {string} organization_name
 * @property {string} start_date
 * @property {string} title
 * @property {string} id
 * @property {string} key
 *
 */

/**
 * @typedef {object} ApolloFundingEvent
 * @property {string} id
 * @property {string} date
 * @property {string} news_url
 * @property {string} type
 * @property {string} investors
 * @property {string} amount
 * @property {string} currency
 */

/**
 * @typedef {object} ApolloPhone
 * @property {string} number
 * @property {string} source
 */

export {};
