import type { ReactNode } from "react";
import { OptionItem } from "../parts/OptionItem";
import { OptionNameDisplay } from "../parts/OptionNameDisplay";

interface OptionRowContent {
	name: string;
	children: ReactNode;
}

export function OptionRowContent({ name, children }: OptionRowContent) {
	return (
		<OptionItem className="min-h-12">
			<div className="flex-1 min-w-0">
				<span className="text-base font-normal text-gray-200 wrap-break-words">
					<OptionNameDisplay name={name} />
				</span>
			</div>
			<div className="shrink-0 flex items-center gap-2">{children}</div>
		</OptionItem>
	);
}
