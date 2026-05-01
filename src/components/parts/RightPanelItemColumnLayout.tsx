import type { ReactNode } from "react";

interface RightPanelItemColumnLayoutProp {
	children: ReactNode;
}

export function RightPanelItemColumnLayout({
	children,
}: RightPanelItemColumnLayoutProp) {
	return <div className="flex flex-col gap-0.5">{children}</div>;
}
