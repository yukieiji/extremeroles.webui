import { auOptionMetaData } from "../logics/api";
import type { AuOptionId } from "../type";
import { useStore } from "../useStore";
import { AuOptionControl } from "./AuOptionControl";

interface AuOptionRowProps {
	optionId: AuOptionId;
}

/**
 * Auの各オプション行を表示するコンポーネント
 */
export function AuOptionRow({ optionId }: AuOptionRowProps) {
	const optionMeta = auOptionMetaData.options[optionId];
	const selection = useStore((state) => state.auValue[optionId] ?? 0);
	const updateAuOptionSelection = useStore((state) => state.updateAuOptionSelection);

	if (!optionMeta) return null;

	return (
		<div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors px-2 rounded">
			<div className="flex flex-col flex-1 min-w-0 mr-4">
				<span className="text-gray-200 text-sm font-medium truncate">
					{optionMeta.title}
				</span>
			</div>
			<div className="flex-shrink-0">
				<AuOptionControl
					optionMeta={optionMeta}
					selection={selection}
					onSelectionChange={(newSelection) => {
						updateAuOptionSelection({ auOptionId: optionId, selection: newSelection });
					}}
				/>
			</div>
		</div>
	);
}
