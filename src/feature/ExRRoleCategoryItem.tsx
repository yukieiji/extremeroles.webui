import { useStore } from '../useStore';
import { ColoredText } from '../components/parts/ColoredText';
import { ExROptionItem } from './ExROptionItem';
import { ExRPairedOptionRow } from './ExRPairedOptionRow';
import { ExRHeaderOptionControl } from './ExRHeaderOptionControl';
import { isPresetOption, groupOptionPairs, getUniqueOptionId } from '../logics/optionUtils';
import type { ExRCategoryDto } from '../type';

const GROUPED_CATEGORY_IDS = [5, 6];

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

  const shouldGroup = GROUPED_CATEGORY_IDS.includes(category.Id);
  const groupedItems = shouldGroup ? groupOptionPairs(filteredOptions) : filteredOptions;

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden mb-2">
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
            <ExRHeaderOptionControl
              categoryId={category.Id}
              option={spawnRateOption}
              label="レート"
            />
          )}
          {spawnRateSelection >= 1 && spawnCountOption && (
            <ExRHeaderOptionControl
              categoryId={category.Id}
              option={spawnCountOption}
              label="数"
            />
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
              <div className="flex flex-col gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {groupedItems.map((item, idx) => {
                  if ('type' in item && item.type === 'pair') {
                    return (
                      <ExRPairedOptionRow
                        key={`pair-${idx}`}
                        categoryId={category.Id}
                        baseName={item.baseName}
                        min={item.min}
                        max={item.max}
                        minLabel={item.minLabel}
                        maxLabel={item.maxLabel}
                      />
                    );
                  }
                  return (
                    <ExROptionItem key={item.Id} categoryId={category.Id} option={item} />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
