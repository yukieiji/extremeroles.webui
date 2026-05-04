import type { ReactNode } from "react";

interface RoleFilterCardLayoutProps {
	guid: string;
	onDelete: () => void;
	header: ReactNode;
	children: ReactNode;
}

/**
 * Role Filter Card の基本レイアウトコンポーネント (Stateless)
 */
export function RoleFilterCardLayout({
	guid,
	onDelete,
	header,
	children,
}: RoleFilterCardLayoutProps) {
	return (
		<div
			data-guid={guid}
			className="bg-white shadow rounded-lg p-4 border border-gray-200 flex flex-col gap-3 relative"
		>
			<button
				type="button"
				onClick={onDelete}
				className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
				aria-label="Delete filter"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					role="img"
					aria-label="Delete icon"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<div className="flex flex-col border-b border-gray-100 pb-2">
				{header}
			</div>

			<div className="flex flex-wrap gap-2">{children}</div>
		</div>
	);
}
