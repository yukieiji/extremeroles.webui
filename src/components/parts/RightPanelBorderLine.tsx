interface RightPanelBorderLineProps {
	depth?: number;
	indentMultiplier?: number;
}

import { calculateIndentation } from "@/logics/optionUtils";

export function RightPanelBorderLine({
	depth = 0,
	indentMultiplier = 0.5,
}: RightPanelBorderLineProps) {
	const paddingLeft = calculateIndentation(depth, indentMultiplier);
	return (
		<div style={{ paddingLeft: paddingLeft }}>
			<hr className="w-[95%] mx-auto border-t border-gray-400" />
		</div>
	);
}
