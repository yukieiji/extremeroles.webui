interface OptionFormatProps {
	format: string;
}

import { TYPOGRAPHY } from "@/designConstants";

export function OptionFormat({ format }: OptionFormatProps) {
	const formattedValue = format.includes("{0}")
		? format.replace("{0}", "")
		: format;
	return format === "" ? null : (
		<span className={`${TYPOGRAPHY.SMALL} text-text-secondary whitespace-nowrap`}>
			{formattedValue}
		</span>
	);
}
