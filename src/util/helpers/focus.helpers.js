import { groupBy, omit, uniqueId, some, trim } from 'lodash-es';
import { ICON_MAPPING } from '@util/constants';

const WILDCARD_CHAR = '.*';
/**
 * Converts initiative.match_rule back to user-friendly viewable ruleset
 * that matches the creation/edit/deletion flow
 * @param {Omit<Rule, 'type'>[]} ruleGroup
 * @param {RuleType} ruleType
 * @returns {Rule[]}
 */
export const toRuleset = (ruleGroup, ruleType) => {
  return (ruleGroup ?? []).map((rg) => {
    if (ruleType === 'never_domains' || ruleType === 'only_domains') {
      return { id: uniqueId(), type: ruleType, value: rg };
    }
    return {
      id: uniqueId(),
      type: ruleType,
      min_occurrences: rg.min_occurrences,
      value: ruleType === 'titles' ? trim(rg.value, WILDCARD_CHAR) : rg.value,
      required: rg.required
    };
  });
};

export function convertMatchRulesToRulesets(matchRules) {
  const titles = toRuleset(matchRules?.titles, 'titles');
  const domains = toRuleset(matchRules?.domains, 'domains');
  const notDomains = toRuleset(matchRules?.not_domains, 'not_domains');
  const onlyDomains = toRuleset(matchRules?.only_domains, 'only_domains');
  const neverDomains = toRuleset(matchRules?.never_domains, 'never_domains');
  const emails = toRuleset(matchRules?.emails, 'emails');
  const organizers = toRuleset(matchRules?.organizers, 'organizers');

  return {
    rulesets: [
      ...titles,
      ...domains,
      ...notDomains,
      ...onlyDomains,
      ...neverDomains,
      ...emails,
      ...organizers
    ],
    schedule: matchRules?.schedule
  };
}

/**
 * @param {Rule} rule
 * @returns {MatchRule}
 * Returns a match rule
 * - Adds startsWith and endsWith wildcard symbols to start and end of titles (keywords)
 */
export const toMatchRule = (rule) => {
  if (rule?.type === 'never_domains' || rule?.type === 'only_domains') {
    return rule?.value;
  } else {
    return {
      ...omit(rule, ['type', 'id']),
      value:
        rule?.type === 'titles' ? `${WILDCARD_CHAR}${rule?.value}${WILDCARD_CHAR}` : rule?.value,
      min_occurrences: rule?.min_occurrences ?? 1
    };
  }
};

export function addRulesetToMatchRules(ruleset, existingMatchRules) {
  if (!existingMatchRules) existingMatchRules = {};
  const rulesetType = ruleset[0].type;
  const newMatchRules = ruleset.map(toMatchRule);

  const convert = (matchRuleType) => {
    if (matchRuleType === rulesetType) {
      // e.g. if at least one value for "emails" in current focus.match_rules, add it to that array
      return [...(existingMatchRules[matchRuleType] ?? []), ...newMatchRules];
    } else {
      // otherwise gotta create a new property on the match_rules object for that matchRuleType
      return existingMatchRules[matchRuleType] ?? null;
    }
  };
  return {
    titles: convert('titles'),
    domains: convert('domains'),
    only_domains: convert('only_domains'),
    not_domains: convert('not_domains'),
    never_domains: convert('never_domains'),
    emails: convert('emails'),
    organizers: convert('organizers'),
    schedule: existingMatchRules.schedule
  };
}

// removes type from object and groups by titles, domains, and emails
export function convertRulesetsToMatchRules(rulesets, addToMeetings) {
  const groupedRulesets = groupBy(rulesets, 'type');
  const clean = (ruleset) => (ruleset ? ruleset.map(toMatchRule) : null);
  const matchRules = {
    titles: clean(groupedRulesets.titles),
    domains: clean(groupedRulesets.domains),
    only_domains: clean(groupedRulesets.only_domains),
    not_domains: clean(groupedRulesets.not_domains),
    never_domains: clean(groupedRulesets.never_domains),
    emails: clean(groupedRulesets.emails),
    organizers: clean(groupedRulesets.organizers),
    schedule: addToMeetings
  };
  if (some(matchRules, (rules) => !!rules && rules.length > 0)) {
    return matchRules;
  } else {
    // match_rules cannot all be empty. If none remaining, return null
    return null;
  }
}

export function convertRuleFormValuesToRuleset(formValues) {
  const ruleType = formValues.automateBy;
  const ruleValues = formValues[ruleType];

  if (ruleValues?.length) {
    return ruleValues.map((rv) => ({
      type: ruleType,
      required: formValues.isRequired,
      value: rv.value,
      min_occurrences: rv.invitees ? Number(rv.invitees) : null
    }));
  } else {
    return [];
  }
}

/**
 * @param {RuleType} ruleType
 * @returns {string}
 */
export function getRuleTypeLabel(ruleType) {
  const ruleTypeLabelMap = {
    titles: 'Keywords',
    domains: 'Organization Is',
    only_domains: 'Organization Can Only Be',
    not_domains: 'Organization Is Not',
    never_domains: 'Organization Can Never Be',
    emails: 'Meeting Attendee Email Is',
    organizers: 'Meeting Organizer Email Is'
  };
  return ruleTypeLabelMap[ruleType];
}

export function getLensIconComponent(lens, defaultIcon = 'book') {
  const iconName = lens?.icon || defaultIcon;
  return ICON_MAPPING[iconName]?.icon || null;
}

/**
 * @typedef {'titles' | 'domains' | 'not_domains' | 'only_domains' | 'never_domains' | 'emails'} RuleType
 *
 * @typedef {Object} Rule
 * @property {string} value
 * @property {RuleType} type
 * @property {boolean} required
 * @property {number} min_occurrences
 *
 * @typedef {Omit<Rule, 'type'> | string} MatchRule
 * 
 * 

SWAGGER MATCH RULES
"match_rules": {
  "titles": [
    {
      "value": "string",
      "min_occurrences": 30,
      "required": true
    }
  ],
  "domains": [
    {
      "value": "string",
      "min_occurrences": 30,
      "required": true
    }
  ],
  "not_domains": [
    {
      "value": "string",
      "min_occurrences": 30,
      "required": true
    }
  ],
  "never_domains": [
    "string"
  ],
  "emails": [
    {
      "value": "string",
      "min_occurrences": 30,
      "required": true
    }
  ],
  "schedule": true
}
 */
