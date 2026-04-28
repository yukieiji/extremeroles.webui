import { HighlightWrapper } from "../../components/parts/HighlightWrapper";
import { auOptionMetaData } from "../../logics/api";
import { useUpdateAuOptionSelection } from "../../logics/api.store";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";
import { AuOptionControl } from "./AuOptionControl";

interface AuOptionRowProps {
	auOptionId: AuOptionId;
}

/**
 * Auの各オプション行を表示するコンポーネント
 */
export function AuOptionRow({ auOptionId }: AuOptionRowProps) {
	const optionMeta = auOptionMetaData.options[auOptionId];
	const selection = useStore((state) => state.auValue[auOptionId] ?? 0);
	const highlightedAuOptionId = useStore(
		(state) => state.highlightedAuOptionId,
	);

	const updateAuOption = useUpdateAuOptionSelection();

	if (!optionMeta) {
		return null;
	}

	const isHighlighted = highlightedAuOptionId === auOptionId;

	return (
		<HighlightWrapper
			id={`au-option-${auOptionId}`}
			isHighlighted={isHighlighted}
			className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 px-2"
		>
			<div className="flex flex-col flex-1 min-w-0 mr-4">
				<span className="text-gray-200 text-sm font-medium truncate">
					{optionMeta.title}
				</span>
			</div>
			<div className="shrink-0">
				<AuOptionControl
					optionMeta={optionMeta}
					selection={selection}
					onSelectionChange={(selection) => {
						updateAuOption({ auOptionId, selection });
					}}
				/>
			</div>
		</HighlightWrapper>
	);
}
