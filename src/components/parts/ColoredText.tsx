import type { ReactNode } from 'react';

interface ColoredTextProps {
  text: string;
}

/**
 * カラータグ（<color=#RRGGBB>...</color> または <color=#RRGGBBAA>...</color>）および改行（\n）を検出する正規表現
 */
const COLOR_TAG_REGEX = /(<color=#[0-9A-F]{6,8}>|<\/color>|\n)/gi;

/**
 * カラータグから16進数カラーコードを抽出する正規表現
 */
const COLOR_HEX_REGEX = /#[0-9A-F]{6,8}/i;

/**
 * カラータグ（<color=#RRGGBB>...</color>）と改行（\n）を反映させるコンポーネント
 * ネストをサポートします。
 */
export function ColoredText({ text }: ColoredTextProps) {
  if (!text) {
    return null;
  }

  const parts = text.split(COLOR_TAG_REGEX);

  // ステートフルに解析するためにスタックを使用
  const stack: { color: string; elements: ReactNode[] }[] = [];
  let currentElements: ReactNode[] = [];

  parts.forEach((part, index) => {
    if (!part) {
      return;
    }

    const lowerPart = part.toLowerCase();
    if (lowerPart.startsWith('<color=')) {
      const colorMatch = part.match(COLOR_HEX_REGEX);
      const color = colorMatch ? colorMatch[0] : 'inherit';

      // 現在の要素リストをスタックに保存し、新しい要素リストを開始
      stack.push({ color, elements: currentElements });
      currentElements = [];
    } else if (lowerPart === '</color>') {
      if (stack.length > 0) {
        const last = stack.pop()!;
        const coloredSpan = (
          <span key={`color-${index}`} style={{ color: last.color }}>
            {currentElements}
          </span>
        );
        // 親の要素リストに戻り、作成した要素を追加
        currentElements = last.elements;
        currentElements.push(coloredSpan);
      } else {
        // 閉じタグが余分な場合はテキストとして扱う
        currentElements.push(part);
      }
    } else if (part === '\n') {
      currentElements.push(<br key={`br-${index}`} />);
    } else {
      currentElements.push(part);
    }
  });

  // 未閉じのタグがある場合の処理
  while (stack.length > 0) {
    const last = stack.pop()!;
    const coloredSpan = (
      <span key={`unclosed-${stack.length}`} style={{ color: last.color }}>
        {currentElements}
      </span>
    );
    currentElements = last.elements;
    currentElements.push(coloredSpan);
  }

  return <>{currentElements}</>;
}
