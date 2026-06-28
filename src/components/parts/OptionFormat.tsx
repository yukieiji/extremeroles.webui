import { TYPOGRAPHY } from "@/designConstants";
import { reformatFormatText } from "@/logics/stringUtils";

interface OptionFormatProps {
	format: string;
}

export function OptionFormat({ format }: OptionFormatProps) {
	const formattedValue = reformatFormatText(format);
	return format === "" ? null : (
		<span
			className={`${TYPOGRAPHY.SMALL} text-text-secondary whitespace-nowrap`}
		>
			{formattedValue}
		</span>
	);
}
