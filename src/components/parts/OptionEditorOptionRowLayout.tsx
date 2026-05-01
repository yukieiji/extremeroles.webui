import type { ReactNode } from "react";

interface OptionEditorOptionRowGroupLayoutProp {
	children: ReactNode;
}

export function OptionEditorOptionRowGroupLayout({
	children,
}: OptionEditorOptionRowGroupLayoutProp) {
	return <div className="flex flex-col">{children}</div>;
}
