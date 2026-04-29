import { ColoredText } from "../../components/parts/ColoredText";
import { OptionFormat } from "../../components/parts/OptionFormat";

interface ExRViewerOptionValueProps {
	value: string | number | undefined;
	format: string;
}

/**
 * ExRの設定値を表示用にフォーマットするコンポーネント
 */
export function ExRViewerOptionValue({
	value,
	format,
}: ExRViewerOptionValueProps) {
	if (value === undefined) {
		return <span className="text-gray-400">-</span>;
	}

	const isString = typeof value === "string";

	return (
		<div className="flex items-center gap-1 shrink-0">
			<span className="text-sm text-blue-400 font-medium text-right">
				{isString ? <ColoredText text={value} /> : value.toString()}
			</span>
			{!isString && (
				<div className="text-[10px] scale-90 origin-right">
					<OptionFormat format={format} />
				</div>
			)}
		</div>
	);
}
