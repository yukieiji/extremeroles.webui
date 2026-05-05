import type { ReactNode } from "react";

interface TabButtonContainerProp {
	children: ReactNode;
}

export function TabButtonContainer({ children }: TabButtonContainerProp) {
	return (
		<div className="pt-1 px-2 grid grid-cols-4 gap-2.5 border-b-4 border-gray-200">
			{children}
		</div>
	);
}
