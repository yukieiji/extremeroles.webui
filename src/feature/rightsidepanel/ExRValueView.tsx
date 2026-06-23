import { ColoredText } from "@/components/parts/ColoredText";
import { OptionFormat } from "@/components/parts/OptionFormat";
import { TYPOGRAPHY } from "@/designConstants";
import { useOptionData } from "@/hooks/useExROptionData";
import type { UniqueOptionId } from "@/type";

interface ExRValueViewProps {
	uniqueOptionId: UniqueOptionId;
	format: string;
}

export function ExRValueView({ uniqueOptionId, format }: ExRValueViewProps) {
	const optionValue = useOptionData(uniqueOptionId);
	const currentSelection = optionValue.selection ?? 0;
	return (
		<div className="flex items-end">
			<ColoredText
				text={String(optionValue.values[currentSelection])}
				variant="secondary"
				className={TYPOGRAPHY.CHILD_LABEL}
			/>
			<OptionFormat format={format} />
		</div>
	);
}
