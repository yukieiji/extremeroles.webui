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
		<div
			id={`au-option-${auOptionId}`}
			className={`flex items-center justify-between py-2 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-all duration-500 px-2 rounded ${
				isHighlighted ? "ring-2 ring-blue-500 bg-blue-500/10" : ""
			}`}
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
		</div>
	);
}
