import type { ReactNode } from "react";

interface TabButtonContainerProps {
	children: ReactNode;
}

export function TabButtonContainer({ children }: TabButtonContainerProps) {
	return (
		<div className="pt-1 px-2 grid grid-cols-4 gap-2.5 border-b-4 border-gray-200">
			{children}
		</div>
	);
}
