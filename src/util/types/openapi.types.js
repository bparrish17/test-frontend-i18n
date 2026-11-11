/**
 * @typedef {Object} CountResults
 * @property {number} [value]
 */

/**
 * @typedef {Object} Account
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [website_url]
 * @property {string} [blog_url]
 * @property {string} [angellist_url]
 * @property {string} [linkedin_url]
 * @property {string} [twitter_url]
 * @property {string} [facebook_url]
 * @property {Phone} [primary_phone]
 * @property {string[]} [languages]
 * @property {number} [alexa_ranking]
 * @property {string} [phone]
 * @property {string} [linkedin_uid]
 * @property {number} [founded_year]
 * @property {string} [publicly_traded_symbol]
 * @property {string} [publicly_traded_exchange]
 * @property {string} [logo_url]
 * @property {string} [crunchbase_url]
 * @property {string} [primary_domain]
 * @property {string} [owned_by_organization_id]
 * @property {string} [organization_raw_address]
 * @property {string} [organization_city]
 * @property {string} [organization_street_address]
 * @property {string} [organization_state]
 * @property {string} [organization_country]
 * @property {string} [organization_postal_code]
 * @property {boolean} [suggest_location_enrichment]
 * @property {string} [domain]
 * @property {string} [team_id]
 * @property {string} [organization_id]
 * @property {string} [account_stage_id]
 * @property {string} [source]
 * @property {string} [original_source]
 * @property {string} [creator_id]
 * @property {string} [owner_id]
 * @property {string} [created_at]
 * @property {string} [phone_status]
 * @property {string} [hubspot_id]
 * @property {string} [salesforce_id]
 * @property {string} [crm_owner_id]
 * @property {string} [parent_account_id]
 * @property {string[]} [account_playbook_statuses]
 * @property {object[]} [account_rule_config_statuses]
 * @property {string} [existence_level]
 * @property {string[]} [label_ids]
 * @property {object} [typed_custom_fields]
 * @property {string} [modality]
 * @property {string} [source_display_name]
 * @property {string} [crm_record_url]
 * @property {string[]} [contact_emailer_campaign_ids]
 * @property {object} [contact_campaign_status_tally]
 * @property {number} [num_contacts]
 * @property {string} [last_activity_date]
 * @property {string} [intent_strength]
 * @property {boolean} [show_intent]
 * @property {boolean} [has_intent_signal_account]
 * @property {Account} [intent_signal_account]
 */

/**
 * @typedef {Object} FundingEvent
 * @property {string} [id]
 * @property {string} [date]
 * @property {string} [news_url]
 * @property {string} [type]
 * @property {string} [investors]
 * @property {string} [amount]
 * @property {string} [currency]
 */

/**
 * @typedef {Object} Organization
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [website_url]
 * @property {string} [blog_url]
 * @property {string} [angellist_url]
 * @property {string} [linkedin_url]
 * @property {string} [twitter_url]
 * @property {string} [facebook_url]
 * @property {Phone} [primary_phone]
 * @property {string[]} [languages]
 * @property {number} [alexa_ranking]
 * @property {string} [phone]
 * @property {string} [linkedin_uid]
 * @property {number} [founded_year]
 * @property {string} [publicly_traded_symbol]
 * @property {string} [publicly_traded_exchange]
 * @property {string} [logo_url]
 * @property {string} [crunchbase_url]
 * @property {string} [primary_domain]
 * @property {object} [persona_counts]
 * @property {string} [industry]
 * @property {string[]} [keywords]
 * @property {number} [estimated_num_employees]
 * @property {boolean} [snippets_loaded]
 * @property {string} [industry_tag_id]
 * @property {number} [retail_location_count]
 * @property {string} [raw_address]
 * @property {string} [street_address]
 * @property {string} [city]
 * @property {string} [state]
 * @property {string} [postal_code]
 * @property {string} [country]
 * @property {string} [owned_by_organization_id]
 * @property {Organization[]} [suborganizations]
 * @property {number} [num_suborganizations]
 * @property {string} [seo_description]
 * @property {string} [short_description]
 * @property {string} [annual_revenue_printed]
 * @property {number} [annual_revenue]
 * @property {number} [total_funding]
 * @property {string} [total_funding_printed]
 * @property {string} [latest_funding_round_date]
 * @property {string} [latest_funding_stage]
 * @property {FundingEvent[]} [funding_events]
 * @property {string[]} [technology_names]
 * @property {Technology[]} [current_technologies]
 * @property {string} [account_id]
 * @property {Account} [account]
 * @property {object} [departmental_head_count]
 * @property {string[]} [domains]
 */

/**
 * @typedef {Object} Phone
 * @property {string} [number]
 * @property {string} [source]
 */

/**
 * @typedef {Object} Technology
 * @property {string} [uid]
 * @property {string} [name]
 * @property {string} [category]
 */

/**
 * @typedef {Object} Employment
 * @property {string} [_id]
 * @property {string} [created_at]
 * @property {boolean} [current]
 * @property {string} [degree]
 * @property {string} [description]
 * @property {string[]} [emails]
 * @property {string} [end_date]
 * @property {string} [grade_level]
 * @property {string} [kind]
 * @property {string} [major]
 * @property {string} [organization_id]
 * @property {string} [organization_name]
 * @property {string} [raw_address]
 * @property {string} [start_date]
 * @property {string} [title]
 * @property {string} [updated_at]
 * @property {string} [id]
 * @property {string} [key]
 */

/**
 * @typedef {Object} People
 * @property {string} [id]
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 * @property {string} [linkedin_url]
 * @property {string} [title]
 * @property {string} [email_status]
 * @property {string} [photo_url]
 * @property {string} [twitter_url]
 * @property {string} [github_url]
 * @property {string} [facebook_url]
 * @property {string} [extrapolated_email_confidence]
 * @property {string} [headline]
 * @property {string} [email]
 * @property {Employment[]} [employment_history]
 * @property {string} [state]
 * @property {string} [city]
 * @property {string} [country]
 * @property {string} [organization_id]
 * @property {Organization} [organization]
 * @property {string} [account_id]
 * @property {Account} [account]
 * @property {string[]} [departments]
 * @property {string[]} [subdepartments]
 * @property {string[]} [functions]
 * @property {string} [seniority]
 */

/**
 * @typedef {Object} CachedOrganization
 * @property {Organization} [value]
 * @property {string} [expires_at]
 */

/**
 * @typedef {Object} CachedPeople
 * @property {People} [value]
 * @property {string} [expires_at]
 */

/**
 * @typedef {Object} Breadcrumb
 * @property {string} [label]
 * @property {string} [signal_field_name]
 * @property {string[]} [value]
 * @property {string} [display_name]
 */

/**
 * @typedef {Object} OrganizationSearchResponse
 * @property {Breadcrumb[]} [breadcrumbs]
 * @property {boolean} [partial_results_only]
 * @property {boolean} [disable_eu_prospecting]
 * @property {number} [partial_results_limit]
 * @property {Pagination} [pagination]
 * @property {Organization[]} [organizations]
 * @property {Account[]} [accounts]
 * @property {Organization[]} [values]
 */

/**
 * @typedef {Object} Pagination
 * @property {number} [page]
 * @property {number} [per_page]
 * @property {number} [total_entries]
 * @property {number} [total_pages]
 */

/**
 * @typedef {Object} PeopleSearchResponse
 * @property {Breadcrumb[]} [breadcrumbs]
 * @property {boolean} [partial_results_only]
 * @property {boolean} [disable_eu_prospecting]
 * @property {number} [partial_results_limit]
 * @property {Pagination} [pagination]
 * @property {People[]} [people]
 * @property {People[]} [values]
 */

/**
 * @typedef {Object} Batch
 * @property {string} id
 * @property {Named} channel
 * @property {string[]} [results]
 * @property {string} [message]
 * @property {Named} tenant
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} Named
 * @property {string} id
 * @property {string} [name]
 */

/**
 * @typedef {Object} ResultsBatch
 * @property {number} [total]
 * @property {Batch[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} BatchSearchRequest
 * @property {string[]} [ids]
 * @property {string} [channel_id]
 * @property {string[]} [channel_ids]
 * @property {string[]} [not_channel_ids]
 * @property {string} [channel_name]
 * @property {string} [results]
 * @property {boolean} [has_results]
 * @property {string} [message]
 * @property {boolean} [has_message]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} Calendars
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [location]
 * @property {string} [timezone]
 * @property {boolean} [read_only]
 * @property {boolean} [primary]
 * @property {boolean} [active]
 * @property {Named} tenant
 * @property {Named} creator
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} ResultsCalendars
 * @property {number} [total]
 * @property {Calendars[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} CalendarsSearchRequest
 * @property {string[]} [ids]
 * @property {string} [name]
 * @property {string} [description]
 * @property {boolean} [has_description]
 * @property {string} [location]
 * @property {boolean} [has_location]
 * @property {string} [timezone]
 * @property {boolean} [has_timezone]
 * @property {boolean} [read_only]
 * @property {boolean} [primary]
 * @property {boolean} [has_primary]
 * @property {boolean} [active]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [creator_id]
 * @property {string} [creator_name]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} Call
 * @property {string} id
 * @property {string} path
 * @property {string} method
 * @property {Token[]} [query_params]
 * @property {string} [actor]
 * @property {string} [accept_language]
 * @property {number} [content_length]
 * @property {string} [content_type]
 * @property {string} [referer]
 * @property {number} [status]
 * @property {boolean} [guest]
 * @property {string} [session_id]
 * @property {string} [tenant_id]
 * @property {string} [user_agent]
 * @property {number} [duration]
 * @property {string} [payload]
 * @property {Owner} [session]
 * @property {Named[]} [tenants]
 * @property {Named} [person]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} Owner
 * @property {string} email
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 */

/**
 * @typedef {Object} Token
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef {Object} CallStats
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [avatar_url]
 * @property {number} [count]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} CallSearchRequest
 * @property {string[]} [ids]
 * @property {string} [path]
 * @property {string} [method]
 * @property {string} [query]
 * @property {string} [query_params_name]
 * @property {string} [query_params_value]
 * @property {boolean} [has_query_params]
 * @property {string} [actor]
 * @property {boolean} [has_actor]
 * @property {string} [accept_language]
 * @property {boolean} [has_accept_language]
 * @property {number} [content_length]
 * @property {number} [content_length_from]
 * @property {number} [content_length_to]
 * @property {boolean} [has_content_length]
 * @property {string} [content_type]
 * @property {boolean} [has_content_type]
 * @property {string} [referer]
 * @property {boolean} [has_referer]
 * @property {number} [status]
 * @property {number} [status_from]
 * @property {number} [status_to]
 * @property {boolean} [guest]
 * @property {string} [session_id]
 * @property {boolean} [has_session_id]
 * @property {string} [tenant_id]
 * @property {boolean} [has_tenant_id]
 * @property {string} [user_agent]
 * @property {boolean} [has_user_agent]
 * @property {number} [duration]
 * @property {boolean} [has_duration]
 * @property {number} [duration_from]
 * @property {number} [duration_to]
 * @property {string} [payload]
 * @property {boolean} [has_payload]
 * @property {string} [session_email]
 * @property {string} [session_first_name]
 * @property {string} [session_last_name]
 * @property {string} [session_name]
 * @property {boolean} [has_session]
 * @property {string} [tenant_or_guest]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {boolean} [has_tenants]
 * @property {string} [person_id]
 * @property {string} [person_name]
 * @property {boolean} [has_person]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} ResultsCall
 * @property {number} [total]
 * @property {Call[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} Card
 * @property {string} id
 * @property {string} headline
 * @property {CardSection[]} sections
 * @property {Title} initiative
 * @property {Named} tenant
 * @property {Named} person
 * @property {"Bot" | "Channel" | "Meeting"} source
 * @property {"Google_Meeting" | "Teams_Meeting" | "Webex_Meeting" | "Zoom_Meeting" | "Slack_Digest" | "Teams_Digest" | "Document_Upload" | "Earnings_Call" | "Email_Thread"} [sub_source]
 * @property {Titled} source_data
 * @property {string} [batch_id]
 * @property {Participant[]} [participants]
 * @property {Embedded[]} [supporting_data]
 * @property {number} [num_of_supporting_data]
 * @property {string[]} [tags]
 * @property {Labeled[]} [labels]
 * @property {string} [comments]
 * @property {boolean} [high_priority]
 * @property {string} [high_priority_explanation]
 * @property {Share[]} [shares]
 * @property {boolean} [preferred]
 * @property {boolean} [archived]
 * @property {string} [read_at]
 * @property {string} [shared_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} CardSection
 * @property {string} title
 * @property {string} content
 */

/**
 * @typedef {Object} Embedded
 * @property {string} value
 * @property {number[]} [data]
 */

/**
 * @typedef {Object} Labeled
 * @property {string} id
 * @property {string} [title]
 * @property {"Auto" | "Manual" | "Rule"} [match]
 */

/**
 * @typedef {Object} Participant
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} email
 * @property {string} [title]
 * @property {string} [company_name]
 * @property {string} [company_type]
 * @property {string} [company_industry]
 * @property {string} [avatar_url]
 * @property {string} [comment]
 * @property {"yes" | "no" | "maybe" | "noreply"} [status]
 */

/**
 * @typedef {Object} Share
 * @property {string} email
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} Title
 * @property {string} id
 * @property {string} [title]
 * @property {"Focus" | "Label" | "Lens"} type
 */

/**
 * @typedef {Object} Titled
 * @property {string} id
 * @property {string} [title]
 */

/**
 * @typedef {Object} CardSearchRequest
 * @property {string[]} [ids]
 * @property {string} [query]
 * @property {string} [headline]
 * @property {string} [sections_title]
 * @property {string} [sections_content]
 * @property {string} [initiative_id]
 * @property {string[]} [initiative_ids]
 * @property {string} [initiative_title]
 * @property {"Focus" | "Label" | "Lens"} [initiative_type]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [person_id]
 * @property {string[]} [person_ids]
 * @property {string[]} [not_person_ids]
 * @property {string} [person_name]
 * @property {boolean} [has_person]
 * @property {"Bot" | "Channel" | "Meeting"} [source]
 * @property {"Google_Meeting" | "Teams_Meeting" | "Webex_Meeting" | "Zoom_Meeting" | "Slack_Digest" | "Teams_Digest" | "Document_Upload" | "Earnings_Call" | "Email_Thread"} [sub_sources]
 * @property {"Google_Meeting" | "Teams_Meeting" | "Webex_Meeting" | "Zoom_Meeting" | "Slack_Digest" | "Teams_Digest" | "Document_Upload" | "Earnings_Call" | "Email_Thread"} [not_sub_sources]
 * @property {boolean} [has_sub_source]
 * @property {string} [source_data_id]
 * @property {string[]} [source_data_ids]
 * @property {string} [source_data_title]
 * @property {"Document" | "Earnings_Call" | "Email" | "HubSpot" | "People" | "Salesforce" | "Slack" | "Teams"} [channel_source]
 * @property {string} [batch_id]
 * @property {boolean} [has_batch_id]
 * @property {string} [participants_id]
 * @property {string} [not_participants_id]
 * @property {string} [participants_name]
 * @property {string} [participants_company_name]
 * @property {string} [participants_company_type]
 * @property {string} [participants_company_industry]
 * @property {string[]} [participants_emails]
 * @property {string[]} [participants_domains]
 * @property {boolean} [has_participants]
 * @property {string} [supporting_data]
 * @property {number[]} [supporting_data_embed]
 * @property {number} [supporting_data_embed_score]
 * @property {boolean} [has_supporting_data]
 * @property {number} [num_of_supporting_data]
 * @property {number} [num_of_supporting_data_from]
 * @property {number} [num_of_supporting_data_to]
 * @property {string[]} [tags]
 * @property {boolean} [has_tags]
 * @property {string[]} [label_ids]
 * @property {string[]} [not_label_ids]
 * @property {boolean} [has_labels]
 * @property {string} [comments]
 * @property {boolean} [has_comments]
 * @property {boolean} [high_priority]
 * @property {string} [high_priority_explanation]
 * @property {boolean} [has_high_priority_explanation]
 * @property {string} [shares_email]
 * @property {string} [shares_created_at_from]
 * @property {string} [shares_created_at_to]
 * @property {boolean} [has_shares]
 * @property {boolean} [preferred]
 * @property {boolean} [archived]
 * @property {boolean} [has_read_at]
 * @property {string} [read_at_from]
 * @property {string} [read_at_to]
 * @property {boolean} [has_shared_at]
 * @property {string} [shared_at_from]
 * @property {string} [shared_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [request_id]
 * @property {boolean} [includeSupportingData]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} CardGenerationRequest
 * @property {string} id
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [provider]
 * @property {string} [channelId]
 * @property {string} [meetingId]
 * @property {string} [botId]
 * @property {string} [title]
 * @property {string} [initiativeId]
 * @property {Initiative} [initiative]
 * @property {string} [model]
 * @property {number} [maxLength]
 * @property {number} [temperature]
 * @property {string} [field]
 * @property {string[]} [values]
 * @property {string[]} [tags]
 * @property {string} [batchId]
 */

/**
 * @typedef {Object} Initiative
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {"Focus" | "Label" | "Lens"} type
 * @property {string} [color]
 * @property {string} [icon]
 * @property {string} start_at
 * @property {string} end_at
 * @property {number[]} [embeddings]
 * @property {Link[]} [links]
 * @property {Named[]} [collaborators]
 * @property {string} [card_template]
 * @property {string} [formatting_instructions]
 * @property {string} [understanding]
 * @property {InsightConfig} [insight_config]
 * @property {LensConfig} [lens_config]
 * @property {InitiativeMatchRules} [match_rules]
 * @property {"Collaborators" | "Owner" | "Tenant"} visibility
 * @property {boolean} [sensitive]
 * @property {string[]} [tags]
 * @property {Named} tenant
 * @property {Named} creator
 * @property {string} [archived_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} InitiativeMatchRule
 * @property {string} value
 * @property {number} [min_occurrences]
 * @property {boolean} [required]
 */

/**
 * @typedef {Object} InitiativeMatchRules
 * @property {InitiativeMatchRule[]} [titles]
 * @property {InitiativeMatchRule[]} [domains]
 * @property {InitiativeMatchRule[]} [not_domains]
 * @property {string[]} [only_domains]
 * @property {string[]} [never_domains]
 * @property {InitiativeMatchRule[]} [emails]
 * @property {InitiativeMatchRule[]} [organizers]
 * @property {boolean} [schedule]
 */

/**
 * @typedef {Object} InsightConfig
 * @property {number} [max_days]
 * @property {number} max_cards
 * @property {number} duration_days
 */

/**
 * @typedef {Object} LensCardFilter
 * @property {string} [query]
 * @property {"Google_Meeting" | "Teams_Meeting" | "Webex_Meeting" | "Zoom_Meeting" | "Slack_Digest" | "Teams_Digest" | "Document_Upload" | "Earnings_Call" | "Email_Thread"} [sub_sources]
 * @property {string[]} [participants_emails]
 * @property {string[]} [participants_domains]
 * @property {string[]} [initiative_ids]
 * @property {string[]} [tags]
 * @property {string[]} [label_ids]
 * @property {string[]} [not_label_ids]
 */

/**
 * @typedef {Object} LensConfig
 * @property {LensCardFilter} [card_filter]
 * @property {boolean} [include_earnings_call]
 * @property {string} match_prompt
 * @property {string} explanatory_prompt
 * @property {string} [high_priority_examples_prompt]
 * @property {number} [min_similarity_score]
 * @property {number} [min_topics_match]
 */

/**
 * @typedef {Object} Link
 * @property {string} title
 * @property {string} url
 */

/**
 * @typedef {Object} Assembly
 * @property {string[]} [redact_pii_policies]
 * @property {boolean} [auto_highlights]
 * @property {boolean} [content_safety]
 * @property {boolean} [iab_categories]
 * @property {boolean} [sentiment_analysis]
 * @property {boolean} [auto_chapters]
 * @property {boolean} [entity_detection]
 */

/**
 * @typedef {Object} Attendance
 * @property {string} id
 * @property {string} [name]
 */

/**
 * @typedef {Object} Attendee
 * @property {string} id
 * @property {string} [name]
 * @property {Attendance} [status]
 */

/**
 * @typedef {Object} AutomaticVideoOutput
 * @property {Media} [in_call_recording]
 * @property {Media} [in_call_not_recording]
 */

/**
 * @typedef {Object} Bot
 * @property {string} [id]
 * @property {string} [video_url]
 * @property {string} [media_retention_end]
 * @property {StatusChange[]} [status_changes]
 * @property {MeetingMetadata} [meeting_metadata]
 * @property {MeetingParticipant[]} [meeting_participants]
 * @property {string} [calendar_meeting_id]
 * @property {object[]} [calendar_meetings]
 * @property {string} [calendar_user_id]
 * @property {TranscriptionOptions} [transcription_options]
 * @property {"Auto_By_Person" | "Auto_By_Tenant" | "Manual"} [origin]
 * @property {EarningsCall} [earnings_call]
 * @property {string} [summary]
 * @property {number[]} [summary_vector]
 * @property {number[]} [summary_vector_0]
 * @property {number[]} [summary_vector_1]
 * @property {number} [num_of_status_changes]
 * @property {number} [num_of_transcripts]
 * @property {BotRequest} [outbound]
 * @property {BotCreationRequest} [request]
 * @property {Transcript[]} [transcripts]
 * @property {Followup[]} [followups]
 * @property {Speaker[]} [speakers_]
 * @property {Topic[]} [topics]
 * @property {Recap} [recap]
 * @property {string} [tweet]
 * @property {Highlight[]} [highlights]
 * @property {Named} [tenant]
 * @property {Named} [creator]
 * @property {string} [created_at]
 * @property {object} [meeting_url]
 * @property {string} [join_at]
 * @property {string} [updated_at]
 * @property {object} [speakers]
 */

/**
 * @typedef {Object} BotCreationRequest
 * @property {string} url
 * @property {string} [name]
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [provider]
 * @property {string} [model]
 * @property {boolean} [async]
 * @property {boolean} [notify]
 * @property {string} [notifyMessage]
 * @property {string} [callbackUrl]
 * @property {string[]} [wordBoost]
 * @property {number} [maxLength]
 * @property {string} [prompt]
 * @property {number} [temperature]
 * @property {string} [followupModel]
 * @property {number} [followupMaxLength]
 * @property {string} [followupPrompt]
 * @property {number} [followupTemperature]
 * @property {string} [recapModel]
 * @property {number} [recapMaxLength]
 * @property {string} [recapPrompt]
 * @property {string} [recapPromptX]
 * @property {number} [recapTemperature]
 * @property {number} [summaryIntervalDuration]
 * @property {string} [titleModel]
 * @property {number} [titleMaxLength]
 * @property {string} [titlePrompt]
 * @property {number} [titleTemperature]
 * @property {string} [todoModel]
 * @property {number} [todoMaxLength]
 * @property {string} [todoPrompt]
 * @property {number} [todoTemperature]
 * @property {string} [topicPrompt]
 * @property {boolean} [useQRCode]
 * @property {string} [inCallRecordingMediaUrl]
 * @property {string} [inCallNotRecordingMediaUrl]
 */

/**
 * @typedef {Object} BotRequest
 * @property {string} [meeting_url]
 * @property {string} [bot_name]
 * @property {"speaker_view" | "gallery_view" | "gallery_view_v2" | "audio_only"} [recording_mode]
 * @property {RecordingModeOptions} [recording_mode_options]
 * @property {RealTimeTranscription} [real_time_transcription]
 * @property {RealTimeMedia} [real_time_media]
 * @property {TranscriptionOptions} [transcription_options]
 * @property {Intelligence} [intelligence]
 * @property {Chat} [chat]
 * @property {GoogleMeet} [google_meet]
 * @property {Zoom} [zoom]
 * @property {string} [join_at]
 * @property {AutomaticVideoOutput} [automatic_video_output]
 */

/**
 * @typedef {Object} CardResponse
 * @property {Card} [value]
 * @property {Initiative} [initiative]
 * @property {Bot} [bot]
 * @property {Channel} [channel]
 * @property {Meeting} [meeting]
 */

/**
 * @typedef {Object} Channel
 * @property {string} id
 * @property {string} name
 * @property {"Document" | "Earnings_Call" | "Email" | "HubSpot" | "People" | "Salesforce" | "Slack" | "Teams"} source
 * @property {string[]} identifiers
 * @property {Titled} initiative
 * @property {string} [first_run_at]
 * @property {string} [next_run_at]
 * @property {string} [last_run_at]
 * @property {"failure" | "pending" | "success"} [last_run_status]
 * @property {string} [last_message]
 * @property {string} schedule
 * @property {object} [metadata]
 * @property {Named} tenant
 * @property {Named} creator
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} Chat
 * @property {OnBotJoin} [on_bot_join]
 * @property {OnParticipantJoin} [on_participant_join]
 */

/**
 * @typedef {Object} CustomVocabulary
 * @property {Vocabulary[]} [vocabulary]
 */

/**
 * @typedef {Object} EarningsCall
 * @property {string} symbol
 * @property {string} company_name
 * @property {string} domain
 * @property {number} [quarter]
 * @property {number} [year]
 * @property {string} released_at
 */

/**
 * @typedef {Object} Followup
 * @property {string} value
 * @property {string} [assignee]
 */

/**
 * @typedef {Object} Gladia
 * @property {"manual" | "automatic single language" | "automatic multiple languages"} [language_behaviour]
 * @property {string} [language]
 * @property {string} [transcription_hint]
 * @property {number} [endpointing]
 * @property {"fast" | "accurate"} [model_type]
 * @property {boolean} [audio_enhancer]
 */

/**
 * @typedef {Object} GladiaV2
 * @property {boolean} [code_switching]
 * @property {boolean} [custom_vocabulary]
 * @property {CustomVocabulary} [custom_vocabulary_config]
 */

/**
 * @typedef {Object} GoogleMeet
 * @property {string} [google_login_group_id]
 * @property {boolean} [login_required]
 */

/**
 * @typedef {Object} Highlight
 * @property {string} id
 * @property {string} headline
 * @property {string} summary
 * @property {string} evidence
 * @property {string} start_time
 * @property {string} end_time
 */

/**
 * @typedef {Object} Intelligence
 * @property {Assembly} [assembly_ai]
 */

/**
 * @typedef {Object} LinkedMeeting
 * @property {string} id
 * @property {string} [title]
 * @property {string} [bot_id]
 */

/**
 * @typedef {Object} Media
 * @property {"jpeg"} kind
 * @property {string} b64_data
 */

/**
 * @typedef {Object} Meeting
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} [location]
 * @property {string} url
 * @property {string} start_at
 * @property {string} end_at
 * @property {number[]} [embeddings]
 * @property {Attendance} [status]
 * @property {Attendee[]} [attendees]
 * @property {string} [bot_id]
 * @property {boolean} [bot_attendee]
 * @property {Named} [calendar]
 * @property {string[]} [domains]
 * @property {Titled} [initiative]
 * @property {"Auto" | "Manual" | "Rule"} [initiative_match]
 * @property {LinkedMeeting} [linked]
 * @property {object} [nylas]
 * @property {string} [parent_id]
 * @property {string} [preparation]
 * @property {string} [preparation_headline]
 * @property {Notification} [last_minute_prep]
 * @property {Share[]} [shares]
 * @property {Named[]} [watchers]
 * @property {string[]} [tags]
 * @property {Labeled[]} [labels]
 * @property {boolean} [sensitive]
 * @property {Named} [tenant]
 * @property {Named} [creator]
 * @property {string} [archived_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} MeetingMetadata
 * @property {string} [title]
 */

/**
 * @typedef {Object} MeetingParticipant
 * @property {string} [id]
 * @property {string} [name]
 * @property {StatusChange[]} [events]
 */

/**
 * @typedef {Object} Notification
 * @property {string} name
 * @property {"email" | "push" | "sms"} target_channel
 * @property {Contents} contents
 * @property {Contents} headings
 * @property {Aliases} [include_aliases]
 * @property {string} [idempotency_key]
 * @property {object} [data]
 * @property {string} [send_after]
 */

/**
 * @typedef {Object} OnBotJoin
 * @property {"everyone" | "everyone_except_host" | "host"} [send_to]
 * @property {string} [message]
 */

/**
 * @typedef {Object} OnParticipantJoin
 * @property {string} [message]
 * @property {boolean} [exclude_host]
 */

/**
 * @typedef {Object} RealTimeMedia
 * @property {string} [websocket_video_destination_url]
 * @property {string} [websocket_audio_destination_url]
 */

/**
 * @typedef {Object} RealTimeTranscription
 * @property {string} [destination_url]
 * @property {boolean} [partial_results]
 */

/**
 * @typedef {Object} Recap
 * @property {string} headline
 * @property {CardSection[]} [sections]
 */

/**
 * @typedef {Object} RecordingModeOptions
 * @property {"hide" | "beside" | "overlap"} [participant_video_when_screenshare]
 * @property {"call_join" | "participant_join" | "participant_speak" | "manual"} [start_recording_on]
 */

/**
 * @typedef {Object} Speaker
 * @property {string} name
 * @property {number} [duration]
 * @property {string} behavior
 * @property {"balanced" | "strategic" | "tactical"} demeanor
 */

/**
 * @typedef {Object} StatusChange
 * @property {string} code
 * @property {string} [sub_code]
 * @property {string} [message]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} Topic
 * @property {string} title
 * @property {string} [details]
 * @property {string[]} [speakers]
 * @property {number} [sentiment]
 * @property {"strategic" | "tactical"} [strategic_vs_tactical]
 * @property {number[]} [embeddings]
 */

/**
 * @typedef {Object} Transcript
 * @property {string} speaker
 * @property {Word[]} words
 * @property {boolean} [is_final]
 * @property {number} [start_time]
 * @property {number} [end_time]
 * @property {number} [duration]
 * @property {string} [segment]
 * @property {string} [summary]
 * @property {string} [title]
 * @property {string} [todos]
 * @property {string} [todos_title]
 * @property {object} [participant]
 */

/**
 * @typedef {Object} TranscriptionAssembly
 * @property {string[]} [word_boost]
 */

/**
 * @typedef {Object} TranscriptionOptions
 * @property {"assembly_ai" | "deepgram" | "gladia" | "gladia_v2" | "rev" | "upload"} [provider]
 * @property {TranscriptionAssembly} [assembly_ai]
 * @property {Gladia} [gladia]
 * @property {GladiaV2} [gladia_v2]
 * @property {TranscriptionRev} [rev]
 */

/**
 * @typedef {Object} TranscriptionRev
 * @property {string} [custom_vocabulary_id]
 */

/**
 * @typedef {Object} Vocabulary
 * @property {string} [value]
 */

/**
 * @typedef {Object} Word
 * @property {string} text
 * @property {number} [start_time]
 * @property {number} [end_time]
 */

/**
 * @typedef {Object} Zoom
 * @property {string} [join_token_url]
 * @property {string} [user_email]
 * @property {boolean} [require_recording_permission]
 * @property {boolean} [request_recording_permission_on_host_join]
 */

/**
 * @typedef {Object} CountBy
 * @property {string} [name]
 * @property {number} [value]
 */

/**
 * @typedef {Object} ResultsCard
 * @property {number} [total]
 * @property {Card[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ShareRequest
 * @property {string[]} emails
 * @property {string} [message]
 * @property {boolean} [guest]
 */

/**
 * @typedef {Object} ResultsChannel
 * @property {number} [total]
 * @property {Channel[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ChannelSearchRequest
 * @property {string[]} [ids]
 * @property {string} [name]
 * @property {"Document" | "Earnings_Call" | "Email" | "HubSpot" | "People" | "Salesforce" | "Slack" | "Teams"} [source]
 * @property {"Document" | "Earnings_Call" | "Email" | "HubSpot" | "People" | "Salesforce" | "Slack" | "Teams"} [sources]
 * @property {"Document" | "Earnings_Call" | "Email" | "HubSpot" | "People" | "Salesforce" | "Slack" | "Teams"} [not_sources]
 * @property {string} [identifiers]
 * @property {string} [initiative_id]
 * @property {string} [initiative_title]
 * @property {string} [first_run_at]
 * @property {boolean} [has_first_run_at]
 * @property {string} [first_run_at_from]
 * @property {string} [first_run_at_to]
 * @property {string} [next_run_at]
 * @property {boolean} [has_next_run_at]
 * @property {string} [next_run_at_from]
 * @property {string} [next_run_at_to]
 * @property {string} [last_run_at]
 * @property {boolean} [has_last_run_at]
 * @property {string} [last_run_at_from]
 * @property {string} [last_run_at_to]
 * @property {"failure" | "pending" | "success"} [last_run_status]
 * @property {"failure" | "pending" | "success"} [not_last_run_status]
 * @property {boolean} [has_last_run_status]
 * @property {string} [last_message]
 * @property {boolean} [has_last_message]
 * @property {string} [schedule]
 * @property {boolean} [has_schedule]
 * @property {boolean} [has_metadata]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [creator_id]
 * @property {string} [creator_name]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} Company
 * @property {string} id
 * @property {string} name
 * @property {string} [type]
 * @property {string} [domain]
 * @property {string} [industry]
 */

/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} email
 * @property {"CSV" | "HubSpot" | "Salesforce"} source
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 * @property {string} [title]
 * @property {Company} company
 * @property {string} [location]
 * @property {string} [phone]
 * @property {string} [extension]
 * @property {string} [avatar_url]
 * @property {string[]} [departments]
 * @property {string[]} [tags]
 * @property {string} [time_zone_id]
 * @property {string} [external_id]
 * @property {Holder} [owner]
 * @property {Named} tenant
 * @property {boolean} [active]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} Holder
 * @property {string} id
 * @property {string} name
 * @property {"Contact" | "Person"} type
 */

/**
 * @typedef {Object} ResultsContact
 * @property {number} [total]
 * @property {Contact[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ContactSearchRequest
 * @property {string[]} [ids]
 * @property {string} [email]
 * @property {string[]} [emails]
 * @property {"CSV" | "HubSpot" | "Salesforce"} [source]
 * @property {string} [first_name]
 * @property {boolean} [has_first_name]
 * @property {string} [last_name]
 * @property {boolean} [has_last_name]
 * @property {string} [name]
 * @property {boolean} [has_name]
 * @property {string} [title]
 * @property {boolean} [has_title]
 * @property {string} [company_id]
 * @property {string} [company_name]
 * @property {string} [company_type]
 * @property {string} [company_domain]
 * @property {string} [company_industry]
 * @property {string} [location]
 * @property {boolean} [has_location]
 * @property {string} [phone]
 * @property {boolean} [has_phone]
 * @property {string} [extension]
 * @property {boolean} [has_extension]
 * @property {string} [avatar_url]
 * @property {boolean} [has_avatar_url]
 * @property {string} [department]
 * @property {string[]} [departments]
 * @property {boolean} [has_departments]
 * @property {string[]} [tags]
 * @property {string} [time_zone_id]
 * @property {boolean} [has_time_zone_id]
 * @property {string} [external_id]
 * @property {boolean} [has_external_id]
 * @property {string} [owner_id]
 * @property {string} [owner_name]
 * @property {"Contact" | "Person"} [owner_type]
 * @property {boolean} [has_owner]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {boolean} [active]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} Artifact
 * @property {"text/html" | "text/markdown"} type
 * @property {string} [title]
 * @property {string} content
 */

/**
 * @typedef {Object} Conversation
 * @property {string} id
 * @property {string} title
 * @property {Message[]} messages
 * @property {"Channel" | "Custom_Summary" | "Earnings_Call" | "Global" | "Insight" | "Meeting" | "Other"} initiator
 * @property {string[]} [tags]
 * @property {Named} tenant
 * @property {Named} creator
 * @property {string} [archived_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {Sourced[]} [sources]
 * @property {Artifact[]} [artifacts]
 */

/**
 * @typedef {Object} Message
 * @property {"assistant" | "user"} role
 * @property {string} value
 * @property {Artifact} [artifact]
 * @property {Sourced[]} [sources]
 */

/**
 * @typedef {Object} Sourced
 * @property {string} id
 * @property {string} title
 * @property {"Batch" | "Bot" | "Card" | "Meeting"} type
 */

/**
 * @typedef {Object} ResultsConversation
 * @property {number} [total]
 * @property {Conversation[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ConversationSearchRequest
 * @property {string[]} [ids]
 * @property {string} [query]
 * @property {string} [title]
 * @property {"assistant" | "user"} [messages_role]
 * @property {string} [messages_value]
 * @property {boolean} [has_messages_artifact]
 * @property {string[]} [source_ids]
 * @property {boolean} [has_messages_sources]
 * @property {"Channel" | "Custom_Summary" | "Earnings_Call" | "Global" | "Insight" | "Meeting" | "Other"} [initiator]
 * @property {string[]} [tags]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [creator_id]
 * @property {string} [creator_name]
 * @property {boolean} [has_archived_at]
 * @property {string} [archived_at_from]
 * @property {string} [archived_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} Feedback
 * @property {string} id
 * @property {string} content
 * @property {"Open" | "Closed"} status
 * @property {"Card" | "Insight"} source
 * @property {Titled} source_data
 * @property {Named} tenant
 * @property {Named} creator
 * @property {string} [archived_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} ResultsFeedback
 * @property {number} [total]
 * @property {Feedback[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} FeedbackSearchRequest
 * @property {string[]} [ids]
 * @property {string} [content]
 * @property {boolean} [has_content]
 * @property {"Open" | "Closed"} [status]
 * @property {"Card" | "Insight"} [source]
 * @property {string} [source_data_id]
 * @property {string} [source_data_title]
 * @property {string[]} [tenant_id]
 * @property {string} [tenant_name]
 * @property {string} [creator_id]
 * @property {string} [creator_name]
 * @property {boolean} [has_archived_at]
 * @property {string} [archived_at_from]
 * @property {string} [archived_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 * @property {string[]} [tenant_ids]
 */

/**
 * @typedef {Object} ScoredTranscriptSymbol
 * @property {TranscriptSymbol} [value]
 * @property {number} [score]
 */

/**
 * @typedef {Object} TranscriptSymbol
 * @property {string} [symbol]
 * @property {string} [companyName]
 * @property {number} [noOfTranscripts]
 */

/**
 * @typedef {Object} TranscriptPeriod
 * @property {number} [quarter]
 * @property {number} [fiscalYear]
 * @property {string} [date]
 */

/**
 * @typedef {Object} FinancialModelingPrepRequest
 * @property {string} id
 * @property {string} symbol
 * @property {number} quarter
 * @property {number} year
 * @property {BotCreationRequest} [botRequest]
 * @property {string} [initiativeId]
 * @property {Named} tenant
 * @property {Named} creator
 */

/**
 * @typedef {Object} Global
 * @property {string} [outage_message]
 */

/**
 * @typedef {Object} DigestConfig
 * @property {number} [time_of_day]
 */

/**
 * @typedef {Object} DigestConfigs
 * @property {DigestConfig} [morning]
 * @property {DigestConfig} [evening]
 * @property {boolean} [last_minute_prep]
 */

/**
 * @typedef {Object} GlobalSearchResponse
 * @property {ResultsCard} [cards]
 * @property {ResultsInsight} [insights]
 * @property {ResultsMeeting} [meetings]
 * @property {OrganizationSearchResponse} [organizations]
 * @property {ParticipantStats[]} [participants]
 * @property {ResultsPerson} [persons]
 */

/**
 * @typedef {Object} Insight
 * @property {string} id
 * @property {string} headline
 * @property {string} subheadline
 * @property {InsightSection[]} sections
 * @property {Titled[]} cards
 * @property {Title} initiative
 * @property {string} [cover_image_url]
 * @property {Named} tenant
 * @property {Named} person
 * @property {Share[]} [shares]
 * @property {boolean} [preferred]
 * @property {string} [read_at]
 * @property {string} [archived_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} InsightSection
 * @property {"intro" | "main_content" | "conclusion"} type
 * @property {string} title
 * @property {string} content
 */

/**
 * @typedef {Object} ParticipantStats
 * @property {string} [id]
 * @property {string} [email]
 * @property {string} [name]
 * @property {string} [title]
 * @property {string} [avatar_url]
 * @property {string} [company_name]
 * @property {number} [count]
 * @property {number} [botted]
 * @property {number} [duration]
 */

/**
 * @typedef {Object} Person
 * @property {string} id
 * @property {string} email
 * @property {string} password
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 * @property {string} [title]
 * @property {string} [location]
 * @property {string[]} [departments]
 * @property {string[]} [groups]
 * @property {Named} [manager]
 * @property {Named[]} [managers]
 * @property {number} [level]
 * @property {"Admin" | "Associate" | "Executive" | "Full"} type
 * @property {string} [context]
 * @property {Named[]} [tenants]
 * @property {DigestConfigs} [digest_configs]
 * @property {string} [nylas_account_id]
 * @property {PersonMeetingConfig} [meeting_config]
 * @property {PersonPushConfig} [push_config]
 * @property {PersonRecallConfig} [recall_config]
 * @property {number} [card_receipt_levels]
 * @property {string} [avatar_url]
 * @property {string} [slack_channel]
 * @property {string[]} [tags]
 * @property {string} [time_zone_id]
 * @property {string} [external_id]
 * @property {boolean} [active]
 * @property {Named} [creator]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} PersonMeetingConfig
 * @property {boolean} [auto_schedule]
 */

/**
 * @typedef {Object} PersonPushConfig
 * @property {boolean} [enabled]
 * @property {boolean} [last_minute_prep]
 * @property {boolean} [my_pulses]
 * @property {boolean} [my_team_pulses]
 * @property {boolean} [live_activities]
 */

/**
 * @typedef {Object} PersonRecallConfig
 * @property {string} zoom_oauth_credential_id
 */

/**
 * @typedef {Object} ResultsInsight
 * @property {number} [total]
 * @property {Insight[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ResultsMeeting
 * @property {number} [total]
 * @property {Meeting[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ResultsPerson
 * @property {number} [total]
 * @property {Person[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} GlobalSearchRequest
 * @property {string} query
 * @property {string} [start_at_from]
 * @property {string} [start_at_to]
 * @property {"Focus" | "Label" | "Lens"} [insight_type]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [pageSize]
 */

/**
 * @typedef {Object} RedisKey
 * @property {string} [key]
 * @property {string} [type]
 * @property {number} [ttl]
 * @property {string} [value]
 * @property {number} [size]
 */

/**
 * @typedef {Object} AdminFactory
 * @property {HealthCheckConfiguration} healthChecks
 * @property {TaskConfiguration} tasks
 */

/**
 * @typedef {Object} Config
 * @property {string} [env]
 * @property {string} [appKey]
 * @property {string} [appUrl]
 * @property {string} [esHost]
 * @property {string} [esCreds]
 * @property {JedisConfig} [redis]
 * @property {PusherConfig} [pusher]
 * @property {Queues} [queues]
 * @property {number} [summaryIntervalDuration]
 * @property {number} [transcriptSummaryLimit]
 * @property {string} [lazyRecallNotification]
 * @property {string} [qrCodeGeneratorUrl]
 * @property {string} [updateEventUrl]
 * @property {string} [zoomJoinTokenUrl]
 * @property {string} [zoomWebinarTokenUrl]
 * @property {string} [botRecordingsBucket]
 * @property {ServerFactory} [server]
 * @property {LoggingFactory} [logging]
 * @property {MetricsFactory} [metrics]
 * @property {HealthFactory} [health]
 * @property {AdminFactory} [admin]
 */

/**
 * @typedef {Object} HealthCheckConfiguration
 * @property {boolean} [servletEnabled]
 * @property {number} [minThreads]
 * @property {number} [maxThreads]
 * @property {number} [workQueueSize]
 */

/**
 * @typedef {Object} HealthFactory
 * @property {string} type
 */

/**
 * @typedef {Object} JedisConfig
 * @property {string} [host]
 * @property {number} [port]
 * @property {number} [timeout]
 * @property {number} [poolSize]
 * @property {string} [password]
 * @property {boolean} [ssl]
 * @property {boolean} [testWhileIdle]
 */

/**
 * @typedef {Object} LoggingFactory
 * @property {string} type
 */

/**
 * @typedef {Object} MetricsFactory
 * @property {string} frequency
 * @property {ReporterFactory[]} reporters
 * @property {boolean} [reportOnStop]
 */

/**
 * @typedef {Object} PusherConfig
 * @property {string} [baseUrl]
 * @property {string} [appId]
 * @property {string} [key]
 * @property {string} [secret]
 */

/**
 * @typedef {Object} Queues
 * @property {string} [nylas_expiration]
 * @property {string} [google_update_event]
 * @property {string} [bot_highlight_analysis]
 * @property {string} [card_post_processing]
 */

/**
 * @typedef {Object} ReporterFactory
 * @property {string} [frequency]
 * @property {string} type
 */

/**
 * @typedef {Object} ServerFactory
 * @property {string} type
 */

/**
 * @typedef {Object} TaskConfiguration
 * @property {boolean} [printStackTraceOnError]
 */

/**
 * @typedef {Object} Result
 * @property {boolean} [healthy]
 * @property {string} [message]
 * @property {object} [error]
 * @property {object} [details]
 * @property {number} [time]
 * @property {number} [duration]
 * @property {string} [timestamp]
 */

/**
 * @typedef {Object} TaskableStats
 * @property {string} [name]
 * @property {number} [size]
 * @property {number} [errors]
 * @property {number} [started]
 * @property {number} [warnings]
 * @property {number} [finished]
 * @property {number} [completed]
 * @property {string} [lastError]
 * @property {string} [lastWarnings]
 */

/**
 * @typedef {Object} Runtimed
 * @property {number} [availableProcessors]
 * @property {number} [freeMemory]
 * @property {number} [totalMemory]
 * @property {number} [maxMemory]
 * @property {string} [version]
 * @property {number} [percentFreeMemory]
 */

/**
 * @typedef {Object} InitiativeSearchRequest
 * @property {string[]} [ids]
 * @property {string} [title]
 * @property {string[]} [titles]
 * @property {string} [description]
 * @property {"Focus" | "Label" | "Lens"} [type]
 * @property {string} [color]
 * @property {boolean} [has_color]
 * @property {string} [icon]
 * @property {boolean} [has_icon]
 * @property {string} [start_at]
 * @property {string} [start_at_from]
 * @property {string} [start_at_to]
 * @property {string} [end_at]
 * @property {string} [end_at_from]
 * @property {string} [end_at_to]
 * @property {number[]} [embeddings]
 * @property {number} [threshold]
 * @property {boolean} [has_embeddings]
 * @property {string} [link_title]
 * @property {string} [link_url]
 * @property {boolean} [has_links]
 * @property {string} [collaborator_id]
 * @property {string} [collaborator_name]
 * @property {boolean} [has_collaborators]
 * @property {string} [card_template]
 * @property {boolean} [has_card_template]
 * @property {string} [formatting_instructions]
 * @property {boolean} [has_formatting_instructions]
 * @property {string} [understanding]
 * @property {boolean} [has_understanding]
 * @property {number} [insight_config_max_days]
 * @property {number} [insight_config_max_cards]
 * @property {number} [insight_config_duration_days]
 * @property {boolean} [has_insight_config]
 * @property {boolean} [has_insight_config_max_days]
 * @property {boolean} [has_lens_config_card_filter]
 * @property {boolean} [lens_config_include_earnings_call]
 * @property {string} [lens_config_match_prompt]
 * @property {string} [lens_config_explanatory_prompt]
 * @property {string} [lens_config_high_priority_examples_prompt]
 * @property {boolean} [has_lens_config_high_priority_examples_prompt]
 * @property {number} [lens_config_min_similarity_score]
 * @property {number} [lens_config_min_similarity_score_from]
 * @property {number} [lens_config_min_similarity_score_to]
 * @property {boolean} [has_lens_config_min_similarity_score]
 * @property {number} [lens_config_min_topics_match]
 * @property {number} [lens_config_min_topics_match_from]
 * @property {number} [lens_config_min_topics_match_to]
 * @property {boolean} [has_lens_config_min_topics_match]
 * @property {boolean} [has_lens_config]
 * @property {boolean} [has_match_rules]
 * @property {boolean} [has_match_rules_titles]
 * @property {boolean} [has_match_rules_domains]
 * @property {boolean} [has_match_rules_not_domains]
 * @property {boolean} [has_match_rules_only_domains]
 * @property {boolean} [has_match_rules_never_domains]
 * @property {boolean} [has_match_rules_emails]
 * @property {boolean} [has_match_rules_organizers]
 * @property {boolean} [match_rules_schedule]
 * @property {"Collaborators" | "Owner" | "Tenant"} [visibility]
 * @property {boolean} [has_visibility]
 * @property {boolean} [sensitive]
 * @property {string[]} [tags]
 * @property {boolean} [has_tags]
 * @property {string} [tenant_id]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [creator_id]
 * @property {string[]} [creator_ids]
 * @property {string} [creator_name]
 * @property {boolean} [has_archived_at]
 * @property {string} [archived_at_from]
 * @property {string} [archived_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} ResultBoolean
 * @property {boolean} [value]
 */

/**
 * @typedef {Object} ResultString
 * @property {string} [value]
 */

/**
 * @typedef {Object} LensMatchRequest
 * @property {string} id
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [provider]
 * @property {"Bot" | "Channel" | "Meeting"} source
 * @property {"Google_Meeting" | "Teams_Meeting" | "Webex_Meeting" | "Zoom_Meeting" | "Slack_Digest" | "Teams_Digest" | "Document_Upload" | "Earnings_Call" | "Email_Thread"} subSource
 * @property {Titled} sourceData
 * @property {Titled} initiative
 * @property {Participant[]} [participants]
 * @property {Named} person
 * @property {Named} tenant
 * @property {string[]} values
 * @property {number[]} [embeddings]
 * @property {number} [threshold]
 * @property {number} [minMatch]
 * @property {string[]} [tags]
 * @property {string[]} [label_ids]
 * @property {Topic[]} [topics]
 * @property {string} [batchId]
 */

/**
 * @typedef {Object} ResultsInitiative
 * @property {number} [total]
 * @property {Initiative[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} TransformTemplateRequest
 * @property {string} value
 * @property {object} model
 */

/**
 * @typedef {Object} FollowupQuestion
 * @property {string} [value]
 * @property {boolean} [needed]
 */

/**
 * @typedef {Object} InsightGenerationRequest
 * @property {string} id
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [provider]
 * @property {string} initiativeId
 * @property {string} personId
 * @property {string[]} [cardIds]
 * @property {string} [model]
 * @property {number} [maxLength]
 * @property {number} [minCards]
 * @property {number} [temperature]
 * @property {string[]} [extra]
 */

/**
 * @typedef {Object} InsightSearchRequest
 * @property {string[]} [ids]
 * @property {string} [query]
 * @property {string} [headline]
 * @property {string} [subheadline]
 * @property {"intro" | "main_content" | "conclusion"} [sections_type]
 * @property {string} [sections_title]
 * @property {string} [sections_content]
 * @property {string} [cards_id]
 * @property {string[]} [cards_ids]
 * @property {string} [cards_title]
 * @property {string} [initiative_id]
 * @property {string[]} [initiative_ids]
 * @property {string[]} [not_initiative_ids]
 * @property {string} [initiative_title]
 * @property {"Focus" | "Label" | "Lens"} [initiative_type]
 * @property {string} [cover_image_url]
 * @property {boolean} [has_cover_image_url]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [person_id]
 * @property {string} [person_name]
 * @property {string} [shares_email]
 * @property {string} [shares_created_at_from]
 * @property {string} [shares_created_at_to]
 * @property {boolean} [has_shares]
 * @property {boolean} [preferred]
 * @property {boolean} [has_read_at]
 * @property {string} [read_at_from]
 * @property {string} [read_at_to]
 * @property {boolean} [has_archived_at]
 * @property {string} [archived_at_from]
 * @property {string} [archived_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} DigestInitializationRequest
 * @property {string} [when]
 */

/**
 * @typedef {Object} MeetingSearchRequest
 * @property {string[]} [ids]
 * @property {string[]} [not_ids]
 * @property {string} [query]
 * @property {string} [title]
 * @property {string} [title_x]
 * @property {string} [title_regex]
 * @property {string} [description]
 * @property {string} [location]
 * @property {boolean} [has_location]
 * @property {string} [url]
 * @property {string} [url_x]
 * @property {boolean} [has_url]
 * @property {string} [start_at]
 * @property {string} [start_at_from]
 * @property {string} [start_at_to]
 * @property {string} [end_at_from]
 * @property {string} [end_at_to]
 * @property {boolean} [has_embeddings]
 * @property {string} [status_id]
 * @property {string} [status_name]
 * @property {boolean} [has_status]
 * @property {boolean} [not_canceled]
 * @property {string} [attendee_id]
 * @property {string} [attendee_name]
 * @property {boolean} [has_attendees]
 * @property {string} [bot_id]
 * @property {string[]} [bot_ids]
 * @property {boolean} [has_bot_id]
 * @property {string} [either_bot_id]
 * @property {string[]} [either_bot_ids]
 * @property {boolean} [has_either_bot_id]
 * @property {boolean} [bot_attendee]
 * @property {string} [calendar_id]
 * @property {string[]} [not_calendar_ids]
 * @property {string} [calendar_name]
 * @property {boolean} [has_calendar]
 * @property {string[]} [domains]
 * @property {boolean} [has_domains]
 * @property {string} [initiative_id]
 * @property {string[]} [not_initiative_ids]
 * @property {string} [initiative_title]
 * @property {boolean} [has_initiative]
 * @property {"Auto" | "Manual" | "Rule"} [initiative_match]
 * @property {boolean} [has_initiative_match]
 * @property {boolean} [has_linked]
 * @property {string} [linked_id]
 * @property {string} [linked_bot_id]
 * @property {boolean} [has_nylas]
 * @property {boolean} [has_nylas_organizer]
 * @property {string[]} [nylas_organizer_emails]
 * @property {string[]} [not_nylas_organizer_emails]
 * @property {string} [nylas_organizer_email_suffix]
 * @property {string} [not_nylas_organizer_email_suffix]
 * @property {boolean} [has_nylas_participants]
 * @property {string[]} [nylas_participant_emails]
 * @property {string[]} [not_nylas_participant_emails]
 * @property {string} [nylas_participant_email_suffix]
 * @property {boolean} [has_nylas_recurrence]
 * @property {boolean} [has_nylas_v3_id]
 * @property {string} [parent_id]
 * @property {boolean} [has_parent_id]
 * @property {string} [preparation]
 * @property {boolean} [has_preparation]
 * @property {string} [preparation_headline]
 * @property {boolean} [has_preparation_headline]
 * @property {"Email" | "Push" | "Slack" | "Teams"} [last_minute_prep_type]
 * @property {string} [last_minute_prep_message_id]
 * @property {boolean} [has_last_minute_prep]
 * @property {string} [shares_email]
 * @property {string} [shares_created_at_from]
 * @property {string} [shares_created_at_to]
 * @property {boolean} [has_shares]
 * @property {string} [watchers_id]
 * @property {string} [watchers_name]
 * @property {boolean} [has_watchers]
 * @property {string[]} [tags]
 * @property {boolean} [has_tags]
 * @property {string[]} [label_ids]
 * @property {string[]} [not_label_ids]
 * @property {boolean} [has_labels]
 * @property {boolean} [sensitive]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {boolean} [has_tenant]
 * @property {string} [creator_id]
 * @property {string[]} [creator_ids]
 * @property {string} [creator_name]
 * @property {boolean} [has_creator]
 * @property {boolean} [has_archived_at]
 * @property {string} [archived_at_from]
 * @property {string} [archived_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {boolean} [only_active_calendars]
 * @property {number} [reporting_depth]
 * @property {string} [request_id]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} MeetingAccessResponse
 * @property {number} [num_of_shares]
 * @property {number} [num_of_participants]
 * @property {number} [num_of_managers]
 * @property {number} [num_of_collaborators]
 */

/**
 * @typedef {Object} MeetingResponse
 * @property {Meeting} [value]
 * @property {Bot} [bot]
 * @property {Card} [card]
 * @property {string} [videoUrl]
 */

/**
 * @typedef {Object} Explained
 * @property {string} [id]
 * @property {string} [title]
 * @property {string} [explanation]
 */

/**
 * @typedef {Object} InitiativeMatcherResponse
 * @property {ScoredInitiative[]} [values]
 * @property {ScoredInitiative[]} [discarded]
 * @property {Explained[]} [explanations]
 * @property {"invalid_json" | "no_content" | "no_results" | "success"} [explanations_code]
 * @property {string} [message]
 */

/**
 * @typedef {Object} ScoredInitiative
 * @property {Initiative} [value]
 * @property {number} [score]
 */

/**
 * @typedef {Object} ResultsParticipantStats
 * @property {number} [total]
 * @property {ParticipantStats[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ScoredMeeting
 * @property {Meeting} [value]
 * @property {number} [score]
 */

/**
 * @typedef {Object} MeetingPrepResponse
 * @property {Meeting} [value]
 * @property {Meeting} [prior]
 * @property {Card} [card]
 * @property {string} [notes]
 * @property {string} [headline]
 */

/**
 * @typedef {Object} MeetingRsvpRequest
 * @property {"yes" | "no" | "maybe"} status
 * @property {boolean} [notify]
 * @property {string} [comment]
 */

/**
 * @typedef {Object} ChannelMS
 * @property {string} [id]
 * @property {string} [displayName]
 * @property {string} [description]
 * @property {"PRIVATE" | "SHARED" | "STANDARD"} [membershipType]
 * @property {string} [createdDateTime]
 */

/**
 * @typedef {Object} ResultsChannelMS
 * @property {ChannelMS[]} [value]
 */

/**
 * @typedef {Object} ResultsTeam
 * @property {Team[]} [value]
 */

/**
 * @typedef {Object} Team
 * @property {string} [id]
 * @property {string} [displayName]
 * @property {string} [description]
 */

/**
 * @typedef {Object} Phrase
 * @property {string} [recognitionStatus]
 * @property {number} [channel]
 * @property {number} [speaker]
 * @property {string} [offset]
 * @property {string} [duration]
 * @property {number} [offsetInTicks]
 * @property {number} [durationInTicks]
 * @property {Segment[]} [nBest]
 */

/**
 * @typedef {Object} Segment
 * @property {string} [text]
 * @property {number} [start_timestamp]
 * @property {number} [end_timestamp]
 * @property {string} [language]
 * @property {number} [confidence]
 */

/**
 * @typedef {Object} Transcription
 * @property {string} [source]
 * @property {string} [timestamp]
 * @property {number} [durationInTicks]
 * @property {string} [duration]
 * @property {Segment[]} [combinedRecognizedPhrases]
 * @property {Phrase[]} [recognizedPhrases]
 */

/**
 * @typedef {Object} Diarization
 * @property {Speakers} [speakers]
 */

/**
 * @typedef {Object} Error
 * @property {string} [code]
 * @property {string} [message]
 */

/**
 * @typedef {Object} Properties
 * @property {Diarization} [diarization]
 * @property {boolean} [diarizationEnabled]
 * @property {"Masked" | "None" | "Removed" | "Tags"} [profanityFilterMode]
 * @property {"Automatic" | "Dictated" | "DictatedAndAutomatic" | "None"} [punctuationMode]
 * @property {string} [timeToLive]
 * @property {Error} [error]
 */

/**
 * @typedef {Object} Speakers
 * @property {number} [maxCount]
 * @property {number} [minCount]
 */

/**
 * @typedef {Object} TranscriptionRequest
 * @property {string} [displayName]
 * @property {string} [locale]
 * @property {string[]} [contentUrls]
 * @property {object} [customProperties]
 * @property {string} [description]
 * @property {Properties} [properties]
 */

/**
 * @typedef {Object} NylasAccount
 * @property {string} id
 * @property {string} access_token
 * @property {string} email_address
 * @property {string} [provider]
 * @property {Named} tenant
 * @property {Named} person
 * @property {string} [expired_at]
 * @property {string} [deleted_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} NylasAccountResponse
 * @property {NylasAccount} [value]
 * @property {number} [num_of_calendars]
 */

/**
 * @typedef {Object} NylasAccountSearchRequest
 * @property {string[]} [ids]
 * @property {string} [access_token]
 * @property {string} [email_address]
 * @property {string} [provider]
 * @property {boolean} [has_provider]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {string} [person_id]
 * @property {string} [person_name]
 * @property {boolean} [has_expired_at]
 * @property {string} [expired_at_from]
 * @property {string} [expired_at_to]
 * @property {boolean} [has_deleted_at]
 * @property {string} [deleted_at_from]
 * @property {string} [deleted_at_to]
 * @property {boolean} [available]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [request_id]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} ResultsNylasAccount
 * @property {number} [total]
 * @property {NylasAccount[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} AuthorizeRequest
 * @property {string} code
 * @property {string} redirectUri
 */

/**
 * @typedef {Object} EmptyResults
 * @property {string} [request_id]
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} email
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 * @property {Named[]} [tenants]
 * @property {boolean} [admin]
 * @property {boolean} [guest]
 * @property {boolean} [system]
 * @property {Person} [person]
 * @property {number} duration
 * @property {string} [expires_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} OAuthRequest
 * @property {string} accessToken
 * @property {string} idToken
 * @property {string} [domain]
 * @property {string} [realm]
 * @property {boolean} [rememberMe]
 * @property {boolean} [guest]
 */

/**
 * @typedef {Object} Opportunity
 * @property {string} id
 * @property {string} name
 * @property {string} [amount]
 * @property {"CSV" | "HubSpot" | "Salesforce"} source
 * @property {Company} company
 * @property {string} [stage_name]
 * @property {string} [probability]
 * @property {string} [pipeline]
 * @property {Owner} [contact]
 * @property {Owner} owner
 * @property {Named} tenant
 * @property {string} [closed_at]
 * @property {string} [modified_at]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} ResultsOpportunity
 * @property {number} [total]
 * @property {Opportunity[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} OpportunitySearchRequest
 * @property {string[]} [ids]
 * @property {string} [name]
 * @property {string} [amount]
 * @property {boolean} [has_amount]
 * @property {"CSV" | "HubSpot" | "Salesforce"} [source]
 * @property {string} [company_id]
 * @property {string} [company_name]
 * @property {string} [company_type]
 * @property {string} [company_domain]
 * @property {string} [company_industry]
 * @property {string} [stage_name]
 * @property {boolean} [has_stage_name]
 * @property {string} [probability]
 * @property {boolean} [has_probability]
 * @property {string} [pipeline]
 * @property {boolean} [has_pipeline]
 * @property {string} [contact_email]
 * @property {string} [contact_first_name]
 * @property {string} [contact_last_name]
 * @property {string} [contact_name]
 * @property {boolean} [has_contact]
 * @property {string} [owner_email]
 * @property {string} [owner_first_name]
 * @property {string} [owner_last_name]
 * @property {string} [owner_name]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {boolean} [has_closed_at]
 * @property {string} [closed_at_from]
 * @property {string} [closed_at_to]
 * @property {boolean} [has_modified_at]
 * @property {string} [modified_at_from]
 * @property {string} [modified_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} AuthenticationRequest
 * @property {string} email
 * @property {string} password
 * @property {boolean} [rememberMe]
 */

/**
 * @typedef {Object} PersonResponse
 * @property {Person} [value]
 * @property {Person} [manager]
 * @property {Person[]} [peers]
 * @property {Person[]} [reports]
 */

/**
 * @typedef {Object} PersonSearchRequest
 * @property {string[]} [ids]
 * @property {string[]} [not_ids]
 * @property {string} [query]
 * @property {string} [email]
 * @property {string} [email_x]
 * @property {string[]} [emails]
 * @property {string[]} [emails_or_groups]
 * @property {string} [first_name]
 * @property {boolean} [has_first_name]
 * @property {string} [last_name]
 * @property {boolean} [has_last_name]
 * @property {string} [name]
 * @property {boolean} [has_name]
 * @property {string} [title]
 * @property {boolean} [has_title]
 * @property {string} [location]
 * @property {boolean} [has_location]
 * @property {string} [department]
 * @property {string[]} [departments]
 * @property {boolean} [has_departments]
 * @property {string[]} [groups]
 * @property {string[]} [not_groups]
 * @property {boolean} [has_groups]
 * @property {string} [manager_id]
 * @property {string} [manager_name]
 * @property {boolean} [has_manager]
 * @property {string} [managers_id]
 * @property {string} [managers_name]
 * @property {boolean} [has_managers]
 * @property {number} [level]
 * @property {number} [level_from]
 * @property {number} [level_to]
 * @property {"Admin" | "Associate" | "Executive" | "Full"} [type]
 * @property {"Admin" | "Associate" | "Executive" | "Full"} [not_types]
 * @property {string} [context]
 * @property {boolean} [has_context]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {boolean} [has_tenants]
 * @property {boolean} [has_digest_configs]
 * @property {boolean} [has_digest_configs_morning]
 * @property {number} [digest_configs_morning_time_of_day]
 * @property {number} [digest_configs_morning_time_of_day_from]
 * @property {number} [digest_configs_morning_time_of_day_to]
 * @property {boolean} [has_digest_configs_evening]
 * @property {number} [digest_configs_evening_time_of_day]
 * @property {number} [digest_configs_evening_time_of_day_from]
 * @property {number} [digest_configs_evening_time_of_day_to]
 * @property {boolean} [digest_configs_last_minute_prep]
 * @property {string} [nylas_account_id]
 * @property {boolean} [has_nylas_account_id]
 * @property {boolean} [meeting_config_auto_schedule]
 * @property {boolean} [has_meeting_config_auto_schedule]
 * @property {boolean} [has_meeting_config]
 * @property {boolean} [push_config_enabled]
 * @property {boolean} [push_config_last_minute_prep]
 * @property {boolean} [push_config_my_pulses]
 * @property {boolean} [push_config_my_team_pulses]
 * @property {boolean} [push_config_live_activities]
 * @property {boolean} [has_push_config]
 * @property {string} [recall_config_zoom_oauth_credential_id]
 * @property {boolean} [has_recall_config_zoom_oauth_credential_id]
 * @property {boolean} [has_recall_config]
 * @property {number} [card_receipt_levels]
 * @property {number} [card_receipt_levels_from]
 * @property {number} [card_receipt_levels_to]
 * @property {string} [avatar_url]
 * @property {boolean} [has_avatar_url]
 * @property {string} [slack_channel]
 * @property {boolean} [has_slack_channel]
 * @property {string[]} [tags]
 * @property {boolean} [has_tags]
 * @property {string} [time_zone_id]
 * @property {boolean} [has_time_zone_id]
 * @property {string} [external_id]
 * @property {boolean} [has_external_id]
 * @property {boolean} [active]
 * @property {string} [creator_id]
 * @property {string} [creator_name]
 * @property {boolean} [has_creator]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {boolean} [only_info]
 * @property {string} [request_id]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} IdResponse
 * @property {string} [id]
 * @property {string} [external_id]
 * @property {object[]} [errors]
 */

/**
 * @typedef {Object} Aliases
 * @property {string[]} [external_id]
 */

/**
 * @typedef {Object} Contents
 * @property {string} en
 */

/**
 * @typedef {Object} PasswordRequest
 * @property {string} value
 * @property {string} newValue
 * @property {string} confirmValue
 */

/**
 * @typedef {Object} AudioResponse
 * @property {string} [id]
 * @property {number} [expires_at]
 * @property {string} [data]
 * @property {string} [transcript]
 */

/**
 * @typedef {Object} Choice
 * @property {string} [text]
 * @property {Messaged} [message]
 * @property {number} [index]
 * @property {number} [logprobs]
 * @property {string} [finish_reason]
 */

/**
 * @typedef {Object} CompletionResponse
 * @property {string} [id]
 * @property {string} [object]
 * @property {number} [created]
 * @property {string} [model]
 * @property {string} [system_fingerprint]
 * @property {Choice[]} [choices]
 * @property {Usage} [usage]
 */

/**
 * @typedef {Object} Messaged
 * @property {string} [role]
 * @property {string} [content]
 * @property {AudioResponse} [audio]
 */

/**
 * @typedef {Object} Usage
 * @property {string} id
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} provider
 * @property {"Completion" | "Embeddings"} type
 * @property {"Ask" | "Bot" | "Card" | "Channel" | "Initiative" | "Insight" | "Meeting" | "Transcript" | "Verify"} source
 * @property {string} source_id
 * @property {string} [source_key]
 * @property {string} model
 * @property {"none" | "low" | "medium" | "high"} [reasoning_effort]
 * @property {number} max_length
 * @property {number} temperature
 * @property {string} [prompt]
 * @property {string} [context]
 * @property {string[]} [values]
 * @property {"audio" | "json" | "text" | "vector"} response_type
 * @property {string} [system_fingerprint]
 * @property {number} prompt_tokens
 * @property {number} [completion_tokens]
 * @property {number} total_tokens
 * @property {Named} tenant
 * @property {Named} person
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {number} [num_of_values]
 */

/**
 * @typedef {Object} BotAskRequest
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [provider]
 * @property {string} [model]
 * @property {string} prompt
 * @property {string} [system]
 * @property {number} [maxLength]
 * @property {number} [temperature]
 * @property {boolean} [json]
 * @property {Schema} [schema]
 * @property {"none" | "low" | "medium" | "high"} [reasoning_effort]
 * @property {number} [startTime]
 * @property {number} [endTime]
 * @property {string} [field]
 * @property {string[]} values
 */

/**
 * @typedef {Object} Property
 * @property {"array" | "boolean" | "integer" | "number" | "object" | "string"} type
 * @property {Property} [items]
 * @property {object} [properties]
 * @property {string} [description]
 * @property {string[]} [enum]
 * @property {string[]} [required]
 * @property {boolean} [additionalProperties]
 */

/**
 * @typedef {Object} Schema
 * @property {string} name
 * @property {Property} schema
 * @property {boolean} [strict]
 */

/**
 * @typedef {Object} ZoomOAuthAppResponse
 * @property {string} [id]
 * @property {"user_level" | "account_level"} [kind]
 * @property {string} [client_id]
 * @property {string} [client_secret]
 * @property {string} [webhook_secret]
 * @property {string} [webhook_last_validation]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} ZoomOAuthAppRequest
 * @property {"user_level" | "account_level"} kind
 * @property {string} client_id
 * @property {string} client_secret
 * @property {string} webhook_secret
 */

/**
 * @typedef {Object} ZoomOAuthCredentialResponse
 * @property {string} [id]
 * @property {string} [oauth_app]
 * @property {"healthy" | "unhealthy"} [status]
 * @property {string} [user_id]
 * @property {string} [account_id]
 * @property {string} [access_token_callback_url]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} AuthCode
 * @property {string} code
 * @property {string} redirect_uri
 */

/**
 * @typedef {Object} Image
 * @property {string} [url]
 * @property {string} [b64_json]
 * @property {string} [revised_prompt]
 */

/**
 * @typedef {Object} ImageResponse
 * @property {number} [created]
 * @property {Image[]} [data]
 */

/**
 * @typedef {Object} ImageRequest
 * @property {string} prompt
 * @property {string} model
 * @property {number} [n]
 * @property {"hd" | "standard"} [quality]
 * @property {"b64_json" | "url"} [response_format]
 * @property {string} [size]
 * @property {"natural" | "vivid"} [style]
 * @property {string} [user]
 */

/**
 * @typedef {Object} ResultDouble[]
 * @property {number[]} [value]
 */

/**
 * @typedef {Object} GoogleLogin
 * @property {string} [id]
 * @property {string} [email]
 * @property {boolean} [is_active]
 * @property {string} [sso_v2_workspace_domain]
 * @property {string} [sso_v2_private_key]
 * @property {string} [sso_v2_cert]
 * @property {string} [group_id]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} GoogleLoginGroup
 * @property {string} [id]
 * @property {string} [name]
 * @property {"always" | "only_if_required"} [login_mode]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {GoogleLogin[]} [logins]
 */

/**
 * @typedef {Object} ResultsGoogleLoginGroup
 * @property {number} [count]
 * @property {string} [next]
 * @property {string} [previous]
 * @property {GoogleLoginGroup[]} [results]
 */

/**
 * @typedef {Object} ResultsZoomOAuthAppResponse
 * @property {number} [count]
 * @property {string} [next]
 * @property {string} [previous]
 * @property {ZoomOAuthAppResponse[]} [results]
 */

/**
 * @typedef {Object} BotResponse
 * @property {string} [id]
 * @property {string} [video_url]
 * @property {string} [media_retention_end]
 * @property {StatusChange[]} [status_changes]
 * @property {MeetingMetadata} [meeting_metadata]
 * @property {MeetingParticipant[]} [meeting_participants]
 * @property {object[]} [calendar_meetings]
 * @property {string} [calendar_user_id]
 * @property {TranscriptionOptions} [transcription_options]
 * @property {object} [meeting_url]
 * @property {string} [join_at]
 */

/**
 * @typedef {Object} Thumbs
 * @property {string} [id]
 * @property {string} [image_url]
 * @property {string} [video_url]
 */

/**
 * @typedef {Object} BotStats
 * @property {string} [id]
 * @property {number} [num_of_status_changes]
 * @property {number} [num_of_transcripts]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} ResultsBotStats
 * @property {number} [total]
 * @property {BotStats[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} BotSearchRequest
 * @property {string[]} [ids]
 * @property {string} [term]
 * @property {"Auto_By_Person" | "Auto_By_Tenant" | "Manual"} [origins]
 * @property {"Auto_By_Person" | "Auto_By_Tenant" | "Manual"} [not_origins]
 * @property {boolean} [has_origin]
 * @property {string} [earnings_call_symbol]
 * @property {string} [earnings_call_company_name]
 * @property {string} [earnings_call_domain]
 * @property {number} [earnings_call_quarter]
 * @property {number} [earnings_call_quarter_from]
 * @property {number} [earnings_call_quarter_to]
 * @property {number} [earnings_call_year]
 * @property {number} [earnings_call_year_from]
 * @property {number} [earnings_call_year_to]
 * @property {string} [earnings_call_released_at_from]
 * @property {string} [earnings_call_released_at_to]
 * @property {boolean} [has_earnings_call]
 * @property {string} [summary]
 * @property {string} [summary_prefix]
 * @property {boolean} [has_summary]
 * @property {boolean} [has_summary_vector]
 * @property {string} [summary_knn]
 * @property {string} [join_at_from]
 * @property {string} [join_at_to]
 * @property {boolean} [has_join_at]
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [request_provider]
 * @property {boolean} [has_request_provider]
 * @property {string[]} [status_changes_codes]
 * @property {string[]} [status_changes_sub_codes]
 * @property {string[]} [not_status_changes_codes]
 * @property {string[]} [not_status_changes_sub_codes]
 * @property {string} [status_changes_at_from]
 * @property {string} [status_changes_at_to]
 * @property {boolean} [has_status_changes]
 * @property {boolean} [has_participant]
 * @property {string} [followups_value]
 * @property {string} [followups_assignee]
 * @property {boolean} [has_followups]
 * @property {string} [speakers_name]
 * @property {number} [speakers_duration]
 * @property {number} [speakers_duration_from]
 * @property {number} [speakers_duration_to]
 * @property {string} [speakers_behavior]
 * @property {"balanced" | "strategic" | "tactical"} [speakers_demeanor]
 * @property {boolean} [has_speakers]
 * @property {string} [topics_title]
 * @property {string} [topics_details]
 * @property {string} [topics_speaker]
 * @property {boolean} [has_topics]
 * @property {string} [recap_headline]
 * @property {string} [recap_title]
 * @property {string} [recap_content]
 * @property {boolean} [has_recap]
 * @property {string} [tweet]
 * @property {boolean} [has_tweet]
 * @property {boolean} [has_highlights]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {boolean} [has_tenant]
 * @property {string} [creator_id]
 * @property {string} [creator_name]
 * @property {boolean} [has_creator]
 * @property {string} [createdAtFrom]
 * @property {string} [createdAtTo]
 * @property {boolean} [includeEmbeddings]
 * @property {boolean} [includeTranscript]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} Transcripted
 * @property {string} [speaker]
 * @property {Segment[]} [words]
 * @property {string} [language]
 */

/**
 * @typedef {Object} AccessToken
 * @property {string} [token]
 * @property {string} [expires_at]
 */

/**
 * @typedef {Object} ResultsZoomOAuthCredentialResponse
 * @property {number} [count]
 * @property {string} [next]
 * @property {string} [previous]
 * @property {ZoomOAuthCredentialResponse[]} [results]
 */

/**
 * @typedef {Object} Audio
 * @property {"mp3"} kind
 * @property {string} b64_data
 */

/**
 * @typedef {Object} TranscriptCallback
 * @property {string} event
 * @property {TranscriptCallbackData} data
 */

/**
 * @typedef {Object} TranscriptCallbackData
 * @property {string} bot_id
 * @property {StatusChange} [status]
 * @property {Transcript} [transcript]
 */

/**
 * @typedef {Object} ResultsBot
 * @property {number} [total]
 * @property {Bot[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} ChatRequest
 * @property {"everyone" | "everyone_except_host" | "host"} [to]
 * @property {string} message
 */

/**
 * @typedef {Object} HighlightsRequest
 * @property {string} tweet
 * @property {Highlight[]} highlights
 */

/**
 * @typedef {Object} ResultsSession
 * @property {number} [total]
 * @property {Session[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} SessionSearchRequest
 * @property {string[]} [ids]
 * @property {string} [email]
 * @property {string} [first_name]
 * @property {boolean} [has_first_name]
 * @property {string} [last_name]
 * @property {boolean} [has_last_name]
 * @property {string} [name]
 * @property {boolean} [has_name]
 * @property {string[]} [tenant_ids]
 * @property {string} [tenant_name]
 * @property {boolean} [has_tenants]
 * @property {boolean} [admin]
 * @property {boolean} [guest]
 * @property {boolean} [system]
 * @property {string} [person_id]
 * @property {string} [person_name]
 * @property {string} [person_nylas_account_id]
 * @property {boolean} [has_person]
 * @property {number} [duration]
 * @property {number} [duration_from]
 * @property {number} [duration_to]
 * @property {string} [expires_at_from]
 * @property {string} [expires_at_to]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} ChannelS
 * @property {string} [id]
 * @property {string} [name]
 * @property {number} [priority]
 * @property {number} [unlinked]
 * @property {number} [num_members]
 * @property {string} [name_normalized]
 * @property {string[]} [pending_shared]
 * @property {string[]} [previous_names]
 * @property {boolean} [is_channel]
 * @property {boolean} [is_group]
 * @property {boolean} [is_im]
 * @property {boolean} [is_archived]
 * @property {boolean} [is_general]
 * @property {boolean} [is_shared]
 * @property {boolean} [is_ext_shared]
 * @property {boolean} [is_org_shared]
 * @property {boolean} [is_pending_ext_shared]
 * @property {boolean} [is_member]
 * @property {boolean} [is_private]
 * @property {boolean} [is_mpim]
 * @property {boolean} [is_user_deleted]
 * @property {Value} [topic]
 * @property {Value} [purpose]
 * @property {string} [user]
 * @property {string} [creator]
 * @property {number} [created]
 * @property {number} [updated]
 */

/**
 * @typedef {Object} ChannelsResponse
 * @property {boolean} [ok]
 * @property {ChannelS[]} [channels]
 * @property {ResponseMetadata} [response_metadata]
 */

/**
 * @typedef {Object} ResponseMetadata
 * @property {string} [next_cursor]
 */

/**
 * @typedef {Object} Value
 * @property {string} [value]
 * @property {number} [last_set]
 * @property {string} [creator]
 */

/**
 * @typedef {Object} HubSpotConfig
 * @property {"bearer"} token_type
 * @property {string} access_token
 * @property {string} refresh_token
 * @property {number} [expires_in]
 */

/**
 * @typedef {Object} SalesforceConfig
 * @property {string} id
 * @property {string} access_token
 * @property {string} refresh_token
 * @property {string} signature
 * @property {string} scope
 * @property {string} id_token
 * @property {string} instance_url
 * @property {string} token_type
 * @property {number} [issued_at]
 */

/**
 * @typedef {Object} Tenant
 * @property {string} id
 * @property {string} name
 * @property {BotCreationRequest} [bot_creation_request]
 * @property {TenantCardConfig} [card_config]
 * @property {HubSpotConfig} [hubspot_config]
 * @property {TenantLensConfig} [lens_config]
 * @property {TenantRecallConfig} [recall_config]
 * @property {SalesforceConfig} [salesforce_config]
 * @property {TenantSlackConfig} [slack_config]
 * @property {TenantSlackConfig} [teams_config]
 * @property {TenantMeetingConfig} [meeting_config]
 * @property {TenantInternalConfig} [internal_config]
 * @property {string[]} [domains]
 * @property {string} [time_zone_id]
 * @property {boolean} active
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} TenantCardConfig
 * @property {string} [context]
 * @property {string} [persona]
 * @property {string} [context_template]
 * @property {string} [prompt_template]
 * @property {string} [headline_template]
 * @property {string} [subheadline_template]
 * @property {string} [insight_template]
 * @property {string[]} [insight_templates]
 * @property {string} [lens_prompt_template]
 * @property {string} [lens_headline_template]
 * @property {string} [lens_subheadline_template]
 * @property {string} [lens_insight_template]
 * @property {string} [model]
 * @property {number} [max_length]
 * @property {number} [temperature]
 * @property {string} [field]
 * @property {boolean} [use_bot_recap]
 */

/**
 * @typedef {Object} TenantInternalConfig
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} TenantLensConfig
 * @property {boolean} [enabled]
 * @property {boolean} [auto_prioritize]
 * @property {number} [max_lenses]
 * @property {string} [prompt_relevance]
 * @property {string} [prompt_high_priority_matcher]
 * @property {string} [prompt_verification_template]
 */

/**
 * @typedef {Object} TenantMeetingConfig
 * @property {boolean} [auto_schedule]
 * @property {string[]} [never_domains]
 * @property {string[]} [never_titles]
 * @property {string[]} [only_organizer_domains]
 * @property {string[]} [not_organizer_domains]
 * @property {string[]} [sensitive_organizers]
 * @property {boolean} [always_sensitive]
 * @property {string} [prep_prompt_external]
 * @property {string} [prep_prompt_internal]
 * @property {string} [prep_prompt_recurring]
 * @property {string} [prep_prompt_headline]
 */

/**
 * @typedef {Object} TenantRecallConfig
 * @property {string} [google_login_group_id]
 * @property {boolean} [use_google_api_access]
 * @property {boolean} [microsoft_teams_enabled]
 * @property {string} [zoom_oauth_credential_id]
 */

/**
 * @typedef {Object} TenantSlackConfig
 * @property {string} access_token
 * @property {string} alert_channel
 * @property {Token[]} [access_tokens]
 */

/**
 * @typedef {Object} ResultsTenant
 * @property {number} [total]
 * @property {Tenant[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} TenantSearchRequest
 * @property {string[]} [ids]
 * @property {string} [name]
 * @property {boolean} [has_bot_creation_request]
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [bot_creation_request_provider]
 * @property {boolean} [has_bot_creation_request_provider]
 * @property {boolean} [card_config_use_bot_recap]
 * @property {boolean} [has_card_config]
 * @property {"bearer"} [hubspot_config_token_type]
 * @property {string} [hubspot_config_access_token]
 * @property {string} [hubspot_config_refresh_token]
 * @property {number} [hubspot_config_expires_in]
 * @property {boolean} [has_hubspot_config]
 * @property {boolean} [lens_config_enabled]
 * @property {boolean} [lens_config_auto_prioritize]
 * @property {number} [lens_config_max_lenses]
 * @property {number} [lens_config_max_lenses_from]
 * @property {number} [lens_config_max_lenses_to]
 * @property {boolean} [has_lens_config_max_lenses]
 * @property {string} [lens_config_prompt_relevance]
 * @property {boolean} [has_lens_config_prompt_relevance]
 * @property {string} [lens_config_prompt_high_priority_matcher]
 * @property {boolean} [has_lens_config_prompt_high_priority_matcher]
 * @property {string} [lens_config_prompt_verification_template]
 * @property {boolean} [has_lens_config_prompt_verification_template]
 * @property {boolean} [has_lens_config]
 * @property {string} [recall_config_google_login_group_id]
 * @property {boolean} [has_recall_config_google_login_group_id]
 * @property {boolean} [recall_config_use_google_api_access]
 * @property {boolean} [recall_config_microsoft_teams_enabled]
 * @property {string} [recall_config_zoom_oauth_credential_id]
 * @property {boolean} [has_recall_config_zoom_oauth_credential_id]
 * @property {boolean} [has_recall_config]
 * @property {string} [salesforce_config_id]
 * @property {boolean} [has_salesforce_config]
 * @property {string} [slack_config_access_token]
 * @property {string} [slack_config_alert_channel]
 * @property {string} [slack_config_access_tokens_name]
 * @property {string} [slack_config_access_tokens_value]
 * @property {boolean} [has_slack_config_access_tokens]
 * @property {boolean} [has_slack_config]
 * @property {string} [teams_config_access_token]
 * @property {string} [teams_config_alert_channel]
 * @property {string} [teams_config_access_tokens_name]
 * @property {string} [teams_config_access_tokens_value]
 * @property {boolean} [has_teams_config_access_tokens]
 * @property {boolean} [has_teams_config]
 * @property {boolean} [meeting_config_auto_schedule]
 * @property {string} [meeting_config_never_domains]
 * @property {boolean} [has_meeting_config_never_domains]
 * @property {string} [meeting_config_never_titles]
 * @property {boolean} [has_meeting_config_never_titles]
 * @property {string} [meeting_config_only_organizer_domains]
 * @property {boolean} [has_meeting_config_only_organizer_domains]
 * @property {string} [meeting_config_not_organizer_domains]
 * @property {boolean} [has_meeting_config_not_organizer_domains]
 * @property {string} [meeting_config_sensitive_organizers]
 * @property {boolean} [has_meeting_config_sensitive_organizers]
 * @property {boolean} [meeting_config_always_sensitive]
 * @property {string} [meeting_config_prep_prompt_external]
 * @property {boolean} [has_meeting_config_prep_prompt_external]
 * @property {string} [meeting_config_prep_prompt_internal]
 * @property {boolean} [has_meeting_config_prep_prompt_internal]
 * @property {string} [meeting_config_prep_prompt_recurring]
 * @property {boolean} [has_meeting_config_prep_prompt_recurring]
 * @property {string} [meeting_config_prep_prompt_headline]
 * @property {boolean} [has_meeting_config_prep_prompt_headline]
 * @property {boolean} [has_meeting_config]
 * @property {string[]} [internal_config_tags]
 * @property {string[]} [not_internal_config_tags]
 * @property {boolean} [has_internal_config_tags]
 * @property {boolean} [has_internal_config]
 * @property {string[]} [domains]
 * @property {boolean} [has_domains]
 * @property {string} [time_zone_id]
 * @property {boolean} [has_time_zone_id]
 * @property {boolean} [active]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */

/**
 * @typedef {Object} ResultsUsage
 * @property {number} [total]
 * @property {Usage[]} [data]
 * @property {string} [scrollId]
 * @property {object} [scores]
 * @property {object} [highlights]
 */

/**
 * @typedef {Object} UsageSearchRequest
 * @property {string[]} [ids]
 * @property {"AzureAI" | "Bedrock" | "Gemini" | "OpenAI" | "PaLM"} [provider]
 * @property {"Completion" | "Embeddings"} [type]
 * @property {"Ask" | "Bot" | "Card" | "Channel" | "Initiative" | "Insight" | "Meeting" | "Transcript" | "Verify"} [source]
 * @property {string} [source_id]
 * @property {string} [source_key]
 * @property {boolean} [has_source_key]
 * @property {string} [model]
 * @property {"none" | "low" | "medium" | "high"} [reasoning_efforts]
 * @property {"none" | "low" | "medium" | "high"} [not_reasoning_efforts]
 * @property {boolean} [has_reasoning_effort]
 * @property {number} [max_length]
 * @property {number} [max_length_from]
 * @property {number} [max_length_to]
 * @property {number} [temperature_from]
 * @property {number} [temperature_to]
 * @property {string} [prompt]
 * @property {boolean} [has_prompt]
 * @property {string} [context]
 * @property {boolean} [has_context]
 * @property {string} [value]
 * @property {boolean} [has_values]
 * @property {number} [num_of_values]
 * @property {number} [num_of_values_from]
 * @property {number} [num_of_values_to]
 * @property {"audio" | "json" | "text" | "vector"} [response_type]
 * @property {string} [system_fingerprint]
 * @property {boolean} [has_system_fingerprint]
 * @property {number} [prompt_tokens]
 * @property {number} [prompt_tokens_from]
 * @property {number} [prompt_tokens_to]
 * @property {number} [completion_tokens]
 * @property {boolean} [has_completion_tokens]
 * @property {number} [completion_tokens_from]
 * @property {number} [completion_tokens_to]
 * @property {number} [total_tokens]
 * @property {number} [total_tokens_from]
 * @property {number} [total_tokens_to]
 * @property {string} [tenant_id]
 * @property {string} [tenant_name]
 * @property {string} [person_id]
 * @property {string} [person_name]
 * @property {string} [created_at_from]
 * @property {string} [created_at_to]
 * @property {string} [updated_at_from]
 * @property {string} [updated_at_to]
 * @property {boolean} [includeValues]
 * @property {string} [sort]
 * @property {boolean} [asc]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [scroll]
 */
