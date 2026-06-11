import { useState } from "react";
import { AccordionContentContainer } from "@/components/parts/AccordionContentContainer";
import { AccordionSvg } from "@/components/parts/AccordionSvg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dot, Minus, Plus } from "lucide-react";

interface RoleVariant {
  id: string;
  name: string;
  color: string;
  isOpen: boolean;
  spawnCount: number;
}

export default function RoleColors() {
  const [variants, setVariants] = useState<RoleVariant[]>([
    { id: "crewmate", name: "クルーメイト (Crewmate)", color: "#00eeff", isOpen: true, spawnCount: 1 },
    { id: "imposter", name: "インポスター (Imposter)", color: "#ff0000", isOpen: false, spawnCount: 2 },
    { id: "neutral", name: "第三陣営 (Neutral)", color: "#ff00ff", isOpen: false, spawnCount: 0 },
    { id: "custom", name: "カスタム (Custom)", color: "#8cff00", isOpen: false, spawnCount: 1 },
  ]);

  const toggleAccordion = (id: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, isOpen: !v.isOpen } : v));
  };

  const updateColor = (id: string, color: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, color } : v));
  };

  const updateSpawnCount = (id: string, delta: number) => {
    setVariants(variants.map(v => v.id === id ? { ...v, spawnCount: Math.max(0, v.spawnCount + delta) } : v));
  };

  return (
    <div className="p-8 flex flex-col gap-10 max-w-4xl min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-4">役職カラーパレット (Role Colors)</h2>
        <div className="bg-card p-4 rounded border border-border mb-6 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">デザイン定義:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>役職カラー:</strong> アコーディオンの外枠、ヘッダー右側のグラデーション(22%不透明度)</li>
            <li><strong>タブカラー:</strong> 選択中インジケーター(下線)、アクティブ時のタブ外枠</li>
            <li>内部の区切り線には役職カラーを使用せず、デフォルトのボーダー色を使用。</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded border">
          {variants.map(v => (
            <div key={v.id} className="flex items-center gap-3">
              <input
                type="color"
                value={v.color}
                onChange={(e) => updateColor(v.id, e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-none p-0"
              />
              <span className="text-[10px] font-mono w-14 text-muted-foreground">{v.color}</span>
              <span className="text-xs font-medium">{v.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Samples */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-l-4 border-primary pl-3">1. アコーディオン・サンプル (4バリアント)</h3>
        <div className="flex flex-col gap-3">
          {variants.map(v => (
            <div
              key={v.id}
              className="rounded-lg overflow-hidden border transition-all"
              style={{ borderColor: v.color }}
            >
              <div
                className="flex items-center"
                style={{
                  background: `linear-gradient(to right, transparent 60%, ${v.color}38 100%)`
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(v.id)}
                  className="flex-1 flex items-center gap-3 p-4 text-left hover:bg-accent/10 transition-colors"
                >
                  <AccordionSvg isOpen={v.isOpen} className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-sm">{v.name}</span>
                </button>

                {/* Mock Spawn Control */}
                <div className="flex items-center gap-2 px-4">
                   <div className="flex items-center border border-border rounded bg-background h-8">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateSpawnCount(v.id, -1); }}
                        className="px-2 h-full hover:bg-muted transition-colors border-r border-border"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-mono min-w-[2rem] text-center">{v.spawnCount}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateSpawnCount(v.id, 1); }}
                        className="px-2 h-full hover:bg-muted transition-colors border-l border-border"
                      >
                        <Plus size={12} />
                      </button>
                   </div>
                   <span className="text-[9px] text-muted-foreground font-bold tracking-tighter uppercase">Spawn</span>
                </div>
              </div>
              <AccordionContentContainer isOpen={v.isOpen}>
                <div className="border-t border-border p-4 bg-background/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Dot size={14} className="text-muted-foreground" />
                    <span>役職設定項目 A</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Dot size={14} className="text-muted-foreground" />
                    <span>役職設定項目 B</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic pl-5 mt-2">
                    ※ ヘッダー直下の境界線(border-t)はデフォルト色を使用
                  </p>
                </div>
              </AccordionContentContainer>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs Sample */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-l-4 border-primary pl-3">2. タブ・サンプル (動的カラー)</h3>
        <div className="bg-card p-6 rounded border border-border">
          <Tabs defaultValue={variants[0].id}>
            <TabsList className="w-full grid grid-cols-4 h-11">
              {variants.map((v) => (
                <TabsTrigger
                  key={v.id}
                  value={v.id}
                  style={{ "--tab-color": v.color } as React.CSSProperties}
                  className="data-[state=active]:border-[var(--tab-color)] data-[state=active]:shadow-none transition-all"
                >
                  <span className="truncate">{v.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-4 p-10 border border-dashed border-border rounded text-center bg-muted/5">
              {variants.map(v => (
                <div key={v.id} className="data-[state=active]:block hidden" data-state={v.id === variants[0].id ? "active" : "inactive"}>
                   <p className="text-sm text-muted-foreground">
                     <span className="font-bold" style={{ color: v.color }}>{v.name}</span> のタブを選択中
                   </p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-1 italic">
                アクティブなタブのインジケーターと外枠に役職色が適用されています。
              </p>
            </div>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
