import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
import { ColoredText } from '../components/parts/ColoredText';
import { ExROptionItem } from './ExROptionItem';
import { ExRPairedOptionRow } from './ExRPairedOptionRow';
import { isPresetOption, groupOptionPairs } from '../logics/optionUtils';
import type { ExRCategoryDto, ExROptionDto } from '../type';

const GROUPED_CATEGORY_IDS = [5, 6];

interface ExRCategoryOptionListProps {
  categoryId: number;
  options: ExROptionDto[];
}

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

interface ExRStandardCategoryItemProps {
  category: ExRCategoryDto;
}

/**
 * 全般タブなどで使用される標準的なカテゴリ表示コンポーネント
 */
export function ExRStandardCategoryItem({ category }: ExRStandardCategoryItemProps) {
  const isOpen = useStore((state) => {
    return state.openedExRCategoryIds[category.Id] ?? false;
  });
  const toggleExRCategory = useStore((state) => {
    return state.toggleExRCategory;
  });

  const filteredOptions = category.Options.filter((option) => {
    return !isPresetOption(category.Id, option.Id);
  });

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
      <ExRCategoryOptionList categoryId={category.Id} options={filteredOptions} />
    </Accordion>
  );
}
