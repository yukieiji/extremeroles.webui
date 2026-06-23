interface BorderLineProps {
	depth?: number;
	indentMultiplier?: number;
}

import { calculateIndentation } from "@/logics/optionUtils";

export function BorderLine({
	depth = 0,
	indentMultiplier = 1,
}: BorderLineProps) {
	const paddingLeft = calculateIndentation(depth, indentMultiplier);
	return (
		<div style={{ paddingLeft: paddingLeft }}>
			<hr className="border-t border-border-weak" />
		</div>
	);
}
