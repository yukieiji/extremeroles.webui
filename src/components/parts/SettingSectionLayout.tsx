import type { ReactNode } from "react";

interface SettingSectionLayoutProps {
	children: ReactNode;
}

export function SettingSectionLayout({ children }: SettingSectionLayoutProps) {
	return <div className="flex items-center justify-between">{children}</div>;
}
