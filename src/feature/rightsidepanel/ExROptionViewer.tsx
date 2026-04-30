import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { useStore } from "../../useStore";
import { ExRTab0GeneralCategory } from "./ExRTab0GeneralCategory";

/**
 * ExRの設定内容を表示するコンポーネント
 */
export function ExROptionViewer() {
	const tab0CategoryIds = exrOptionMetaData.tabs[0]?.categoryIds || [];
	const presetNames = useStore((state) => state.presetNames);
	const exrValue = useStore((state) => state.exrValue);

	// プリセット情報の取得
	const presetValueData = exrValue[PRESET_OPTION_UNIQUE_ID];
	const currentSelection = presetValueData?.selection ?? 0;
	const presetValues = presetValueData?.values || [];
	const currentPresetValue = presetValues[currentSelection];
	const currentPresetName =
		presetNames[currentSelection] ?? String(currentPresetValue ?? "");

	return (
		<div className="flex flex-col gap-2">
			{/* プリセット表示 */}
			{presetValueData && (
				<div className="px-2 py-1 bg-gray-100 rounded text-sm flex justify-between items-center">
					<span className="text-gray-500">Preset</span>
					<span className="font-semibold text-gray-700">
						{currentPresetName}
					</span>
				</div>
			)}

			{tab0CategoryIds.map((categoryId) => {
				return (
					<ExRTab0GeneralCategory key={categoryId} categoryId={categoryId} />
				);
			})}
		</div>
	);
}
