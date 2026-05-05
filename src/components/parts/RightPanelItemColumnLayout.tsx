import type { ReactNode } from "react";

interface RightPanelItemColumnLayoutProps {
	children: ReactNode;
}

export function RightPanelItemColumnLayout({
	children,
}: RightPanelItemColumnLayoutProps) {
	return <div className="flex flex-col gap-0.5">{children}</div>;
}
