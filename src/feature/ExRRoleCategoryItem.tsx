import { useStore } from '../useStore';
import { ColoredText } from '../components/parts/ColoredText';
import { ExRCategoryOptionList } from './ExRCategoryOptionList';
import { ExRHeaderOptionControl } from './ExRHeaderOptionControl';
import { isPresetOption, getUniqueOptionId, findClosestIndex } from '../logics/optionUtils';
import type { ExRCategoryDto } from '../type';

interface ExRRoleCategoryItemProps {
  category: ExRCategoryDto;
}

/**
 * 役職タブで使用される、スポーン設定をヘッダーに持つカテゴリ表示コンポーネント
 */
export function ExRRoleCategoryItem({ category }: ExRRoleCategoryItemProps) {
  const isOpen = useStore((state) => {
    return state.openedExRCategoryIds[category.Id] ?? false;
  });
  const toggleExRCategory = useStore((state) => {
    return state.toggleExRCategory;
  });
  const TEMP_updateExROptionSelection = useStore((state) => {
    return state.TEMP_updateExROptionSelection;
  });

  const spawnRateOption = category.Options.find((opt) => {
    return opt.Id === 50;
  });
  const spawnCountOption = category.Options.find((opt) => {
    return opt.Id === 51;
  });

  const spawnRateSelection = useStore((state) => {
    const uniqueId = getUniqueOptionId(category.Id, 50);
    return state.effectiveSelections[uniqueId] ?? spawnRateOption?.Selection ?? 0;
  });

  const spawnCountSelection = useStore((state) => {
    const uniqueId = getUniqueOptionId(category.Id, 51);
    return state.effectiveSelections[uniqueId] ?? spawnCountOption?.Selection ?? 0;
  });

  // スポーンレートが0のときはスポーン数も0として扱うための仮想的な値リスト
  const originalSpawnCountValues = (spawnCountOption?.RangeMeta.Values as number[]) ?? [];
  const virtualSpawnCountValues = [0, ...originalSpawnCountValues];

  // 現在のスポーンレートが0%なら、表示上のスポーン数も0にする
  const spawnRateValues = (spawnRateOption?.RangeMeta.Values as number[]) ?? [0];
  const isSpawnRateZero = spawnRateValues[spawnRateSelection] === 0;

  const currentCountUISelection = isSpawnRateZero ? 0 : spawnCountSelection + 1;

  const handleRateChange = (newSelection: number) => {
    if (!spawnRateOption) {
      return;
    }
    const uniqueRateId = getUniqueOptionId(category.Id, 50);
    TEMP_updateExROptionSelection(uniqueRateId, newSelection);

    // スポーンレートを0%にするとスポーン数を0に（内部的にはレートが0なら数も0と見なす）
    const newRateValue = spawnRateValues[newSelection] ?? 0;
    if (newRateValue === 0 && spawnCountOption) {
      const uniqueCountId = getUniqueOptionId(category.Id, 51);
      // スポーン数を0にする（レート0のときは表示上0になるので、内部値は適当でも良いが、一応最小値にしておく）
      TEMP_updateExROptionSelection(uniqueCountId, 0);
    }
  };

  const handleCountUIChange = (newUISelection: number) => {
    if (!spawnCountOption || !spawnRateOption) {
      return;
    }
    const uniqueCountId = getUniqueOptionId(category.Id, 51);
    const uniqueRateId = getUniqueOptionId(category.Id, 50);

    if (newUISelection === 0) {
      // スポーン数を0へ変更するとスポーンレートが0%へ
      TEMP_updateExROptionSelection(uniqueRateId, findClosestIndex(spawnRateValues, 0));
      TEMP_updateExROptionSelection(uniqueCountId, 0);
    } else {
      // スポーン数を変更（0以外）するとスポーンレートを10％へ（元が0%の場合のみ）
      if (isSpawnRateZero) {
        TEMP_updateExROptionSelection(uniqueRateId, findClosestIndex(spawnRateValues, 10));
      }
      TEMP_updateExROptionSelection(uniqueCountId, newUISelection - 1);
    }
  };

  const filteredOptions = category.Options.filter((option) => {
    if (isPresetOption(category.Id, option.Id)) {
      return false;
    }
    if (option.Id === 50 || option.Id === 51) {
      return false;
    }
    return true;
  });

  if (filteredOptions.length === 0) {
    return null;
  }

  return (
    <div
      className="border border-gray-700 rounded-lg overflow-hidden mb-2"
      data-testid={`exr-category-${category.Id}`}
    >
      <div className="flex items-center bg-gray-800 hover:bg-gray-700 transition-colors">
        <button
          type="button"
          onClick={() => {
            toggleExRCategory(category.Id);
          }}
          className="flex-1 flex items-center gap-3 p-4 text-left"
          aria-expanded={isOpen}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span className="font-semibold text-gray-200">
            <ColoredText text={category.Name} />
          </span>
        </button>

        <div className="flex items-center px-4 gap-4">
          {spawnRateOption && (
            <div data-testid="spawn-rate-control">
              <ExRHeaderOptionControl
                categoryId={category.Id}
                option={spawnRateOption}
                label="レート"
                customSelection={spawnRateSelection}
                onSelectionChange={handleRateChange}
              />
            </div>
          )}
          {spawnCountOption && (
            <div data-testid="spawn-count-control">
              <ExRHeaderOptionControl
                categoryId={category.Id}
                option={spawnCountOption}
                label="数"
                customValues={virtualSpawnCountValues}
                customSelection={currentCountUISelection}
                onSelectionChange={handleCountUIChange}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          {isOpen && (
            <div className="p-4 bg-gray-900 border-t border-gray-700">
              <ExRCategoryOptionList categoryId={category.Id} options={filteredOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
