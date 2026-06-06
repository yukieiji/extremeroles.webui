import { ChevronRight, CornerDownRight } from "lucide-react";
import { Fragment } from "react";
import type { ParentData } from "@/type";
import { ParentItem } from "../parts/ParentItem";

interface SearchParentDataProps {
	parentData: ParentData;
}

export function SearchParentData({ parentData }: SearchParentDataProps) {
	const { tabName, categoryName, parentOptionNames } = parentData;

	// 親オプション名は、API側で[直近の親, その親, ...]の順で入っているため、
	// 表示用に[ルートに近い親, ..., 直近の親]の順に反転させる
	const orderedParents = [...parentOptionNames].reverse().filter(Boolean);

	return (
		<div className="flex w-full min-w-0 items-center gap-0.5 leading-tight">
			<ParentItem icon={CornerDownRight} text={tabName} />
			{categoryName !== "" && (
				<ParentItem icon={ChevronRight} text={categoryName} />
			)}
			{orderedParents.map((name) => (
				<Fragment key={name}>
					<ParentItem icon={ChevronRight} text={name} />
				</Fragment>
			))}
		</div>
	);
}
