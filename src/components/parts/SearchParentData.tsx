import { ChevronRight, CornerDownRight } from "lucide-react";
import { Fragment } from "react";
import type { ParentData } from "@/type";

interface SearchParentDataProps {
	parentData: ParentData;
}

export function SearchParentData({ parentData }: SearchParentDataProps) {
	const { tabName, categoryName, parentOptionNames } = parentData;

	// 親オプション名は、API側で[直近の親, その親, ...]の順で入っているため、
	// 表示用に[ルートに近い親, ..., 直近の親]の順に反転させる
	const orderedParents = [...parentOptionNames].reverse().filter(Boolean);

	return (
		<div className="flex w-full min-w-0 items-center gap-1 text-muted-foreground text-[10px] leading-tight">
			<CornerDownRight className="size-3 shrink-0" />
			<span className="min-w-0 truncate">{tabName}</span>
			{categoryName && (
				<>
					<ChevronRight className="size-3 shrink-0" />
					<span className="min-w-0 truncate">{categoryName}</span>
				</>
			)}
			{orderedParents.map((name) => (
				<Fragment key={name}>
					<ChevronRight className="size-3 shrink-0" />
					<span className="min-w-0 truncate">{name}</span>
				</Fragment>
			))}
		</div>
	);
}
