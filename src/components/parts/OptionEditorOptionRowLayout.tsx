import type { ReactNode } from "react";

interface OptionEditorOptionRowGroupLayoutProps {
	children: ReactNode;
}

export function OptionEditorOptionRowGroupLayout({
	children,
}: OptionEditorOptionRowGroupLayoutProps) {
	return <div className="flex flex-col">{children}</div>;
}
