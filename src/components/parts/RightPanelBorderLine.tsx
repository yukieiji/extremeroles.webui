interface RightPanelBorderLineProps {
	depth?: number;
	indentMultiplier?: number;
}

export function RightPanelBorderLine({
	depth = 0,
	indentMultiplier = 0.5,
}: RightPanelBorderLineProps) {
	const paddingLeft = depth > 0 ? `${depth * indentMultiplier}rem` : "0";
	return (
		<div style={{ paddingLeft: paddingLeft }}>
			<hr className="w-[95%] mx-auto border-t border-gray-400" />
		</div>
	);
}
