import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionViewer } from "../src/feature/rightsidepanel/ExROptionViewer";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getAllOptions, resetApiCache } from "../src/logics/api.store";
import type { ExRTabDto, UniqueOptionId } from "../src/type";
import { ExRTabId } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExROptionViewer", () => {
	beforeEach(async () => {
		resetApiCache();
		resetExrOptionMetaData();
		useStore.getState().resetAll();
		useStore.getState().resetViewer();

		const mockExRData: ExRTabDto[] = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "General",
				Categories: [
					{
						Id: 1,
						Name: "Game Settings",
						Options: [
							{
								Id: 10,
								IsActive: true,
								TranslatedName: "Game Mode",
								Selection: 0,
								Format: "{0}",
								RangeMeta: { Type: "String", Values: ["Normal", "Hard"] },
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
						json: vi.fn().mockResolvedValue([]),
					} as unknown as Response);
				}
				return Promise.reject(new Error(`Unhandled URL: ${url}`));
			}),
		);

		await getAllOptions();
	});

	it("renders GeneralTab categories and options", async () => {
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		expect(screen.getByText("Game Settings")).toBeInTheDocument();
		expect(screen.getByText("Game Mode")).toBeInTheDocument();
		expect(screen.getByText("Normal")).toBeInTheDocument();
	});

	it("calls store actions and scroll on double click", async () => {
		const uniqueOptionId = Number(
			Object.keys(exrOptionMetaData.options)[0],
		) as unknown as UniqueOptionId;

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
		mockElement.id = `exr-option-${uniqueOptionId}`;
		vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionViewer />
				</Suspense>,
			);
		});

		const row = screen.getByText("Game Mode").closest("button");
		if (!row) {
			throw new Error("Row not found");
		}

		fireEvent.doubleClick(row);

		expect(setSelectedTabSpy).toHaveBeenCalledWith("ExR");
		expect(setSelectedExRTabIdSpy).toHaveBeenCalledWith(ExRTabId.GeneralTab);
		expect(setHighlightedExROptionIdSpy).toHaveBeenCalledWith(uniqueOptionId);

		// setTimeout の処理待ち
		await vi.waitFor(
			() => {
				expect(scrollIntoViewMock).toHaveBeenCalled();
			},
			{ timeout: 500 },
		);
	});
});
