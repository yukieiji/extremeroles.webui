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
import { getUniqueOptionId } from "../src/logics/optionUtils";
import { ExRTabId, type UniqueOptionId } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExROptionViewer", () => {
	beforeEach(async () => {
		resetApiCache();
		resetExrOptionMetaData();
		useStore.getState().resetAll();
		useStore.getState().resetViewer();
		translationMetaData.booleanTransData = ["OFF", "ON"];

		const mockExRData = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "General",
				Categories: [
					{
						Id: 1,
						Name: "Random Settings",
						Options: [
							{
								Id: 10,
								TranslatedName: "Option 1",
								IsActive: true,
								Selection: 0,
								Format: "{0}",
								RangeMeta: { Type: "Int32", Values: [0, 1] },
								Childs: [],
							},
						],
					},
				],
			},
		];

		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((input: RequestInfo | URL) => {
				const url = typeof input === "string" ? input : input.toString();
				if (url.includes("/exr/option/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue(mockExRData),
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

	it("renders General Tab categories and options", async () => {
		const uniqueId = getUniqueOptionId(ExRTabId.GeneralTab, 1, 10);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		expect(screen.getByText("Random Settings")).toBeInTheDocument();
		expect(screen.getByText("Option 1")).toBeInTheDocument();
		expect(screen.getByText("0")).toBeInTheDocument();
	});

	it("groups Min-Max option pairs", async () => {
		// モックデータをMin-Maxペアを含むように上書き
		const minId = 11;
		const maxId = 12;
		const minUniqueId = getUniqueOptionId(ExRTabId.GeneralTab, 1, minId);
		const maxUniqueId = getUniqueOptionId(ExRTabId.GeneralTab, 1, maxId);

		exrOptionMetaData.options[minUniqueId] = {
			metaData: {
				translatedName: "Count Min",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};
		exrOptionMetaData.options[maxUniqueId] = {
			metaData: {
				translatedName: "Count Max",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[1] = [minUniqueId, maxUniqueId];

		useStore.getState().setExROptions(
			{
				[minUniqueId]: { selection: 0, values: [1, 2] },
				[maxUniqueId]: { selection: 1, values: [1, 2] },
			},
			{
				[minUniqueId]: true,
				[maxUniqueId]: true,
			},
		);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		expect(screen.getByText("Count")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("-")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("uses preset names from store", async () => {
		const presetUniqueId = getUniqueOptionId(ExRTabId.GeneralTab, 0, 0);

		// カテゴリ0, オプション0 はプリセットとして扱われる
		exrOptionMetaData.categories[0] = {
			name: "Preset",
			tabId: ExRTabId.GeneralTab,
		};
		exrOptionMetaData.tabs[ExRTabId.GeneralTab].categoryIds.unshift(0);
		exrOptionMetaData.globalCategoryIdTopLevelMap[0] = [presetUniqueId];
		exrOptionMetaData.options[presetUniqueId] = {
			metaData: {
				translatedName: "Preset",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};

		useStore.getState().setExROptions(
			{ [presetUniqueId]: { selection: 1, values: [1, 2] } },
			{ [presetUniqueId]: true },
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
	});

	it("navigates and highlights on double click", async () => {
		const uniqueId = getUniqueOptionId(ExRTabId.GeneralTab, 1, 10);

		const setSelectedTabSpy = vi.spyOn(useStore.getState(), "setSelectedTab");
		const setSelectedExRTabIdSpy = vi.spyOn(
			useStore.getState(),
			"setSelectedExRTabId",
		);
		const setHighlightedExROptionIdSpy = vi.spyOn(
			useStore.getState(),
			"setHighlightedExROptionId",
		);

		// scrollIntoView のモック
		const scrollIntoViewMock = vi.fn();
		window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		// getElementById のモック
		const mockElement = document.createElement("div");
		mockElement.id = `exr-option-${uniqueId}`;
		vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		const row = screen.getByText("Option 1").closest("button");
		if (!row) {
			throw new Error("Row not found");
		}

		fireEvent.doubleClick(row);

		expect(setSelectedTabSpy).toHaveBeenCalledWith("ExR");
		expect(setSelectedExRTabIdSpy).toHaveBeenCalledWith(ExRTabId.GeneralTab);
		expect(setHighlightedExROptionIdSpy).toHaveBeenCalledWith(uniqueId);

		// setTimeout の処理待ち
		await vi.waitFor(
			() => {
				expect(scrollIntoViewMock).toHaveBeenCalled();
			},
			{ timeout: 500 },
		);
	});
});
