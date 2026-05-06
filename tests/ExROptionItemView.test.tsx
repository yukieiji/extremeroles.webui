import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionItemView } from "@/feature/rightsidepanel/ExROptionItemView";
import {
	useHasActiveOptionChild,
	useOptionActive,
} from "@/hooks/useExROptionData";
import type { UniqueOptionId } from "@/type";

vi.mock("@/hooks/useExROptionData");
vi.mock("@/feature/rightsidepanel/ExROptionRecursiveItemView", () => ({
	ExROptionRecursiveItemView: ({
		uniqueOptionId,
		depth,
	}: {
		uniqueOptionId: UniqueOptionId;
		depth: number;
	}) => (
		<div data-testid="ex-roption-recursive-item-view">
			Recursive Item {uniqueOptionId} Depth {depth}
		</div>
	),
}));
vi.mock("@/feature/rightsidepanel/ExROptionRowView", () => ({
	ExROptionRowView: ({
		uniqueOptionId,
		depth,
	}: {
		uniqueOptionId: UniqueOptionId;
		depth: number;
	}) => (
		<div data-testid="ex-roption-row-view">
			Row Item {uniqueOptionId} Depth {depth}
		</div>
	),
}));

describe("ExROptionItemView", () => {
	const mockUniqueId = 123 as UniqueOptionId;
	const mockDepth = 1;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders nothing when the option is not active", () => {
		vi.mocked(useOptionActive).mockReturnValue(false);

		const { container } = render(
			<ExROptionItemView uniqueOptionId={mockUniqueId} depth={mockDepth} />,
		);

		expect(container.firstChild).toBeNull();
	});

	it("renders ExROptionRowView when the option is active and has no active children", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(false);

		render(
			<ExROptionItemView uniqueOptionId={mockUniqueId} depth={mockDepth} />,
		);

		expect(screen.getByTestId("ex-roption-row-view")).toBeInTheDocument();
		expect(
			screen.getByText(`Row Item ${mockUniqueId} Depth ${mockDepth}`),
		).toBeInTheDocument();
	});

	it("renders ExROptionRecursiveItemView when the option is active and has active children", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(true);

		render(
			<ExROptionItemView uniqueOptionId={mockUniqueId} depth={mockDepth} />,
		);

		expect(
			screen.getByTestId("ex-roption-recursive-item-view"),
		).toBeInTheDocument();
		expect(
			screen.getByText(`Recursive Item ${mockUniqueId} Depth ${mockDepth}`),
		).toBeInTheDocument();
	});

	it("uses default depth of 0 when depth prop is not provided", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(false);

		render(<ExROptionItemView uniqueOptionId={mockUniqueId} />);

		expect(
			screen.getByText(`Row Item ${mockUniqueId} Depth 0`),
		).toBeInTheDocument();
	});
});
