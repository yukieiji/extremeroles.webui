import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRStandardCategoryItem } from "../src/feature/ExRStandardCategoryItem";
import * as api from "../src/logics/api";
import type { ExRCategoryDto } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRStandardCategoryItem", () => {
	const mockCategory: ExRCategoryDto = {
		Id: 1,
		Name: "Test Category",
		Options: [
			{
				Id: 101,
				IsActive: true,
				TranslatedName: "Option 1",
				Selection: 0,
				Format: "{0}",
				RangeMeta: { Type: "Int32", Values: [0, 1] },
				Childs: [],
			},
		],
	};

	beforeEach(() => {
		vi.restoreAllMocks();
		useStore.getState().resetViewer();
		vi.spyOn(api, "getExrCategoryOptions").mockResolvedValue(mockCategory);
	});

	it("should render category name", async () => {
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExRStandardCategoryItem categoryId={1} />
				</Suspense>,
			);
		});

		expect(await screen.findByText("Test Category")).toBeInTheDocument();
	});
});
