import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExROptionViewer } from "../src/feature/rightsidepanel/ExROptionViewer";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import type { OptionTab } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExROptionViewer Component", () => {
	it("renders all 7 role tabs if they have metadata", () => {
		resetExrOptionMetaData();

		// Setup metadata for all 7 tabs
		for (let i = 1; i <= 7; i++) {
			const tabId = i as OptionTab;
			exrOptionMetaData.tabs[tabId] = {
				name: `Tab ${i}`,
				categoryIds: [i * 100],
			};
			// Also need a category and active options for it to actually render anything
			const categoryId = i * 100;
			exrOptionMetaData.categories[categoryId] = {
				name: `Role ${i}`,
				tabId: tabId,
			};

			const rateId = getUniqueOptionId(tabId, categoryId, 50);
			const countId = getUniqueOptionId(tabId, categoryId, 51);

			useStore.setState((state) => ({
				exrValue: {
					...state.exrValue,
					[rateId]: { selection: 1, values: [0, 100] },
					[countId]: { selection: 1, values: [0, 1] },
				},
			}));
		}

		render(<ExROptionViewer />);

		for (let i = 1; i <= 7; i++) {
			expect(screen.getByText(`Tab ${i}`)).toBeInTheDocument();
		}
	});
});
