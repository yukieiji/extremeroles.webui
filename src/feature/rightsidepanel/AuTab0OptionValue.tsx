import { ColoredText } from "@/components/parts/ColoredText";
import { OptionFormat } from "@/components/parts/OptionFormat";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import { stripColorTags } from "@/logics/colorUtils";

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
		<div className="flex items-end shrink-0">
			{isBoolean ? (
				<ColoredText
					text={stripColorTags(translationMetaData[value ? 1 : 0] || "")}
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
				<div className="origin-right">
					<OptionFormat format={format} />
				</div>
			)}
		</div>
	);
}
