import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { TYPOGRAPHY } from "@/designConstants";

interface BaseRoleSummaryRowProps {
	name: string;
	displayValue: string;
	onDoubleClick: () => void;
	"data-testid"?: string;
}

export function BaseRoleSummaryRow({
	name,
	displayValue,
	onDoubleClick,
	"data-testid": dataTestId,
}: BaseRoleSummaryRowProps) {
	return (
		<ViewerOptionRow
			data-testid={dataTestId}
			title={<ColoredText text={name} className={TYPOGRAPHY.CHILD_LABEL} />}
			value={displayValue}
			onDoubleClick={onDoubleClick}
		/>
	);
}
