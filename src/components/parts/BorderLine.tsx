interface BorderLineProps {
	depth?: number;
}

export function BorderLine({ depth = 0 }: BorderLineProps) {
	const paddingLeft = depth > 0 ? `${depth * 1}rem` : "0";
	return (
		<div style={{ paddingLeft: paddingLeft }}>
			<hr className="w-[95%] mx-auto border-t border-gray-700" />
		</div>
	);
}
