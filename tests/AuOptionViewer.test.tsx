import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuOptionViewer } from "@/feature/rightsidepanel/AuOptionViewer";
import {
	auOptionMetaData,
	resetAuOptionMetaData,
	translationMetaData,
} from "@/logics/api";
import { getAllOptions, resetApiCache } from "@/logics/api.store";
import type { AuOptionCategoryDto, AuOptionId } from "@/type";
import { useStore } from "@/useStore";

describe("AuOptionViewer", () => {
	beforeEach(async () => {
		resetApiCache();
		resetAuOptionMetaData();
		useStore.getState().resetAll();
		useStore.getState().resetViewer();
		// 翻訳データの初期化
		translationMetaData.booleanTransData = ["OFF", "ON"];

		const mockAuData: AuOptionCategoryDto[] = [
			{
				TranslatedTitle: "Map",
				Options: [
					{
						TranslatedTitle: "Map",
						TranslatedFormat: "{0}",
						Value: 0,
						Info: { ValueType: 2, OptionName: 1 },
						Range: ["The Skeld", "Mira HQ"],
					},
				],
			},
			{
				TranslatedTitle: "Game Settings",
				Options: [
					{
						TranslatedTitle: "Anonymous Voting",
						TranslatedFormat: "{0}",
						Value: true,
						Info: { ValueType: 0, OptionName: 2 },
					},
				],
			},
		];

		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((input: RequestInfo | URL) => {
				const url = typeof input === "string" ? input : input.toString();
				if (url.includes("/au/option/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue(mockAuData),
					} as unknown as Response);
				}
				if (url.includes("/exr/option/")) {
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
				if (url.includes("/exr/role/filter/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue({
							FilterSet: {},
							FilterRoleId: [],
							NormalRoleId: {},
							CombinationId: {},
							GhostRoleId: {},
						}),
					} as unknown as Response);
				}
				return Promise.reject(new Error(`Unhandled URL: ${url}`));
			}),
		);

		await getAllOptions();
	});

	it("renders Tab 0 categories and options", async () => {
		const optionId = 100 as unknown as AuOptionId;
		auOptionMetaData.tabCategoryMap = { 0: [1], 1: [], 2: [] };
		auOptionMetaData.categoryMetaData = {
			1: { name: "Game Settings", options: [optionId] },
		};
		auOptionMetaData.options[optionId] = {
			title: "Map",
			format: "{0}",
			range: ["The Skeld", "Mira HQ"],
		};
		useStore.getState().setAuValue({ [optionId]: 0 });

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<AuOptionViewer />
				</Suspense>,
			);
		});

		// マップカテゴリ（index 0）は AuOptionViewer からは非表示になった（RightSidePanelSummary で表示される）
		expect(screen.queryByText("Map")).not.toBeInTheDocument();
		expect(screen.queryByText("The Skeld")).not.toBeInTheDocument();
	});

	it("uses translation data for boolean values", async () => {
		// mockAuData の 2番目のオプション (Anonymous Voting, ValueType 0) を使用
		const boolOptionId = auOptionMetaData.categoryMetaData[1].options[0];

		// 翻訳テキストを設定
		translationMetaData.booleanTransData = ["無効", "有効"];
		useStore.getState().setAuValue({ [boolOptionId]: 1 });

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<AuOptionViewer />
				</Suspense>,
			);
		});

		// Boolean値はColoredText経由で表示される
		expect(screen.getByText("有効")).toBeInTheDocument();
	});

	it("calls store actions and scroll on double click", async () => {
		const optionId = auOptionMetaData.categoryMetaData[1].options[0];

		const setSelectedTabSpy = vi.spyOn(useStore.getState(), "setSelectedTab");
		const setSelectedAuTabIdSpy = vi.spyOn(
			useStore.getState(),
			"setSelectedAuTabId",
		);
		const setHighlightedAuOptionIdSpy = vi.spyOn(
			useStore.getState(),
			"setHighlightedAuOptionId",
		);

		// scrollIntoView のモック
		const scrollIntoViewMock = vi.fn();
		window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		// getElementById のモック
		const mockElement = document.createElement("div");
		mockElement.id = `au-option-${optionId}`;
		vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<AuOptionViewer />
				</Suspense>,
			);
		});

		const row = screen.getByText("Anonymous Voting").closest("button");
		if (!row) {
			throw new Error("Row not found");
		}

		fireEvent.doubleClick(row);

		expect(setSelectedTabSpy).toHaveBeenCalledWith("Au");
		expect(setSelectedAuTabIdSpy).toHaveBeenCalledWith(0);
		expect(setHighlightedAuOptionIdSpy).toHaveBeenCalledWith(optionId);

		// setTimeout の処理待ち
		await vi.waitFor(
			() => {
				expect(scrollIntoViewMock).toHaveBeenCalled();
			},
			{ timeout: 500 },
		);
	});
});
