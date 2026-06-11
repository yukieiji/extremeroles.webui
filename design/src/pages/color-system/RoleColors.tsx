import { useState } from "react";
import { AccordionContentContainer } from "@/components/parts/AccordionContentContainer";
import { AccordionSvg } from "@/components/parts/AccordionSvg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dot } from "lucide-react";

export default function RoleColors() {
  const [roleColor, setRoleColor] = useState("#ff4444");
  const [tabColor, setTabColor] = useState("#8cff00");
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  return (
    <div className="p-8 flex flex-col gap-12 max-w-4xl min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-4">役職カラーパレット (Role Colors)</h2>
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h3 className="text-lg font-semibold mb-2">デザイン定義</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>ドメインカラーとしての役割</strong></li>
            <li>
              <strong>各役職のカラー:</strong>
              <p className="ml-6 text-sm">役職のアコーディオンヘッダー(リニアーグラディアントの右)とアコーディオンの境界線(ヘッダーとコンテンツの境界には使用しない)に適用されます。</p>
            </li>
            <li>
              <strong>タブのカラー:</strong>
              <p className="ml-6 text-sm">タブ選択中のインジケーター(下線)とタブ選択中の枠の色に適用されます。</p>
            </li>
          </ul>
        </div>

        <div className="flex gap-8 mb-8 p-4 bg-secondary rounded-lg border border-border">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">役職カラー (Role Color)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={roleColor}
                onChange={(e) => setRoleColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer bg-transparent"
              />
              <code className="bg-background px-2 py-1 rounded border border-border text-xs">{roleColor}</code>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">タブカラー (Tab Color)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={tabColor}
                onChange={(e) => setTabColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer bg-transparent"
              />
              <code className="bg-background px-2 py-1 rounded border border-border text-xs">{tabColor}</code>
            </div>
          </div>
        </div>
      </section>

      {/* サンプル: アコーディオン */}
      <section>
        <h3 className="text-xl font-semibold mb-4">役職アコーディオン サンプル</h3>
        <p className="text-sm text-muted-foreground mb-4">
          境界線に役職カラーが適用され、ヘッダーに右側が役職カラーになるグラデーションが適用されています。
        </p>

        <div
          className="rounded-lg overflow-hidden transition-colors duration-200"
          style={{ border: `1px solid ${roleColor}` }}
        >
          <div
            className="flex items-center hover:bg-accent/50 transition-colors"
            style={{
              background: `linear-gradient(to right, transparent 50%, ${roleColor}33 100%)`
            }}
          >
            <button
              type="button"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="flex-1 flex items-center gap-3 p-4 text-left"
              aria-expanded={isAccordionOpen}
            >
              <AccordionSvg isOpen={isAccordionOpen} className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">サンプル役職カテゴリ</span>
            </button>
            <div className="flex items-center px-4">
              <div className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground border border-border">Control Sample</div>
            </div>
          </div>
          <AccordionContentContainer isOpen={isAccordionOpen}>
            <div className="min-h-0">
              {isAccordionOpen && (
                <div className="border-t border-border p-4 bg-background/50">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Dot className="text-muted-foreground" />
                      <span>アコーディオン内部のコンテンツ</span>
                    </div>
                    <div className="pl-8 text-sm text-muted-foreground">
                      ヘッダーとコンテンツの境界線（上の線）には役職カラーを使用せず、
                      デフォルトの境界線色（border / gray-700相当）を使用しています。
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AccordionContentContainer>
        </div>
      </section>

      {/* サンプル: タブ */}
      <section>
        <h3 className="text-xl font-semibold mb-4">タブ サンプル</h3>
        <p className="text-sm text-muted-foreground mb-4">
          選択中のインジケーター（下線）と、枠線の色にタブカラーが適用されます。
        </p>

        <div className="w-full max-w-2xl">
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger
                value="tab1"
                style={{ "--tab-color": tabColor } as React.CSSProperties}
              >
                タブ 1
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                style={{ "--tab-color": tabColor } as React.CSSProperties}
              >
                タブ 2
              </TabsTrigger>
              <TabsTrigger
                value="tab3"
                style={{ "--tab-color": tabColor } as React.CSSProperties}
              >
                タブ 3
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4 p-8 border border-border rounded-lg bg-card flex items-center justify-center text-muted-foreground italic">
            タブコンテンツ領域
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted border border-border rounded-lg text-sm text-foreground">
          <strong className="text-primary font-bold mr-2">実装メモ:</strong>
          <code>TabsTrigger</code> は <code>--tab-color</code> 変数を使用して
          インジケーターの色を制御します。枠線の色については、今回 <code>tabs.tsx</code> を修正し、
          <code>--tab-color</code> が存在する場合はその色を境界線に使用するようにしました。
        </div>
      </section>
    </div>
  );
}
