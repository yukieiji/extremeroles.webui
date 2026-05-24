import { useCallback, useMemo } from "react";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import {
	getAuOptionId,
	getUniqueOptionId,
	PRESET_OPTION_UNIQUE_ID,
} from "@/logics/optionUtils";
import { OptionValueType } from "@/type";
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

	// 2. Map
	const mapOptionId = getAuOptionId(1, OptionValueType.Byte);
	const mapMeta = auOptionMetaData.options[mapOptionId];
	const mapValue = mapMeta?.range[auValue[mapOptionId] ?? 0] ?? "";

	// 3. Impostor Count
	const impCountOptionId = getAuOptionId(1, OptionValueType.Int);
	const impCountMeta = auOptionMetaData.options[impCountOptionId];
	const impCountValue =
		impCountMeta?.range[auValue[impCountOptionId] ?? 0] ?? "";

	// Helper for ExR Min-Max
	const getExRMinMax = (
		minId: number,
		maxId: number,
		catId: number,
		tabId = 0,
	) => {
		const minUniqueId = getUniqueOptionId(tabId, catId, minId);
		const maxUniqueId = getUniqueOptionId(tabId, catId, maxId);
		const minVal =
			exrValue[minUniqueId]?.values[exrValue[minUniqueId]?.selection ?? 0] ?? 0;
		const maxVal =
			exrValue[maxUniqueId]?.values[exrValue[maxUniqueId]?.selection ?? 0] ?? 0;
		return {
			display: `${minVal} - ${maxVal}`,
			minUniqueId,
			maxUniqueId,
		};
	};

	// 4. Liberal Count
	const liberal = getExRMinMax(6, 7, 5);

	// 5. Militant Count
	const militant = getExRMinMax(22, 23, 7);

	// 6. Crew Role Count
	const crewRoles = getExRMinMax(0, 1, 5);

	// 7. Impostor Role Count
	const impRoles = getExRMinMax(4, 5, 5);

	// 8. Neutral Role Count
	const neutralRoles = getExRMinMax(2, 3, 5);

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
		const roles = [5, 6, 7, 8, 9, 10, 11, 12, 13]
			.map(getVanillaRoleData)
			.filter(Boolean);
		return roles;
	}, [getVanillaRoleData]);

	return (
		<div className="flex flex-col gap-1 p-3 border-b border-gray-200 bg-gray-50">
			<ViewerOptionRow
				title="プリセット"
				value={presetName}
				onDoubleClick={() => navigateExR(PRESET_OPTION_UNIQUE_ID)}
			/>
			<ViewerOptionRow
				title="マップ"
				value={String(mapValue)}
				onDoubleClick={() => navigateAu(0, 0, mapOptionId)}
			/>
			<ViewerOptionRow
				title="インポスター人数"
				value={String(impCountValue)}
				onDoubleClick={() => navigateAu(0, 1, impCountOptionId)}
			/>
			<ViewerOptionRow
				title="リベラル人数"
				value={liberal.display}
				onDoubleClick={() => navigateExR(liberal.minUniqueId)}
			/>
			<ViewerOptionRow
				title="ミリタント"
				value={militant.display}
				onDoubleClick={() => navigateExR(militant.minUniqueId)}
			/>
			<ViewerOptionRow
				title="クルー陣営役職数"
				value={crewRoles.display}
				onDoubleClick={() => navigateExR(crewRoles.minUniqueId)}
			/>
			<ViewerOptionRow
				title="インポスター陣営役職数"
				value={impRoles.display}
				onDoubleClick={() => navigateExR(impRoles.minUniqueId)}
			/>
			<ViewerOptionRow
				title="ニュートラル陣営役職数"
				value={neutralRoles.display}
				onDoubleClick={() => navigateExR(neutralRoles.minUniqueId)}
			/>
			{vanillaRoles.map(
				(role) =>
					role && (
						<ViewerOptionRow
							key={role.name}
							title={role.name}
							value={role.display}
							onDoubleClick={() => navigateAu(role.tabId, 0, role.chanceId)}
						/>
					),
			)}
		</div>
	);
}
