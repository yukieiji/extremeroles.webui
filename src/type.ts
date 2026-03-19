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

export const OptionTabSchema = z.nativeEnum(OptionTab);

/**
 * オプションの範囲メタデータ
 */
export interface IOptionRangeMeta {
  Type: string;
  Selection: number;
  Values: unknown[];
}

export const IOptionRangeMetaSchema = z.object({
  Type: z.string(),
  Selection: z.number(),
  Values: z.array(z.any()),
});

/**
 * オプションDTO
 */
export interface ExROptionDto {
  Id: number;
  IsActive: boolean;
  TransedName: string;
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
    TransedName: z.string(),
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
