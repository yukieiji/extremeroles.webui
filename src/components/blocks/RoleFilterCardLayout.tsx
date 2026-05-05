import { X } from "lucide-react";
import type { ReactNode } from "react";

interface RoleFilterCardLayoutProps {
	onDelete: () => void;
	header: ReactNode;
	children: ReactNode;
}

/**
 * Role Filter Card の基本レイアウトコンポーネント (Stateless)
 */
export function RoleFilterCardLayout({
	onDelete,
	header,
	children,
}: RoleFilterCardLayoutProps) {
	return (
		<li className="bg-white shadow rounded-lg p-4 border border-gray-200 flex flex-col gap-3 relative list-none">
			<button
				type="button"
				onClick={onDelete}
				className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
				aria-label="Delete filter"
			>
				<X size={20} aria-hidden="true" />
			</button>

			<div className="flex flex-col border-b border-gray-100 pb-2">
				{header}
			</div>

			<div className="flex flex-wrap gap-2">{children}</div>
		</li>
	);
}
