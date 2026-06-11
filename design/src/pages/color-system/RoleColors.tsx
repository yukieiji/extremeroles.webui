import { useState } from "react";
import { AccordionContentContainer } from "@/components/parts/AccordionContentContainer";
import { AccordionSvg } from "@/components/parts/AccordionSvg";
import { Dot } from "lucide-react";

export default function RoleColors() {
  const [roleColor, setRoleColor] = useState("#ff4444");
  const [tabColor, setTabColor] = useState("#8cff00");
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="p-4 flex flex-col gap-8 max-w-4xl">
      <section>
        <h2 className="text-xl font-bold mb-4">役職カラーパレット (Role Colors)</h2>
        <div className="bg-card p-4 rounded border mb-4 text-sm">
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>役職カラー:</strong> アコーディオンヘッダー右側のグラデーションと、アコーディオンの外枠に適用。</li>
            <li><strong>タブカラー:</strong> 選択中のタブのインジケーター（下線）と、枠線の色に適用。</li>
          </ul>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">役職カラー</label>
            <input
              type="color"
              value={roleColor}
              onChange={(e) => setRoleColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">タブカラー</label>
            <input
              type="color"
              value={tabColor}
              onChange={(e) => setTabColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent"
            />
          </div>
        </div>
      </section>

      {/* サンプル: アコーディオン */}
      <section>
        <h3 className="text-lg font-semibold mb-2">アコーディオン サンプル</h3>
        <div
          className="rounded overflow-hidden border transition-colors"
          style={{ borderColor: roleColor }}
        >
          <div
            className="flex items-center"
            style={{
              background: `linear-gradient(to right, transparent 60%, ${roleColor}22 100%)`
            }}
          >
            <button
              type="button"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="flex-1 flex items-center gap-3 p-3 text-left"
            >
              <AccordionSvg isOpen={isAccordionOpen} className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">カテゴリ名</span>
            </button>
          </div>
          <AccordionContentContainer isOpen={isAccordionOpen}>
            <div className="p-3 border-t border-border bg-background/50 text-sm">
              <div className="flex items-center gap-2">
                <Dot className="w-4 h-4 text-muted-foreground" />
                <span>コンテンツ領域</span>
              </div>
              <p className="mt-2 text-muted-foreground text-xs pl-6">
                外枠は役職カラーですが、内部の区切り線はデフォルトの色を使用します。
              </p>
            </div>
          </AccordionContentContainer>
        </div>
      </section>

      {/* サンプル: タブ */}
      <section>
        <h3 className="text-lg font-semibold mb-2">タブ サンプル</h3>
        <div className="flex border-b border-border mb-4">
          {["tab1", "tab2", "tab3"].map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="px-4 py-2 text-sm font-medium transition-colors relative border border-transparent -mb-[1px]"
              style={{
                color: activeTab === id ? "inherit" : "var(--muted-foreground)",
                borderColor: activeTab === id ? tabColor : "transparent",
                borderBottomColor: activeTab === id ? "var(--background)" : "transparent",
                backgroundColor: activeTab === id ? "var(--background)" : "transparent",
              }}
            >
              タブ {id.slice(-1)}
              {activeTab === id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: tabColor }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="p-8 border border-border rounded bg-card text-center text-sm text-muted-foreground italic">
          コンテンツ領域
        </div>
      </section>
    </div>
  );
}
