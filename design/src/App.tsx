import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
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
import { ThemeProvider, useTheme, useDesignTheme } from "./themeContext";
import {
  TYPOGRAPHY,
  DATA_FONT,
  LINE_HEIGHT,
  GRID_SYSTEM,
} from "./designConstants";

function Home() {
  const {
    basicTextColor,
    primaryActionColor,
    semanticColors,
    neutralColors,
    searchHighlightColor,
  } = useDesignTheme();

  return (
    <div className="p-8 space-y-12">
      {/* Color Matrix */}
      <section>
        <h2 className="text-xl font-bold mb-6 border-b pb-2">Color Matrix</h2>

        <div className="space-y-1 border-2">
          {/* Top Row: Primary + Semantic */}
          <div className="grid grid-cols-4">
            <div className={`${primaryActionColor.primary} row-span-2 p-4 min-h-[160px] flex flex-col items-center justify-center text-white`}>
              <span className="font-bold text-2xl">PRIMARY_ACTION_COLOR</span>
              <span className="text-xl opacity-80 mt-2">{primaryActionColor.primary}</span>
            </div>
            <div
              className=" p-4 flex flex-col items-center justify-center text-white"
              style={{ backgroundColor: semanticColors.error }}
            >
              <span className="text-2xl font-bold">Error</span>
              <span className="text-xl opacity-80">{semanticColors.error}</span>
            </div>
            <div
              className="p-4 flex flex-col items-center justify-center text-white"
              style={{ backgroundColor: semanticColors.warning }}
            >
              <span className="text-2xl font-bold">Warning</span>
              <span className="text-xl opacity-80">{semanticColors.warning}</span>
            </div>
            <div
              className="p-4 flex flex-col items-center justify-center text-white"
              style={{ backgroundColor: semanticColors.success }}
            >
              <span className="text-2xl font-bold">Success</span>
              <span className="text-xl opacity-80">{semanticColors.success}</span>
            </div>
            <div
              className="col-span-3 p-4 flex flex-col items-center justify-center text-white"
              style={{ backgroundColor: semanticColors.info }}
            >
              <span className="text-2xl font-bold">info</span>
              <span className="text-xl opacity-80">{semanticColors.info}</span>
            </div>
          </div>

          {/* Middle Row: Neutral 1 + Text/Highlight */}
          <div
            className="p-6 min-h-[140px] flex flex-col justify-between"
            style={{ backgroundColor: neutralColors.neutral1.hex }}
          >
            <span className="mb-4 text-2xl font-bold text-gray-500">Neutral1</span>
            <span className="mb-4 text-xl font-bold text-gray-500">{neutralColors.neutral1.hex}</span>
          </div>

          {/* Bottom Row: Neutrals 2-7 */}
          <div className="grid grid-cols-4">
            {[
              neutralColors.neutral2,
              neutralColors.neutral3,
              neutralColors.neutral4,
              neutralColors.neutral5,
            ].map((data, i) => {
              const isDark = i >= 4; // Neutral 6 and 7
              return (
                <div
                  key={i}
                  className="p-4 h-20 flex flex-col justify-between"
                  style={{ backgroundColor: data.hex }}
                >
                  <span className={`text-2xl font-semibold ${isDark ? 'text-white opacity-90' : 'text-gray-500'}`}>Neutral {i + 2}</span>
                  <span className={`text-xl font-mono ${isDark ? 'text-white opacity-70' : 'text-gray-400'}`}>{data.hex}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section>
        <div className="flex items-center gap-4">
          <span className="text-xl text-gray-400">Search highlight Color:</span>
          <span className="text-xl text-gray-400">{searchHighlightColor.ring}</span>
          <div className={`px-4 py-1 border rounded ring-2 ${searchHighlightColor.ring} bg-white text-xl dark:bg-neutral-800`}>
            Highlighted Item
          </div>
        </div>
      </section>
      <section>
        <div className="gap-4">
          <span className="text-xl text-gray-400">TextColor:</span>
          <div className="grid gap-4">
            <span className={`${basicTextColor.textPrimary} font-bold text-xl`}>{basicTextColor.textPrimary} Primary  The Boy who Cried Wolf.  ヤオヨロ～♪!</span>
            <span className={`${basicTextColor.textSecondary} text-xl`}>{basicTextColor.textSecondary} Secondary  The Boy who Cried Wolf. ヤオヨロ～♪!</span>
            <span className={`${basicTextColor.textTertiary} text-xl`}>{basicTextColor.textTertiary} Tertiary   The Boy who Cried Wolf. ヤオヨロ～♪!</span>
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
        <div className="space-y-8 flex flex-row">
          {Object.entries(GRID_SYSTEM.spacing).map(([name, grid]) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold uppercase w-8">{name}</span>
                 <span className="px-5 text-[10px] font-mono text-gray-500">{grid.px} ({grid.value})</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-[10px]">Item</div>
                <div
                  className="bg-blue-200 border-x border-blue-400 h-8 flex items-center justify-center text-[10px] text-blue-600 font-bold overflow-hidden"
                  style={{ width: grid.px }}
                >
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-[10px]">Item</div>
              </div>
              <span className="ml-4 text-xs text-gray-500 italic">{grid.description}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-gray-500 italic border-t pt-4">{GRID_SYSTEM.description}</p>
      </section>
    </div>
  );
}

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { isDark, setIsDark } = useTheme();

  return (
    <header>
      {isHomePage && (
        <div className="flex items-center gap-2 pb-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDark}
              onChange={(e) => setIsDark(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-text-primary">ダークテーマ</span>
          </label>
        </div>
      )}
      <h1>
        <Link to="/">Design Language Checklist</Link>
      </h1>
    </header>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? "bg-[#1e293b] text-slate-100 min-h-screen transition-colors duration-200" : "min-h-screen transition-colors duration-200"}>
      <Header />

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
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
