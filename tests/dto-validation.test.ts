import { describe, it, expect } from 'vitest';
import { ExRTabDtoArraySchema, OptionTab } from '../src/type';

describe('ExRTabDto Validation', () => {
  it('should validate a correct ExRTabDto array', () => {
    const data = [
      {
        Id: OptionTab.GeneralTab,
        Name: 'Test Tab',
        Categories: [
          {
            Id: 1,
            Name: 'Test Category',
            Options: [
              {
                Id: 101,
                IsActive: true,
                TransedName: 'Test Option',
                Selection: 1,
                Format: '{0}',
                RangeMeta: {
                  Type: 'Test',
                  Selection: 1,
                  Values: [1, 2, 3],
                },
                Childs: [],
              },
            ],
          },
        ],
      },
    ];

    const result = ExRTabDtoArraySchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should fail validation if data is incorrect', () => {
    const invalidData = [
      {
        Id: 999, // Invalid OptionTab
        Name: 'Invalid Tab',
        Categories: [],
      },
    ];

    const result = ExRTabDtoArraySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail validation if RangeMeta Values are mixed types', () => {
    const data = [
      {
        Id: OptionTab.GeneralTab,
        Name: 'T',
        Categories: [
          {
            Id: 1,
            Name: 'C',
            Options: [
              {
                Id: 1,
                IsActive: true,
                TransedName: 'O',
                Selection: 0,
                Format: '',
                RangeMeta: {
                  Type: 'T',
                  Selection: 0,
                  Values: [1, 'a'], // Mixed
                },
                Childs: [],
              },
            ],
          },
        ],
      },
    ];
    const result = ExRTabDtoArraySchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate recursive Childs in ExROptionDto', () => {
    const data = [
      {
        Id: OptionTab.GeneralTab,
        Name: 'Tab',
        Categories: [
          {
            Id: 1,
            Name: 'Category',
            Options: [
              {
                Id: 101,
                IsActive: true,
                TransedName: 'Parent',
                Selection: 0,
                Format: '{0}',
                RangeMeta: { Type: 'T', Selection: 0, Values: [] },
                Childs: [
                  {
                    Id: 102,
                    IsActive: true,
                    TransedName: 'Child',
                    Selection: 0,
                    Format: '{0}',
                    RangeMeta: { Type: 'T', Selection: 0, Values: [] },
                    Childs: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const result = ExRTabDtoArraySchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
