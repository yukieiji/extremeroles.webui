import type { FC, SVGProps } from "react";

interface ParentItemProps {
	icon: FC<SVGProps<SVGSVGElement>>;
	text: string;
}

export function ParentItem({ icon: Icon, text }: ParentItemProps) {
	return (
		<>
			<Icon className="size-3 shrink-0" />
			<span className="min-w-0 truncate">{text}</span>
		</>
	);
}
