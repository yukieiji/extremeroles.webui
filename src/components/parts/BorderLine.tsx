interface BorderLineProps {
	depth?: number;
	indentMultiplier?: number;
}

export function BorderLine({
	depth = 0,
	indentMultiplier = 1,
}: BorderLineProps) {
	const paddingLeft = depth > 0 ? `${depth * indentMultiplier}rem` : "0";
	return (
		<div style={{ paddingLeft: paddingLeft }}>
			<hr className="w-[95%] mx-auto border-t border-gray-700" />
		</div>
	);
}
