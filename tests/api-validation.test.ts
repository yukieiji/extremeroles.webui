import { describe, it, expect } from 'vitest';
import { ExROptionPutRequestSchema, UpdatedOptionsSchema } from '../src/type';

describe('ExROptionPutRequest and UpdatedOptions Validation', () => {
  it('should validate a correct ExROptionPutRequest', () => {
    const data = {
      TabId: 1,
      CategoryId: 2,
      OptionId: 101,
      Selection: 1,
    };

    const result = ExROptionPutRequestSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should fail validation if ExROptionPutRequest has missing fields', () => {
    const data = {
      TabId: 1,
      CategoryId: 2,
      // OptionId missing
      Selection: 1,
    };

    const result = ExROptionPutRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should fail validation if ExROptionPutRequest has incorrect types', () => {
    const data = {
      TabId: '1', // string instead of number
      CategoryId: 2,
      OptionId: 101,
      Selection: 1,
    };

    const result = ExROptionPutRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate a correct UpdatedOptions', () => {
    const data = {
      UpdatedCategory: {
        Id: 1,
        Name: 'Test Category',
        Options: [],
      },
      ChainUpdatedOption: [
        {
          Id: 101,
          IsActive: true,
          TransedName: 'Test Option',
          Selection: 1,
          Format: '{0}',
          RangeMeta: {
            Type: 'Int32',
            Values: [1, 2, 3],
          },
          Childs: [],
        },
      ],
    };

    const result = UpdatedOptionsSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should validate UpdatedOptions with null UpdatedCategory', () => {
    const data = {
      UpdatedCategory: null,
      ChainUpdatedOption: [],
    };

    const result = UpdatedOptionsSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
