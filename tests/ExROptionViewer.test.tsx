import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionViewer } from "../src/feature/rightsidepanel/ExROptionViewer";
import {
	exrOptionMetaData,
	resetExrOptionMetaData,
	translationMetaData,
} from "../src/logics/api";
import { getAllOptions, resetApiCache } from "../src/logics/api.store";
import {
	getUniqueOptionId,
	PRESET_OPTION_UNIQUE_ID,
} from "../src/logics/optionUtils";
import { useStore } from "../src/useStore";

describe("ExROptionViewer", () => {
	beforeEach(async () => {
		resetApiCache();
		resetExrOptionMetaData();
		useStore.getState().resetAll();
		useStore.getState().resetViewer();
		// 翻訳データの初期化
		translationMetaData.booleanTransData = ["OFF", "ON"];

		// Mock implementation of fetch
		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((input: RequestInfo | URL) => {
				const url = typeof input === "string" ? input : input.toString();
				if (url.includes("/exr/option/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue([]),
					} as unknown as Response);
				}
				if (url.includes("/au/option/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue([]),
					} as unknown as Response);
				}
				if (url.includes("/au/translation/batch/optionunit/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue([]),
					} as unknown as Response);
				}
				if (url.includes("/au/translation/batch/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue([
							{ Key: "optionOff", Result: "OFF", Param: [] },
							{ Key: "optionOn", Result: "ON", Param: [] },
						]),
					} as unknown as Response);
				}
				return Promise.reject(new Error(`Unhandled URL: ${url}`));
			}),
		);

		await getAllOptions();
	});

	it("renders preset and categories", async () => {
		// Setup meta data
		const categoryId = 1;
		const optionId = getUniqueOptionId(0, categoryId, 10);

		exrOptionMetaData.tabs[0] = {
			name: "General",
			categoryIds: [0, categoryId],
		};
		exrOptionMetaData.categories[0] = { name: "Presets", tabId: 0 };
		exrOptionMetaData.categories[categoryId] = {
			name: "Test Category",
			tabId: 0,
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[0] = [
			PRESET_OPTION_UNIQUE_ID,
		];
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [optionId];

		exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID] = {
			metaData: { translatedName: "Preset", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};
		exrOptionMetaData.options[optionId] = {
			metaData: { translatedName: "Test Option", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		useStore.getState().setExROptions(
			{
				[PRESET_OPTION_UNIQUE_ID]: { selection: 0, values: [1, 2, 3] },
				[optionId]: { selection: 0, values: [100] },
			},
			{
				[PRESET_OPTION_UNIQUE_ID]: true,
				[optionId]: true,
			},
		);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		expect(screen.getByText("Preset")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("Test Category")).toBeInTheDocument();
		expect(screen.getByText("Test Option")).toBeInTheDocument();
		expect(screen.getByText("100")).toBeInTheDocument();
	});

	it("uses preset names from store", async () => {
		const categoryId = 1;
		const optionId = getUniqueOptionId(0, categoryId, 10);

		exrOptionMetaData.tabs[0] = {
			name: "General",
			categoryIds: [0, categoryId],
		};
		exrOptionMetaData.categories[0] = { name: "Presets", tabId: 0 };
		exrOptionMetaData.categories[categoryId] = {
			name: "Test Category",
			tabId: 0,
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[0] = [
			PRESET_OPTION_UNIQUE_ID,
		];
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [optionId];

		exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID] = {
			metaData: { translatedName: "Preset", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};
		exrOptionMetaData.options[optionId] = {
			metaData: { translatedName: "Test Option", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		useStore.getState().setExROptions(
			{
				[PRESET_OPTION_UNIQUE_ID]: { selection: 1, values: [1, 2, 3] },
				[optionId]: { selection: 0, values: [100] },
			},
			{
				[PRESET_OPTION_UNIQUE_ID]: true,
				[optionId]: true,
			},
		);
		useStore.getState().updatePresetName(1, "My Custom Preset");

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		expect(screen.getByText("My Custom Preset")).toBeInTheDocument();
		expect(screen.queryByText("2")).not.toBeInTheDocument();
		expect(screen.getByText("Test Option")).toBeInTheDocument();
		expect(screen.getByText("100")).toBeInTheDocument();
	});

	it("renders min-max pairs as XX-XX", async () => {
		const categoryId = 5;
		const minId = getUniqueOptionId(0, categoryId, 10);
		const maxId = getUniqueOptionId(0, categoryId, 11);

		exrOptionMetaData.tabs[0] = { name: "General", categoryIds: [categoryId] };
		exrOptionMetaData.categories[categoryId] = {
			name: "Role Settings",
			tabId: 0,
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [minId, maxId];

		exrOptionMetaData.options[minId] = {
			metaData: {
				translatedName: "Role Count 最小",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};
		exrOptionMetaData.options[maxId] = {
			metaData: {
				translatedName: "Role Count 最大",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};

		useStore.getState().setExROptions(
			{
				[minId]: { selection: 1, values: [0, 1, 2] },
				[maxId]: { selection: 2, values: [0, 1, 2] },
			},
			{
				[minId]: true,
				[maxId]: true,
			},
		);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		expect(screen.getByText("Role Count")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("-")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("filters out inactive options and empty categories", async () => {
		const categoryId = 1;
		const optionId = getUniqueOptionId(0, categoryId, 10);

		exrOptionMetaData.tabs[0] = { name: "General", categoryIds: [categoryId] };
		exrOptionMetaData.categories[categoryId] = {
			name: "Test Category",
			tabId: 0,
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [optionId];

		exrOptionMetaData.options[optionId] = {
			metaData: { translatedName: "Test Option", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		// Option is inactive
		useStore
			.getState()
			.setExROptions(
				{ [optionId]: { selection: 0, values: [100] } },
				{ [optionId]: false },
			);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		expect(screen.queryByText("Test Category")).not.toBeInTheDocument();
		expect(screen.queryByText("Test Option")).not.toBeInTheDocument();
	});

	it("navigates on double click", async () => {
		const categoryId = 1;
		const optionId = getUniqueOptionId(0, categoryId, 10);

		exrOptionMetaData.tabs[0] = { name: "General", categoryIds: [categoryId] };
		exrOptionMetaData.categories[categoryId] = {
			name: "Test Category",
			tabId: 0,
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [optionId];
		exrOptionMetaData.options[optionId] = {
			metaData: { translatedName: "Test Option", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		useStore
			.getState()
			.setExROptions(
				{ [optionId]: { selection: 0, values: [100] } },
				{ [optionId]: true },
			);

		const setSelectedTabSpy = vi.spyOn(useStore.getState(), "setSelectedTab");
		const setSelectedExRTabIdSpy = vi.spyOn(
			useStore.getState(),
			"setSelectedExRTabId",
		);

		// scrollIntoView mock
		const scrollIntoViewMock = vi.fn();
		window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		const mockElement = document.createElement("div");
		mockElement.id = `exr-option-${optionId}`;
		vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		const row = screen.getByText("Test Option").closest("button");
		if (!row) {
			throw new Error("Row not found");
		}

		fireEvent.doubleClick(row);

		expect(setSelectedTabSpy).toHaveBeenCalledWith("ExR");
		expect(setSelectedExRTabIdSpy).toHaveBeenCalledWith(0);
	});
});
