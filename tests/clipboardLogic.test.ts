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
	type UniqueOptionId,
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
			[EXR_CREW_MIN_ID]: {
				metaData: {
					translatedName: "クルーのロール数 最小",
					format: "",
					type: "",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[EXR_IMPOSTOR_MIN_ID]: {
				metaData: {
					translatedName: "インポスターのロール数 最小",
					format: "",
					type: "",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[EXR_NEUTRAL_MIN_ID]: {
				metaData: {
					translatedName: "第3陣営のロール数 最小",
					format: "",
					type: "",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[EXR_LIBERAL_MIN_ID]: {
				metaData: {
					translatedName: "リベラルのロール数 最小",
					format: "",
					type: "",
				},
				childOptionIds: [],
				parentOptionIds: [],
			},
			[EXR_MILITANT_MIN_ID]: {
				metaData: {
					translatedName: "ミリタントのロール数 最小",
					format: "",
					type: "",
				},
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
				title: "マップ",
				range: ["Skeld", "Mira", "Polus", "Airship"],
				tabId: 0,
				categoryId: 0,
				format: "",
			},
			[AU_KILL_COOLDOWN_OPTION_ID]: {
				title: "キルクールダウン時間",
				range: [10, 15, 20],
				tabId: 0,
				categoryId: 1,
				format: "",
			},
			[AU_IMPOSTOR_COUNT_OPTION_ID]: {
				title: "インポスター人数",
				range: [1, 2, 3],
				tabId: 0,
				categoryId: 1,
				format: "",
			},
			["1000" as AuOptionId]: {
				title: "Chance",
				range: [0, 100],
				tabId: 0, // Crew
				categoryId: 5,
				format: "",
			},
			["1001" as AuOptionId]: {
				title: "Max",
				range: [0, 1],
				tabId: 0, // Crew
				categoryId: 5,
				format: "",
			},
			["1002" as AuOptionId]: {
				title: "Chance",
				range: [0, 100],
				tabId: 1, // Impostor
				categoryId: 6,
				format: "",
			},
			["1003" as AuOptionId]: {
				title: "Max",
				range: [0, 1],
				tabId: 1, // Impostor
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
				tabId: 0, // Crew
			},
			6: {
				name: "Shapeshifter",
				options: ["1002" as AuOptionId, "1003" as AuOptionId],
				tabId: 1, // Impostor
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
			["2000" as AuOptionId]: 0,
		},
		isExROptionActive: {
			[PRESET_OPTION_UNIQUE_ID]: true,
			[EXR_RANDOM_MAP_OPTION_ID]: true,
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: true,
			["2000" as AuOptionId]: true,
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
		expect(text).toContain(" - ExR Role - 1 / 100％");
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

	it("should handle liberal/militant roles and omit militant if 0", () => {
		const stateWithLiberal = {
			...mockState,
			exrValue: {
				...mockState.exrValue,
				[EXR_LIBERAL_MIN_ID]: { selection: 0, values: [1] },
				[EXR_LIBERAL_MAX_ID]: { selection: 0, values: [1] },
				[EXR_MILITANT_MIN_ID]: { selection: 0, values: [0] },
				[EXR_MILITANT_MAX_ID]: { selection: 0, values: [0] },
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
		expect(text).toContain("リベラルのロール数: 1");
		expect(text).not.toContain("ミリタントのロール数");
	});

	it("should include vanilla roles with suffix and order them before ExR roles", () => {
		const stateWithVanilla = {
			...mockState,
			auValue: {
				...mockState.auValue,
				["1000" as AuOptionId]: 1, // 100%
				["1001" as AuOptionId]: 1, // 1
			},
		};
		const text = generateClipboardText(
			stateWithVanilla,
			mockExrMeta,
			mockAuMeta,
		);
		expect(text).toContain(" - Scientist※バニラ - 1 / 100％");
		// Scientist (Vanilla) should be before ExR Role in Crew section
		const vanillaPos = text.indexOf("Scientist※バニラ");
		const exrPos = text.indexOf("ExR Role");
		expect(vanillaPos).toBeLessThan(exrPos);
	});

	it("should include detailed settings including child options", () => {
		const childOptionId = 500 as unknown as UniqueOptionId;
		const metaWithChild = {
			...mockExrMeta,
			options: {
				...mockExrMeta.options,
				[100 as unknown as UniqueOptionId]: {
					metaData: { translatedName: "Parent Option", format: "", type: "" },
					childOptionIds: [childOptionId],
					parentOptionIds: [],
				},
				[childOptionId]: {
					metaData: { translatedName: "Child Option", format: "", type: "" },
					childOptionIds: [],
					parentOptionIds: [100 as unknown as UniqueOptionId],
				},
			},
			globalCategoryIdTopLevelMap: {
				...mockExrMeta.globalCategoryIdTopLevelMap,
				1: [PRESET_OPTION_UNIQUE_ID, 100 as unknown as UniqueOptionId],
			},
		};

		const stateWithSettings = {
			...mockState,
			exrValue: {
				...mockState.exrValue,
				[100 as unknown as UniqueOptionId]: { selection: 0, values: ["Val"] },
				[childOptionId]: { selection: 0, values: ["ChildVal"] },
			},
			auValue: {
				...mockState.auValue,
				["2000" as AuOptionId]: 1, // On
			},
			isExROptionActive: {
				...mockState.isExROptionActive,
				[100 as unknown as UniqueOptionId]: true,
				[childOptionId]: true,
				["2000" as AuOptionId]: true,
			},
		};
		const text = generateClipboardText(
			stateWithSettings,
			metaWithChild as unknown as ExROptionMetaDataRecords,
			mockAuMeta,
		);
		expect(text).toContain("## 詳細設定");
		expect(text).toContain("- Setting A : On");
		expect(text).toContain("- Parent Option : Val");
		expect(text).toContain("  - Child Option : ChildVal");
	});

	it("should handle missing data gracefully and omit zero counts", () => {
		const emptyState = {
			exrValue: {},
			auValue: {},
			isExROptionActive: {},
			presetNames: {},
		};
		const text = generateClipboardText(
			emptyState as unknown as ClipboardState,
			mockExrMeta,
			mockAuMeta,
		);
		expect(text).toBeDefined();
		expect(text).not.toContain("クルーのロール数");
		expect(text).not.toContain("インポスターのロール数");
		expect(text).not.toContain("第3陣営のロール数");
		expect(text).not.toContain("リベラルのロール数");
	});

	it("should correctly format values even if {0} is missing in format string", () => {
		const metaWithPercent = {
			...mockExrMeta,
			options: {
				...mockExrMeta.options,
				[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: {
					metaData: {
						translatedName: "Spawn Rate",
						format: "％",
						type: "Int32",
					},
					childOptionIds: [],
					parentOptionIds: [],
				},
			},
		};
		const text = generateClipboardText(
			mockState,
			metaWithPercent as unknown as ExROptionMetaDataRecords,
			mockAuMeta,
		);
		expect(text).toContain(" - ExR Role - 1 / 100％");
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
		expect(text).toContain(" - ExR Impostor - 1 / 100％");
		expect(text).toContain(`### ${CLIPBOARD_NEUTRAL}`);
		expect(text).toContain(" - ExR Neutral - 1 / 100％");
	});

	it("should clean color tags and replace newlines with spaces", () => {
		const metaWithTags = {
			...mockExrMeta,
			categories: {
				...mockExrMeta.categories,
				2: {
					name: "<color=#FF0000>Spawn\nRate</color>",
					tabId: ExRTabId.CrewmateTab,
				},
			},
		};
		const text = generateClipboardText(
			mockState,
			metaWithTags as unknown as ExROptionMetaDataRecords,
			mockAuMeta,
		);
		expect(text).toContain(" - Spawn Rate - 1 / 100％");
		expect(text).not.toContain("<color");
		expect(text).not.toContain("\nRate");
	});
});
