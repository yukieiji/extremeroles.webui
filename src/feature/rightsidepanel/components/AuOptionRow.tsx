import { ColoredText } from "../../../components/parts/ColoredText";
import { OptionFormat } from "../../../components/parts/OptionFormat";
import { auOptionMetaData, translationMetaData } from "../../../logics/api";
import type { AuOptionId } from "../../../type";
import { useStore } from "../../../useStore";

interface AuOptionRowProps {
	optionId: AuOptionId;
	onDoubleClick: (optionId: AuOptionId) => void;
}

export function AuOptionRow({ optionId, onDoubleClick }: AuOptionRowProps) {
	const auValue = useStore((state) => state.auValue);
	const optionMeta = auOptionMetaData.options[optionId];

	if (!optionMeta) {
		return null;
	}

	const selection = auValue[optionId] ?? 0;
	const value = optionMeta.range[selection];
	const isBoolean = typeof value === "boolean";

	return (
		<button
			type="button"
			data-testid={`right-panel-option-${optionId}`}
			onDoubleClick={() => onDoubleClick(optionId)}
			className="w-full flex justify-between items-center py-1 px-2 hover:bg-gray-700/50 rounded cursor-pointer select-none gap-2"
			title="ダブルクリックで設定場所へ移動"
		>
			<span className="text-xs text-gray-300 truncate flex-1 text-left">
				{optionMeta.title}
			</span>
			<div className="flex items-center gap-1 shrink-0">
				<span className="text-xs text-blue-400 font-medium text-right">
					{isBoolean ? (
						<ColoredText
							text={
								translationMetaData.booleanTransData[value ? 1 : 0] ||
								(value ? "ON" : "OFF")
							}
						/>
					) : (
						value.toString()
					)}
				</span>
				{!isBoolean && (
					<div className="text-[10px] scale-90 origin-right">
						<OptionFormat format={optionMeta.format} />
					</div>
				)}
			</div>
		</button>
	);
}
