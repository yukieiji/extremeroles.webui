import type { ReactNode } from "react";

interface TabButtonContainerProp {
	children: ReactNode;
}

export function TabButtonContainer({ children }: TabButtonContainerProp) {
	return (
		<div className="flex flex-wrap gap-2 border-b-4 border-gray-200">
			{children}
		</div>
	);
}
