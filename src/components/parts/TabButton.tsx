import type { ReactNode } from "react";

interface TabButtonProp {
	onClick: () => void;
	isSelect: boolean;
	children: ReactNode;
}

export function TabButton({ onClick, isSelect, children }: TabButtonProp) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`px-4 py-2 rounded-t-lg transition-colors font-medium ${isSelect ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
		>
			{children}
		</button>
	);
}
