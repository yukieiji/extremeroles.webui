import { ColoredText } from './ColoredText';

interface OptionNameDisplayProps {
  name: string;
}

/**
 * オプション名を表示するコンポーネント
 */
export function OptionNameDisplay({ name }: OptionNameDisplayProps) {
  return <ColoredText text={name} />;
}
