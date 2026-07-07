import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";

interface BigSettingSelectionProp {
	title: string;
	children: ReactNode;
}

export function BigSettingSelection({
	title,
	children,
}: BigSettingSelectionProp) {
	return (
		<div className="grid gap-2">
			<h3 className={TYPOGRAPHY.LABEL}>{title}</h3>
			{children}
		</div>
	);
}
