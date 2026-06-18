import type { ReactNode } from "react";

interface RightPanelGroupColumnLayoutProps {
	children: ReactNode;
}

export function RightPanelGroupColumnLayout({
	children,
}: RightPanelGroupColumnLayoutProps) {
	return <div className="flex flex-col">{children}</div>;
}
