import { ColoredText } from './ColoredText';

interface OptionNameDisplayProps {
  name: string;
}

/**
 * オプション名を表示するコンポーネント
 * ColoredText をラップして表示を統一します。
 */
export function OptionNameDisplay({ name }: OptionNameDisplayProps) {
  return <ColoredText text={name} />;
}
