import { useState, useEffect, useCallback } from "react";
import {
  BASIC_TEXT_COLOR,
  NEUTRAL_COLORS,
  SEARCH_HIGHLIGHT_COLOR,
} from "../../designConstants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockHighlightWrapperProps {
  isHighlighted: boolean;
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
  children,
  isInset = false,
  className,
  style,
}: MockHighlightWrapperProps) {
  const highlightClass = isHighlighted
    ? `ring-2 ${SEARCH_HIGHLIGHT_COLOR.ring} ${isInset ? "ring-inset" : ""}`
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

  const triggerHighlight = useCallback((id: string) => {
    setHighlightedId(id);
  }, []);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, SEARCH_HIGHLIGHT_COLOR.duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [highlightedId]);

  // Logic from src/logics/optionUtils.ts
  const getIndentation = (depth: number, multiplier = 0.5, base = 0.375) => {
    const total = base + (depth > 0 ? depth * multiplier : 0);
    return `${total}rem`;
  };

  return (
    <div
      className="p-4 space-y-12 min-h-screen"
      style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex }}
    >
      {/* 説明文セクション */}
      <section>
        <h2 className={cn("text-2xl font-bold mb-4", BASIC_TEXT_COLOR.textPrimary)}>
          検索ハイライト色
        </h2>
        <div
          className="p-4 border rounded-lg mb-6"
          style={{
            borderColor: NEUTRAL_COLORS.neutral4.hex,
            backgroundColor: NEUTRAL_COLORS.neutral2.hex,
          }}
        >
          <h3 className={cn("text-lg font-semibold mb-2", BASIC_TEXT_COLOR.textPrimary)}>
            DesignLanguageCheckList.md の定義
          </h3>
          <ul className={cn("list-disc list-inside space-y-1", BASIC_TEXT_COLOR.textSecondary)}>
            <li>
              <strong>検索ハイライト色</strong> : 検索ワードに一致した箇所を目立たせる色。
            </li>
          </ul>
          <p className={cn("mt-4 text-sm", BASIC_TEXT_COLOR.textTertiary)}>
            設定ファイル:{" "}
            <code className="p-1 rounded bg-gray-100 font-mono">
              design/src/designConstants.ts
            </code>
          </p>
        </div>
      </section>

      {/* テスト操作パネル */}
      <section className="space-y-4">
        <h3 className={cn("text-lg font-semibold", BASIC_TEXT_COLOR.textPrimary)}>
          ハイライトテスト
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => {
            triggerHighlight("dropdown");
          }}>
            ドロップダウンをハイライト
          </Button>
          <Button onClick={() => {
            triggerHighlight("accordion-all");
          }}>
            アコーディオン全体をハイライト
          </Button>
          <Button onClick={() => {
            triggerHighlight("row-parent-1");
          }}>
            親要素1をハイライト
          </Button>
          <Button onClick={() => {
            triggerHighlight("row-child-1");
          }}>
            子要素1をハイライト
          </Button>
          <Button onClick={() => {
            triggerHighlight("row-nested-child-1");
          }}>
            ネストされた子要素1をハイライト
          </Button>
        </div>
      </section>

      {/* プレビューエリア */}
      <section className="space-y-8">
        <h3 className={cn("text-lg font-semibold", BASIC_TEXT_COLOR.textPrimary)}>
          プレビュー
        </h3>

        {/* プリセットドロップダウンのモック */}
        <div className="space-y-2">
          <h4 className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textSecondary)}>
            プリセットドロップダウン (Mock)
          </h4>
          <MockHighlightWrapper isHighlighted={highlightedId === "dropdown"} className="w-fit">
            <div
              className="flex items-stretch border rounded-md overflow-hidden w-48 h-9"
              style={{
                backgroundColor: NEUTRAL_COLORS.neutral1.hex,
                borderColor: NEUTRAL_COLORS.neutral5.hex,
              }}
            >
              <div className="flex-1 px-3 flex items-center">
                <span className={cn("text-sm", BASIC_TEXT_COLOR.textPrimary)}>Preset 1</span>
              </div>
              <div
                className="w-9 flex items-center justify-center border-l"
                style={{ borderColor: NEUTRAL_COLORS.neutral5.hex }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </MockHighlightWrapper>
        </div>

        {/* アコーディオンのモック */}
        <div className="space-y-2">
          <h4 className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textSecondary)}>
            アコーディオン構成 (Mock)
          </h4>
          <MockHighlightWrapper
            isHighlighted={highlightedId === "accordion-all"}
            className="border rounded-md overflow-hidden"
            style={{
              backgroundColor: NEUTRAL_COLORS.neutral1.hex,
              borderColor: NEUTRAL_COLORS.neutral5.hex,
            }}
          >
            {/* Parent Accordion Row 1 */}
            <MockHighlightWrapper
              isHighlighted={highlightedId === "row-parent-1"}
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
                  <span className={cn("text-sm font-bold", BASIC_TEXT_COLOR.textPrimary)}>
                    親アコーディオン項目 1
                  </span>
                </div>
              </div>
            </MockHighlightWrapper>

            <div
              className="border-t"
              style={{ borderColor: NEUTRAL_COLORS.neutral4.hex }}
            >
              {/* Child Item 1 */}
              <MockHighlightWrapper
                isHighlighted={highlightedId === "row-child-1"}
                isInset={true}
              >
                <div
                  className="flex items-stretch py-2"
                  style={{ paddingLeft: getIndentation(1) }}
                >
                  <div className="w-8 shrink-0" />
                  <div className="flex-1 flex items-center justify-between pr-4">
                    <span className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>
                      子要素 1
                    </span>
                    <Input
                      className="w-24 h-7 text-xs"
                      defaultValue="Value"
                      style={{
                        backgroundColor: NEUTRAL_COLORS.neutral1.hex,
                        borderColor: NEUTRAL_COLORS.neutral5.hex,
                      }}
                    />
                  </div>
                </div>
              </MockHighlightWrapper>

              <div
                className="mx-4 border-t"
                style={{ borderColor: NEUTRAL_COLORS.neutral4.hex }}
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
                    <span className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textSecondary)}>
                      ネストされたアコーディオン
                    </span>
                  </div>
                </div>

                <div
                  className="border-t"
                  style={{ borderColor: NEUTRAL_COLORS.neutral4.hex }}
                >
                  {/* Nested Child Item 1 */}
                  <MockHighlightWrapper
                    isHighlighted={highlightedId === "row-nested-child-1"}
                    isInset={true}
                  >
                    <div
                      className="flex items-stretch py-2"
                      style={{ paddingLeft: getIndentation(2) }}
                    >
                      <div className="w-8 shrink-0" />
                      <div className="flex-1 flex items-center justify-between pr-4">
                        <span className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>
                          ネストされた子要素 1
                        </span>
                        <div
                          className="px-2 py-0.5 rounded border-2"
                          style={{ borderColor: NEUTRAL_COLORS.neutral6.hex }}
                        >
                          <span className="text-[10px] font-bold">TAG</span>
                        </div>
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
