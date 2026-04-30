import { BorderLine } from "../../components/parts/BorderLine";
import type { AuOptionId } from "../../type";
import { AuOptionRow } from "./AuOptionRow";

interface AuCategoryOptionListProps {
	optionIds: AuOptionId[];
}

/**
 * Auのカテゴリ内オプション一覧を表示するコンポーネント
 */
export function AuCategoryOptionList({ optionIds }: AuCategoryOptionListProps) {
	return (
		<div className="flex flex-col">
			{optionIds.map((optionId, index) => (
				<>
					{index !== 0 && <BorderLine />}
					<AuOptionRow key={optionId} auOptionId={optionId} />
				</>
			))}
		</div>
	);
}
