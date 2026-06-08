import { describe, expect, it } from "vitest";
import { generateClipboardText } from "@/logics/clipboardLogic";
import { ExRTabId, OptionValueType, SPAWN_RATE_OPTION_ID, SPAWN_COUNT_OPTION_ID } from "@/type";
import {
	getUniqueOptionId,
	getAuOptionId,
	AU_MAP_OPTION_ID,
	AU_KILL_COOLDOWN_OPTION_ID,
	AU_IMPOSTOR_COUNT_OPTION_ID,
	PRESET_OPTION_UNIQUE_ID,
	EXR_CREW_MIN_ID,
	EXR_CREW_MAX_ID,
	EXR_IMPOSTOR_MIN_ID,
	EXR_IMPOSTOR_MAX_ID,
	EXR_NEUTRAL_MIN_ID,
	EXR_NEUTRAL_MAX_ID,
	EXR_LIBERAL_MIN_ID,
	EXR_LIBERAL_MAX_ID,
	EXR_MILITANT_MIN_ID,
	EXR_MILITANT_MAX_ID,
} from "@/logics/optionUtils";

describe("generateClipboardText", () => {
	const mockExrMeta = {
		tabs: {
			[ExRTabId.GeneralTab]: { name: "General", categoryIds: [1], colors: [] },
			[ExRTabId.CrewmateTab]: { name: "Crewmate", categoryIds: [2], colors: [] },
			[ExRTabId.ImpostorTab]: { name: "Impostor", categoryIds: [], colors: [] },
			[ExRTabId.NeutralTab]: { name: "Neutral", categoryIds: [], colors: [] },
		},
		categories: {
			1: { name: "Preset Category", tabId: ExRTabId.GeneralTab },
			2: { name: "ExR Role", tabId: ExRTabId.CrewmateTab },
		},
		options: {
			[PRESET_OPTION_UNIQUE_ID]: { metaData: { translatedName: "Preset", format: "", type: "Int32" }, childOptionIds: [] },
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: { metaData: { translatedName: "Spawn Rate", format: "{0}%", type: "Int32" }, childOptionIds: [] },
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_COUNT_OPTION_ID)]: { metaData: { translatedName: "Spawn Count", format: "", type: "Int32" }, childOptionIds: [] },
		},
		globalCategoryIdTopLevelMap: {
			1: [PRESET_OPTION_UNIQUE_ID],
		},
	} as any;

	const mockAuMeta = {
		options: {
			[AU_MAP_OPTION_ID]: { title: "Map", range: ["Skeld", "Mira", "Polus", "Airship"], tabId: 0, categoryId: 0 },
			[AU_KILL_COOLDOWN_OPTION_ID]: { title: "Kill Cooldown", range: [10, 15, 20], tabId: 0, categoryId: 1 },
			[AU_IMPOSTOR_COUNT_OPTION_ID]: { title: "Impostor Count", range: [1, 2, 3], tabId: 0, categoryId: 1 },
		},
		tabCategoryMap: {
			0: [0, 1],
		},
		categoryMetaData: {
			0: { name: "Map Category", options: [AU_MAP_OPTION_ID], tabId: 0 },
			1: { name: "Game Category", options: [AU_KILL_COOLDOWN_OPTION_ID, AU_IMPOSTOR_COUNT_OPTION_ID], tabId: 0 },
		},
	} as any;

	const mockState = {
		exrValue: {
			[PRESET_OPTION_UNIQUE_ID]: { selection: 0, values: [1] },
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
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: { selection: 1, values: [0, 100] },
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_COUNT_OPTION_ID)]: { selection: 0, values: [1] },
		},
		auValue: {
			[AU_MAP_OPTION_ID]: 0,
			[AU_KILL_COOLDOWN_OPTION_ID]: 0,
			[AU_IMPOSTOR_COUNT_OPTION_ID]: 0,
		},
		isExROptionActive: {
			[PRESET_OPTION_UNIQUE_ID]: true,
			[getUniqueOptionId(ExRTabId.CrewmateTab, 2, SPAWN_RATE_OPTION_ID)]: true,
		},
		presetNames: {
			0: "Test Preset",
		},
	} as any;

	it("should generate correct Markdown text", () => {
		const text = generateClipboardText(mockState, mockExrMeta, mockAuMeta);
		expect(text).toContain("# 設定(Test Preset)");
		expect(text).toContain("- マップ: Skeld");
		expect(text).toContain("- キルクールダウン時間: 10");
		expect(text).toContain("### クルー");
		expect(text).toContain("| ExR Role | 100% | 1 |");
	});
});
