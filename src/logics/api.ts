import type {
	AuOptionId,
	AuOptionMetaDataRecords,
	AuRoleOption,
	DeltRoleAssignFilter,
	ExROptionDto,
	ExROptionMetaDataRecords,
	ExROptionValueData,
	ExRTabMetaData,
	GetCsvResult,
	LobbyInfo,
	RoleAssignFilterSetUI,
	RoleFilterMetaData,
	SearchItem,
	SimulateOption,
	SimulateResult,
	TranslationMetaDataRecords,
	UniqueOptionId,
	UpdatedOptions,
	VanillaOptionPutRequest,
} from "../type";
import {
	AU_PREFIX,
	AU_TAB_COLORS,
	AuOptionCategoryDtoArraySchema,
	ExRTabDtoArraySchema,
	ExRTabId,
	GetCsvResultSchema,
	GetTranslationResponseArraySchema,
	LobbyInfoSchema,
	OptionValueType,
	RoleAssignFilterDtoSchema,
	SimulateResultArraySchema,
	UpdatedOptionsSchema,
} from "../type";

import { darkenColor, extractColors, stripColorTags } from "./colorUtils";
import { getAuOptionId, getUniqueOptionId } from "./optionUtils";

/**
 * API エンドポイントの定数定義
 */
const EXR_OPTION_URL = "/exr/option/";
const EXR_CSV_URL = "/exr/option/csv/";
const AU_OPTION_URL = "/au/option/";
const EXR_ROLE_FILTER_URL = "/exr/role/filter/";
const EXR_SIMULATE_URL = "/exr/role/simulate/";
const AU_LOBBY_URL = "/au/lobby/";
const TRANSLATION_BATCH_BASE_URL = "/au/translation/batch/";
const OPUTION_TRANSLATION_BATCH_URL = `${TRANSLATION_BATCH_BASE_URL}optionunit/`;
const ROLE_TRANSLATION_BATCH_URL = `${TRANSLATION_BATCH_BASE_URL}role/`;

export const translationMetaData: TranslationMetaDataRecords = {};

export const exrOptionMetaData: ExROptionMetaDataRecords = {
	// ExRTabIdはAPIから取得したデータに基づいて動的に構築され全てあることが保証されるため、初期値は空のオブジェクトで問題ありません
	tabs: {} as Record<ExRTabId, ExRTabMetaData>,
	categories: {},
	options: {},
	globalCategoryIdTopLevelMap: {},
};

export const auOptionMetaData: AuOptionMetaDataRecords = {
	tabNames: [],
	tabColors: [],
	tabCategoryMap: {},
	categoryMetaData: {},
	options: {},
};

export const roleFilterMetaData: RoleFilterMetaData = {
	FilterRoleId: [],
	NormalRoleId: {},
	CombinationId: {},
	GhostRoleId: {},
};

export const globalSearchItems: SearchItem[] = [];

/**
 * ExRオプションのメタデータをリセットする（テスト用）
 */
export function resetExrOptionMetaData() {
	exrOptionMetaData.tabs = {} as Record<ExRTabId, ExRTabMetaData>;
	exrOptionMetaData.categories = {};
	exrOptionMetaData.options = {};
	exrOptionMetaData.globalCategoryIdTopLevelMap = {};
}

/**
 * Auオプションのメタデータをリセットする（テスト用）
 */
export function resetAuOptionMetaData() {
	auOptionMetaData.tabNames = [];
	auOptionMetaData.tabColors = [];
	auOptionMetaData.tabCategoryMap = {};
	auOptionMetaData.categoryMetaData = {};
	auOptionMetaData.options = {};
}

/**
 * RoleFilterのメタデータをリセットする（テスト用）
 */
export function resetRoleFilterMetaData() {
	roleFilterMetaData.FilterRoleId = [];
	roleFilterMetaData.NormalRoleId = {};
	roleFilterMetaData.CombinationId = {};
	roleFilterMetaData.GhostRoleId = {};
}

interface ExRinitializeData {
	valueData: Record<UniqueOptionId, ExROptionValueData>;
	isOptionActive: Record<UniqueOptionId, boolean>;
}

export async function fetchTranslationMetaData(): Promise<void> {
	const batchKeys = [
		"GameSettingsLabel",
		"SYNC_BUTTON_TITLE",
		"importCsv",
		"IMPORT_CONFIRM_TITLE",
		"IMPORT_CONFIRM_MESSAGE",
		"exportCsv",
		"Cancel",
		"VIEWER_ROW_TITLE",
		"SpawnRate",
		"RoleNum",
		"Close",
		"ROLE_FILTER_CONFIRM",
		"PRESET_SWITCH_TITLE",
		"PRESET_SWITCH_MESSAGE",
		"PRESET_INPUT_PLACEHOLDER",
		"ROLE_FILTER_ADD_TITLE",
		"RoleAssignFilterAddFilter",
		"RoleAssignFilterAddRole",
		"RoleAssignFilter",
		"RoleAssignFilterAssignNum",
		"ROLE_FILTER_EMPTY_MESSAGE",
		"ROLE_FILTER_DELETE_CONFIRM_TITLE",
		"ROLE_FILTER_DELETE_CONFIRM_MESSAGE",
		"ROLE_FILTER_ROLE_DELETE_CONFIRM_TITLE",
		"ROLE_FILTER_ROLE_DELETE_CONFIRM_MESSAGE",
		"ROLE_SELECT_SEARCH_PLACEHOLDER",
		"OPTION_SEARCH_PLACEHOLDER",
		"ROLE_SELECT_DEFAULT_TITLE",
		"CSV_FILE_DESCRIPTION",
		"PresetOption",
		"SYNCHRONIZING",
		"RIGHT_PANEL_TITLE",
		"SettingsLabel",
		"ROLE_FILTER_SHORT_LABEL",
		"RANDOM_MAP_LABEL",
		"ROLE_FILTER_NOT_FOUND",
		"OK",
		"SEARCH_NO_RESULTS",
		"CLIPBOARD_SETTING_TITLE",
		"CLIPBOARD_FACTION_COUNTS",
		"roleName",
		"Crewmate",
		"Impostor",
		"Neutral",
		"Liberal",
		"CLIPBOARD_DETAILED_SETTINGS",
		"OtherLanguage",
		"CLIPBOARD_OTHERS_NOTE",
		"CLIPBOARD_VANILLA_SUFFIX",
		"CLIPBOARD_COPY_BUTTON",
		"CLIPBOARD_COPY_SUCCESS",
		"optionOff",
		"optionOn",
		"SIMULATE_LABEL",
		"SIMULATE_RESULT_HEADER",
		"SIMULATE_RESULT_TITLE",
		"COPY_BUTTON_LABEL",
		"playerName",
		"SIMULATE_DETAILS_SETTING",
		"LOBBY_INFO_TITLE",
		"CYCLE_LABEL",
		"PLAYER_NUM_LABEL",
		"EMPTY_SIMULATE_MESSAGE",
		"SIMULATE_EXECUTING_LABEL",
		"EXECUTE_BUTTON_LABEL",
		"RoomCodeLabel",
		"SERVER_TITLE",
		"CURRENT_PLAYER_LABEL",
		"LEFT_SIDEBAR_SETTING",
		"RIGHT_SIDEBAR_SETTING",
		"INITIAL_SIDEBAR_STATE",
		"SAVE_STATE_TO_BROWSER",
		"SIDEBAR_OPEN_LABEL",
		"SIDEBAR_CLOSE_LABEL",
	];
	const batchBody = batchKeys.map((key) => {
		return { Key: key };
	});

	console.log(
		JSON.stringify({
			type: "request",
			method: "GET",
			url: OPUTION_TRANSLATION_BATCH_URL,
		}),
	);
	console.log(
		JSON.stringify({
			type: "request",
			method: "GET",
			url: ROLE_TRANSLATION_BATCH_URL,
		}),
	);
	console.log(
		JSON.stringify({
			type: "request",
			method: "POST",
			url: TRANSLATION_BATCH_BASE_URL,
			body: batchBody,
		}),
	);
	const [resOptionUnit, resRoleOptionUnit, resBatch] = await Promise.all([
		fetch(OPUTION_TRANSLATION_BATCH_URL),
		fetch(ROLE_TRANSLATION_BATCH_URL),
		fetch(TRANSLATION_BATCH_BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(batchBody),
		}),
	]);

	console.log(
		JSON.stringify({
			type: "response",
			url: OPUTION_TRANSLATION_BATCH_URL,
			status: resOptionUnit.status,
		}),
	);
	console.log(
		JSON.stringify({
			type: "response",
			url: ROLE_TRANSLATION_BATCH_URL,
			status: resRoleOptionUnit.status,
		}),
	);
	console.log(
		JSON.stringify({
			type: "response",
			url: TRANSLATION_BATCH_BASE_URL,
			status: resBatch.status,
		}),
	);

	if (!resOptionUnit.ok) {
		throw new Error(
			`Failed to fetch translation data (optionunit): ${resOptionUnit.statusText}`,
		);
	}
	if (!resRoleOptionUnit.ok) {
		throw new Error(
			`Failed to fetch translation data (role): ${resRoleOptionUnit.statusText}`,
		);
	}
	if (!resBatch.ok) {
		throw new Error(
			`Failed to fetch translation data (batch): ${resBatch.statusText}`,
		);
	}

	const [jsonOptionUnit, jsonRoleOptionUnit, jsonBatch] = await Promise.all([
		resOptionUnit.json(),
		resRoleOptionUnit.json(),
		resBatch.json(),
	]);

	const parseOptionUnit =
		await GetTranslationResponseArraySchema.parseAsync(jsonOptionUnit);
	for (const item of parseOptionUnit) {
		translationMetaData[item.Key] = item.Result;
	}

	const parseRole =
		await GetTranslationResponseArraySchema.parseAsync(jsonRoleOptionUnit);
	for (const item of parseRole) {
		translationMetaData[item.Key] = item.Result;
	}

	const parseBatch =
		await GetTranslationResponseArraySchema.parseAsync(jsonBatch);
	const booleanMap: Record<string, string> = {};
	for (const item of parseBatch) {
		translationMetaData[item.Key] = item.Result;
		booleanMap[item.Key.toString()] = item.Result;
	}

	// オン/オフは数値キーで保存する
	translationMetaData[0] = booleanMap.optionOff;
	translationMetaData[1] = booleanMap.optionOn;
}

export async function createExROptionMetaData(): Promise<ExRinitializeData> {
	console.log(
		JSON.stringify({ type: "request", method: "GET", url: EXR_OPTION_URL }),
	);
	const res = await fetch(EXR_OPTION_URL);
	console.log(
		JSON.stringify({
			type: "response",
			url: EXR_OPTION_URL,
			status: res.status,
		}),
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch ExR options: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: EXR_OPTION_URL, data: jsonData }),
	);
	const data = await ExRTabDtoArraySchema.parseAsync(jsonData);

	const valueData: Record<number, ExROptionValueData> = {};
	const isOptionActive: Record<number, boolean> = {};

	const processOptions = (
		options: ExROptionDto[],
		tabId: ExRTabId,
		categoryId: number,
		ancestorIds: UniqueOptionId[],
	) => {
		for (const opt of options) {
			const uniqueId = getUniqueOptionId(tabId, categoryId, opt.Id);

			const format = (translationMetaData[opt.Format] as string) ?? "";

			exrOptionMetaData.options[uniqueId] = {
				metaData: {
					translatedName: opt.TranslatedName,
					format: format,
					type: opt.RangeMeta.Type,
				},
				childOptionIds:
					exrOptionMetaData.options[uniqueId]?.childOptionIds ?? [],
				parentOptionIds: ancestorIds,
			};

			valueData[uniqueId] = {
				selection: opt.Selection,
				values: opt.RangeMeta.Values,
			};
			isOptionActive[uniqueId] = opt.IsActive;
			if (ancestorIds.length > 0) {
				const parentUniqueOptionId = ancestorIds[0];
				if (!exrOptionMetaData.options[parentUniqueOptionId]) {
					exrOptionMetaData.options[parentUniqueOptionId] = {
						metaData: {
							translatedName: "",
							format: "",
							type: "",
						},
						childOptionIds: [],
						parentOptionIds: [],
					};
				}
				if (
					!exrOptionMetaData.options[
						parentUniqueOptionId
					].childOptionIds.includes(uniqueId)
				) {
					exrOptionMetaData.options[parentUniqueOptionId].childOptionIds.push(
						uniqueId,
					);
				}
			}

			globalSearchItems.push({
				term: opt.TranslatedName,
				parentData: {
					tabName: stripColorTags(exrOptionMetaData.tabs[tabId].name),
					categoryName: exrOptionMetaData.categories[categoryId]?.name || "",
					parentOptionNames: ancestorIds.map(
						(id) =>
							exrOptionMetaData.options[id]?.metaData.translatedName || "",
					),
				},
				info: {
					mode: "exr-opt",
					uniqueOptionId: uniqueId,
					parentUniqueOptionIds: ancestorIds,
				},
			});

			if (opt.Childs && opt.Childs.length > 0) {
				processOptions(opt.Childs, tabId, categoryId, [
					uniqueId,
					...ancestorIds,
				]);
			}
		}
	};

	for (const tab of data) {
		const isGhost =
			tab.Id === ExRTabId.GhostCrewmateTab ||
			tab.Id === ExRTabId.GhostImpostorTab ||
			tab.Id === ExRTabId.GhostNeutralTab;

		const extractedColors = extractColors(tab.Name);
		let colors = isGhost
			? extractedColors.map((c) => darkenColor(c))
			: extractedColors;

		if (colors.length === 0 && tab.Id === ExRTabId.GeneralTab) {
			colors = ["#CCCC00"];
		}

		exrOptionMetaData.tabs[tab.Id] = {
			name: stripColorTags(tab.Name),
			colors,
			categoryIds: tab.Categories.map((c) => c.Id),
		};
		for (const category of tab.Categories) {
			const categoryColors = category.ColorCode
				? [
						category.ColorCode.startsWith("#")
							? category.ColorCode
							: `#${category.ColorCode}`,
					]
				: extractColors(category.Name);

			exrOptionMetaData.categories[category.Id] = {
				name: stripColorTags(category.Name),
				tabId: tab.Id,
				categoryColors,
			};
			globalSearchItems.push({
				term: exrOptionMetaData.categories[category.Id].name,
				parentData: {
					tabName: stripColorTags(tab.Name),
					categoryName: "", // カテゴリはタブの直下にあるため、親カテゴリは存在しない
					parentOptionNames: [],
				},
				info: {
					mode: "exr-cat",
					tabId: tab.Id,
					categoryId: category.Id,
				},
			});
			if (tab.Id === ExRTabId.GeneralTab) {
				// 一般タブのカテゴリは、トップレベルオプションIDを直接カテゴリIDに紐づける
				exrOptionMetaData.globalCategoryIdTopLevelMap[category.Id] =
					category.Options.map((o) =>
						getUniqueOptionId(tab.Id, category.Id, o.Id),
					); // カテゴリIDとそのカテゴリに属するオプションIDの対応を保存
			}
			processOptions(category.Options, tab.Id, category.Id, []);
		}
	}
	return { valueData, isOptionActive };
}

export async function createAuOptionMetaData(): Promise<
	Record<AuOptionId, number>
> {
	console.log(
		JSON.stringify({ type: "request", method: "GET", url: AU_OPTION_URL }),
	);
	const res = await fetch(AU_OPTION_URL);
	console.log(
		JSON.stringify({
			type: "response",
			url: AU_OPTION_URL,
			status: res.status,
		}),
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch Au options: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: AU_OPTION_URL, data: jsonData }),
	);
	const data = await AuOptionCategoryDtoArraySchema.parseAsync(jsonData);

	const initialValueData: Record<number, number> = {};
	auOptionMetaData.tabNames = [
		translationMetaData.GameSettingsLabel,
		translationMetaData.Crewmate,
		translationMetaData.Impostor,
	];
	auOptionMetaData.tabColors = [...AU_TAB_COLORS];
	auOptionMetaData.tabCategoryMap = { 0: [], 1: [], 2: [] };
	auOptionMetaData.categoryMetaData = {};
	auOptionMetaData.options = {};

	let currentTab = 0;

	for (let i = 0; i < data.length; i++) {
		const category = data[i];
		const categoryId = i;
		const firstOption = category.Options[0];
		if (currentTab === 0 && firstOption?.TranslatedTitle === "DefaultOption") {
			currentTab = 1;
		} else if (
			currentTab === 1 &&
			firstOption?.TranslatedTitle === "DefaultOption" &&
			firstOption?.TranslatedFormat === "ShapeshifterRole"
		) {
			currentTab = 2;
		}

		auOptionMetaData.tabCategoryMap[currentTab].push(categoryId);
		auOptionMetaData.categoryMetaData[categoryId] = {
			name: category.TranslatedTitle,
			options: [],
			tabId: currentTab,
		};

		const isMapCategory =
			currentTab === 0 && auOptionMetaData.tabCategoryMap[0].length === 1;

		if (!isMapCategory) {
			globalSearchItems.push({
				term: category.TranslatedTitle,
				parentData: {
					tabName: auOptionMetaData.tabNames[currentTab],
					categoryName: "", // カテゴリはタブの直下にあるため、親カテゴリは存在しない
					parentOptionNames: [],
				},
				info: {
					mode: "au-cat",
					tabId: currentTab,
					categoryId: categoryId,
				},
			});
		}

		for (const opt of category.Options) {
			const valueType = opt.Info.ValueType;
			const optionName = opt.Info.OptionName;
			const tlanslatedTitle = opt.TranslatedTitle;

			if (valueType === OptionValueType.RoleBase) {
				const roleValue = opt.Value as AuRoleOption;

				// Chance
				const chanceId = getAuOptionId(optionName, valueType, AU_PREFIX.CHANCE);
				auOptionMetaData.categoryMetaData[categoryId].options.push(chanceId);
				auOptionMetaData.options[chanceId] = {
					title: opt.TranslatedTitle,
					format: opt.TranslatedFormat,
					range: Array.from({ length: 11 }, (_, i) => i * 10), // 0～100％を10％刻みで用意するため
					tabId: currentTab,
					categoryId: categoryId,
				};
				initialValueData[chanceId] = Math.floor(roleValue.Chance / 10);

				// MaxCount
				const maxCountId = getAuOptionId(
					optionName,
					valueType,
					AU_PREFIX.MAX_COUNT,
				);
				auOptionMetaData.categoryMetaData[categoryId].options.push(maxCountId);
				auOptionMetaData.options[maxCountId] = {
					title: tlanslatedTitle,
					format: opt.TranslatedFormat,
					range: Array.from({ length: 16 }, (_, i) => i), // 0～15を1刻みで用意するため
					tabId: currentTab,
					categoryId: categoryId,
				};
				initialValueData[maxCountId] = roleValue.MaxCount;
			} else {
				const auOptionId = getAuOptionId(optionName, valueType);
				auOptionMetaData.categoryMetaData[categoryId].options.push(auOptionId);

				let range: number[] | string[] | boolean[] = opt.Range || [];
				let index = 0;

				if (valueType === OptionValueType.Bool) {
					range = [false, true];
					index = opt.Value ? 1 : 0;
				} else if (range.length > 0) {
					index = (range as (number | string)[]).indexOf(
						opt.Value as string | number,
					);
					if (index === -1) {
						index = 0;
					}
				}

				auOptionMetaData.options[auOptionId] = {
					title: tlanslatedTitle,
					format: opt.TranslatedFormat,
					range,
					tabId: currentTab,
					categoryId: categoryId,
				};
				initialValueData[auOptionId] = index;

				globalSearchItems.push({
					term: tlanslatedTitle,
					parentData: {
						tabName: auOptionMetaData.tabNames[currentTab],
						categoryName: isMapCategory ? "" : category.TranslatedTitle,
						parentOptionNames: [],
					},
					info: {
						mode: "au-opt",
						tabId: currentTab,
						categoryId: categoryId,
						auOptionId: auOptionId,
					},
				});
			}
		}
	}

	return initialValueData;
}

export async function updateExrOption(
	tabId: number,
	categoryId: number,
	optionId: number,
	selection: number,
): Promise<UpdatedOptions | null> {
	const request = {
		TabId: tabId,
		CategoryId: categoryId,
		OptionId: optionId,
		Selection: selection,
	};
	console.log(
		JSON.stringify({
			type: "request",
			method: "PUT",
			url: EXR_OPTION_URL,
			body: request,
		}),
	);
	const res = await fetch(EXR_OPTION_URL, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	console.log(
		JSON.stringify({
			type: "response",
			url: EXR_OPTION_URL,
			status: res.status,
		}),
	);

	if (res.status === 202) {
		return null;
	}

	if (!res.ok) {
		throw new Error(`Failed to update ExR option: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: EXR_OPTION_URL, data: jsonData }),
	);
	return await UpdatedOptionsSchema.parseAsync(jsonData);
}

export async function postSimulate(
	options: SimulateOption,
): Promise<SimulateResult[]> {
	console.log(
		JSON.stringify({
			type: "request",
			method: "POST",
			url: EXR_SIMULATE_URL,
			body: options,
		}),
	);
	const res = await fetch(EXR_SIMULATE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(options),
	});

	console.log(
		JSON.stringify({
			type: "response",
			url: EXR_SIMULATE_URL,
			status: res.status,
		}),
	);

	if (!res.ok) {
		throw new Error(`Failed to post simulate: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: EXR_SIMULATE_URL, data: jsonData }),
	);
	return await SimulateResultArraySchema.parseAsync(jsonData);
}

export async function postExrCsv(csvBody: string): Promise<void> {
	const body = { CsvBody: csvBody };
	console.log(
		JSON.stringify({
			type: "request",
			method: "POST",
			url: EXR_CSV_URL,
			body: body,
		}),
	);
	const res = await fetch(EXR_CSV_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	console.log(
		JSON.stringify({
			type: "response",
			url: EXR_CSV_URL,
			status: res.status,
		}),
	);

	if (!res.ok) {
		throw new Error(`Failed to post ExR CSV: ${res.statusText}`);
	}
}
export async function fetchCsvData(): Promise<GetCsvResult> {
	console.log(
		JSON.stringify({ type: "request", method: "GET", url: EXR_CSV_URL }),
	);
	const res = await fetch(EXR_CSV_URL);
	console.log(
		JSON.stringify({
			type: "response",
			url: EXR_CSV_URL,
			status: res.status,
		}),
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch CSV data: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: EXR_CSV_URL, data: jsonData }),
	);
	return await GetCsvResultSchema.parseAsync(jsonData);
}

export async function postRoleFilterUpdate(
	request: DeltRoleAssignFilter,
): Promise<void> {
	console.log(
		JSON.stringify({
			type: "request",
			method: "POST",
			url: EXR_ROLE_FILTER_URL,
			body: request,
		}),
	);
	const res = await fetch(EXR_ROLE_FILTER_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	console.log(
		JSON.stringify({
			type: "response",
			url: EXR_ROLE_FILTER_URL,
			status: res.status,
		}),
	);

	if (!res.ok) {
		throw new Error(`Failed to update role filter: ${res.statusText}`);
	}
}

export async function fetchRoleFilterData(): Promise<
	Record<string, RoleAssignFilterSetUI>
> {
	console.log(
		JSON.stringify({
			type: "request",
			method: "GET",
			url: EXR_ROLE_FILTER_URL,
		}),
	);
	const res = await fetch(EXR_ROLE_FILTER_URL);
	console.log(
		JSON.stringify({
			type: "response",
			url: EXR_ROLE_FILTER_URL,
			status: res.status,
		}),
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch role filter data: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: EXR_ROLE_FILTER_URL, data: jsonData }),
	);
	const data = await RoleAssignFilterDtoSchema.parseAsync(jsonData);

	roleFilterMetaData.FilterRoleId = data.FilterRoleId;
	roleFilterMetaData.NormalRoleId = data.NormalRoleId;
	roleFilterMetaData.CombinationId = data.CombinationId;
	roleFilterMetaData.GhostRoleId = data.GhostRoleId;

	const filterSetUI: Record<string, RoleAssignFilterSetUI> = {};
	for (const [guid, set] of Object.entries(data.FilterSet)) {
		filterSetUI[guid] = {
			AssignNum: set.AssignNum,
			Roles: [
				...Object.entries(set.FilterNormalId).map(([id, name]) => {
					return {
						id: Number(id),
						name: String(name),
					};
				}),
				...Object.entries(set.FilterCombinationId).map(([id, name]) => {
					return {
						id: Number(id),
						name: String(name),
					};
				}),
				...Object.entries(set.FilterGhostRoleId).map(([id, name]) => {
					return {
						id: Number(id),
						name: String(name),
					};
				}),
			],
		};
	}

	return filterSetUI;
}

export async function fetchLobbyInfo(): Promise<LobbyInfo> {
	console.log(
		JSON.stringify({ type: "request", method: "GET", url: AU_LOBBY_URL }),
	);
	const res = await fetch(AU_LOBBY_URL);
	console.log(
		JSON.stringify({
			type: "response",
			url: AU_LOBBY_URL,
			status: res.status,
		}),
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch lobby info: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: AU_LOBBY_URL, data: jsonData }),
	);
	return await LobbyInfoSchema.parseAsync(jsonData);
}

export async function updateAuOption(
	request: VanillaOptionPutRequest,
): Promise<UpdatedOptions> {
	console.log(
		JSON.stringify({
			type: "request",
			method: "PUT",
			url: AU_OPTION_URL,
			body: request,
		}),
	);
	const res = await fetch(AU_OPTION_URL, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	console.log(
		JSON.stringify({
			type: "response",
			url: AU_OPTION_URL,
			status: res.status,
		}),
	);

	if (!res.ok) {
		throw new Error(`Failed to update AU option: ${res.statusText}`);
	}

	const jsonData = await res.json();
	console.log(
		JSON.stringify({ type: "data", url: AU_OPTION_URL, data: jsonData }),
	);
	return await UpdatedOptionsSchema.parseAsync(jsonData);
}
