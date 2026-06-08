import { describe, expect, it } from "vitest";
import {
	type ClipboardState,
	generateClipboardText,
} from "@/logics/clipboardLogic";
import {
	AU_IMPOSTOR_COUNT_OPTION_ID,
	AU_KILL_COOLDOWN_OPTION_ID,
	AU_MAP_OPTION_ID,
	EXR_CREW_MAX_ID,
	EXR_CREW_MIN_ID,
	EXR_IMPOSTOR_MAX_ID,
	EXR_IMPOSTOR_MIN_ID,
	EXR_LIBERAL_MAX_ID,
	EXR_LIBERAL_MIN_ID,
	EXR_MILITANT_MAX_ID,
	EXR_MILITANT_MIN_ID,
	EXR_NEUTRAL_MAX_ID,
	EXR_NEUTRAL_MIN_ID,
	EXR_RANDOM_MAP_OPTION_ID,
	getUniqueOptionId,
	PRESET_OPTION_UNIQUE_ID,
} from "@/logics/optionUtils";
import {
	CLIPBOARD_CREW,
	CLIPBOARD_IMPOSTOR,
	CLIPBOARD_NEUTRAL,
	CLIPBOARD_ROLES,
} from "@/noTrans";
import {
	type AuOptionId,
	type AuOptionMetaDataRecords,
	type ExROptionMetaDataRecords,
	ExRTabId,
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
} from "@/type";

describe("generateClipboardText", () => {
	const mockExrMeta: ExROptionMetaDataRecords = {
		tabs: {
			[ExRTabId.GeneralTab]: {
				name: "General",
				categoryIds: [1, 3],
				colors: [],
			},
			[ExRTabId.CrewmateTab]: {
				name: "Crewmate",
				categoryIds: [2],
				colors: [],
			},
			[ExRTabId.ImpostorTab]: {
				name: "Impostor",
				categoryIds: [4],
				colors: [],
			},
			[ExRTabId.NeutralTab]: {
				name: "Neutral",
				categoryIds: [5],
				colors: [],
			},
		} as unknown as ExROptionMetaDataRecords["tabs"],
		categories: {
			1: { name: "Preset Category", tabId: ExRTabId.GeneralTab },
			2: { name: "ExR Role", tabId: ExRTabId.CrewmateTab },
			3: { name: "Liberal Category", tabId: ExRTabId.GeneralTab },
			4: { name: "ExR Impostor", tabId: ExRTabId.ImpostorTab },
			5: { name: "ExR Neutral", tabId: ExRTabId.NeutralTab },
		},
		options: {
			[PRESET_OPTION_UNIQUE_ID]: {
				metaData: { translatedName: "Preset", format: "", type: "Int32" },
				childOptionIds: [],
				parentOptionIds: [],
			},
			[EXR_RANDOM_MAP_OPTION_ID]: {
				metaData: { translatedName: "Random Map", format: "", type: "Bool" },
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: {
				metaData: {
					translatedName: "Spawn Rate",
					format: "{0}%",
					type: "Int32",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_COUNT_OPTION_ID)]: {
				metaData: { translatedName: "Spawn Count", format: "", type: "Int32" },
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.ImpostorTab, 4, SPAWN_RATE_OPTION_ID)]: {
				metaData: {
					translatedName: "Spawn Rate",
					format: "{0}%",
					type: "Int32",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.ImpostorTab, 4, SPAWN_COUNT_OPTION_ID)]: {
				metaData: { translatedName: "Spawn Count", format: "", type: "Int32" },
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.NeutralTab, 5, SPAWN_RATE_OPTION_ID)]: {
				metaData: {
					translatedName: "Spawn Rate",
					format: "{0}%",
					type: "Int32",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.NeutralTab, 5, SPAWN_COUNT_OPTION_ID)]: {
				metaData: { translatedName: "Spawn Count", format: "", type: "Int32" },
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.GeneralTab, 3, SPAWN_RATE_OPTION_ID)]: {
				metaData: {
					translatedName: "Spawn Rate",
					format: "{0}%",
					type: "Int32",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[getUniqueOptionId(ExRTabId.GeneralTab, 3, SPAWN_COUNT_OPTION_ID)]: {
				metaData: {
					translatedName: "Spawn Count",
					format: "",
					type: "Int32",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
		} as unknown as ExROptionMetaDataRecords["options"],
		globalCategoryIdTopLevelMap: {
			1: [PRESET_OPTION_UNIQUE_ID, EXR_RANDOM_MAP_OPTION_ID],
		},
	};

	const mockAuMeta: AuOptionMetaDataRecords = {
		tabNames: ["0", "1", "2"],
		tabColors: [],
		options: {
			[AU_MAP_OPTION_ID]: {
				title: "Map",
				range: ["Skeld", "Mira", "Polus", "Airship"],
				tabId: 0,
				categoryId: 0,
				format: "",
			},
			[AU_KILL_COOLDOWN_OPTION_ID]: {
				title: "Kill Cooldown",
				range: [10, 15, 20],
				tabId: 0,
				categoryId: 1,
				format: "",
			},
			[AU_IMPOSTOR_COUNT_OPTION_ID]: {
				title: "Impostor Count",
				range: [1, 2, 3],
				tabId: 0,
				categoryId: 1,
				format: "",
			},
			["1000" as AuOptionId]: {
				title: "Chance",
				range: [0, 100],
				tabId: 1,
				categoryId: 5,
				format: "",
			},
			["1001" as AuOptionId]: {
				title: "Max",
				range: [0, 1],
				tabId: 1,
				categoryId: 5,
				format: "",
			},
			["1002" as AuOptionId]: {
				title: "Chance",
				range: [0, 100],
				tabId: 2,
				categoryId: 6,
				format: "",
			},
			["1003" as AuOptionId]: {
				title: "Max",
				range: [0, 1],
				tabId: 2,
				categoryId: 6,
				format: "",
			},
			["2000" as AuOptionId]: {
				title: "Setting A",
				range: ["Off", "On"],
				tabId: 0,
				categoryId: 2,
				format: "",
			},
		} as unknown as AuOptionMetaDataRecords["options"],
		tabCategoryMap: {
			0: [0, 1, 2],
			1: [],
			2: [],
		},
		categoryMetaData: {
			0: { name: "Map Category", options: [AU_MAP_OPTION_ID], tabId: 0 },
			1: {
				name: "Game Category",
				options: [AU_KILL_COOLDOWN_OPTION_ID, AU_IMPOSTOR_COUNT_OPTION_ID],
				tabId: 0,
			},
			2: { name: "Other Settings", options: ["2000" as AuOptionId], tabId: 0 },
			5: {
				name: "Scientist",
				options: ["1000" as AuOptionId, "1001" as AuOptionId],
				tabId: 1,
			},
			6: {
				name: "Shapeshifter",
				options: ["1002" as AuOptionId, "1003" as AuOptionId],
				tabId: 2,
			},
		},
	};

	const mockState: ClipboardState = {
		exrValue: {
			[PRESET_OPTION_UNIQUE_ID]: { selection: 0, values: [1] },
			[EXR_RANDOM_MAP_OPTION_ID]: { selection: 0, values: [0, 1] },
			[EXR_CREW_MIN_ID]: { selection: 0, values: [1] },
			[EXR_CREW_MAX_ID]: { selection: 0, values: [1] },
			[EXR_IMPOSTOR_MIN_ID]: { selection: 0, values: [0] },
			[EXR_IMPOSTOR_MAX_ID]: { selection: 0, values: [0] },
			[EXR_NEUTRAL_MIN_ID]: { selection: 0, values: [0] },
			[EXR_NEUTRAL_MAX_ID]: { selection: 0, values: [0] },
			[EXR_LIBERAL_MIN_ID]: { selection: 0, values: [0] },
			[EXR_LIBERAL_MAX_ID]: { selection: 0, values: [0] },
			[EXR_MILITANT_MIN_ID]: { selection: 0, values: [0] },
			[EXR_MILITANT_MAX_ID]: { selection: 0, values: [0] },
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: {
				selection: 1,
				values: [0, 100],
			},
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_COUNT_OPTION_ID)]: {
				selection: 0,
				values: [1],
			},
		},
		auValue: {
			[AU_MAP_OPTION_ID]: 0,
			[AU_KILL_COOLDOWN_OPTION_ID]: 0,
			[AU_IMPOSTOR_COUNT_OPTION_ID]: 0,
		},
		isExROptionActive: {
			[PRESET_OPTION_UNIQUE_ID]: true,
			[EXR_RANDOM_MAP_OPTION_ID]: true,
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: true,
		},
		presetNames: {
			0: "Test Preset",
		},
	};

	it("should generate correct Markdown text", () => {
		const text = generateClipboardText(mockState, mockExrMeta, mockAuMeta);
		expect(text).toContain("# 設定(Test Preset)");
		expect(text).toContain("- マップ: Skeld");
		expect(text).toContain("- キルクールダウン時間: 10");
		expect(text).toContain(`## ${CLIPBOARD_ROLES}`);
		expect(text).toContain(`### ${CLIPBOARD_CREW}`);
		expect(text).toContain("| ExR Role | 100% | 1 |");
	});

	it("should handle random map", () => {
		const stateWithRandomMap = {
			...mockState,
			exrValue: {
				...mockState.exrValue,
				[EXR_RANDOM_MAP_OPTION_ID]: { selection: 1, values: [0, 1] },
			},
		};
		const text = generateClipboardText(
			stateWithRandomMap,
			mockExrMeta,
			mockAuMeta,
		);
		expect(text).toContain("- マップ: ランダム");
	});

	it("should handle liberal/militant roles", () => {
		const stateWithLiberal = {
			...mockState,
			exrValue: {
				...mockState.exrValue,
				[getUniqueOptionId(ExRTabId.GeneralTab, 3, SPAWN_RATE_OPTION_ID)]: {
					selection: 1,
					values: [0, 100],
				},
				[getUniqueOptionId(ExRTabId.GeneralTab, 3, SPAWN_COUNT_OPTION_ID)]: {
					selection: 0,
					values: [1],
				},
			},
			isExROptionActive: {
				...mockState.isExROptionActive,
				[getUniqueOptionId(ExRTabId.GeneralTab, 3, SPAWN_RATE_OPTION_ID)]: true,
			},
		};
		const text = generateClipboardText(
			stateWithLiberal,
			mockExrMeta,
			mockAuMeta,
		);
		expect(text).toContain("### リベラル");
		expect(text).toContain("| Liberal Category | 100% | 1 |");
	});

	it("should include vanilla roles with suffix", () => {
		const stateWithVanilla = {
			...mockState,
			auValue: {
				...mockState.auValue,
				["1000" as AuOptionId]: 1, // 100%
				["1001" as AuOptionId]: 1, // 1
				["1002" as AuOptionId]: 1, // 100%
				["1003" as AuOptionId]: 1, // 1
			},
		};
		const text = generateClipboardText(
			stateWithVanilla,
			mockExrMeta,
			mockAuMeta,
		);
		expect(text).toContain("| Scientist※バニラ | 100% | 1 |");
		expect(text).toContain("| Shapeshifter※バニラ | 100% | 1 |");
	});

	it("should include detailed settings", () => {
		const stateWithSettings = {
			...mockState,
			auValue: {
				...mockState.auValue,
				["2000" as AuOptionId]: 1, // On
			},
		};
		const text = generateClipboardText(
			stateWithSettings,
			mockExrMeta,
			mockAuMeta,
		);
		expect(text).toContain("## 詳細設定");
		expect(text).toContain("| Setting A | On |");
	});

	it("should handle missing data gracefully", () => {
		const emptyState = {
			exrValue: {},
			auValue: {},
			isExROptionActive: {},
			presetNames: {},
		};
		const text = generateClipboardText(
			emptyState as any,
			mockExrMeta,
			mockAuMeta,
		);
		expect(text).toBeDefined();
	});

	it("should handle impostor and neutral roles", () => {
		const stateWithRoles = {
			...mockState,
			exrValue: {
				...mockState.exrValue,
				[getUniqueOptionId(ExRTabId.ImpostorTab, 4, SPAWN_RATE_OPTION_ID)]: {
					selection: 1,
					values: [0, 100],
				},
				[getUniqueOptionId(ExRTabId.ImpostorTab, 4, SPAWN_COUNT_OPTION_ID)]: {
					selection: 0,
					values: [1],
				},
				[getUniqueOptionId(ExRTabId.NeutralTab, 5, SPAWN_RATE_OPTION_ID)]: {
					selection: 1,
					values: [0, 100],
				},
				[getUniqueOptionId(ExRTabId.NeutralTab, 5, SPAWN_COUNT_OPTION_ID)]: {
					selection: 0,
					values: [1],
				},
			},
			isExROptionActive: {
				...mockState.isExROptionActive,
				[getUniqueOptionId(ExRTabId.ImpostorTab, 4, SPAWN_RATE_OPTION_ID)]:
					true,
				[getUniqueOptionId(ExRTabId.NeutralTab, 5, SPAWN_RATE_OPTION_ID)]: true,
			},
		};
		const text = generateClipboardText(stateWithRoles, mockExrMeta, mockAuMeta);
		expect(text).toContain(`### ${CLIPBOARD_IMPOSTOR}`);
		expect(text).toContain("| ExR Impostor | 100% | 1 |");
		expect(text).toContain(`### ${CLIPBOARD_NEUTRAL}`);
		expect(text).toContain("| ExR Neutral | 100% | 1 |");
	});
});
