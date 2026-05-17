import { OptionEditorCategoryOptionLayout } from "@/components/blocks/OptionEditorCategoryOptionLayout";
import type { AuOptionId } from "@/type";
import { AuOptionRow } from "./AuOptionRow";

interface AuCategoryOptionListProps {
	optionIds: AuOptionId[];
}

/**
 * Auのカテゴリ内オプション一覧を表示するコンポーネント
 */
export function AuCategoryOptionList({ optionIds }: AuCategoryOptionListProps) {
	return (
		<OptionEditorCategoryOptionLayout arr={optionIds} ignoreIndex={0}>
			{(optionId, withBorder) => (
				<AuOptionRow auOptionId={optionId} withBorder={withBorder} />
			)}
		</OptionEditorCategoryOptionLayout>
	);
}
