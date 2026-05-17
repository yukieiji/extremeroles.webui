import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuOptionRow } from "@/feature/amongus/AuOptionRow";
import { auOptionMetaData, resetAuOptionMetaData } from "@/logics/api";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";

describe("AuOptionRow Internal", () => {
	const mockAuId = 123 as unknown as AuOptionId;

	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetAll();
		vi.clearAllMocks();
	});

	it("renders null if option metadata is missing", () => {
		const { container } = render(<AuOptionRow auOptionId={mockAuId} />);
		expect(container.firstChild).toBeNull();
	});

	it("renders border when withBorder is true", () => {
		auOptionMetaData.options[mockAuId] = {
			title: "Test Option",
			format: "{0}",
			range: [0, 1],
		};

		const { container } = render(
			<AuOptionRow auOptionId={mockAuId} withBorder={true} />,
		);

		expect(container.querySelector("hr")).toBeInTheDocument();
		expect(screen.getByText("Test Option")).toBeInTheDocument();
	});

	it("does not render border when withBorder is false", () => {
		auOptionMetaData.options[mockAuId] = {
			title: "Test Option",
			format: "{0}",
			range: [0, 1],
		};

		const { container } = render(
			<AuOptionRow auOptionId={mockAuId} withBorder={false} />,
		);

		expect(container.querySelector("hr")).not.toBeInTheDocument();
	});

	it("uses custom separator if provided", () => {
		auOptionMetaData.options[mockAuId] = {
			title: "Test Option",
			format: "{0}",
			range: [0, 1],
		};
		const CustomSeparator = () => <div data-testid="custom-separator" />;

		render(
			<AuOptionRow
				auOptionId={mockAuId}
				withBorder={true}
				Separator={CustomSeparator}
			/>,
		);

		expect(screen.getByTestId("custom-separator")).toBeInTheDocument();
	});
});
