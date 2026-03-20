import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
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
    return !!state.openedExRCategoryIds[category.Id];
  });
  const toggleExRCategory = useStore((state) => {
    return state.toggleExRCategory;
  });

  return (
    <Accordion
      title={category.Name}
      isOpen={isOpen}
      onToggle={() => {
        toggleExRCategory(category.Id);
      }}
    >
      <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto max-h-[40vh]">
        <pre
          data-testid={`category-json-${category.Id}`}
          className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed"
        >
          {JSON.stringify(category.Options, null, 2)}
        </pre>
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
    <div className="flex flex-col">
      {visibleCategories.map((category) => {
        return <CategoryAccordion key={category.Id} category={category} />;
      })}
    </div>
  );
}
