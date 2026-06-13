import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BasicTextColor from "./pages/color-system/BasicTextColor";
import RoleColors from "./pages/color-system/RoleColors";
import PrimaryActionColor from "./pages/color-system/PrimaryActionColor";
import SemanticColors from "./pages/color-system/SemanticColors";
import NeutralColors from "./pages/color-system/NeutralColors";
import SearchHighlightColor from "./pages/color-system/SearchHighlightColor";
import FontSizeWeight from "./pages/typography/FontSizeWeight";
import LineHeight from "./pages/typography/LineHeight";
import DataFont from "./pages/typography/DataFont";
import GridSystem from "./pages/typography/GridSystem";
import {
  BASIC_TEXT_COLOR,
  PRIMARY_ACTION_COLOR,
  SEMANTIC_COLORS,
  NEUTRAL_COLORS,
  SEARCH_HIGHLIGHT_COLOR,
  TYPOGRAPHY,
  DATA_FONT,
  LINE_HEIGHT,
  GRID_SYSTEM,
} from "./designConstants";

function Home() {
  return (
    <div className="p-8 space-y-12">
      {/* Color Matrix */}
      <section>
        <h2 className="text-xl font-bold mb-6 border-b pb-2">Color Matrix</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Display: Neutral 1 + Text Colors */}
          <div className="flex-1 space-y-4">
            <div className={`${NEUTRAL_COLORS.neutral1.bg} ${NEUTRAL_COLORS.neutral1.border} border rounded-xl p-8 shadow-sm min-h-[200px] flex flex-col justify-center`}>
              <div className="mb-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Neutral 1 (Main Background)</span>
                <h3 className="text-sm font-bold text-gray-400">BASIC_TEXT_COLOR</h3>
              </div>
              <div className="space-y-3">
                <p className={`${BASIC_TEXT_COLOR.textPrimary} text-2xl font-extrabold`}>
                  Primary Text: The quick brown fox
                </p>
                <p className={`${BASIC_TEXT_COLOR.textSecondary} text-lg font-medium`}>
                  Secondary Text: jumps over the lazy dog.
                </p>
                <p className={`${BASIC_TEXT_COLOR.textTertiary}`}>
                  Tertiary Text: 1234567890 !@#$%^&*()
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Search Highlight</span>
                  <div className={`px-4 py-1.5 border rounded-md ring-2 ${SEARCH_HIGHLIGHT_COLOR.ring} inline-block bg-white text-sm font-medium`}>
                    Highlighted Item
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400 self-end mb-1">Duration: {SEARCH_HIGHLIGHT_COLOR.duration}ms</span>
              </div>
            </div>

            {/* Other Neutrals (2-7) */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                NEUTRAL_COLORS.neutral2,
                NEUTRAL_COLORS.neutral3,
                NEUTRAL_COLORS.neutral4,
                NEUTRAL_COLORS.neutral5,
                NEUTRAL_COLORS.neutral6,
                NEUTRAL_COLORS.neutral7
              ].map((data, i) => (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[80px]">
                  <div
                    className={`w-full h-12 rounded border ${data.bg} ${data.border}`}
                    title={data.description}
                  ></div>
                  <span className="text-[10px] font-mono">Neutral {i + 2}</span>
                  <span className="text-[10px] font-mono text-gray-400">{data.hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action & Semantic Colors (Adjacent) */}
          <div className="w-full lg:w-72 space-y-4">
             <div className="flex flex-col gap-2">
                <div className={`${PRIMARY_ACTION_COLOR.primary} h-24 rounded-lg flex flex-col items-center justify-center text-white p-4 shadow-md`}>
                  <span className="text-xs opacity-80 font-mono">Primary Action</span>
                  <span className="font-bold text-lg">Save Changes</span>
                </div>
                <div className={`${PRIMARY_ACTION_COLOR.hover} h-10 rounded-lg flex items-center justify-center text-white text-sm opacity-90`}>
                  Hover State
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(SEMANTIC_COLORS).map(([name, hex]) => (
                  <div key={name} className="flex flex-col gap-1">
                    <div
                      className="h-16 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                      style={{ backgroundColor: hex }}
                    >
                      {name.toUpperCase()}
                    </div>
                    <span className="text-[10px] font-mono text-center text-gray-500">{hex}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* Text Matrix */}
      <section>
        <h2 className="text-xl font-bold mb-6 border-b pb-2">Text Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {Object.entries(TYPOGRAPHY).map(([name, style]) => (
              <div key={name} className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase">{name}</span>
                <p className={`${style.size} ${style.weight} ${LINE_HEIGHT.standard}`}>
                  The quick brown fox jumps over the lazy dog.
                </p>
                <p className="text-[10px] text-gray-500 italic">{style.description}</p>
              </div>
            ))}
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Data Font</span>
              <p className={`${DATA_FONT.family} text-xl border p-4 bg-gray-50 rounded`}>
                ID: 987,654,321.00
              </p>
              <p className="text-[10px] text-gray-500 italic">{DATA_FONT.description}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Line Height (Standard)</span>
              <div className="border p-4 rounded">
                <p className={`${LINE_HEIGHT.standard} text-sm max-w-sm`}>
                  {LINE_HEIGHT.description} このテキストは行間の確認用です。複数行にわたる文章がどのように表示されるか、読みやすさをチェックしてください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Matrix */}
      <section>
        <h2 className="text-xl font-bold mb-6 border-b pb-2">Spacing Matrix</h2>
        <div className="flex flex-wrap items-end gap-8">
          {Object.entries(GRID_SYSTEM.spacing).map(([name, grid]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className={`bg-blue-200 border border-blue-400 rounded`}
                style={{ width: grid.px, height: grid.px }}
                title={grid.description}
              ></div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold uppercase">{name}</span>
                <span className="text-[10px] font-mono text-gray-500">{grid.px} ({grid.value})</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500 italic">{GRID_SYSTEM.description}</p>
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <h1>
            <Link to="/">Design Language Checklist</Link>
          </h1>
        </header>

        <div className="flex flex-1">
          <nav>
            <div className="border-2 py-2">
              <h3 className="py-0.5">カラーシステム</h3>
              <ul>
                <li>
                  <Link to="/color/basic" className="underline" >基本テキストカラー</Link>
                </li>
                <li>
                  <Link to="/color/role" className="underline">役職カラーパレット</Link>
                </li>
                <li>
                  <Link to="/color/primary-action" className="underline">プライマリーアクション色</Link>
                </li>
                <li>
                  <Link to="/color/semantic" className="underline">セマンティックカラー</Link>
                </li>
                <li>
                  <Link to="/color/neutral" className="underline">ニュートラルカラー</Link>
                </li>
                <li>
                  <Link to="/color/search-highlight" className="underline">検索ハイライト色</Link>
                </li>
              </ul>
            </div>

            <div className="border-2 py-2">
              <h3 className="py-0.5">タイポグラフィ</h3>
              <ul>
                <li>
                  <Link to="/typography/font-size-weight" className="underline">フォントサイズ・ウェイト階層</Link>
                </li>
                <li>
                  <Link to="/typography/line-height" className="underline">行間</Link>
                </li>
                <li>
                  <Link to="/typography/data-font" className="underline">データ用フォント</Link>
                </li>
                <li>
                  <Link to="/typography/grid" className="underline">グリッドシステム</Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/color/basic" element={<BasicTextColor />} />
              <Route path="/color/role" element={<RoleColors />} />
              <Route path="/color/primary-action" element={<PrimaryActionColor />} />
              <Route path="/color/semantic" element={<SemanticColors />} />
              <Route path="/color/neutral" element={<NeutralColors />} />
              <Route path="/color/search-highlight" element={<SearchHighlightColor />} />
              <Route path="/typography/font-size-weight" element={<FontSizeWeight />} />
              <Route path="/typography/line-height" element={<LineHeight />} />
              <Route path="/typography/data-font" element={<DataFont />} />
              <Route path="/typography/grid" element={<GridSystem />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
