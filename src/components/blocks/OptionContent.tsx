import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { OptionItem } from "../parts/OptionItem";
import { OptionNameDisplay } from "../parts/OptionNameDisplay";

interface OptionRowContent {
	name: string;
	children: ReactNode;
}

export function OptionRowContent({ name, children }: OptionRowContent) {
	return (
		<OptionItem className="min-h-10">
			<div className="flex-1 min-w-0">
				<span className="text-text-primary wrap-break-words">
					<OptionNameDisplay name={name} />
				</span>
			</div>
			<div className="shrink-0 flex items-center gap-2">{children}</div>
		</OptionItem>
	);
}
