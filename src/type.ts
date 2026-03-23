import { z } from 'zod';

/**
 * タブの種類を表す定数
 */
export const OptionTab = {
  GeneralTab: 0,
  CrewmateTab: 1,
  ImpostorTab: 2,
  NeutralTab: 3,
  CombinationTab: 4,
  GhostCrewmateTab: 5,
  GhostImpostorTab: 6,
  GhostNeutralTab: 7,
} as const;

export type OptionTab = (typeof OptionTab)[keyof typeof OptionTab];

export const OptionTabSchema = z.preprocess((val) => {
  if (typeof val === 'string' && val in OptionTab) {
    return OptionTab[val as keyof typeof OptionTab];
  }
  return val;
}, z.nativeEnum(OptionTab));

/**
 * オプションの範囲メタデータ
 */
export interface IOptionRangeMeta {
  Type: string;
  Values: number[] | string[];
}

export const IOptionRangeMetaSchema = z.object({
  Type: z.enum(['Single', 'Int32', 'String']),
  Values: z.union([z.array(z.number()), z.array(z.string())]),
});

/**
 * オプションDTO
 */
export interface ExROptionDto {
  Id: number;
  IsActive: boolean;
  TranslatedName: string;
  Selection: number;
  Format: string;
  RangeMeta: IOptionRangeMeta;
  Childs: ExROptionDto[];
}

// 再帰的な定義のため z.lazy を使用
export const ExROptionDtoSchema: z.ZodType<ExROptionDto> = z.lazy(() =>
  z.object({
    Id: z.number(),
    IsActive: z.boolean(),
    TranslatedName: z.string(),
    Selection: z.number(),
    Format: z.string(),
    RangeMeta: IOptionRangeMetaSchema,
    Childs: z.array(ExROptionDtoSchema),
  })
);

/**
 * カテゴリDTO
 */
export interface ExRCategoryDto {
  Id: number;
  Name: string;
  Options: ExROptionDto[];
}

export const ExRCategoryDtoSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  Options: z.array(ExROptionDtoSchema),
});

/**
 * タブDTO
 */
export interface ExRTabDto {
  Id: OptionTab;
  Name: string;
  Categories: ExRCategoryDto[];
}

export const ExRTabDtoSchema = z.object({
  Id: OptionTabSchema,
  Name: z.string(),
  Categories: z.array(ExRCategoryDtoSchema),
});

export const ExRTabDtoArraySchema = z.array(ExRTabDtoSchema);

/**
 * Au系のオプション設定に関連する型定義
 */

export const OptionValueType = {
  Bool: 0,
  Byte: 1,
  Int: 2,
  UInt: 3,
  Float: 4,
  RoleBase: 5,
} as const;

export type OptionValueType = (typeof OptionValueType)[keyof typeof OptionValueType];

export const OptionValueTypeSchema = z.preprocess((val) => {
  if (typeof val === 'string' && val in OptionValueType) {
    return OptionValueType[val as keyof typeof OptionValueType];
  }
  return val;
}, z.nativeEnum(OptionValueType));

export interface AuRoleOption {
  MaxCount: number;
  Chance: number;
}

export const AuRoleOptionSchema = z.object({
  MaxCount: z.number().int(),
  Chance: z.number().int(),
});

export interface AuOptionInfo {
  ValueType: OptionValueType;
  OptionName: number;
}

export const AuOptionInfoSchema = z.object({
  ValueType: OptionValueTypeSchema,
  OptionName: z.number().int(),
});

export interface AuOptionDto {
  TranslatedTitle: string;
  TranslatedFormat: string;
  Value: number | boolean | AuRoleOption;
  Info: AuOptionInfo;
  Range?: (number | string)[] | null;
}

export const AuOptionDtoSchema: z.ZodType<AuOptionDto> = z.object({
  TranslatedTitle: z.string(),
  TranslatedFormat: z.string(),
  Value: z.union([z.number(), z.boolean(), AuRoleOptionSchema]),
  Info: AuOptionInfoSchema,
  Range: z.array(z.union([z.number(), z.string()])).nullable().optional(),
});

export interface AuOptionCategoryDto {
  TranslatedTitle: string;
  Options: AuOptionDto[];
}

export const AuOptionCategoryDtoSchema = z.object({
  TranslatedTitle: z.string(),
  Options: z.array(AuOptionDtoSchema),
});

export const AuOptionCategoryDtoArraySchema = z.array(AuOptionCategoryDtoSchema);

/**
 * オプション更新リクエスト
 */
export interface ExROptionPutRequest {
  TabId: number;
  CategoryId: number;
  OptionId: number;
  Selection: number;
}

export const ExROptionPutRequestSchema = z.object({
  TabId: z.number().int(),
  CategoryId: z.number().int(),
  OptionId: z.number().int(),
  Selection: z.number().int(),
})

export interface VanillaOptionPutRequest {
  ValueType: OptionValueType;
  OptionName: number;
  NewValue: number | boolean | AuRoleOption;
}

export const VanillaOptionPutRequestSchema = z.object({
  ValueType: OptionValueTypeSchema,
  OptionName: z.number().int(),
  NewValue: z.union([z.number(), z.boolean(), AuRoleOptionSchema]),
});

/**
 * 更新されたオプション情報
 */
export interface UpdatedOptions {
  UpdatedCategory: ExRCategoryDto | null;
  ChainUpdatedOption: ExROptionDto[];
}

export const UpdatedOptionsSchema = z.object({
  UpdatedCategory: ExRCategoryDtoSchema.nullable(),
  ChainUpdatedOption: z.array(ExROptionDtoSchema),
});

/**
 * プリセット名管理用のスキーマ
 * キーが数値（文字列としてシリアライズされる）、値がユーザー入力の文字列
 */
export const PresetNamesSchema = z.record(z.string(), z.string()).transform((val) => {
  const result: Record<number, string> = {};
  for (const key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      const numKey = Number(key);
      if (!isNaN(numKey)) {
        result[numKey] = val[key];
      }
    }
  }
  return result;
});

export type PresetNames = z.infer<typeof PresetNamesSchema>;
