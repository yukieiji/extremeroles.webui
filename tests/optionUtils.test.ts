import { describe, it, expect } from 'vitest';
import { getOptionPairType, getBaseOptionName, groupOptionPairs, findClosestIndex, getOptionLabel } from '../src/logics/optionUtils';
import type { ExROptionDto } from '../src/type';

describe('optionUtils', () => {
  describe('getOptionPairType', () => {
    it('should identify Japanese min/max', () => {
      expect(getOptionPairType('テスト 最小')).toBe('min');
      expect(getOptionPairType('テスト 最大')).toBe('max');
    });

    it('should identify English min/max', () => {
      expect(getOptionPairType('Test Min')).toBe('min');
      expect(getOptionPairType('Test Max')).toBe('max');
    });

    it('should identify Chinese min/max', () => {
      expect(getOptionPairType('测试 最小值')).toBe('min');
      expect(getOptionPairType('测试 最大值')).toBe('max');
    });

    it('should return none for other names', () => {
      expect(getOptionPairType('テスト')).toBe('none');
      expect(getOptionPairType('最小テスト')).toBe('none');
    });
  });

  describe('findClosestIndex', () => {
    it('should find exact match', () => {
      expect(findClosestIndex([0, 10, 20], 10)).toBe(1);
    });

    it('should find closest value', () => {
      expect(findClosestIndex([0, 10, 20], 12)).toBe(1);
      expect(findClosestIndex([0, 10, 20], 18)).toBe(2);
    });

    it('should handle boundary values', () => {
      expect(findClosestIndex([0, 10, 20], -5)).toBe(0);
      expect(findClosestIndex([0, 10, 20], 25)).toBe(2);
    });

    it('should return 0 for empty array', () => {
      expect(findClosestIndex([], 10)).toBe(0);
    });
  });

  describe('getBaseOptionName', () => {
    it('should remove suffixes', () => {
      expect(getBaseOptionName('テスト 最小')).toBe('テスト');
      expect(getBaseOptionName('テスト 最大')).toBe('テスト');
      expect(getBaseOptionName('Test Min')).toBe('Test');
      expect(getBaseOptionName('测试 最大值')).toBe('测试');
    });
  });

  describe('getOptionLabel', () => {
    it('extracts Japanese label', () => {
      expect(getOptionLabel('テスト 最小')).toBe('最小');
      expect(getOptionLabel('テスト 最大')).toBe('最大');
    });

    it('extracts English label', () => {
      expect(getOptionLabel('Test Min')).toBe('Min');
      expect(getOptionLabel('Test Max')).toBe('Max');
    });

    it('extracts parenthesized label', () => {
      expect(getOptionLabel('Test (Min)')).toBe('(Min)');
    });

    it('returns empty string if no suffix', () => {
      expect(getOptionLabel('テスト')).toBe('');
    });
  });


  describe('groupOptionPairs', () => {
    const mockOption = (id: number, name: string): ExROptionDto => {
      return {
        Id: id,
        IsActive: true,
        TranslatedName: name,
        Selection: 0,
        Format: '',
        RangeMeta: { Type: 'Int32', Values: [0, 1, 2] },
        Childs: [],
      };
    };

    it('should group consecutive min/max pairs', () => {
      const options = [
        mockOption(1, 'A 最小'),
        mockOption(2, 'A 最大'),
        mockOption(3, 'B'),
      ];
      const grouped = groupOptionPairs(options);
      expect(grouped).toHaveLength(2);
      expect(grouped[0]).toEqual({
        type: 'pair',
        baseName: 'A',
        min: options[0],
        max: options[1],
        minLabel: '最小',
        maxLabel: '最大',
      });
      expect(grouped[1]).toEqual(options[2]);
    });

    it('should not group non-consecutive pairs', () => {
      const options = [
        mockOption(1, 'A 最小'),
        mockOption(3, 'B'),
        mockOption(2, 'A 最大'),
      ];
      const grouped = groupOptionPairs(options);
      expect(grouped).toHaveLength(3);
    });
  });
});
