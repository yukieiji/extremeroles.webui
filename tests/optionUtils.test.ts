import { describe, it, expect } from 'vitest';
import { getOptionPairType, getBaseOptionName, groupOptionPairs } from '../src/logics/optionUtils';
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

  describe('getBaseOptionName', () => {
    it('should remove suffixes', () => {
      expect(getBaseOptionName('テスト 最小')).toBe('テスト');
      expect(getBaseOptionName('テスト 最大')).toBe('テスト');
      expect(getBaseOptionName('Test Min')).toBe('Test');
      expect(getBaseOptionName('测试 最大值')).toBe('测试');
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

    it('should group consecutive min/max pairs in category 5', () => {
      const options = [
        mockOption(1, 'A 最小'),
        mockOption(2, 'A 最大'),
        mockOption(3, 'B'),
      ];
      const grouped = groupOptionPairs(5, options);
      expect(grouped).toHaveLength(2);
      expect(grouped[0]).toEqual({
        type: 'pair',
        baseName: 'A',
        min: options[0],
        max: options[1],
      });
      expect(grouped[1]).toEqual(options[2]);
    });

    it('should not group non-consecutive pairs', () => {
      const options = [
        mockOption(1, 'A 最小'),
        mockOption(3, 'B'),
        mockOption(2, 'A 最大'),
      ];
      const grouped = groupOptionPairs(5, options);
      expect(grouped).toHaveLength(3);
    });

    it('should not group in other categories', () => {
      const options = [
        mockOption(1, 'A 最小'),
        mockOption(2, 'A 最大'),
      ];
      const grouped = groupOptionPairs(1, options);
      expect(grouped).toHaveLength(2);
    });
  });
});
