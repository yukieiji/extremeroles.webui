import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
import { ColoredText } from '../components/parts/ColoredText';
import { ExROptionItem } from './ExROptionItem';
import { isPresetOption } from '../logics/optionUtils';
import type { ExRCategoryDto, ExRTabDto } from '../type';

interface CategoryAccordionProps {
  category: ExRCategoryDto;
}

/**
 * 個別のカテゴリを表示するコンポーネント
 * 特定のカテゴリの開閉状態のみを監視することで、再レンダリングを最小限に抑えます。
 */
function CategoryAccordion({ category }: CategoryAccordionProps) {
  const isOpen = useStore((state) => {
    return state.openedExRCategoryIds[category.Id] ?? false;
  });
  const toggleExRCategory = useStore((state) => {
    return state.toggleExRCategory;
  });

  // プリセット設定（Category 0, Option 0）を非表示にする
  const filteredOptions = category.Options.filter((option) => {
    return !isPresetOption(category.Id, option.Id);
  });

  // 全てのオプションが除外された場合はアコーディオンを表示しない
  if (filteredOptions.length === 0) {
    return null;
  }

  return (
    <Accordion
      title={<ColoredText text={category.Name} />}
      isOpen={isOpen}
      onToggle={() => {
        toggleExRCategory(category.Id);
      }}
    >
      <div className="flex flex-col gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {filteredOptions.map((option) => {
          return (
            <ExROptionItem key={option.Id} categoryId={category.Id} option={option} />
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

  const selectedTab = tabs.find((tab) => {
    return tab.Id === selectedExRTabId;
  }) || tabs[0];

  // オプションが空でない、かつ少なくとも1つのオプションが有効なカテゴリのみを抽出
  // ※ プリセット設定が唯一のオプションだった場合も考慮してフィルタリング
  const visibleCategories = selectedTab.Categories.filter((category) => {
    const filteredOptions = category.Options.filter((option) => {
      return !isPresetOption(category.Id, option.Id);
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
        return <CategoryAccordion key={category.Id} category={category} />;
      })}
    </div>
  );
}
