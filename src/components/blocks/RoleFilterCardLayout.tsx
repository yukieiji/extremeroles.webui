import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { ROLE_FILTER_DELETE_ARIA } from "@/noTrans";

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
		<Card>
			<CardHeader>
				<CardAction>
					<Button onClick={onDelete} aria-label={ROLE_FILTER_DELETE_ARIA}>
						<X />
					</Button>
				</CardAction>
				{header}
			</CardHeader>
			<CardDescription>{children}</CardDescription>
		</Card>
	);
}
