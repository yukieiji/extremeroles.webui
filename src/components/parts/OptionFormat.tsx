interface OptionFormatProps {
	format: string;
}

export function OptionFormat({ format }: OptionFormatProps) {
	const formattedValue = format.includes("{0}")
		? format.replace("{0}", "")
		: format;
	return format === "" ? null : (
		<span className="text-sm text-text-secondary whitespace-nowrap">
			{formattedValue}
		</span>
	);
}
