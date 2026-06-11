import { useState } from "react";
import { AccordionContentContainer } from "@/components/parts/AccordionContentContainer";
import { AccordionSvg } from "@/components/parts/AccordionSvg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptionSliderControl } from "@/components/parts/OptionSliderControl";
import { OptionToggleControl } from "@/components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";
import { getLinearGradient } from "@/logics/colorUtils";
import { Dot } from "lucide-react";

interface RoleVariant {
  id: string;
  name: string;
  colors: string[];
  isOpen: boolean;
  selection1: number;
  selection2: number;
  selection3?: number;
}

const percentValues = Array.from({ length: 101 }, (_, i) => i);
const countValues = Array.from({ length: 16 }, (_, i) => i);
const toggleValues = ["OFF", "ON"];
const roleTypeValues = ["Standard", "Special", "Unique", "Legacy"];
const abilityValues = ["None", "Invisibility", "Teleport", "Shield"];

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
      className="border rounded-lg overflow-hidden transition-all duration-300"
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
        {/* Controls Container in Header */}
        <div className="flex items-center px-4 gap-6">
          {spawnControl}
        </div>
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
    { id: "crewmate", name: "クルーメイト (Crewmate)", colors: ["#00eeff"], isOpen: true, selection1: 100, selection2: 1 },
    { id: "imposter", name: "インポスター (Imposter)", colors: ["#ff0000"], isOpen: false, selection1: 1, selection2: 50 },
    { id: "neutral", name: "第三陣営 (Neutral)", colors: ["#ff00ff"], isOpen: false, selection1: 2, selection2: 0 },
    { id: "ghost", name: "幽霊 / その他 (Ghost)", colors: ["#aaaaaa"], isOpen: false, selection1: 15, selection2: 3, selection3: 1 },
  ]);

  const [globalTabColors, setGlobalTabColors] = useState<string[]>(["#8cff00"]);

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

  const updateSelection = (id: string, key: keyof RoleVariant, val: number) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [key]: val } : v));
  };

  return (
    <div className="p-8 flex flex-col gap-12 max-w-6xl min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-4 font-heading">役職カラーパレット (Role Colors) テスト調整</h2>

        <div className="bg-card p-6 rounded-lg border border-border mb-8 text-sm space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Dot size={24} strokeWidth={4} />
            <span>デザイン定義要件</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none text-muted-foreground pl-2">
            <li className="flex gap-2">
              <span className="text-foreground font-bold">1.</span>
              <span>アコーディオンの<strong>外枠</strong> ➔ 役職カラーを適用</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-bold">2.</span>
              <span>ヘッダー右側の<strong>グラデーション</strong> ➔ 役職カラー(22%不透明度)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-bold">3.</span>
              <span>タブ選択中の<strong>インジケーター</strong> ➔ タブカラーを適用</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-bold">4.</span>
              <span>アクティブなタブの<strong>枠線</strong> ➔ タブカラーを適用</span>
            </li>
            <li className="flex gap-2 col-span-full mt-2 pt-2 border-t border-border italic text-[11px]">
              ※ 内部の境界線（ヘッダーとコンテンツの間）はデフォルトのボーダー色を使用します。
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/20 p-6 rounded-xl border">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1">Role Variant Colors</h4>
            <div className="grid grid-cols-2 gap-3">
              {variants.map(v => (
                <div key={v.id} className="flex items-center gap-3 bg-background/50 p-2 rounded-md border border-border/50">
                  <input
                    type="color"
                    value={v.colors[0]}
                    onChange={(e) => updateVariantColor(v.id, e.target.value)}
                    className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">{v.colors[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1">Global Tab Color</h4>
            <div className="flex flex-col gap-3 bg-background/50 p-3 rounded-md border border-border/50">
                <div className="flex items-center gap-4">
                  {globalTabColors.map((c, i) => (
                    <input
                      key={i}
                      type="color"
                      value={c}
                      onChange={(e) => {
                        const next = [...globalTabColors];
                        next[i] = e.target.value;
                        setGlobalTabColors(next);
                      }}
                      className="w-10 h-10 rounded cursor-pointer bg-transparent"
                    />
                  ))}
                  <div>
                    <span className="block text-sm font-mono">{globalTabColors.join(', ')}</span>
                    <span className="text-[10px] text-muted-foreground italic">タブサンプルのアクティブ色に使用</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setGlobalTabColors([...globalTabColors, "#ffffff"])} className="text-[10px] bg-muted px-2 py-0.5 rounded border">Add Color for Gradient</button>
                  <button onClick={() => setGlobalTabColors(globalTabColors.slice(0, 1))} className="text-[10px] bg-muted px-2 py-0.5 rounded border">Reset</button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. アコーディオン・セクション */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">1. 役職アコーディオン・多様なコントロール</h3>
        <div className="flex flex-col gap-4">

          {/* Variant 1: Slider (Rate) + Slider (Max) */}
          <LocalRoleAccordion
            color={variants[0].colors[0]}
            name={variants[0].name}
            isOpen={variants[0].isOpen}
            onClick={() => toggleAccordion(variants[0].id)}
            spawnControl={
              <>
                <OptionSliderControl
                  label="Rate"
                  values={percentValues}
                  selection={variants[0].selection1}
                  onChange={(idx) => updateSelection(variants[0].id, 'selection1', idx)}
                />
                <OptionSliderControl
                  label="Max"
                  values={countValues}
                  selection={variants[0].selection2}
                  onChange={(idx) => updateSelection(variants[0].id, 'selection2', idx)}
                />
              </>
            }
          >
            <div className="p-8 bg-background/40">
               <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                  <Dot size={18} className="text-primary" />
                  <span className="text-sm font-medium">基本設定項目（コンテンツ領域）</span>
               </div>
               <div className="grid grid-cols-2 gap-8 pl-8 opacity-40">
                  <div className="h-10 bg-muted/20 rounded border border-dashed border-border" />
                  <div className="h-10 bg-muted/20 rounded border border-dashed border-border" />
               </div>
            </div>
          </LocalRoleAccordion>

          {/* Variant 2: Toggle (Enabled) + Slider (Cooldown) */}
          <LocalRoleAccordion
            color={variants[1].colors[0]}
            name={variants[1].name}
            isOpen={variants[1].isOpen}
            onClick={() => toggleAccordion(variants[1].id)}
            spawnControl={
              <>
                <OptionToggleControl
                  selection={variants[1].selection1}
                  values={toggleValues}
                  onChange={(idx) => updateSelection(variants[1].id, 'selection1', idx)}
                />
                <div className="w-48">
                  <OptionSliderControl
                    label="Cooldown"
                    values={percentValues}
                    selection={variants[1].selection2}
                    onChange={(idx) => updateSelection(variants[1].id, 'selection2', idx)}
                  />
                </div>
              </>
            }
          >
            <div className="p-8 bg-background/40">
               <p className="text-xs text-muted-foreground italic mb-4 pl-4 border-l border-primary/30 font-bold">
                 インポスター専用の特殊設定セクション
               </p>
               <div className="space-y-3 pl-4 opacity-40">
                  <div className="h-8 w-full bg-muted/10 rounded border border-border" />
                  <div className="h-8 w-full bg-muted/10 rounded border border-border" />
               </div>
            </div>
          </LocalRoleAccordion>

          {/* Variant 3: Dropdown (Type) + Toggle (Ability) */}
          <LocalRoleAccordion
            color={variants[2].colors[0]}
            name={variants[2].name}
            isOpen={variants[2].isOpen}
            onClick={() => toggleAccordion(variants[2].id)}
            spawnControl={
              <>
                <div className="w-32">
                  <OptionDropdownControl
                    values={roleTypeValues}
                    selection={variants[2].selection1}
                    onChange={(idx) => updateSelection(variants[2].id, 'selection1', idx)}
                  />
                </div>
                <OptionToggleControl
                  selection={variants[2].selection2}
                  values={["VULNERABLE", "IMMUNE"]}
                  onChange={(idx) => updateSelection(variants[2].id, 'selection2', idx)}
                />
              </>
            }
          >
            <div className="p-8 bg-background/40 flex items-center justify-center">
               <div className="text-center space-y-2 opacity-60">
                 <div className="text-sm font-bold text-foreground">第三陣営の特殊勝利条件</div>
                 <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Custom Logic Pipeline Active</div>
               </div>
            </div>
          </LocalRoleAccordion>

          {/* Variant 4: Slider (Alpha) + Dropdown (Power) + Toggle (Visibility) */}
          <LocalRoleAccordion
            color={variants[3].colors[0]}
            name={variants[3].name}
            isOpen={variants[3].isOpen}
            onClick={() => toggleAccordion(variants[3].id)}
            spawnControl={
              <>
                <OptionSliderControl
                  label="Alpha"
                  values={percentValues}
                  selection={variants[3].selection1}
                  onChange={(idx) => updateSelection(variants[3].id, 'selection1', idx)}
                />
                <div className="w-32">
                  <OptionDropdownControl
                    values={abilityValues}
                    selection={variants[3].selection2}
                    onChange={(idx) => updateSelection(variants[3].id, 'selection2', idx)}
                  />
                </div>
                <OptionToggleControl
                  selection={variants[3].selection3 ?? 0}
                  values={["HIDDEN", "VISIBLE"]}
                  onChange={(idx) => updateSelection(variants[3].id, 'selection3', idx)}
                />
              </>
            }
          >
            <div className="p-8 bg-background/40 opacity-50">
               <div className="grid grid-cols-3 gap-4 h-24">
                  <div className="bg-primary/5 rounded-lg border border-border p-2 flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] font-bold">POWER A</span>
                    <div className="h-1 w-full bg-primary/20 rounded" />
                  </div>
                  <div className="bg-primary/5 rounded-lg border border-border p-2 flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] font-bold">POWER B</span>
                    <div className="h-1 w-full bg-primary/20 rounded" />
                  </div>
                  <div className="bg-primary/5 rounded-lg border border-border p-2 flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] font-bold">POWER C</span>
                    <div className="h-1 w-full bg-primary/20 rounded" />
                  </div>
               </div>
            </div>
          </LocalRoleAccordion>
        </div>
      </section>

      {/* 2. タブ・セクション */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">2. タブ・システム・サンプル</h3>
        <div className="bg-card p-10 rounded-2xl border border-border shadow-sm">
          <Tabs defaultValue="t1">
            <TabsList className="w-full grid grid-cols-4 h-12 bg-muted/50 p-1.5 rounded-xl">
              {["t1", "t2", "t3", "t4"].map((t, i) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  style={{ "--tab-color": getLinearGradient(globalTabColors) } as React.CSSProperties}
                  // data-active matches the convention in src/components/ui/tabs.tsx
                  className="data-active:border-[var(--tab-color)] data-active:shadow-none transition-all duration-300"
                >
                  Tab {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-8 p-12 border border-dashed border-border rounded-2xl text-center bg-muted/5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                タブを切り替えて、<span className="font-bold text-foreground">インジケーター（下線）</span>と
                <span className="font-bold text-foreground">枠線</span>の色が連動していることを確認してください。
                <br />
                現在の設定色: <span className="font-mono text-primary px-1.5 py-0.5 bg-primary/10 rounded ml-1">{globalTabColors.join(' → ')}</span>
              </p>
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
