import type { FC, SVGProps } from "react";
import { TYPOGRAPHY } from "@/designConstants";

interface ParentItemProps {
	icon: FC<SVGProps<SVGSVGElement>>;
	text: string;
}

export function ParentItem({ icon: Icon, text }: ParentItemProps) {
	return (
		<>
			<Icon className="size-3 shrink-0 text-text-secondary" />
			<span
				className={`${TYPOGRAPHY.SMALL} min-w-0 truncate text-text-secondary`}
			>
				{text}
			</span>
		</>
	);
}
