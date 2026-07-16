import { useState, useEffect, useCallback } from "react";
import { useDesignTheme } from "../../themeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockHighlightWrapperProps {
  isHighlighted: boolean;
  ringColor: string;
  children: React.ReactNode;
  isInset?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント（デザイン調整用モック）
 */
function MockHighlightWrapper({
  isHighlighted,
  ringColor,
  children,
  isInset = false,
  className,
  style,
}: MockHighlightWrapperProps) {
  const highlightClass = isHighlighted
    ? `ring-2 ${ringColor} ${isInset ? "ring-inset" : ""}`
    : "";

  return (
    <div
      className={cn(
        "transition-all duration-500 rounded",
        highlightClass,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export default function SearchHighlightColor() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const { basicTextColor, neutralColors, searchHighlightColor } = useDesignTheme();

  const triggerHighlight = useCallback((id: string) => {
    setHighlightedId(id);
  }, []);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, searchHighlightColor.duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [highlightedId, searchHighlightColor.duration]);

  // Logic from src/logics/optionUtils.ts
  const getIndentation = (depth: number, multiplier = 0.5, base = 0.375) => {
    const total = base + (depth > 0 ? depth * multiplier : 0);
    return `${total}rem`;
  };

  return (
    <div
      className="p-4 space-y-12 min-h-screen"
      style={{ backgroundColor: neutralColors.neutral1.hex }}
    >
      {/* 説明文セクション */}
      <section>
        <h2 className={cn("text-2xl font-bold mb-4", basicTextColor.textPrimary)}>
          検索ハイライト色
        </h2>
        <div
          className="p-4 border rounded-lg mb-6"
          style={{
            borderColor: neutralColors.neutral4.hex,
            backgroundColor: neutralColors.neutral2.hex,
          }}
        >
          <h3 className={cn("text-lg font-semibold mb-2", basicTextColor.textPrimary)}>
            DesignLanguageCheckList.md の定義
          </h3>
          <ul className={cn("list-disc list-inside space-y-1", basicTextColor.textSecondary)}>
            <li>
              <strong>検索ハイライト色</strong> : 検索ワードに一致した箇所を目立たせる色。
            </li>
          </ul>
          <p className={cn("mt-4 text-sm", basicTextColor.textTertiary)}>
            設定ファイル:{" "}
            <code className="p-1 rounded bg-gray-100 dark:bg-neutral-800 font-mono">
              design/src/designConstants.ts
            </code>
          </p>
        </div>
      </section>

      {/* テスト操作パネル */}
      <section className="space-y-4">
        <h3 className={cn("text-lg font-semibold", basicTextColor.textPrimary)}>
          ハイライトテスト
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-amber-300 dark:text-neutral-900" onClick={() => {
            triggerHighlight("dropdown");
          }}>
            ドロップダウンをハイライト
          </Button>
          <Button className="bg-amber-300 dark:text-neutral-900" onClick={() => {
            triggerHighlight("accordion-all");
          }}>
            アコーディオン全体をハイライト
          </Button>
          <Button className="bg-amber-300 dark:text-neutral-900" onClick={() => {
            triggerHighlight("row-parent-1");
          }}>
            親要素1をハイライト
          </Button>
          <Button className="bg-amber-300 dark:text-neutral-900" onClick={() => {
            triggerHighlight("row-child-1");
          }}>
            子要素1をハイライト
          </Button>
          <Button className="bg-amber-300 dark:text-neutral-900" onClick={() => {
            triggerHighlight("row-nested-child-1");
          }}>
            ネストされた子要素1をハイライト
          </Button>
        </div>
      </section>

      {/* プレビューエリア */}
      <section className="space-y-8">
        <h3 className={cn("text-lg font-semibold", basicTextColor.textPrimary)}>
          プレビュー
        </h3>

        {/* プリセットドロップダウンのモック */}
        <div className="space-y-2">
          <h4 className={cn("text-sm font-medium", basicTextColor.textSecondary)}>
            プリセットドロップダウン (Mock)
          </h4>
          <MockHighlightWrapper isHighlighted={highlightedId === "dropdown"} ringColor={searchHighlightColor.ring} className="w-fit">
            <div
              className="flex items-stretch border rounded-md overflow-hidden w-48 h-9"
              style={{
                backgroundColor: neutralColors.neutral2.hex,
                borderColor: neutralColors.neutral5.hex,
              }}
            >
              <div className="flex-1 px-3 flex items-center">
                <span className={cn("text-sm", basicTextColor.textPrimary)}>Preset 1</span>
              </div>
              <div
                className="w-9 flex items-center justify-center border-l"
                style={{ borderColor: neutralColors.neutral5.hex }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </MockHighlightWrapper>
        </div>

        {/* アコーディオンのモック */}
        <div className="space-y-2">
          <h4 className={cn("text-sm font-medium", basicTextColor.textSecondary)}>
            アコーディオン構成 (Mock)
          </h4>
          <MockHighlightWrapper
            isHighlighted={highlightedId === "accordion-all"}
            ringColor={searchHighlightColor.ring}
            className="border rounded-md overflow-hidden"
            style={{
              backgroundColor: neutralColors.neutral3.hex,
              borderColor: neutralColors.neutral5.hex,
            }}
          >
            {/* Parent Accordion Row 1 */}
            <MockHighlightWrapper
              isHighlighted={highlightedId === "row-parent-1"}
              ringColor={searchHighlightColor.ring}
              isInset={true}
            >
              <div
                className="flex items-stretch py-2"
                style={{ paddingLeft: getIndentation(0) }}
              >
                <div className="w-8 shrink-0 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 flex items-center justify-between pr-4">
                  <span className={cn("text-sm font-bold", basicTextColor.textPrimary)}>
                    親アコーディオン項目 1
                  </span>
                </div>
              </div>
            </MockHighlightWrapper>

            <div
              className="border-t"
              style={{ borderColor: neutralColors.neutral4.hex }}
            >
              {/* Child Item 1 */}
              <MockHighlightWrapper
                isHighlighted={highlightedId === "row-child-1"}
                ringColor={searchHighlightColor.ring}
                isInset={true}
              >
                <div
                  className="flex items-stretch py-2"
                  style={{ paddingLeft: getIndentation(1) }}
                >
                  <div className="w-8 shrink-0" />
                  <div className="flex-1 flex items-center justify-between pr-4">
                    <span className={cn("text-sm", basicTextColor.textSecondary)}>
                      子要素 1
                    </span>
                    <Input
                      className="w-24 h-7 text-xs"
                      defaultValue="Value"
                      style={{
                        backgroundColor: neutralColors.neutral1.hex,
                        borderColor: neutralColors.neutral5.hex,
                      }}
                    />
                  </div>
                </div>
              </MockHighlightWrapper>

              <div
                className="mx-4 border-t"
                style={{ borderColor: neutralColors.neutral4.hex }}
              />

              {/* Nested Accordion */}
              <div className="flex flex-col">
                <div
                  className="flex items-stretch py-2"
                  style={{ paddingLeft: getIndentation(1) }}
                >
                  <div className="w-8 shrink-0 flex items-center justify-center">
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="flex-1 flex items-center justify-between pr-4">
                    <span className={cn("text-sm font-medium", basicTextColor.textSecondary)}>
                      ネストされたアコーディオン
                    </span>
                  </div>
                </div>

                <div
                  className="border-t"
                  style={{ borderColor: neutralColors.neutral4.hex }}
                >
                  {/* Nested Child Item 1 */}
                  <MockHighlightWrapper
                    isHighlighted={highlightedId === "row-nested-child-1"}
                    ringColor={searchHighlightColor.ring}
                    isInset={true}
                  >
                    <div
                      className="flex items-stretch py-2"
                      style={{ paddingLeft: getIndentation(2) }}
                    >
                      <div className="w-8 shrink-0" />
                      <div className="flex-1 flex items-center justify-between pr-4">
                        <span className={cn("text-sm", basicTextColor.textSecondary)}>
                          ネストされた子要素 1
                        </span>
                      </div>
                    </div>
                  </MockHighlightWrapper>
                </div>
              </div>
            </div>
          </MockHighlightWrapper>
        </div>
      </section>
    </div>
  );
}
