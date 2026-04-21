import type { AuOptionId } from "../type";
import { AuOptionRow } from "./AuOptionRow";

interface AuCategoryOptionListProps {
	optionIds: AuOptionId[];
}

/**
 * Auのカテゴリ内オプション一覧を表示するコンポーネント
 */
export function AuCategoryOptionList({ optionIds }: AuCategoryOptionListProps) {
	return (
		<div className="flex flex-col gap-2">
			{optionIds.map((optionId) => (
				<AuOptionRow key={optionId} optionId={optionId} />
			))}
		</div>
	);
}
