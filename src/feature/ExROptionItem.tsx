import { useStore } from '../useStore';
import { OptionItem } from '../components/parts/OptionItem';
import { OptionNameDisplay } from '../components/parts/OptionNameDisplay';
import { OptionSliderControl } from '../components/parts/OptionSliderControl';
import { OptionDropdownControl } from '../components/parts/OptionDropdownControl';
import { OptionAccordion } from '../components/blocks/OptionAccordion';
import type { ExROptionDto } from '../type';

interface ExROptionItemProps {
  option: ExROptionDto;
  depth?: number;
}

/**
 * ExRオプションの個別の項目を表示・管理するコンポーネント
 */
export function ExROptionItem({ option, depth = 0 }: ExROptionItemProps) {
  const isOpen = useStore((state) => {
    return state.openedExROptionIds[option.Id] ?? false;
  });
  const toggleExROption = useStore((state) => {
    return state.toggleExROption;
  });

  if (!option.IsActive) {
    return null;
  }

  const handleToggle = () => {
    toggleExROption(option.Id);
  };

  const handleChange = (newSelection: number) => {
    // TODO: 将来的に API を呼び出すロジックを追加
    console.log(`Option ${option.Id} changed to selection ${newSelection}`);
  };

  const hasChildren = option.Childs && option.Childs.length > 0;

  const renderControl = () => {
    const { Type, Values } = option.RangeMeta;

    if (Type === 'String') {
      return (
        <OptionDropdownControl
          selection={option.Selection}
          values={Values as string[]}
          onChange={handleChange}
        />
      );
    }

    if (Type === 'Int32' || Type === 'Single') {
      return (
        <OptionSliderControl
          selection={option.Selection}
          values={Values as number[]}
          format={option.Format}
          onChange={handleChange}
        />
      );
    }

    return null;
  };

  const optionItem = (
    <OptionItem
      className={depth > 0 ? 'border-l-2 border-blue-500/30 ml-4' : ''}
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-200 break-words">
          <OptionNameDisplay name={option.TranslatedName} />
        </span>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        {renderControl()}
      </div>
    </OptionItem>
  );

  if (hasChildren) {
    return (
      <OptionAccordion
        optionItem={optionItem}
        isOpen={isOpen}
        onToggle={handleToggle}
      >
        <div className="flex flex-col">
          {option.Childs.map((child) => (
            <ExROptionItem key={child.Id} option={child} depth={depth + 1} />
          ))}
        </div>
      </OptionAccordion>
    );
  }

  return optionItem;
}
