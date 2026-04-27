import type { ReactNode } from "react";

interface TabButtonContainerProp {
	children: ReactNode;
}

export function TabButtonContainer({ children }: TabButtonContainerProp) {
	return (
		<div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
			{children}
		</div>
	);
}
