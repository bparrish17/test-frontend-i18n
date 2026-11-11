import { isSafariMobile, toSelectOptions, pluralized } from '@util/helpers';

describe('isSafariMobile', () => {
  it('should return true for Safari on iOS', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    const selectOptions = isSafariMobile(userAgent);
    expect(selectOptions).toBe(true);
  });

  it('should return false for Safari on macOS', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15';
    const selectOptions = isSafariMobile(userAgent);
    expect(selectOptions).toBe(false);
  });

  it('should return false for Chrome-based browsers on iOS', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/132.0.6834.100 Mobile/15E148 Safari/604.1';
    const selectOptions = isSafariMobile(userAgent);
    expect(selectOptions).toBe(false);
  });
});

describe('toSelectOptions', () => {
  const option1 = { id: 1, name: 'Option 1' };
  const option2 = { id: 2, name: 'Option 2' };
  it('should convert array of objects to select options', () => {
    const options = [option1, option2];
    const expectedOutput = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 }
    ];
    const selectOptions = toSelectOptions('id', 'name')(options);
    expect(selectOptions).toEqual(expectedOutput);
  });

  it('should keep the body of the object if shouldKeepBody is true', () => {
    const options = [
      { ...option1, extra: 'extra1' },
      { ...option2, extra: 'extra2' }
    ];
    const expectedOutput = [
      { label: 'Option 1', value: 1, ...option1, extra: 'extra1' },
      { label: 'Option 2', value: 2, ...option2, extra: 'extra2' }
    ];
    const selectOptions = toSelectOptions('id', 'name', true)(options);
    expect(selectOptions).toEqual(expectedOutput);
  });

  it('should return nested property names if provided as array arguments', () => {
    const options = [{ value: option1 }, { value: option2 }];
    const expectedOutput = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 }
    ];
    expect(toSelectOptions(['value', 'id'], ['value', 'name'])(options)).toEqual(expectedOutput);
  });

  it("should return nested property names if provided as period-separated strings (e.g. 'hello.world')", () => {
    const options = [{ value: option1 }, { value: option2 }];
    const expectedOutput = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 }
    ];
    expect(toSelectOptions('value.id', 'value.name')(options)).toEqual(expectedOutput);
  });

  it('should return the options if it is not an array', () => {
    const options = 'not an array';
    const selectOptions = toSelectOptions('id', 'name')(options);
    expect(selectOptions).toBe(options);
  });

  it('should return the options if it is null or undefined', () => {
    expect(toSelectOptions('id', 'name')(null)).toBeNull();
    expect(toSelectOptions('id', 'name')(undefined)).toBeUndefined();
  });
});

describe('pluralized', () => {
  // Basic singular case
  it('should return singular form for count of 1', () => {
    expect(pluralized('meeting', 1)).toBe('1 meeting');
    expect(pluralized('person', 1)).toBe('1 person');
    expect(pluralized('summary', 1)).toBe('1 summary');
  });

  // Basic plural case
  it('should return plural form for count greater than 1', () => {
    expect(pluralized('meeting', 2)).toBe('2 meetings');
    expect(pluralized('person', 3)).toBe('3 people');
    expect(pluralized('summary', 10)).toBe('10 summaries');
  });

  // Zero case
  it('should return plural form for count of 0', () => {
    expect(pluralized('meeting', 0)).toBe('0 meetings');
    expect(pluralized('person', 0)).toBe('0 people');
    expect(pluralized('summary', 0)).toBe('0 summaries');
  });

  // Irregular plurals
  it('should handle irregular plurals correctly', () => {
    expect(pluralized('child', 2)).toBe('2 children');
    expect(pluralized('foot', 3)).toBe('3 feet');
    expect(pluralized('tooth', 4)).toBe('4 teeth');
    expect(pluralized('goose', 5)).toBe('5 geese');
  });

  // Already plural terms
  it('should handle already plural terms', () => {
    expect(pluralized('species', 1)).toBe('1 species');
    expect(pluralized('series', 2)).toBe('2 series');
  });

  // Uncountable nouns
  it('should handle uncountable nouns', () => {
    expect(pluralized('equipment', 1)).toBe('1 equipment');
    expect(pluralized('information', 5)).toBe('5 information');
  });

  // Structure option
  it('should return structured object when struct option is true', () => {
    const result1 = pluralized('meeting', 1, { struct: true });
    expect(result1).toEqual({
      count: 1,
      noun: 'meeting'
    });

    const result2 = pluralized('person', 5, { struct: true });
    expect(result2).toEqual({
      count: 5,
      noun: 'people'
    });
  });

  // Testing with specific examples from the component
  it('should handle specific examples from the Recently Met With component', () => {
    // Test cases observed in new-recently-met-with.component.jsx
    expect(pluralized('meeting', 5)).toBe('5 meetings');
    expect(pluralized('summary', 3)).toBe('3 summaries');
    expect(pluralized('Person', 2)).toBe('2 People');
    expect(pluralized('Company', 3)).toBe('3 Companies');
  });
});
