import { useDesignTheme } from "../../themeContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NeutralColors() {
  const { neutralColors, basicTextColor, primaryActionColor } = useDesignTheme();

  const colors = [
    { key: "neutral1", label: "Level 1: Main Background", ...neutralColors.neutral1 },
    { key: "neutral2", label: "Level 2: Surface / Card Background", ...neutralColors.neutral2 },
    { key: "neutral3", label: "Level 3: Muted / Hover Background", ...neutralColors.neutral3 },
    { key: "neutral4", label: "Level 4: Separator / Light Border", ...neutralColors.neutral4 },
    { key: "neutral5", label: "Level 5: Border / Input Border", ...neutralColors.neutral5 },
  ];

  // Logic from src/logics/optionUtils.ts
  const getIndentation = (depth: number, multiplier = 1, base = 0.375) => {
    const total = base + (depth > 0 ? depth * multiplier : 0);
    return `${total}rem`;
  };

  return (
    <div className="p-4 space-y-16" style={{ backgroundColor: neutralColors.neutral1.hex }}>
      <div>
        <h2 className={cn("text-2xl font-bold mb-4", basicTextColor.textPrimary)}>ニュートラルカラー</h2>
        <p className={cn("mb-6 text-sm", basicTextColor.textSecondary)}>
          情報を「階層化」するために定義された7段階のニュートラルカラーです。
          <code
            className="p-1 rounded ml-2 font-mono"
            style={{ backgroundColor: neutralColors.neutral3.hex }}
          >
            design/src/designConstants.ts
          </code> で色味を調整できます。
        </p>
      </div>

      <section className="space-y-4">
        <h3 className={cn("text-lg font-semibold", basicTextColor.textPrimary)}>カラー定義一覧</h3>
        <div className="grid grid-cols-1 gap-4">
          {colors.map((color) => (
            <div
              key={color.key}
              className="flex items-start gap-4 p-4 border rounded-lg"
              style={{ borderColor: neutralColors.neutral4.hex, backgroundColor: neutralColors.neutral1.hex }}
            >
              <div
                className="size-16 rounded shadow-inner border"
                style={{ backgroundColor: color.hex, borderColor: neutralColors.neutral4.hex }}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn("font-bold", basicTextColor.textPrimary)}>{color.label}</span>
                  <span
                    className={cn("text-xs font-mono px-1.5 py-0.5 rounded", basicTextColor.textSecondary)}
                    style={{ backgroundColor: neutralColors.neutral3.hex }}
                  >
                    {color.hex}
                  </span>
                </div>
                <p className={cn("text-sm", basicTextColor.textSecondary)}>{color.description}</p>
                <div className={cn("text-[10px] font-mono", basicTextColor.textTertiary)}>
                  Class: {color.bg} / {color.border}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <h3 className={cn("text-lg font-semibold", basicTextColor.textPrimary)}>コンポーネントサンプル</h3>

        <div className="space-y-16">
          {/* Section: Card Layout */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", basicTextColor.textSecondary)}>Surface & Card (Unified Lv1 BG)</h4>
            <div
              className="p-8 rounded-xl border"
              style={{ backgroundColor: neutralColors.neutral1.hex, borderColor: neutralColors.neutral4.hex }}
            >
              <div className="max-w-md mx-auto">
                <Card
                  className="shadow-sm"
                  style={{ backgroundColor: neutralColors.neutral4.hex, borderColor: neutralColors.neutral2.hex }}
                >
                  <CardHeader className="py-4">
                    <CardTitle className={cn("text-lg", basicTextColor.textPrimary)}>Card Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 py-2">
                    <p className={cn("text-sm", basicTextColor.textSecondary)}>
                      背景はすべてLv1で統一し、境界線（Lv5）で階層を表現します。
                    </p>
                    <div
                      className="p-3 rounded border text-xs"
                      style={{ backgroundColor: neutralColors.neutral4.hex, borderColor: neutralColors.neutral2.hex }}
                    >
                      <p className={basicTextColor.textSecondary}>内部セクション (Lv1 BG / Lv4 Border)</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 py-4">
                    <Button
                      variant="outline" size="sm"
                      className={basicTextColor.textPrimary}
                      style={{ backgroundColor: neutralColors.neutral1.hex, borderColor: neutralColors.neutral3.hex }}
                    >
                      閉じる
                    </Button>
                    <Button size="sm" className={cn(primaryActionColor.primary)}>保存</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

          {/* Section: Settings List & Accordion (Accurate Mimic) */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", basicTextColor.textSecondary)}>Settings List & Accordion (Compact Layout)</h4>
            <div
              className="border overflow-hidden rounded-md"
              style={{ backgroundColor: neutralColors.neutral5.hex, borderColor: neutralColors.neutral2.hex }}
            >
              {/* Row: Level 0 Accordion */}
              <div className="py-0.5 transition-colors"
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = neutralColors.neutral3.hex}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="flex items-stretch" style={{ paddingLeft: getIndentation(0) }}>
                  <div className="flex items-center justify-center w-8 shrink-0"> {/* Reduced from w-10 to w-8 for "寄せろ" */}
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center justify-between pr-4 py-2">
                    <span className={cn("text-sm font-bold", basicTextColor.textPrimary)}>アコーディオン項目 (Lv0)</span>
                    <span className={cn("text-xs", basicTextColor.textTertiary)}>w-8 Leading</span>
                  </div>
                </div>
              </div>

              {/* Divider (Lv4) */}
              <div className="px-4"><div style={{ height: '1px', backgroundColor: neutralColors.neutral4.hex }} /></div>

              {/* Row: Level 0 Standard */}
              <div className="py-0.5 transition-colors"
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = neutralColors.neutral3.hex}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="flex items-stretch" style={{ paddingLeft: getIndentation(0) }}>
                  <div className="w-8 shrink-0" />
                  <div className="flex-1 flex items-center justify-between pr-4 py-2">
                    <span className={cn("text-sm", basicTextColor.textPrimary)}>標準の設定項目</span>
                    <span className={cn("text-sm font-medium", basicTextColor.textTertiary)}>10.0</span>
                  </div>
                </div>
              </div>

              {/* Divider (Lv5) */}
              <div className="px-4"><div style={{ height: '1px', backgroundColor: neutralColors.neutral5.hex }} /></div>

              {/* Row: Level 1 Child (Indent Multiplier 0.5 for compactness) */}
              <div className="py-0.5 transition-colors"
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = neutralColors.neutral3.hex}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="flex items-stretch" style={{ paddingLeft: getIndentation(1, 0.5) }}>
                  <div className="flex items-center justify-center w-8 shrink-0">
                    <svg className="w-3 h-3 text-gray-400 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center justify-between pr-4 py-1.5" >
                    <span className={cn("text-sm", basicTextColor.textSecondary)}>インデントされた子要素 (Lv1)</span>
                    <Input
                      className="w-20 h-6 text-xs"
                      style={{ backgroundColor: neutralColors.neutral1.hex, borderColor: neutralColors.neutral5.hex }}
                      defaultValue="Value"
                    />
                  </div>
                </div>
              </div>

              {/* Divider (Lv4) */}
              <div style={{ paddingLeft: '4rem', paddingRight: '1rem' }}><div style={{ height: '1px', backgroundColor: neutralColors.neutral4.hex }} /></div>

              {/* Row: Level 2 Child */}
              <div className="py-0.5 transition-colors"
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = neutralColors.neutral3.hex}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="flex items-stretch" style={{ paddingLeft: getIndentation(2, 0.5) }}>
                  <div className="w-8 shrink-0" />
                  <div className="flex-1 flex items-center justify-between pr-4 py-1.5">
                    <span className={cn("text-sm", basicTextColor.textSecondary)}>さらに深い階層 (Lv2)</span>
                  </div>
                </div>
              </div>
            </div>
            <p className={cn("text-xs mt-2", basicTextColor.textTertiary)}>
              ※ 背景はすべてLv1。アコーディオンのLeading領域をw-10からw-8へ、インデント倍率を0.5remへ調整し「寄せた」レイアウトにしています。
              区切り線はLv4/Lv5、強調境界はLv6を使用。
            </p>
          </div>

          {/* Section: Borders Comparison */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", basicTextColor.textSecondary)}>Border Samples (Lv4-6)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded border" style={{ borderColor: neutralColors.neutral4.hex, backgroundColor: neutralColors.neutral1.hex }}>
                <div className={cn("text-xs mb-2 font-mono", basicTextColor.textSecondary)}>Level 4: Separator</div>
                <div className="h-1 bg-gray-100 w-full" style={{ backgroundColor: neutralColors.neutral4.hex }} />
              </div>
              <div className="p-4 rounded border" style={{ borderColor: neutralColors.neutral5.hex, backgroundColor: neutralColors.neutral1.hex }}>
                <div className={cn("text-xs mb-2 font-mono", basicTextColor.textSecondary)}>Level 5: Border</div>
                <div className="h-4 border rounded" style={{ borderColor: neutralColors.neutral5.hex }} />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
