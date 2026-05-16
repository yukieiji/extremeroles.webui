interface RightPanelBorderLineProps {
	depth?: number;
}

export function RightPanelBorderLine({ depth = 0 }: RightPanelBorderLineProps) {
	const paddingLeft = depth > 0 ? `${depth * 0.5}rem` : "0";
	return (
		<div style={{ paddingLeft: paddingLeft }}>
			<hr className="w-[95%] mx-auto border-t rounded-lg border-gray-400" />
		</div>
	);
}
