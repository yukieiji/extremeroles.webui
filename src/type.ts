import { z } from "zod";

// 内部的にはnumber型ですが、ブランド型を使用して区別しています
type Branded<T, Brand extends string> = T & {
	readonly [K in Brand]: never; // neverなので実行時に存在しない
};

// ExR向け

/**
 * 特別な意味を持つオプションIDの定数
 */
export const SPAWN_RATE_OPTION_ID = 50;
export const SPAWN_COUNT_OPTION_ID = 51;

// ユニークオプションIDは、タブID、カテゴリID、オプションIDの組み合わせを一意に識別するための型
export type UniqueOptionId = Branded<number, "UniqueOptionId">;

export interface ExROptionMetaData {
	translatedName: string;
	format: string;
	type: string;
}

export interface ExROptionValueData {
	selection: number;
	values: number[] | string[];
}

export interface ExRTabMetaData {
	name: string;
	categoryIds: number[];
}

export interface ExRCategoryMetaData {
	name: string;
	tabId: OptionTab;
}

export interface ExROptionMetaDataDetail {
	metaData: ExROptionMetaData;
	childOptionIds: UniqueOptionId[];
}

export interface ExROptionMetaDataRecords {
	tabs: Record<OptionTab, ExRTabMetaData>;
	categories: Record<number, ExRCategoryMetaData>;
	options: Record<UniqueOptionId, ExROptionMetaDataDetail>;
	globalCategoryIdTopLevelMap: Record<number, UniqueOptionId[]>;
}

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
	if (typeof val === "string" && val in OptionTab) {
		return OptionTab[val as keyof typeof OptionTab];
	}
	return val;
}, z.enum(OptionTab));

/**
 * オプションの範囲メタデータ
 */
export interface IOptionRangeMeta {
	Type: string;
	Values: number[] | string[];
}

export const IOptionRangeMetaSchema = z.object({
	Type: z.enum(["Single", "Int32", "String"]),
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
	}),
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

// AmongUs本体

/**
 * Au系のオプション設定に関連する型定義
 */

export const AU_PREFIX = {
	MAX_COUNT: 1,
	CHANCE: 2,
} as const;

// 全ての値（1 | 2）を型として抽出
export type AuOptionPrefix = (typeof AU_PREFIX)[keyof typeof AU_PREFIX];

// 基本的には名前で分かるんだけど一部特殊なことをしないといけないので
// 1～2桁: 予備用プレフィックスコード、基本0
// 3～4桁: OptionValueType
// 5桁より上: OptionName
export type AuOptionId = Branded<number, "AuOptionName">;

export interface AuOptionMeta {
	title: string;
	format: string;
	range: number[] | string[] | boolean[];
}

export interface AuOptionCategoryMetaData {
	name: string;
	options: AuOptionId[];
}

export interface AuOptionMetaDataRecords {
	tabNames: string[]; // タブの名前
	tabCategoryMap: Record<number, number[]>; // タブIDとそのタブに属するカテゴリIDの対応
	categoryMetaData: Record<number, AuOptionCategoryMetaData>; // カテゴリIDとカテゴリメタデータの対応
	options: Record<AuOptionId, AuOptionMeta>; // 全オプションのメタデータ
}

export const OptionValueType = {
	Bool: 0,
	Byte: 1,
	Int: 2,
	UInt: 3,
	Float: 4,
	RoleBase: 5,
} as const;

export type OptionValueType =
	(typeof OptionValueType)[keyof typeof OptionValueType];

export const OptionValueTypeSchema = z.preprocess((val) => {
	if (typeof val === "string" && val in OptionValueType) {
		return OptionValueType[val as keyof typeof OptionValueType];
	}
	return val;
}, z.enum(OptionValueType));

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
	Range?: number[] | string[] | null;
}

export const AuOptionDtoSchema: z.ZodType<AuOptionDto> = z.object({
	TranslatedTitle: z.string(),
	TranslatedFormat: z.string(),
	Value: z.union([z.number(), z.boolean(), AuRoleOptionSchema]),
	Info: AuOptionInfoSchema,
	Range: z
		.union([z.array(z.number()), z.array(z.string())])
		.nullable()
		.optional(),
});

export interface AuOptionCategoryDto {
	TranslatedTitle: string;
	Options: AuOptionDto[];
}

export const AuOptionCategoryDtoSchema = z.object({
	TranslatedTitle: z.string(),
	Options: z.array(AuOptionDtoSchema),
});

export const AuOptionCategoryDtoArraySchema = z.array(
	AuOptionCategoryDtoSchema,
);

// 以下レスポンス向け

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
});

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
 * リザルトのカテゴリごとのオプションリスト
 */
export interface CategoryOptionDto {
	Id: number;
	Options: ExROptionDto[];
}

export const CategoryOptionDtoSchema = z.object({
	Id: z.number().int(),
	Options: z.array(ExROptionDtoSchema),
});

/**
 * 更新されたオプション情報
 */
export interface UpdatedOptions {
	UpdatedCategory?: ExRCategoryDto | null;
	ChainUpdatedOption: CategoryOptionDto[];
}

export const UpdatedOptionsSchema = z.object({
	UpdatedCategory: ExRCategoryDtoSchema.nullish(),
	ChainUpdatedOption: z.array(CategoryOptionDtoSchema),
});

// 内部データ向け

/**
 * プリセット名管理用のスキーマ
 * キーが数値（文字列としてシリアライズされる）、値がユーザー入力の文字列
 */
export const PresetNamesSchema = z
	.record(z.string(), z.string())
	.transform((val) => {
		const result: Record<number, string> = {};
		for (const key in val) {
			if (Object.hasOwn(val, key)) {
				const numKey = Number(key);
				if (!Number.isNaN(numKey)) {
					result[numKey] = val[key];
				}
			}
		}
		return result;
	});

export type PresetNames = z.infer<typeof PresetNamesSchema>;

export interface OptionData {
	uniqueOptionId: UniqueOptionId;
	metaData: ExROptionMetaData;
	label: string;
}

export interface UpdateExRArg {
	uniqueOptionId: UniqueOptionId;
	selection: number;
}

export interface UpdateAuArg {
	auOptionId: AuOptionId;
	selection: number;
}

export interface BlockDialog {
	title: string;
	message: string;
	onConfirm: () => void;
}

export interface GetTranslationResponse {
	Key: string | number;
	Param: (string | number)[];
	Result: string;
}

export const GetTranslationResponseSchema = z.object({
	Key: z.union([z.string(), z.number()]),
	Param: z.array(z.union([z.string(), z.number()])),
	Result: z.string(),
});

export const GetTranslationResponseArraySchema = z.array(
	GetTranslationResponseSchema,
);

export interface TranslationMetaDataRecords {
	booleanTransData: string[];
	[key: string | number]: string | string[] | undefined;
}
