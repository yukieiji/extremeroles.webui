import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAuOptionMetaData, auOptionMetaData, AU_OPTION_URL, resetAuOptionMetaData } from '../src/logics/api';
import { OptionValueType } from '../src/type';

// Mock global fetch
global.fetch = vi.fn();

describe('createAuOptionMetaData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAuOptionMetaData();
    });

    it('should correctly process options and tabs', async () => {
        const mockData = [
            {
                TranslatedTitle: "Tab0Category",
                Options: [
                    {
                        TranslatedTitle: "NormalOption",
                        TranslatedFormat: "Format",
                        Value: 10,
                        Info: { ValueType: OptionValueType.Int, OptionName: 1 },
                        Range: [0, 10, 20]
                    }
                ]
            },
            {
                TranslatedTitle: "Tab1CategoryStart",
                Options: [
                    {
                        TranslatedTitle: "DefaultOption",
                        TranslatedFormat: "Something",
                        Value: true,
                        Info: { ValueType: OptionValueType.Bool, OptionName: 2 }
                    }
                ]
            },
            {
                TranslatedTitle: "Tab2CategoryStart",
                Options: [
                    {
                        TranslatedTitle: "DefaultOption",
                        TranslatedFormat: "Shapeshifter",
                        Value: { MaxCount: 1, Chance: 50 },
                        Info: { ValueType: OptionValueType.RoleBase, OptionName: 3 }
                    }
                ]
            }
        ];

        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockData,
        });

        const result = await createAuOptionMetaData();

        // Check tabs
        expect(auOptionMetaData.tabCategoryMap[0]).toContain(0);
        expect(auOptionMetaData.tabCategoryMap[1]).toContain(1);
        expect(auOptionMetaData.tabCategoryMap[2]).toContain(2);

        // Check category info
        expect(auOptionMetaData.categoryInfo[0]).toBe("Tab0Category");

        // Check options
        // NormalOption: Name 1, Type 2 (Int), Prefix 0 => 10200
        const id1 = 10200;
        expect(auOptionMetaData.options[id1]).toBeDefined();
        expect(auOptionMetaData.options[id1].title).toBe("NormalOption");
        expect(result.initialValueData[id1]).toBe(1); // Index of 10 in [0, 10, 20]

        // BoolOption: Name 2, Type 0 (Bool), Prefix 0 => 20000
        const id2 = 20000;
        expect(auOptionMetaData.options[id2]).toBeDefined();
        expect(result.initialValueData[id2]).toBe(1); // true => 1

        // RoleBase: Name 3, Type 5 (RoleBase)
        // MaxCount: Name 3, Type 5, Prefix 1 => 30501
        const id3Max = 30501;
        expect(auOptionMetaData.options[id3Max]).toBeDefined();
        expect(result.initialValueData[id3Max]).toBe(1);

        // Chance: Name 3, Type 5, Prefix 2 => 30502
        const id3Chance = 30502;
        expect(auOptionMetaData.options[id3Chance]).toBeDefined();
        expect(result.initialValueData[id3Chance]).toBe(5); // 50 / 10 = 5
    });
});
