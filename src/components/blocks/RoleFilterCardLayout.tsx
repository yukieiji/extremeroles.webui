import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

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
			<Button
				onClick={onDelete}
				className="absolute top-2 right-2"
				aria-label="Delete filter"
			>
				<X />
			</Button>
			<div className="flex flex-col border-b border-gray-100 pb-2">
				{header}
			</div>

			<div className="flex flex-wrap gap-2">{children}</div>
		</li>
	);
}
