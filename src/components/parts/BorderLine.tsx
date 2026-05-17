interface BorderLineProps {
	depth?: number;
	indentMultiplier?: number;
}

import { calculateIndentation } from "@/logics/optionUtils";

export function BorderLine({
	depth = 0,
	indentMultiplier = 1,
	className = "",
}: BorderLineProps & { className?: string }) {
	const paddingLeft = calculateIndentation(depth, indentMultiplier);
	return (
		<div style={{ paddingLeft: paddingLeft }} className={className}>
			<hr className="w-[95%] mx-auto border-t border-gray-700" />
		</div>
	);
}
