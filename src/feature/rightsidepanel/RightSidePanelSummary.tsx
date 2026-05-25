import { useMemo } from "react";
import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import { auOptionMetaData, exrOptionMetaData } from "@/logics/api";
import {
	AU_IMPOSTOR_COUNT_OPTION_ID,
	AU_MAP_OPTION_ID,
	EXR_CREW_MAX_ID,
	EXR_CREW_MIN_ID,
	EXR_IMPOSTOR_MAX_ID,
	EXR_IMPOSTOR_MIN_ID,
	EXR_LIBERAL_MAX_ID,
	EXR_LIBERAL_MIN_ID,
	EXR_MILITANT_MAX_ID,
	EXR_MILITANT_MIN_ID,
	EXR_NEUTRAL_MAX_ID,
	EXR_NEUTRAL_MIN_ID,
	getBaseOptionName,
	PRESET_OPTION_UNIQUE_ID,
	VANILLA_ROLE_CATEGORY_IDS,
} from "@/logics/optionUtils";
import type { AuOptionId, UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";

/**
 * 右パネルの上部に表示される、主要な設定のサマリー項目
 */
export function RightSidePanelSummary() {
	return (
		<div
			className="flex flex-col gap-1 p-3 border-b border-gray-200 bg-gray-50"
			data-testid="right-panel-summary"
		>
			<PresetSummaryRow />
			<AuOptionSummaryRow
				optionId={AU_MAP_OPTION_ID}
				fallbackTitle="マップ"
				tabId={0}
				categoryId={0}
			/>
			<AuOptionSummaryRow
				optionId={AU_IMPOSTOR_COUNT_OPTION_ID}
				fallbackTitle="インポスター人数"
				tabId={0}
				categoryId={1}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_LIBERAL_MIN_ID}
				maxUniqueId={EXR_LIBERAL_MAX_ID}
				fallbackTitle="リベラル人数"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_MILITANT_MIN_ID}
				maxUniqueId={EXR_MILITANT_MAX_ID}
				fallbackTitle="ミリタント"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_CREW_MIN_ID}
				maxUniqueId={EXR_CREW_MAX_ID}
				fallbackTitle="クルー陣営役職数"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_IMPOSTOR_MIN_ID}
				maxUniqueId={EXR_IMPOSTOR_MAX_ID}
				fallbackTitle="インポスター陣営役職数"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_NEUTRAL_MIN_ID}
				maxUniqueId={EXR_NEUTRAL_MAX_ID}
				fallbackTitle="ニュートラル陣営役職数"
			/>
			{VANILLA_ROLE_CATEGORY_IDS.map((catId) => (
				<VanillaRoleSummaryRow key={catId} categoryId={catId} />
			))}
		</div>
	);
}

function PresetSummaryRow() {
	const navigateExR = useExROptionNavigationInline();
	const presetName = useStore((state) => {
		const option = state.exrValue[PRESET_OPTION_UNIQUE_ID];
		const selection = option?.selection ?? 0;
		return (
			state.presetNames[selection] ?? String(option?.values[selection] ?? "")
		);
	});

	const presetTitle = useMemo(
		() =>
			exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID]?.metaData
				.translatedName ?? "プリセット",
		[],
	);

	return (
		<ViewerOptionRow
			title={<ColoredText text={presetTitle} />}
			value={presetName}
			onDoubleClick={() => navigateExR(PRESET_OPTION_UNIQUE_ID)}
		/>
	);
}

interface AuOptionSummaryRowProps {
	optionId: AuOptionId;
	fallbackTitle: string;
	tabId: number;
	categoryId: number;
}

function AuOptionSummaryRow({
	optionId,
	fallbackTitle,
	tabId,
	categoryId,
}: AuOptionSummaryRowProps) {
	const navigateAu = useAuOptionNavigationInline();
	const value = useStore((state) => {
		const selection = state.auValue[optionId] ?? 0;
		return String(auOptionMetaData.options[optionId]?.range[selection] ?? "");
	});

	const title = useMemo(
		() => auOptionMetaData.options[optionId]?.title ?? fallbackTitle,
		[optionId, fallbackTitle],
	);

	return (
		<ViewerOptionRow
			title={<ColoredText text={title} />}
			value={value}
			onDoubleClick={() => navigateAu(tabId, categoryId, optionId)}
		/>
	);
}

interface ExRMinMaxSummaryRowProps {
	minUniqueId: UniqueOptionId;
	maxUniqueId: UniqueOptionId;
	fallbackTitle: string;
}

function ExRMinMaxSummaryRow({
	minUniqueId,
	maxUniqueId,
	fallbackTitle,
}: ExRMinMaxSummaryRowProps) {
	const navigateExR = useExROptionNavigationInline();
	const display = useStore((state) => {
		const minOption = state.exrValue[minUniqueId];
		const maxOption = state.exrValue[maxUniqueId];
		const minVal = minOption?.values[minOption?.selection ?? 0] ?? 0;
		const maxVal = maxOption?.values[maxOption?.selection ?? 0] ?? 0;
		return `${minVal} - ${maxVal}`;
	});

	const title = useMemo(() => {
		const minMeta = exrOptionMetaData.options[minUniqueId]?.metaData;
		return minMeta ? getBaseOptionName(minMeta.translatedName) : fallbackTitle;
	}, [minUniqueId, fallbackTitle]);

	return (
		<ViewerOptionRow
			title={<ColoredText text={title} />}
			value={display}
			onDoubleClick={() => navigateExR(minUniqueId)}
		/>
	);
}

interface VanillaRoleSummaryRowProps {
	categoryId: number;
}

function VanillaRoleSummaryRow({ categoryId }: VanillaRoleSummaryRowProps) {
	const navigateAu = useAuOptionNavigationInline();
	const roleData = useStore((state) => {
		const catMeta = auOptionMetaData.categoryMetaData[categoryId];
		if (!catMeta) {
			return null;
		}
		const chanceId = catMeta.options[0] as AuOptionId;
		const maxCountId = catMeta.options[1] as AuOptionId;
		const chanceMeta = auOptionMetaData.options[chanceId];
		const maxCountMeta = auOptionMetaData.options[maxCountId];

		const chance = chanceMeta?.range[state.auValue[chanceId] ?? 0] ?? 0;
		const maxCount = maxCountMeta?.range[state.auValue[maxCountId] ?? 0] ?? 0;

		if (Number(chance) === 0 || Number(maxCount) === 0) {
			return null;
		}

		return {
			name: catMeta.name,
			display: `${maxCount} - ${chance}%`,
			chanceId,
			tabId: categoryId >= 5 && categoryId <= 10 ? 1 : 2, // Crew or Impostor tab
		};
	});

	if (!roleData) {
		return null;
	}

	return (
		<ViewerOptionRow
			data-testid="vanilla-role-summary"
			title={<ColoredText text={roleData.name} />}
			value={roleData.display}
			onDoubleClick={() => navigateAu(roleData.tabId, 0, roleData.chanceId)}
		/>
	);
}
