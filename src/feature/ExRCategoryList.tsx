import type { ReactNode } from 'react';
import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
import { ColoredText } from '../components/parts/ColoredText';
import { ExROptionItem } from './ExROptionItem';
import { ExRPairedOptionRow } from './ExRPairedOptionRow';
import { ExRHeaderOptionControl } from './ExRHeaderOptionControl';
import { isPresetOption, groupOptionPairs, getUniqueOptionId } from '../logics/optionUtils';
import { OptionTab } from '../type';
import type { ExRCategoryDto, ExRTabDto, ExROptionDto } from '../type';

/**
 * グループ化表示（最小・最大ペア）を有効にするカテゴリIDのリスト
 */
const GROUPED_CATEGORY_IDS = [5, 6];

interface ExRCategoryHeaderSpawnControlsProps {
  categoryId: number;
  spawnRateOption: ExROptionDto;
  spawnCountOption: ExROptionDto | null;
}

/**
 * カテゴリヘッダー内のスポーンレート・数コントロール
 */
function ExRCategoryHeaderSpawnControls({
  categoryId,
  spawnRateOption,
  spawnCountOption,
}: ExRCategoryHeaderSpawnControlsProps) {
  const spawnRateSelection = useStore((state) => {
    const uniqueId = getUniqueOptionId(categoryId, 50);
    return state.effectiveSelections[uniqueId] ?? spawnRateOption.Selection;
  });

  return (
    <div className="flex items-center gap-4">
      <ExRHeaderOptionControl
        categoryId={categoryId}
        option={spawnRateOption}
        label="レート"
      />
      {spawnRateSelection >= 1 && spawnCountOption && (
        <ExRHeaderOptionControl
          categoryId={categoryId}
          option={spawnCountOption}
          label="数"
        />
      )}
    </div>
  );
}

interface ExRCategoryOptionListProps {
  categoryId: number;
  options: ExROptionDto[];
}

/**
 * カテゴリ内のオプション一覧を表示するコンポーネント
 */
function ExRCategoryOptionList({ categoryId, options }: ExRCategoryOptionListProps) {
  const shouldGroup = GROUPED_CATEGORY_IDS.includes(categoryId);
  const groupedItems = shouldGroup ? groupOptionPairs(options) : options;

  return (
    <div className="flex flex-col gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      {groupedItems.map((item, idx) => {
        if ('type' in item && item.type === 'pair') {
          return (
            <ExRPairedOptionRow
              key={`pair-${idx}`}
              categoryId={categoryId}
              baseName={item.baseName}
              min={item.min}
              max={item.max}
              minLabel={item.minLabel}
              maxLabel={item.maxLabel}
            />
          );
        }
        return <ExROptionItem key={item.Id} categoryId={categoryId} option={item} />;
      })}
    </div>
  );
}

interface ExRCategoryItemProps {
  tabId: OptionTab;
  category: ExRCategoryDto;
}

/**
 * カテゴリ項目の構成を行うコンポーネント
 */
function ExRCategoryItem({ tabId, category }: ExRCategoryItemProps) {
  const isOpen = useStore((state) => {
    return state.openedExRCategoryIds[category.Id] ?? false;
  });
  const toggleExRCategory = useStore((state) => {
    return state.toggleExRCategory;
  });

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

  const filteredOptions = category.Options.filter((option) => {
    if (isPresetOption(category.Id, option.Id)) {
      return false;
    }
    if (isRoleTab && (option.Id === 50 || option.Id === 51)) {
      return false;
    }
    return true;
  });

  if (filteredOptions.length === 0) {
    return null;
  }

  const headerExtra =
    isRoleTab && spawnRateOption ? (
      <ExRCategoryHeaderSpawnControls
        categoryId={category.Id}
        spawnRateOption={spawnRateOption}
        spawnCountOption={spawnCountOption}
      />
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
      <ExRCategoryOptionList categoryId={category.Id} options={filteredOptions} />
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
      data-is-pending={isTabPending ? 'true' : 'false'}
    >
      {isTabPending && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {visibleCategories.map((category) => {
        return (
          <ExRCategoryItem
            key={category.Id}
            tabId={selectedExRTabId}
            category={category}
          />
        );
      })}
    </div>
  );
}
