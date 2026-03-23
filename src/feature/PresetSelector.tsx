import { useEffect, useRef } from "react";
import { getUniqueOptionId } from "../logics/optionUtils";
import type { ExRTabDto } from "../type";
import { useStore } from "../useStore";

interface PresetSelectorProps {
	tabs: ExRTabDto[];
}

/**
 * プリセットを選択・編集するためのコンポーネント。
 * CategoryId: 0, OptionId: 0 の設定を操作します。
 * AGENT.md のガイドラインに従い、useState を使用せず、グローバルストアで状態を管理します。
 *
 * 入力更新の最適化:
 * ユーザー入力ごとの Cookie 書き込みを避けるため、onBlur または Enter キー入力時に更新を行います。
 */
export function PresetSelector({ tabs }: PresetSelectorProps) {
	// GeneralTab (Id: 0) から プリセットカテゴリ (Id: 0) を探す
	const generalTab = tabs.find((t) => {
		return t.Id === 0;
	});
	const presetCategory = generalTab?.Categories.find((c) => {
		return c.Id === 0;
	});
	const presetOption = presetCategory?.Options.find((o) => {
		return o.Id === 0;
	});

	const uniqueId = getUniqueOptionId(0, 0);
	const effectiveSelection = useStore((state) => {
		return state.effectiveSelections[uniqueId];
	});
	const currentSelection = effectiveSelection ?? presetOption?.Selection ?? 0;

	const presetNames = useStore((state) => {
		return state.presetNames;
	});
	const isDropdownOpen = useStore((state) => {
		return state.isPresetDropdownOpen;
	});
	const updatePresetName = useStore((state) => {
		return state.updatePresetName;
	});
	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});
	const setPresetDropdownOpen = useStore((state) => {
		return state.setPresetDropdownOpen;
	});

	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// 外部クリックでドロップダウンを閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setPresetDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setPresetDropdownOpen]);

	if (!presetOption) {
		return null;
	}

	const presetValues = presetOption.RangeMeta.Values as number[];
	const currentPresetValue = presetValues[currentSelection];
	const currentPresetName =
		presetNames[currentSelection] ?? String(currentPresetValue);

	const handlePresetSelect = (index: number) => {
		TEMP_updateExROptionSelection(uniqueId, index);
		setPresetDropdownOpen(false);
	};

	/**
	 * ストアと Cookie を更新する
	 */
	const commitNameChange = () => {
		if (inputRef.current) {
			const value = inputRef.current.value.trim();
			updatePresetName(currentSelection, value);
			if (value === "") {
				inputRef.current.value = String(currentPresetValue);
			}
		}
	};

	const handleBlur = () => {
		commitNameChange();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			commitNameChange();
			// Enter 入力後はフォーカスを外して確定を視覚的に示す
			e.currentTarget.blur();
		}
	};

	const toggleDropdown = () => {
		setPresetDropdownOpen(!isDropdownOpen);
	};

	return (
		<div className="relative flex items-center gap-2" ref={dropdownRef}>
			<div className="relative flex items-center bg-gray-800 border border-gray-700 rounded overflow-hidden focus-within:border-blue-500">
				<input
					ref={inputRef}
					type="text"
					key={currentSelection}
					defaultValue={currentPresetName}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					className="px-3 py-1.5 text-sm bg-transparent text-gray-200 outline-none w-48"
					placeholder="プリセット名を入力..."
				/>
				<button
					type="button"
					onClick={toggleDropdown}
					className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 border-l border-gray-600 transition-colors"
					aria-label="プリセットを選択"
				>
					<svg
						className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
			</div>

			{isDropdownOpen && (
				<div className="absolute top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded shadow-xl z-50 max-h-60 overflow-y-auto">
					{presetValues.map((val, index) => {
						const name = presetNames[index] ?? String(val);
						const isSelected = index === currentSelection;
						return (
							<button
								key={`preset-${val}`}
								type="button"
								onClick={() => {
									handlePresetSelect(index);
								}}
								className={`
                  w-full text-left px-3 py-2 text-sm transition-colors
                  ${isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}
                `}
							>
								<div className="flex justify-between items-center">
									<span>{name}</span>
									{name !== String(val) && (
										<span className="text-xs opacity-50 ml-2">({val})</span>
									)}
								</div>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
