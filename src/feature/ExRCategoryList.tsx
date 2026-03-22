import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
import { ColoredText } from '../components/parts/ColoredText';
import { ExROptionItem } from './ExROptionItem';
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

  return (
    <Accordion
      title={<ColoredText text={category.Name} />}
      isOpen={isOpen}
      onToggle={() => {
        toggleExRCategory(category.Id);
      }}
    >
      <div className="flex flex-col gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {category.Options.map((option) => (
          <ExROptionItem key={option.Id} option={option} />
        ))}
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

  const selectedTab = tabs.find((tab) => {
    return tab.Id === selectedExRTabId;
  }) || tabs[0];

  // オプションが空でない、かつ少なくとも1つのオプションが有効なカテゴリのみを抽出
  const visibleCategories = selectedTab.Categories.filter((category) => {
    return category.Options.length > 0 && category.Options.some((opt) => {
      return opt.IsActive;
    });
  });

  return (
    <div
      data-testid="exr-category-list"
      className="flex flex-col"
    >
      {visibleCategories.map((category) => {
        return <CategoryAccordion key={category.Id} category={category} />;
      })}
    </div>
  );
}
