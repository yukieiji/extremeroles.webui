import { useState } from "react";
import { AccordionContentContainer } from "@/components/parts/AccordionContentContainer";
import { AccordionSvg } from "@/components/parts/AccordionSvg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptionSliderControl } from "@/components/parts/OptionSliderControl";
import { OptionToggleControl } from "@/components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";
import { getLinearGradient } from "@/logics/colorUtils";
import { Dot } from "lucide-react";
import { BASIC_TEXT_COLOR } from "../../designConstants";

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
      className="border rounded-lg overflow-hidden transition-all duration-300 w-full shadow-sm"
      style={{ borderColor: color }}
    >
      <div
        className="flex items-center hover:bg-accent/5 transition-colors min-h-[64px]"
        style={{
          background: `linear-gradient(to right, transparent 60%, ${color}38 100%)`
        }}
      >
        <button
          type="button"
          onClick={onClick}
          className={`flex-1 flex items-center gap-3 p-4 text-left ${BASIC_TEXT_COLOR.textPrimary}`}
          aria-expanded={isOpen}
        >
          <AccordionSvg isOpen={isOpen} className="w-5 h-5 opacity-70" />
          <span className="font-bold text-base tracking-tight">{name}</span>
        </button>
        <div className="flex items-center px-6 gap-8">
          {spawnControl}
        </div>
      </div>
      <AccordionContentContainer isOpen={isOpen}>
        <div className="min-h-0">
          <div className="border-t border-border">
            {children}
          </div>
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

  const updateSelection = (id: string, key: keyof RoleVariant, val: number) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [key]: val } : v));
  };

  return (
    <div className="p-12 flex flex-col gap-16 max-w-4xl mx-auto min-h-screen items-center">
      {/* Header Section */}
      <section className="w-full text-center space-y-6">
        <h2 className={`text-4xl font-black tracking-tighter ${BASIC_TEXT_COLOR.textPrimary}`}>役職カラーパレット</h2>
        <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${BASIC_TEXT_COLOR.textSecondary}`}>
          DesignLanguageCheckList.md に基づく色彩設計のプレビューです。
          BASIC_TEXT_COLOR を使用したテキスト階層と、役職ごとの動的なカラー適用を確認できます。
        </p>

        <div className="bg-card p-8 rounded-2xl border border-border text-sm space-y-6 text-left shadow-sm">
          <div className={`flex items-center gap-3 font-bold text-lg ${BASIC_TEXT_COLOR.textPrimary}`}>
            <Dot size={32} strokeWidth={4} className="text-primary -ml-2" />
            <span>デザイン定義要件</span>
          </div>
          <ul className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 list-none pl-2 ${BASIC_TEXT_COLOR.textSecondary}`}>
            <li className="flex gap-3">
              <span className={`${BASIC_TEXT_COLOR.textPrimary} font-black`}>01.</span>
              <span>アコーディオンの<strong>外枠</strong>に役職カラーを適用</span>
            </li>
            <li className="flex gap-3">
              <span className={`${BASIC_TEXT_COLOR.textPrimary} font-black`}>02.</span>
              <span>ヘッダー右側に役職色の<strong>グラデーション</strong>(22%不透明度)</span>
            </li>
            <li className="flex gap-3">
              <span className={`${BASIC_TEXT_COLOR.textPrimary} font-black`}>03.</span>
              <span>タブ選択中の<strong>インジケーター</strong>にタブカラーを適用</span>
            </li>
            <li className="flex gap-3">
              <span className={`${BASIC_TEXT_COLOR.textPrimary} font-black`}>04.</span>
              <span>アクティブなタブの<strong>枠線</strong>にタブカラーを適用</span>
            </li>
            <li className={`col-span-full mt-4 pt-4 border-t border-border italic text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>
              ※ アコーディオン内部の境界線（ヘッダーとコンテンツの間）はデフォルト色を維持してください。
            </li>
          </ul>
        </div>

        {/* Color Tuning Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-8 rounded-3xl border border-border/50 text-left">
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-widest border-b border-border pb-2 ${BASIC_TEXT_COLOR.textSecondary}`}>Role Variants Tuner</h4>
            <div className="grid grid-cols-2 gap-4">
              {variants.map(v => (
                <div key={v.id} className="flex items-center gap-3 bg-background/60 p-2 rounded-xl border border-border/50 shadow-inner">
                  <input
                    type="color"
                    value={v.colors[0]}
                    onChange={(e) => updateVariantColor(v.id, e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                  />
                  <span className={`text-[10px] font-mono font-bold ${BASIC_TEXT_COLOR.textTertiary}`}>{v.colors[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-widest border-b border-border pb-2 ${BASIC_TEXT_COLOR.textSecondary}`}>Global Tab Tuner</h4>
            <div className="flex items-center gap-5 bg-background/60 p-4 rounded-2xl border border-border/50 h-[88px] shadow-inner">
                <input
                  type="color"
                  value={globalTabColor}
                  onChange={(e) => setGlobalTabColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent shadow-sm"
                />
                <div>
                  <span className={`block text-base font-mono font-black ${BASIC_TEXT_COLOR.textPrimary}`}>{globalTabColor}</span>
                  <span className={`text-[10px] font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>Active Tab / Indicator Color</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. アコーディオン・セクション */}
      <section className="space-y-8 w-full">
        <div className="flex items-end justify-between border-b-2 border-primary/20 pb-2">
           <h3 className={`text-2xl font-black ${BASIC_TEXT_COLOR.textPrimary}`}>1. 役職アコーディオン</h3>
           <span className={`text-xs font-bold uppercase tracking-tighter ${BASIC_TEXT_COLOR.textTertiary}`}>Multiple Control Variants</span>
        </div>

        <div className="flex flex-col gap-6">

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
            <div className="p-10 bg-background/40 space-y-6">
               <div className={`flex items-center gap-3 ${BASIC_TEXT_COLOR.textSecondary}`}>
                  <div className="w-1.5 h-6 bg-primary/40 rounded-full" />
                  <span className="text-sm font-bold uppercase tracking-widest">Detail Settings</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pl-4">
                  <OptionSliderControl
                    label="Internal Multiplier"
                    values={percentValues}
                    selection={variants[0].selection1}
                    onChange={(idx) => updateSelection(variants[0].id, 'selection1', idx)}
                  />
                  <div className="h-12 bg-muted/10 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                     <span className={`text-[10px] font-bold uppercase tracking-tighter ${BASIC_TEXT_COLOR.textTertiary}`}>Layout Placeholder</span>
                  </div>
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
                <div className="min-w-[200px]">
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
            <div className="p-10 bg-background/40">
               <div className={`mb-6 p-4 rounded-xl bg-destructive/5 border border-destructive/10 ${BASIC_TEXT_COLOR.textSecondary}`}>
                 <p className="text-xs font-bold uppercase mb-1 text-destructive opacity-70">Warning Zone</p>
                 <p className="text-sm">インポスター専用の特殊設定セクションです。不適切な値はバランスを崩します。</p>
               </div>
               <div className="pl-4 space-y-4">
                  <OptionSliderControl
                    label="Sabotage Cooldown"
                    values={percentValues}
                    selection={variants[1].selection2}
                    onChange={(idx) => updateSelection(variants[1].id, 'selection2', idx)}
                  />
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
                <div className="min-w-[140px]">
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
            <div className="p-10 bg-background/40 flex flex-col items-center gap-8">
               <div className="text-center space-y-2 max-w-sm">
                 <div className={`text-lg font-black tracking-tight ${BASIC_TEXT_COLOR.textPrimary}`}>第三陣営の特殊勝利条件</div>
                 <p className={`text-xs leading-relaxed ${BASIC_TEXT_COLOR.textSecondary}`}>
                   この役職は独自のアルゴリズムによって勝利判定が行われます。
                   カラーシステムが正しく視認性を確保できているか確認してください。
                 </p>
               </div>
               <div className="w-full max-w-md bg-background/60 p-6 rounded-2xl border border-border shadow-inner">
                  <OptionSliderControl
                    label="Victory Threshold"
                    values={percentValues}
                    selection={50}
                    onChange={() => {}}
                  />
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
                <div className="min-w-[140px]">
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
            <div className="p-10 bg-background/40 space-y-8">
               <div className="grid grid-cols-3 gap-6 h-32">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card rounded-2xl border border-border p-4 flex flex-col items-center justify-center gap-3 shadow-sm group hover:border-primary/50 transition-colors">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${BASIC_TEXT_COLOR.textSecondary}`}>Module 0{i}</span>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/40 w-2/3 group-hover:bg-primary transition-all" />
                      </div>
                      <span className={`text-[10px] font-bold ${BASIC_TEXT_COLOR.textTertiary}`}>Status: ACTIVE</span>
                    </div>
                  ))}
               </div>
            </div>
          </LocalRoleAccordion>
        </div>
      </section>

      {/* 2. タブ・セクション */}
      <section className="space-y-8 w-full">
        <div className="flex items-end justify-between border-b-2 border-primary/20 pb-2">
           <h3 className={`text-2xl font-black ${BASIC_TEXT_COLOR.textPrimary}`}>2. タブ・システム</h3>
           <span className={`text-xs font-bold uppercase tracking-tighter ${BASIC_TEXT_COLOR.textTertiary}`}>Dynamic Variable Sync</span>
        </div>

        <div className="bg-card p-12 rounded-[2.5rem] border border-border shadow-lg w-full">
          <Tabs defaultValue="t1">
            <TabsList className="w-full grid grid-cols-4 h-14 bg-muted/40 p-2 rounded-2xl border border-border/50">
              {["t1", "t2", "t3", "t4"].map((t, i) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  style={{ "--tab-color": globalTabColor } as React.CSSProperties}
                  // data-active selector as seen in src/components/ui/tabs.tsx
                  className="data-active:border-[var(--tab-color)] data-active:shadow-none transition-all duration-500 rounded-xl"
                >
                  <span className="font-bold tracking-tight">TAB 0{i + 1}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-12 p-16 border-2 border-dashed border-border/50 rounded-[2rem] text-center bg-muted/5 relative overflow-hidden group">
              <p className={`text-base leading-relaxed ${BASIC_TEXT_COLOR.textSecondary}`}>
                タブを切り替えて、<span className={`font-black text-lg ${BASIC_TEXT_COLOR.textPrimary}`}>インジケーター（下線）</span>と
                <br />
                <span className={`font-black text-lg ${BASIC_TEXT_COLOR.textPrimary}`}>アクティブ枠線</span>の色が連動していることを確認してください。
              </p>
              <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-background border border-border rounded-full shadow-sm">
                 <div className="w-4 h-4 rounded-full shadow-inner animate-pulse" style={{ backgroundColor: globalTabColor }} />
                 <span className={`font-mono text-sm font-black ${BASIC_TEXT_COLOR.textPrimary}`}>{globalTabColor}</span>
              </div>
              {/* Background Decoration */}
              <Dot size={200} className="absolute -bottom-24 -right-24 text-primary opacity-[0.03] group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </Tabs>
        </div>
      </section>

      <footer className={`text-[10px] text-center pt-12 border-t border-border/50 w-full pb-8 ${BASIC_TEXT_COLOR.textTertiary}`}>
        <p className="uppercase tracking-[0.2em] font-bold">Design Language Preview System</p>
        <p className="mt-1 opacity-50">Verified against DesignLanguageCheckList.md</p>
      </footer>
    </div>
  );
}
