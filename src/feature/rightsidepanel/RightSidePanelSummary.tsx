import { useCallback, useMemo } from "react";
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
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";

export function RightSidePanelSummary() {
	const auValue = useStore((state) => state.auValue);
	const exrValue = useStore((state) => state.exrValue);
	const presetNames = useStore((state) => state.presetNames);
	const navigateExR = useExROptionNavigationInline();
	const navigateAu = useAuOptionNavigationInline();

	// 1. Preset
	const presetOption = exrValue[PRESET_OPTION_UNIQUE_ID];
	const presetSelection = presetOption?.selection ?? 0;
	const presetName =
		presetNames[presetSelection] ??
		String(presetOption?.values[presetSelection] ?? "");
	const presetTitle =
		exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID]?.metaData
			.translatedName ?? "プリセット";

	// 2. Map
	const mapMeta = auOptionMetaData.options[AU_MAP_OPTION_ID];
	const mapValue = mapMeta?.range[auValue[AU_MAP_OPTION_ID] ?? 0] ?? "";
	const mapTitle = mapMeta?.title ?? "マップ";

	// 3. Impostor Count
	const impCountMeta = auOptionMetaData.options[AU_IMPOSTOR_COUNT_OPTION_ID];
	const impCountValue =
		impCountMeta?.range[auValue[AU_IMPOSTOR_COUNT_OPTION_ID] ?? 0] ?? "";
	const impCountTitle = impCountMeta?.title ?? "インポスター人数";

	// Helper for ExR Min-Max
	const getExRMinMax = (
		minUniqueId: UniqueOptionId,
		maxUniqueId: UniqueOptionId,
		fallbackTitle: string,
	) => {
		const minOption = exrValue[minUniqueId];
		const maxOption = exrValue[maxUniqueId];
		const minVal = minOption?.values[minOption?.selection ?? 0] ?? 0;
		const maxVal = maxOption?.values[maxOption?.selection ?? 0] ?? 0;

		const minMeta = exrOptionMetaData.options[minUniqueId]?.metaData;
		const title = minMeta
			? getBaseOptionName(minMeta.translatedName)
			: fallbackTitle;

		return {
			title,
			display: `${minVal} - ${maxVal}`,
			minUniqueId,
			maxUniqueId,
		};
	};

	// 4. Liberal Count
	const liberal = getExRMinMax(
		EXR_LIBERAL_MIN_ID,
		EXR_LIBERAL_MAX_ID,
		"リベラル人数",
	);

	// 5. Militant Count
	const militant = getExRMinMax(
		EXR_MILITANT_MIN_ID,
		EXR_MILITANT_MAX_ID,
		"ミリタント",
	);

	// 6. Crew Role Count
	const crewRoles = getExRMinMax(
		EXR_CREW_MIN_ID,
		EXR_CREW_MAX_ID,
		"クルー陣営役職数",
	);

	// 7. Impostor Role Count
	const impRoles = getExRMinMax(
		EXR_IMPOSTOR_MIN_ID,
		EXR_IMPOSTOR_MAX_ID,
		"インポスター陣営役職数",
	);

	// 8. Neutral Role Count
	const neutralRoles = getExRMinMax(
		EXR_NEUTRAL_MIN_ID,
		EXR_NEUTRAL_MAX_ID,
		"ニュートラル陣営役職数",
	);

	// 9. Vanilla Roles
	const getVanillaRoleData = useCallback(
		(catId: number) => {
			const catMeta = auOptionMetaData.categoryMetaData[catId];
			if (!catMeta) {
				return null;
			}
			const chanceId = catMeta.options[0];
			const maxCountId = catMeta.options[1];
			const chanceMeta = auOptionMetaData.options[chanceId];
			const maxCountMeta = auOptionMetaData.options[maxCountId];

			const chance = chanceMeta?.range[auValue[chanceId] ?? 0] ?? 0;
			const maxCount = maxCountMeta?.range[auValue[maxCountId] ?? 0] ?? 0;

			if (Number(chance) === 0 || Number(maxCount) === 0) {
				return null;
			}

			return {
				name: catMeta.name,
				display: `${maxCount} - ${chance}%`,
				chanceId,
				tabId: catId >= 5 && catId <= 10 ? 1 : 2, // Crew or Impostor tab
			};
		},
		[auValue],
	);

	const vanillaRoles = useMemo(() => {
		const roles = (VANILLA_ROLE_CATEGORY_IDS as readonly number[])
			.map(getVanillaRoleData)
			.filter(Boolean);
		return roles;
	}, [getVanillaRoleData]);

	return (
		<div
			className="flex flex-col gap-1 p-3 border-b border-gray-200 bg-gray-50"
			data-testid="right-panel-summary"
		>
			<ViewerOptionRow
				title={<ColoredText text={presetTitle} />}
				value={presetName}
				onDoubleClick={() => navigateExR(PRESET_OPTION_UNIQUE_ID)}
			/>
			<ViewerOptionRow
				title={<ColoredText text={mapTitle} />}
				value={String(mapValue)}
				onDoubleClick={() => navigateAu(0, 0, AU_MAP_OPTION_ID)}
			/>
			<ViewerOptionRow
				title={<ColoredText text={impCountTitle} />}
				value={String(impCountValue)}
				onDoubleClick={() => navigateAu(0, 1, AU_IMPOSTOR_COUNT_OPTION_ID)}
			/>
			<ViewerOptionRow
				title={<ColoredText text={liberal.title} />}
				value={liberal.display}
				onDoubleClick={() => navigateExR(liberal.minUniqueId)}
			/>
			<ViewerOptionRow
				title={<ColoredText text={militant.title} />}
				value={militant.display}
				onDoubleClick={() => navigateExR(militant.minUniqueId)}
			/>
			<ViewerOptionRow
				title={<ColoredText text={crewRoles.title} />}
				value={crewRoles.display}
				onDoubleClick={() => navigateExR(crewRoles.minUniqueId)}
			/>
			<ViewerOptionRow
				title={<ColoredText text={impRoles.title} />}
				value={impRoles.display}
				onDoubleClick={() => navigateExR(impRoles.minUniqueId)}
			/>
			<ViewerOptionRow
				title={<ColoredText text={neutralRoles.title} />}
				value={neutralRoles.display}
				onDoubleClick={() => navigateExR(neutralRoles.minUniqueId)}
			/>
			{vanillaRoles.map(
				(role) =>
					role && (
						<ViewerOptionRow
							key={role.name}
							data-testid="vanilla-role-summary"
							title={<ColoredText text={role.name} />}
							value={role.display}
							onDoubleClick={() => navigateAu(role.tabId, 0, role.chanceId)}
						/>
					),
			)}
		</div>
	);
}
