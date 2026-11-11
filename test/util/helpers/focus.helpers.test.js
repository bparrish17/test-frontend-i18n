import { describe, it, expect } from 'vitest';
import {
  convertRuleFormValuesToRuleset,
  convertMatchRulesToRulesets,
  convertRulesetsToMatchRules,
  toMatchRule,
  toRuleset
} from '@util/helpers';

const WILDCARD_CHAR = '.*';

const fakeRulesets = [
  {
    type: 'only_domains',
    required: false,
    value: 'test.com',
    min_occurrences: null
  },
  {
    type: 'only_domains',
    required: false,
    value: 'hello.org',
    min_occurrences: 1
  },
  {
    type: 'never_domains',
    required: false,
    value: 'fedex.com',
    min_occurrences: null
  },
  {
    type: 'domains',
    required: false,
    value: 'abcd.io',
    min_occurrences: 1
  },
  {
    type: 'emails',
    required: false,
    value: 'john.smith@gmail.com',
    min_occurrences: null
  },
  {
    type: 'organizers',
    required: false,
    value: 'admin@gmail.com',
    min_occurrences: null
  },
  {
    type: 'organizers',
    required: false,
    value: 'subadmin@gmail.com',
    min_occurrences: null
  },
  {
    type: 'never_domains',
    required: false,
    value: 'disney.com',
    min_occurrences: null
  }
];

const fakeMatchRules = {
  titles: null,
  domains: [
    {
      required: false,
      value: 'abcd.io',
      min_occurrences: 1
    }
  ],
  only_domains: ['test.com', 'hello.org'],
  not_domains: null,
  never_domains: ['fedex.com', 'disney.com'],
  emails: [
    {
      required: false,
      value: 'john.smith@gmail.com',
      min_occurrences: 1
    }
  ],
  organizers: [
    {
      required: false,
      value: 'admin@gmail.com',
      min_occurrences: 1
    },
    {
      required: false,
      value: 'subadmin@gmail.com',
      min_occurrences: 1
    }
  ],
  schedule: false
};

describe('toMatchRule', () => {
  it('should return the value directly for "never_domains" type', () => {
    const rule = { type: 'never_domains', value: 'example.com', required: true };
    const result = toMatchRule(rule);
    expect(result).toBe('example.com');
  });

  it('should return the value directly for "only_domains" type', () => {
    const rule = { type: 'only_domains', value: 'example.org', required: false };
    const result = toMatchRule(rule);
    expect(result).toBe('example.org');
  });

  it('should return a match rule with wildcard symbols for "titles" type', () => {
    const rule = { type: 'titles', value: 'keyword', required: true, min_occurrences: 2 };
    const result = toMatchRule(rule);
    expect(result).toEqual({
      value: `${WILDCARD_CHAR}keyword${WILDCARD_CHAR}`,
      required: true,
      min_occurrences: 2
    });
  });

  it('should return a match rule without wildcard symbols for other types', () => {
    const rule = { type: 'domains', value: 'example.net', required: false, min_occurrences: 3 };
    const result = toMatchRule(rule);
    expect(result).toEqual({
      value: 'example.net',
      required: false,
      min_occurrences: 3
    });
  });

  it('should set min_occurrences to 1 if not provided', () => {
    const rule = { type: 'emails', value: 'user@example.com', required: true };
    const result = toMatchRule(rule);
    expect(result).toEqual({
      value: 'user@example.com',
      required: true,
      min_occurrences: 1
    });
  });
});

describe('toRuleset', () => {
  it('should take value directly from "never_domains" and "only_domains" types', () => {
    const neverRuleGroup = ['example1.com', 'example2.org'];
    const resultNever = toRuleset(neverRuleGroup, 'never_domains');

    expect(resultNever).toEqual([
      { id: expect.any(String), type: 'never_domains', value: 'example1.com' },
      { id: expect.any(String), type: 'never_domains', value: 'example2.org' }
    ]);

    const onlyRuleGroup = ['example.com', 'example.org'];
    const resultOnly = toRuleset(onlyRuleGroup, 'only_domains');

    expect(resultOnly).toEqual([
      { id: expect.any(String), type: 'only_domains', value: 'example.com' },
      { id: expect.any(String), type: 'only_domains', value: 'example.org' }
    ]);
  });

  it('should handle "titles" type and trim wildcard characters', () => {
    const ruleGroup = [
      { value: `${WILDCARD_CHAR}keyword${WILDCARD_CHAR}`, min_occurrences: 2, required: true }
    ];
    const ruleType = 'titles';
    const result = toRuleset(ruleGroup, ruleType);

    expect(result).toEqual([
      {
        id: expect.any(String),
        type: 'titles',
        min_occurrences: 2,
        value: 'keyword',
        required: true
      }
    ]);
  });

  it('should handle other rule types without trimming', () => {
    const ruleGroup = [{ value: 'example.net', min_occurrences: 3, required: false }];
    const ruleType = 'domains';
    const result = toRuleset(ruleGroup, ruleType);

    expect(result).toEqual([
      {
        id: expect.any(String),
        type: 'domains',
        min_occurrences: 3,
        value: 'example.net',
        required: false
      }
    ]);
  });
});

describe('convertRuleFormValuesToRuleset', () => {
  it('returns ruleset with valid formValues', () => {
    const rulesets = {
      automateBy: 'titles',
      titles: [{ value: 'CEO' }, { value: 'Manager' }],
      isRequired: true
    };
    const result = convertRuleFormValuesToRuleset(rulesets);
    expect(result).toEqual([
      { type: 'titles', required: true, value: 'CEO', min_occurrences: null },
      { type: 'titles', required: true, value: 'Manager', min_occurrences: null }
    ]);
  });

  it('returns an empty array when ruleValues is empty', () => {
    const rulesets = {
      automateBy: 'titles',
      titles: [],
      isRequired: false
    };
    const result = convertRuleFormValuesToRuleset(rulesets);
    expect(result).toEqual([]);
  });

  it('handles ruleValues with invitees', () => {
    const rulesets = {
      automateBy: 'titles',
      titles: [{ value: 'CEO', invitees: '5' }],
      isRequired: true
    };
    const result = convertRuleFormValuesToRuleset(rulesets);
    expect(result).toEqual([{ type: 'titles', required: true, value: 'CEO', min_occurrences: 5 }]);
  });

  it('returns an empty array when automateBy is missing', () => {
    const rulesets = {
      titles: [{ value: 'CEO' }],
      isRequired: true
    };
    const result = convertRuleFormValuesToRuleset(rulesets);
    expect(result).toEqual([]);
  });
});

describe('convertMatchRulesToRulesets', () => {
  it('should convert match rules to rulesets correctly', () => {
    const matchRules = {
      titles: [
        { value: 'title1', min_occurrences: 1, required: true },
        { value: 'title2', min_occurrences: 2, required: false }
      ],
      domains: [{ value: 'domain1.com', min_occurrences: 1, required: true }],
      not_domains: [{ value: 'notdomain1.com', min_occurrences: 1, required: false }],
      never_domains: ['neverdomain1.com', 'neverdomain2.com'],
      emails: [{ value: 'email@example.com', min_occurrences: 1, required: true }],
      schedule: true
    };

    const result = convertMatchRulesToRulesets(matchRules);

    expect(result).toEqual({
      rulesets: [
        {
          id: expect.any(String),
          type: 'titles',
          value: 'title1',
          min_occurrences: 1,
          required: true
        },
        {
          id: expect.any(String),
          type: 'titles',
          value: 'title2',
          min_occurrences: 2,
          required: false
        },
        {
          id: expect.any(String),
          type: 'domains',
          value: 'domain1.com',
          min_occurrences: 1,
          required: true
        },
        {
          id: expect.any(String),
          type: 'not_domains',
          value: 'notdomain1.com',
          min_occurrences: 1,
          required: false
        },
        { id: expect.any(String), type: 'never_domains', value: 'neverdomain1.com' },
        { id: expect.any(String), type: 'never_domains', value: 'neverdomain2.com' },
        {
          id: expect.any(String),
          type: 'emails',
          value: 'email@example.com',
          min_occurrences: 1,
          required: true
        }
      ],
      schedule: true
    });
  });

  it('should handle empty match rules', () => {
    const matchRules = {};
    const result = convertMatchRulesToRulesets(matchRules);
    expect(result).toEqual({ rulesets: [], schedule: undefined });
  });

  it('should handle null match rules', () => {
    const result = convertMatchRulesToRulesets(null);
    expect(result).toEqual({ rulesets: [], schedule: undefined });
  });

  it('should include schedule if present', () => {
    const matchRules = { schedule: false };
    const result = convertMatchRulesToRulesets(matchRules);
    expect(result).toEqual({ rulesets: [], schedule: false });
  });

  it('should handle missing optional fields in match rules', () => {
    const matchRules = {
      titles: [
        { value: 'title1' } // Missing `min_occurrences` and `required`
      ]
    };

    const result = convertMatchRulesToRulesets(matchRules);
    expect(result).toEqual({
      rulesets: [
        {
          id: expect.any(String),
          type: 'titles',
          value: 'title1',
          min_occurrences: undefined,
          required: undefined
        }
      ],
      schedule: undefined
    });
  });
});

describe('convertRulesetsToMatchRules', () => {
  it('should convert a simple ruleset to match rules', () => {
    expect(convertRulesetsToMatchRules(fakeRulesets, false)).toEqual(fakeMatchRules);
  });

  it('should return null if empty ruleset', () => {
    expect(convertRulesetsToMatchRules([])).toEqual(null);
  });

  it('should set schedule to provided addToMeetings flag', () => {
    expect(convertRulesetsToMatchRules(fakeRulesets, true).schedule).toBe(true);
  });
});
