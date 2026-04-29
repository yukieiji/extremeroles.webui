import { ColoredText } from "../../components/parts/ColoredText";
import { OptionFormat } from "../../components/parts/OptionFormat";
import { translationMetaData } from "../../logics/api";

interface AuTab0OptionValueProps {
	value: string | number | boolean;
	format: string;
}

/**
 * Auのタブ0の設定値を表示するコンポーネント
 */
export function AuTab0OptionValue({ value, format }: AuTab0OptionValueProps) {
	const isBoolean = typeof value === "boolean";

	return (
		<div className="flex items-center gap-1 shrink-0">
			<span className="text-sm font-medium text-right">
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
					<OptionFormat format={format} />
				</div>
			)}
		</div>
	);
}
