interface OptionFormatProps {
	format: string;
}

export function OptionFormat({ format }: OptionFormatProps) {
	const formattedValue = format.includes("{0}")
		? format.replace("{0}", "")
		: format;
	return format === "" ? null : (
		<span className="text-sm text-white whitespace-nowrap">
			{formattedValue}
		</span>
	);
}
