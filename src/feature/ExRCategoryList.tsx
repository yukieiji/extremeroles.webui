import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
import { ColoredText } from '../components/parts/ColoredText';
import { ExROptionItem } from './ExROptionItem';
import { ExRPairedOptionRow } from './ExRPairedOptionRow';
import { ExRHeaderOptionControl } from './ExRHeaderOptionControl';
import { isPresetOption, groupOptionPairs, getUniqueOptionId } from '../logics/optionUtils';
import { OptionTab } from '../type';
import type { ExRCategoryDto, ExRTabDto } from '../type';

/**
 * グループ化表示（最小・最大ペア）を有効にするカテゴリIDのリスト
 */
const GROUPED_CATEGORY_IDS = [5, 6];

interface CategoryAccordionProps {
  tabId: OptionTab;
  category: ExRCategoryDto;
}

/**
 * 個別のカテゴリを表示するコンポーネント
 * 特定のカテゴリの開閉状態のみを監視することで、再レンダリングを最小限に抑えます。
 */
function CategoryAccordion({ tabId, category }: CategoryAccordionProps) {
  const isOpen = useStore((state) => {
    return state.openedExRCategoryIds[category.Id] ?? false;
  });
  const toggleExRCategory = useStore((state) => {
    return state.toggleExRCategory;
  });

  // スポーンレート(50)のセレクション状態を監視
  const spawnRateSelection = useStore((state) => {
    const uniqueId = getUniqueOptionId(category.Id, 50);
    const effectiveSelection = state.effectiveSelections[uniqueId];
    if (effectiveSelection !== undefined) {
      return effectiveSelection;
    }
    const option = category.Options.find((opt) => {
      return opt.Id === 50;
    });
    return option?.Selection ?? 0;
  });

  // 役職タブ（GeneralTab以外）の場合は、Id: 50, 51 を特別扱いする
  const isRoleTab = tabId !== OptionTab.GeneralTab;
  const spawnRateOption = isRoleTab
    ? category.Options.find((opt) => {
        return opt.Id === 50;
      })
    : null;
  const spawnCountOption = isRoleTab
    ? category.Options.find((opt) => {
        return opt.Id === 51;
      })
    : null;

  // プリセット設定（Category 0, Option 0）およびヘッダーに移動した 50, 51 を非表示にする
  const filteredOptions = category.Options.filter((option) => {
    if (isPresetOption(category.Id, option.Id)) {
      return false;
    }
    if (isRoleTab && (option.Id === 50 || option.Id === 51)) {
      return false;
    }
    return true;
  });

  // 全てのオプションが除外された場合はアコーディオンを表示しない
  if (filteredOptions.length === 0) {
    return null;
  }

  const shouldGroup = GROUPED_CATEGORY_IDS.includes(category.Id);
  const groupedItems = shouldGroup
    ? groupOptionPairs(filteredOptions)
    : filteredOptions;

  const headerExtra = (isRoleTab && spawnRateOption) ? (
    <div className="flex items-center gap-4">
      <ExRHeaderOptionControl
        categoryId={category.Id}
        option={spawnRateOption}
        label="レート"
      />
      {spawnRateSelection >= 1 && spawnCountOption && (
        <ExRHeaderOptionControl
          categoryId={category.Id}
          option={spawnCountOption}
          label="数"
        />
      )}
    </div>
  ) : undefined;

  return (
    <Accordion
      title={<ColoredText text={category.Name} />}
      headerExtra={headerExtra}
      isOpen={isOpen}
      onToggle={() => {
        toggleExRCategory(category.Id);
      }}
    >
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
    </Accordion>
  );
}

interface ExRCategoryListProps {
  tabs: ExRTabDto[];
}

/**
 * 選択されたタブのカテゴリ一覧を表示するコンポーネント
 */
export function ExRCategoryList({ tabs }: ExRCategoryListProps) {
  const selectedExRTabId = useStore((state) => {
    return state.selectedExRTabId;
  });
  const isTabPending = useStore((state) => {
    return state.isTabPending;
  });

  let selectedTab = tabs.find((tab) => {
    return tab.Id === selectedExRTabId;
  });

  if (!selectedTab) {
    selectedTab = tabs[0];
  }

  // オプションが空でない、かつ少なくとも1つのオプションが有効なカテゴリのみを抽出
  // ※ プリセット設定が唯一のオプションだった場合も考慮してフィルタリング
  const visibleCategories = selectedTab.Categories.filter((category) => {
    const filteredOptions = category.Options.filter((option) => {
      const isPreset = isPresetOption(category.Id, option.Id);
      return !isPreset;
    });
    return filteredOptions.some((opt) => {
      return opt.IsActive;
    });
  });

  return (
    <div
      data-testid="exr-category-list"
      className={`flex flex-col relative transition-opacity duration-200 ${isTabPending ? 'is-pending opacity-50 pointer-events-none' : 'opacity-100'}`}
      data-is-pending={isTabPending ? "true" : "false"}
    >
      {isTabPending && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {visibleCategories.map((category) => {
        return (
          <CategoryAccordion
            key={category.Id}
            tabId={selectedExRTabId}
            category={category}
          />
        );
      })}
    </div>
  );
}
