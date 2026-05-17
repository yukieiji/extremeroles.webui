import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionRowView } from "@/feature/rightsidepanel/ExROptionRowView";
import { useOptionData } from "@/hooks/useExROptionData";
import { useExROptionNavigation } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import type { UniqueOptionId } from "@/type";

vi.mock("@/hooks/useExROptionData");
vi.mock("@/hooks/useOptionNavigation");

describe("ExROptionRowView and Content", () => {
	const mockUniqueId = 123 as UniqueOptionId;

	beforeEach(() => {
		resetExrOptionMetaData();
		vi.clearAllMocks();

		exrOptionMetaData.options[mockUniqueId] = {
			metaData: {
				translatedName: "Test Option",
				format: "{0} units",
				type: "Int32",
			},
			childOptionIds: [],
		};

		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [10, 20, 30],
		});

		vi.mocked(useExROptionNavigation).mockReturnValue(() => {});
	});

	it("renders option name and value correctly", () => {
		render(<ExROptionRowView uniqueOptionId={mockUniqueId} isLeaf={true} />);

		expect(screen.getByText("Test Option")).toBeInTheDocument();
		expect(screen.getByText("10")).toBeInTheDocument();
		expect(screen.getByText("units")).toBeInTheDocument();
	});

	it("renders correctly when not a leaf", () => {
		render(<ExROptionRowView uniqueOptionId={mockUniqueId} isLeaf={false} />);

		expect(screen.getByText("Test Option")).toBeInTheDocument();
		expect(screen.getByText("10")).toBeInTheDocument();
	});

	it("calls navigate on double click", () => {
		const navigateSpy = vi.fn();
		vi.mocked(useExROptionNavigation).mockReturnValue(navigateSpy);

		render(<ExROptionRowView uniqueOptionId={mockUniqueId} />);

		const _row = screen.getByText("Test Option").closest("div");
		// ViewerOptionRow implementation might have the listener on a specific element.
		// Let's try to find the row by title and fire double click.
		fireEvent.doubleClick(screen.getByText("Test Option"));

		expect(navigateSpy).toHaveBeenCalled();
	});

	it("returns null if option metadata is missing", () => {
		const missingId = 999 as UniqueOptionId;
		const { container } = render(
			<ExROptionRowView uniqueOptionId={missingId} />,
		);
		expect(container.firstChild).toBeNull();
	});
});
