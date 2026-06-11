import { NEUTRAL_COLORS, BASIC_TEXT_COLOR, PRIMARY_ACTION_COLOR } from "../../designConstants";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
          <code className={cn("p-1 rounded ml-2 font-mono", NEUTRAL_COLORS.neutral3.bg)}>design/src/designConstants.ts</code> で色味を調整できます。
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

      <section className="space-y-8">
        <h3 className={cn("text-lg font-semibold", BASIC_TEXT_COLOR.textPrimary)}>コンポーネントサンプル</h3>

        <div className="space-y-12">
          {/* Card & Layering Sample */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Card & Layering (Levels 1-3, 5)</h4>
            <div
              className="p-8 rounded-xl border"
              style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
            >
              <div className={cn("mb-4 text-xs font-mono", BASIC_TEXT_COLOR.textTertiary)}>Level 1 Background + Level 5 Border</div>
              <Card
                className="shadow-none"
                style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
              >
                <CardHeader>
                  <CardTitle className={BASIC_TEXT_COLOR.textPrimary}>Level 2 Background Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={BASIC_TEXT_COLOR.textSecondary}>
                    カードの背景にLevel 2を使用し、枠線にLevel 5を使用しています。
                  </p>
                  <div
                    className="mt-4 p-4 rounded border"
                    style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex, borderColor: NEUTRAL_COLORS.neutral4.hex }}
                  >
                    <p className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>
                      カード内の一部にLevel 3背景とLevel 4枠線を使用。
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className={BASIC_TEXT_COLOR.textPrimary}
                    style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
                  >
                    キャンセル
                  </Button>
                  <Button className={cn(PRIMARY_ACTION_COLOR.primary)}>保存</Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Separator & Table Sample */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Separator & Table (Levels 4-5)</h4>
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <span className={cn("text-sm font-bold", BASIC_TEXT_COLOR.textPrimary)}>セクション見出し</span>
                <Separator style={{ backgroundColor: NEUTRAL_COLORS.neutral4.hex }} />
                <p className={cn("text-sm", BASIC_TEXT_COLOR.textSecondary)}>SeparatorにLevel 4を使用しています。</p>
              </div>

              <div
                className="border rounded-md overflow-hidden"
                style={{ borderColor: NEUTRAL_COLORS.neutral5.hex }}
              >
                <Table>
                  <TableHeader style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex }}>
                    <TableRow
                      className="hover:bg-transparent"
                      style={{ borderBottomColor: NEUTRAL_COLORS.neutral4.hex }}
                    >
                      <TableHead className={BASIC_TEXT_COLOR.textPrimary}>項目</TableHead>
                      <TableHead className={BASIC_TEXT_COLOR.textPrimary}>ステータス</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow style={{ borderBottomColor: NEUTRAL_COLORS.neutral4.hex }}>
                      <TableCell className={BASIC_TEXT_COLOR.textPrimary}>メインタスク</TableCell>
                      <TableCell><span className={BASIC_TEXT_COLOR.textSecondary}>進行中</span></TableCell>
                    </TableRow>
                    <TableRow
                      className="border-b-0"
                      style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex }}
                    >
                      <TableCell className={BASIC_TEXT_COLOR.textPrimary}>サブタスク (Hover/Muted)</TableCell>
                      <TableCell><span className={BASIC_TEXT_COLOR.textSecondary}>待機</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Input & Form Sample */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Input & Focus (Levels 5-6)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>標準の入力フィールド</label>
                <Input
                  className={BASIC_TEXT_COLOR.textPrimary}
                  style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
                  defaultValue="Level 5 Border"
                />
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>強調された入力フィールド</label>
                <Input
                  className={cn("ring-2 ring-offset-0 ring-offset-transparent", BASIC_TEXT_COLOR.textPrimary)}
                  style={{
                    backgroundColor: NEUTRAL_COLORS.neutral1.hex,
                    borderColor: NEUTRAL_COLORS.neutral6.hex,
                    "--tw-ring-color": NEUTRAL_COLORS.neutral6.hex
                  } as React.CSSProperties}
                  defaultValue="Level 6 Border & Ring"
                />
                <p className={cn("text-xs", BASIC_TEXT_COLOR.textTertiary)}>Level 6を枠線やリングに使用した例。</p>
              </div>
            </div>
          </div>

          {/* Deep Content Sample */}
          <div className="space-y-4">
            <h4 className={cn("text-sm font-medium opacity-50 uppercase tracking-wider", BASIC_TEXT_COLOR.textSecondary)}>Deep Layering (Level 7)</h4>
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: NEUTRAL_COLORS.neutral7.hex }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn("font-medium", BASIC_TEXT_COLOR.textPrimary, "px-2 py-0.5 rounded")}
                  style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex }}
                >
                   Level 7 Background
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className={BASIC_TEXT_COLOR.textPrimary}
                  style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex }}
                >
                  詳細
                </Button>
              </div>
              <p
                className={cn("text-sm mt-4 p-2 rounded", BASIC_TEXT_COLOR.textSecondary)}
                style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex }}
              >
                濃い背景色が必要な場合にLevel 7を使用します。
                テキストの視認性を確保するため、この例ではLevel 1背景のチップ内にテキストを配置しています。
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
