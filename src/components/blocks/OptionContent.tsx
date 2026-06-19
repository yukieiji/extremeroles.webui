import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { ColoredText } from "../parts/ColoredText";
import { OptionItem } from "../parts/OptionItem";

interface OptionRowContent {
	name: string;
	children: ReactNode;
}

export function OptionRowContent({ name, children }: OptionRowContent) {
	return (
		<OptionItem className="min-h-10">
			<div className="flex-1 min-w-0">
				<ColoredText
					text={name}
					className={`${TYPOGRAPHY.CHILD_LABEL} text-text-primary wrap-break-words`}
				/>
			</div>
			<div className="shrink-0 flex items-center">{children}</div>
		</OptionItem>
	);
}
