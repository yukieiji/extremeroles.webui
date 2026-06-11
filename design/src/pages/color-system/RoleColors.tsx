import { useState } from "react";
import { AccordionContentContainer } from "@/components/parts/AccordionContentContainer";
import { AccordionSvg } from "@/components/parts/AccordionSvg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptionSliderControl } from "@/components/parts/OptionSliderControl";
import { getLinearGradient } from "@/logics/colorUtils";
import { Dot } from "lucide-react";

interface RoleVariant {
  id: string;
  name: string;
  colors: string[];
  isOpen: boolean;
  spawnRateIdx: number;
  maxCountIdx: number;
}

const percentValues = Array.from({ length: 101 }, (_, i) => i);
const countValues = Array.from({ length: 16 }, (_, i) => i);

/**
 * Local implementation of RoleCategoryAccordion to allow dynamic color injection
 * while maintaining the exact structure and layout of src/components/blocks/RoleCategoryAccordion.tsx
 */
function LocalRoleAccordion({
  color,
  isOpen,
  onClick,
  name,
  spawnControl,
  children
}: {
  color: string;
  isOpen: boolean;
  onClick: () => void;
  name: string;
  spawnControl: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border rounded-lg overflow-hidden transition-all duration-200"
      style={{ borderColor: color }}
    >
      <div
        className="flex items-center hover:bg-accent/5 transition-colors"
        style={{
          background: `linear-gradient(to right, transparent 60%, ${color}38 100%)`
        }}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex-1 flex items-center gap-3 p-4 text-left"
          aria-expanded={isOpen}
        >
          <AccordionSvg isOpen={isOpen} className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-sm text-foreground">{name}</span>
        </button>
        <div className="flex items-center px-4">{spawnControl}</div>
      </div>
      <AccordionContentContainer isOpen={isOpen}>
        <div className="min-h-0">
          {isOpen && (
            <div className="border-t border-border">
              {children}
            </div>
          )}
        </div>
      </AccordionContentContainer>
    </div>
  );
}

export default function RoleColors() {
  const [variants, setVariants] = useState<RoleVariant[]>([
    { id: "crewmate", name: "クルーメイト (Crewmate)", colors: ["#00eeff"], isOpen: true, spawnRateIdx: 100, maxCountIdx: 1 },
    { id: "imposter", name: "インポスター (Imposter)", colors: ["#ff0000"], isOpen: false, spawnRateIdx: 50, maxCountIdx: 2 },
    { id: "neutral", name: "第三陣営 (Neutral)", colors: ["#ff00ff"], isOpen: false, spawnRateIdx: 20, maxCountIdx: 1 },
    { id: "ghost", name: "幽霊 / その他 (Ghost)", colors: ["#aaaaaa"], isOpen: false, spawnRateIdx: 0, maxCountIdx: 0 },
  ]);

  const [globalTabColor, setGlobalTabColor] = useState("#8cff00");

  const toggleAccordion = (id: string) => {
    setVariants(prev => prev.map(v =>
      v.id === id ? { ...v, isOpen: !v.isOpen } : v
    ));
  };

  const updateVariantColor = (id: string, newColor: string) => {
    setVariants(prev => prev.map(v =>
      v.id === id ? { ...v, colors: [newColor] } : v
    ));
  };

  return (
    <div className="p-8 flex flex-col gap-12 max-w-5xl min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-4 font-heading">役職カラーパレット (Role Colors)</h2>
        <div className="bg-card p-6 rounded-lg border border-border mb-8 text-sm space-y-3">
          <p className="font-semibold text-foreground italic underline decoration-primary/50 underline-offset-4">
            DesignLanguageCheckList.md 定義内容:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
            <li><strong>各役職のカラー:</strong> アコーディオンの外枠と、ヘッダー右側のグラデーション（22%相当の不透明度）に適用。</li>
            <li><strong>タブのカラー:</strong> 選択中のタブのインジケーター（下線）と、アクティブなタブの枠線に適用。</li>
            <li><strong>共通ルール:</strong> アコーディオン内部の区切り線には役職カラーを使用せず、デフォルトの <code>border-border</code> を維持。</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/20 p-6 rounded-xl border">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1">Role Variant Colors</h4>
            <div className="grid grid-cols-1 gap-3">
              {variants.map(v => (
                <div key={v.id} className="flex items-center gap-4 bg-background/50 p-2 rounded-md border border-border/50">
                  <input
                    type="color"
                    value={v.colors[0]}
                    onChange={(e) => updateVariantColor(v.id, e.target.value)}
                    className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                  />
                  <span className="text-[10px] font-mono text-muted-foreground w-16">{v.colors[0]}</span>
                  <span className="text-xs font-medium truncate">{v.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1">Test Tab Color</h4>
            <div className="flex flex-col gap-4 bg-background/50 p-4 rounded-md border border-border/50 h-full justify-center">
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={globalTabColor}
                  onChange={(e) => setGlobalTabColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent"
                />
                <div>
                  <span className="block text-sm font-mono">{globalTabColor}</span>
                  <span className="text-[10px] text-muted-foreground italic">タブサンプルのアクティブ色に使用されます</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. アコーディオン・セクション */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">1. 役職アコーディオン・サンプル (4バリアント)</h3>
        <div className="flex flex-col gap-4">
          {variants.map(v => (
            <LocalRoleAccordion
              key={v.id}
              color={v.colors[0]}
              name={v.name}
              isOpen={v.isOpen}
              onClick={() => toggleAccordion(v.id)}
              spawnControl={
                <div className="flex items-center gap-6">
                  <OptionSliderControl
                    label="Rate"
                    values={percentValues}
                    selection={v.spawnRateIdx}
                    onChange={(idx) => setVariants(prev => prev.map(rv => rv.id === v.id ? { ...rv, spawnRateIdx: idx } : rv))}
                  />
                  <OptionSliderControl
                    label="Max"
                    values={countValues}
                    selection={v.maxCountIdx}
                    onChange={(idx) => setVariants(prev => prev.map(rv => rv.id === v.id ? { ...rv, maxCountIdx: idx } : rv))}
                  />
                </div>
              }
            >
              <div className="p-8 bg-background/40 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground italic">
                  <Dot size={18} className="text-primary animate-pulse" />
                  <span>コンテンツ領域のサンプル。直上のボーダーはデフォルト色（Role Colorではない）であることを確認。</span>
                </div>
                <div className="grid grid-cols-2 gap-8 pl-6">
                  <div className="space-y-2 opacity-50">
                    <div className="h-2 w-24 bg-muted rounded" />
                    <div className="h-10 w-full bg-muted/20 rounded border border-dashed border-border" />
                  </div>
                  <div className="space-y-2 opacity-50">
                    <div className="h-2 w-24 bg-muted rounded" />
                    <div className="h-10 w-full bg-muted/20 rounded border border-dashed border-border" />
                  </div>
                </div>
              </div>
            </LocalRoleAccordion>
          ))}
        </div>
      </section>

      {/* 2. タブ・セクション */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">2. タブ・システム・サンプル (個別カラー)</h3>
        <div className="bg-card p-10 rounded-2xl border border-border shadow-sm">
          <Tabs defaultValue={variants[0].id}>
            <TabsList className="w-full grid grid-cols-4 h-12 bg-muted/50 p-1.5 rounded-xl">
              {variants.map((v) => (
                <TabsTrigger
                  key={v.id}
                  value={v.id}
                  style={{ "--tab-color": getLinearGradient(v.colors) } as React.CSSProperties}
                  // Using data-[state=active] to match standard Radix behaviors
                  className="data-[state=active]:border-[var(--tab-color)] data-[state=active]:shadow-none transition-all duration-300"
                >
                  <span className="truncate">{v.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-8 p-16 border border-dashed border-border rounded-2xl text-center bg-muted/5 relative overflow-hidden">
               {variants.map(v => (
                 <div key={v.id} className="data-[state=active]:block hidden transition-opacity duration-500" data-state={v.id === variants[0].id ? "active" : "inactive"}>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      現在 <span className="font-bold text-foreground underline decoration-2 decoration-primary/30 underline-offset-4" style={{ color: v.colors[0] }}>{v.name}</span> のタブをプレビュー中。
                      <br />
                      アクティブ時の枠線とインジケーターの色が連動しているか確認してください。
                    </p>
                 </div>
               ))}
               {/* Decor background dots */}
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Dot size={120} />
               </div>
            </div>
          </Tabs>
        </div>
      </section>

      <footer className="text-[10px] text-muted-foreground text-center pt-8 border-t border-border/50">
        Design Language Preview System - Based on DesignLanguageCheckList.md
      </footer>
    </div>
  );
}
