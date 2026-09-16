import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DisabledControlTooltip } from "@/components/blocks/DisabledControlTooltip";
import { translationMetaData } from "@/logics/api";

describe("DisabledControlTooltip", () => {
	it("renders children when not disabled", () => {
		render(
			<DisabledControlTooltip disabled={false}>
				<span>Enabled Text</span>
			</DisabledControlTooltip>,
		);

		expect(screen.getByText("Enabled Text")).toBeInTheDocument();
	});

	it("uses default tooltip from translationMetaData when disabled and no custom tooltip provided", () => {
		translationMetaData.DISABLED_CONTROL_TOOLTIP =
			"前提となるオプションや役職が設定されていません";

		render(
			<DisabledControlTooltip disabled={true}>
				<span>Disabled Text</span>
			</DisabledControlTooltip>,
		);

		expect(screen.getByText("Disabled Text")).toBeInTheDocument();
	});

	it("uses custom tooltip text when provided", () => {
		render(
			<DisabledControlTooltip disabled={true} tooltipText="Custom Tooltip">
				<span>Disabled Text</span>
			</DisabledControlTooltip>,
		);

		expect(screen.getByText("Disabled Text")).toBeInTheDocument();
	});
});
