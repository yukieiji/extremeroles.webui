import type { ReactNode } from "react";

interface RightPanelGroupColumnLayoutProp {
	children: ReactNode;
}

export function RightPanelGroupColumnLayout({
	children,
}: RightPanelGroupColumnLayoutProp) {
	return <div className="flex flex-col gap-2">{children}</div>;
}
