import { ColoredText } from "@/components/parts/ColoredText";
import { OptionFormat } from "@/components/parts/OptionFormat";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import { OFF, ON } from "@/noTrans";

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
		<div className="flex items-center shrink-0">
			{isBoolean ? (
				<ColoredText
					text={translationMetaData[value ? 1 : 0] || (value ? ON : OFF)}
					variant="secondary"
					className={`${TYPOGRAPHY.CHILD_LABEL} text-right`}
				/>
			) : (
				<span
					className={`${TYPOGRAPHY.CHILD_LABEL} text-text-secondary text-right`}
				>
					{value.toString()}
				</span>
			)}
			{!isBoolean && (
				<div className="text-[10px] scale-90 origin-right">
					<OptionFormat format={format} />
				</div>
			)}
		</div>
	);
}
