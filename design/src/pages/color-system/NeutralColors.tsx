import { NEUTRAL_COLORS, BASIC_TEXT_COLOR, PRIMARY_ACTION_COLOR } from "../../designConstants";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NeutralColors() {
  const colors = [
    { key: "neutral1", label: "Level 1: Main Background", ...NEUTRAL_COLORS.neutral1 },
    { key: "neutral2", label: "Level 2: Surface / Card Background", ...NEUTRAL_COLORS.neutral2 },
    { key: "neutral3", label: "Level 3: Muted / Hover Background", ...NEUTRAL_COLORS.neutral3 },
    { key: "neutral4", label: "Level 4: Separator / Light Border", ...NEUTRAL_COLORS.neutral4 },
    { key: "neutral5", label: "Level 5: Border / Input Border", ...NEUTRAL_COLORS.neutral5 },
    { key: "neutral6", label: "Level 6: Strong Border / Emphasis", ...NEUTRAL_COLORS.neutral6 },
    { key: "neutral7", label: "Level 7: Deep Background / Shadow", ...NEUTRAL_COLORS.neutral7 },
  ];

  return (
    <div className="p-4 space-y-16">
      <div>
        <h2 className={cn("text-2xl font-bold mb-4", BASIC_TEXT_COLOR.textPrimary)}>ニュートラルカラー</h2>
        <p className={cn("mb-6 text-sm", BASIC_TEXT_COLOR.textSecondary)}>
          情報を「階層化」するために定義された7段階のニュートラルカラーです。
          <code
            className="p-1 rounded ml-2 font-mono"
            style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex }}
          >
            design/src/designConstants.ts
          </code> で色味を調整できます。
        </p>
      </div>

      <section className="space-y-4">
        <h3 className={cn("text-lg font-semibold", BASIC_TEXT_COLOR.textPrimary)}>カラー定義一覧</h3>
        <div className="grid grid-cols-1 gap-4">
          {colors.map((color) => (
            <div
              key={color.key}
              className="flex items-start gap-4 p-4 border rounded-lg"
              style={{ borderColor: NEUTRAL_COLORS.neutral4.hex }}
            >
              <div
                className="size-16 rounded shadow-inner border"
                style={{ backgroundColor: color.hex, borderColor: NEUTRAL_COLORS.neutral4.hex }}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn("font-bold", BASIC_TEXT_COLOR.textPrimary)}>{color.label}</span>
                  <span
                    className={cn("text-xs font-mono px-1.5 py-0.5 rounded", BASIC_TEXT_COLOR.textSecondary)}
                    style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex }}
                  >
                    {color.hex}
                  </span>
                </div>
                <p className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>{color.description}</p>
                <div className={cn("text-[10px] font-mono", BASIC_TEXT_COLOR.textTertiary)}>
                  Class: {color.bg} / {color.border}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <h3 className={cn("text-lg font-semibold", BASIC_TEXT_COLOR.textPrimary)}>コンポーネントサンプル</h3>

        <div className="space-y-16">
          {/* Section: Card Layout */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Surface & Card (Levels 1-2, 5)</h4>
            <div
              className="p-8 rounded-xl border"
              style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
            >
              <div className="max-w-md mx-auto">
                <Card
                  className="shadow-md"
                  style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
                >
                  <CardHeader>
                    <CardTitle className={BASIC_TEXT_COLOR.textPrimary}>Card Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>
                      メインのカード背景にLevel 2を使用し、Level 1背景の上に浮かせています。
                    </p>
                    <div
                      className="p-3 rounded border text-xs"
                      style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex, borderColor: NEUTRAL_COLORS.neutral4.hex }}
                    >
                      <p className={BASIC_TEXT_COLOR.textSecondary}>カード内のサブセクション（Level 3背景）</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline" size="sm"
                      className={BASIC_TEXT_COLOR.textPrimary}
                      style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
                    >
                      閉じる
                    </Button>
                    <Button size="sm" className={cn(PRIMARY_ACTION_COLOR.primary)}>保存</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

          {/* Section: Settings List (Mimicking OptionRowContainer / ViewerOptionRow) */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Settings List & Rows (Levels 3-5)</h4>
            <div
              className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
            >
              {/* Row 1: Regular Row */}
              <div className="group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors"
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NEUTRAL_COLORS.neutral3.hex}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span className={cn("text-sm", BASIC_TEXT_COLOR.textPrimary)}>標準の設定項目</span>
                <span className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textTertiary)}>10.0</span>
              </div>

              {/* Divider (BorderLine) */}
              <div className="px-4"><div style={{ height: '1px', backgroundColor: NEUTRAL_COLORS.neutral4.hex }} /></div>

              {/* Row 2: Hover State Sample (Forced) */}
              <div className="group flex items-center justify-between px-4 py-3 transition-colors"
                   style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex }}>
                <div className="flex flex-col">
                   <span className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>ホバー状態の項目 (Level 3)</span>
                   <span className={cn("text-xs", BASIC_TEXT_COLOR.textSecondary)}>背景にLevel 3を使用します</span>
                </div>
                <div className="size-4 rounded-full" style={{ border: `2px solid ${NEUTRAL_COLORS.neutral6.hex}` }} />
              </div>

              {/* Divider */}
              <div className="px-4"><div style={{ height: '1px', backgroundColor: NEUTRAL_COLORS.neutral4.hex }} /></div>

              {/* Row 3: Indented Child Row */}
              <div className="group flex items-center justify-between pr-4 py-2 transition-colors"
                   style={{ paddingLeft: '40px' }}
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NEUTRAL_COLORS.neutral3.hex}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>インデントされた子要素</span>
                <Input
                  className="w-24 h-7 text-xs"
                  style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
                  defaultValue="Value"
                />
              </div>

              {/* Row 4: Deep Indented Row */}
              <div className="group flex items-center justify-between pr-4 py-2 transition-colors"
                   style={{ paddingLeft: '60px' }}
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NEUTRAL_COLORS.neutral3.hex}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>さらに深い階層</span>
                <span className={cn("text-xs font-mono px-2 py-0.5 rounded", BASIC_TEXT_COLOR.textPrimary)}
                      style={{ backgroundColor: NEUTRAL_COLORS.neutral4.hex }}>
                  TAG
                </span>
              </div>
            </div>
            <p className={cn("text-xs", BASIC_TEXT_COLOR.textTertiary)}>
              ※ src/components/parts の OptionRowContainer や ViewerOptionRow のレイアウトを再現しています。
              ホバー背景にLevel 3、区切り線にLevel 4、入力枠線にLevel 5を使用。
            </p>
          </div>

          {/* Section: Emphasis & Forms */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Emphasis & Focus (Levels 5-6)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 p-4 rounded-lg border" style={{ borderColor: NEUTRAL_COLORS.neutral5.hex }}>
                <label className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>標準的な境界 (Level 5)</label>
                <div
                   className="p-4 rounded border flex items-center justify-center h-20"
                   style={{ borderColor: NEUTRAL_COLORS.neutral5.hex, backgroundColor: NEUTRAL_COLORS.neutral2.hex }}
                >
                   <span className={BASIC_TEXT_COLOR.textSecondary}>Level 5 Border</span>
                </div>
              </div>
              <div className="space-y-3 p-4 rounded-lg border" style={{ borderColor: NEUTRAL_COLORS.neutral6.hex }}>
                <label className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>強調された境界 (Level 6)</label>
                <div
                   className="p-4 rounded border-2 flex items-center justify-center h-20"
                   style={{ borderColor: NEUTRAL_COLORS.neutral6.hex, backgroundColor: NEUTRAL_COLORS.neutral2.hex }}
                >
                   <span className={BASIC_TEXT_COLOR.textPrimary}>Level 6 Border (Strong)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Deep Background */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Deep Layering (Level 7)</h4>
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: NEUTRAL_COLORS.neutral7.hex }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={cn("text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded")}
                  style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex, color: NEUTRAL_COLORS.neutral7.hex }}
                >
                   Contrast Check
                </span>
                <Button
                  variant="secondary" size="sm"
                  className={BASIC_TEXT_COLOR.textPrimary}
                  style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex }}
                >
                  Action
                </Button>
              </div>
              <p
                className={cn("text-sm p-4 rounded", BASIC_TEXT_COLOR.textSecondary)}
                style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex }}
              >
                情報の背後で最も深い階層を表現する場合にLevel 7を使用します。
                テキストの可読性を保つために、明るい背景（Level 1-2）のチップを併用するパターンの例です。
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
