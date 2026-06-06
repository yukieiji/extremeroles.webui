import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuOptionSummaryRow } from "@/feature/rightsidepanel/summary/AuOptionSummaryRow";
import { auOptionMetaData } from "@/logics/api";
import {
	AU_MAP_OPTION_ID,
	EXR_RANDOM_MAP_OPTION_ID,
} from "@/logics/optionUtils";
import { RANDOM_MAP_LABEL } from "@/noTrans";
import { useStore } from "@/useStore";

// モック化
vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
}));

vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: () => vi.fn(),
}));

describe("AuOptionSummaryRow", () => {
	it("renders 'ランダム' when the map is randomized (EXR_RANDOM_MAP_OPTION_ID is ON)", () => {
		// auOptionMetaData の設定
		auOptionMetaData.options[AU_MAP_OPTION_ID] = {
			title: "マップ",
			format: "",
			range: ["Skeld", "MiraHQ"],
			tabId: 0,
			categoryId: 0,
		};

		// useStore の振る舞いをモック
		vi.mocked(useStore).mockImplementation((selector) => {
			return selector({
				auValue: {
					[AU_MAP_OPTION_ID]: 0,
				},
				exrValue: {
					[EXR_RANDOM_MAP_OPTION_ID]: {
						selection: 1, // ON
						values: ["オフ", "オン"],
					},
				},
			} as unknown as Parameters<typeof selector>[0]);
		});

		render(
			<AuOptionSummaryRow optionId={AU_MAP_OPTION_ID} fallbackTitle="マップ" />,
		);

		expect(screen.getByText(RANDOM_MAP_LABEL)).toBeInTheDocument();
		expect(screen.queryByText("Skeld")).not.toBeInTheDocument();
	});

	it("renders the normal map name when randomization is OFF", () => {
		vi.mocked(useStore).mockImplementation((selector) => {
			return selector({
				auValue: {
					[AU_MAP_OPTION_ID]: 1, // MiraHQ
				},
				exrValue: {
					[EXR_RANDOM_MAP_OPTION_ID]: {
						selection: 0, // OFF
						values: ["オフ", "オン"],
					},
				},
			} as unknown as Parameters<typeof selector>[0]);
		});

		render(
			<AuOptionSummaryRow optionId={AU_MAP_OPTION_ID} fallbackTitle="マップ" />,
		);

		expect(screen.getByText("MiraHQ")).toBeInTheDocument();
		expect(screen.queryByText(RANDOM_MAP_LABEL)).not.toBeInTheDocument();
	});
});
