import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionItem } from "@/feature/exr/ExROptionItem";
import {
	useHasActiveOptionChild,
	useOptionActive,
} from "@/hooks/useExROptionData";
import type { UniqueOptionId } from "@/type";

vi.mock("@/hooks/useExROptionData");
vi.mock("@/feature/exr/ExROptionRecursiveItem", () => ({
	ExROptionRecursiveItem: ({
		uniqueOptionId,
		depth,
	}: {
		uniqueOptionId: UniqueOptionId;
		depth: number;
	}) => (
		<div data-testid="ex-roption-recursive-item">
			Recursive Item {uniqueOptionId} Depth {depth}
		</div>
	),
}));
vi.mock("@/feature/exr/ExROptionRow", () => ({
	ExROptionRow: ({
		uniqueOptionId,
		depth,
	}: {
		uniqueOptionId: UniqueOptionId;
		depth: number;
	}) => (
		<div data-testid="ex-roption-row">
			Row Item {uniqueOptionId} Depth {depth}
		</div>
	),
}));

describe("ExROptionItem", () => {
	const mockUniqueId = 123 as UniqueOptionId;
	const mockDepth = 1;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders nothing when not active", () => {
		vi.mocked(useOptionActive).mockReturnValue(false);
		const { container } = render(
			<ExROptionItem uniqueOptionId={mockUniqueId} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders row when active and no children", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(false);

		render(<ExROptionItem uniqueOptionId={mockUniqueId} depth={mockDepth} />);

		expect(screen.getByTestId("ex-roption-row")).toBeInTheDocument();
	});

	it("renders recursive when active and has children", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(true);

		render(<ExROptionItem uniqueOptionId={mockUniqueId} depth={mockDepth} />);

		expect(screen.getByTestId("ex-roption-recursive-item")).toBeInTheDocument();
	});

	it("renders border when withBorder is true", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(false);

		const { container } = render(
			<ExROptionItem uniqueOptionId={mockUniqueId} withBorder={true} />,
		);

		expect(container.querySelector("hr")).toBeInTheDocument();
	});

	it("uses custom separator if provided", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(false);
		const CustomSeparator = () => <div data-testid="custom-separator" />;

		render(
			<ExROptionItem
				uniqueOptionId={mockUniqueId}
				withBorder={true}
				Separator={CustomSeparator}
			/>,
		);

		expect(screen.getByTestId("custom-separator")).toBeInTheDocument();
	});

	it("renders both border and recursive item when both are appropriate", () => {
		vi.mocked(useOptionActive).mockReturnValue(true);
		vi.mocked(useHasActiveOptionChild).mockReturnValue(true);

		const { container } = render(
			<ExROptionItem uniqueOptionId={mockUniqueId} withBorder={true} />,
		);

		expect(container.querySelector("hr")).toBeInTheDocument();
		expect(screen.getByTestId("ex-roption-recursive-item")).toBeInTheDocument();
	});
});
