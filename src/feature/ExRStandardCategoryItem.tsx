import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
import { ColoredText } from '../components/parts/ColoredText';
import { ExRCategoryOptionList } from './ExRCategoryOptionList';
import { isPresetOption } from '../logics/optionUtils';
import type { ExRCategoryDto } from '../type';

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
