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

function Home() {
  return (
    <div>
      <h2 className="text-2xl font-bold">デザイン定義チェックリスト</h2>
      <p className="mt-4">左または上のメニューからセクションを選択してください。</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-bold text-gray-800">
            <Link to="/">Design Language Checklist</Link>
          </h1>
        </header>

        <div className="flex flex-1">
          <nav className="w-64 bg-white border-r p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-2">
                カラーシステム
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/color/basic" className="text-blue-600 hover:underline block py-1">
                    基本テキストカラー
                  </Link>
                </li>
                <li>
                  <Link to="/color/role" className="text-blue-600 hover:underline block py-1">
                    役職カラーパレット
                  </Link>
                </li>
                <li>
                  <Link to="/color/primary-action" className="text-blue-600 hover:underline block py-1">
                    プライマリーアクション色
                  </Link>
                </li>
                <li>
                  <Link to="/color/semantic" className="text-blue-600 hover:underline block py-1">
                    セマンティックカラー
                  </Link>
                </li>
                <li>
                  <Link to="/color/neutral" className="text-blue-600 hover:underline block py-1">
                    ニュートラルカラー
                  </Link>
                </li>
                <li>
                  <Link to="/color/search-highlight" className="text-blue-600 hover:underline block py-1">
                    検索ハイライト色
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-2">
                タイポグラフィ
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/typography/font-size-weight" className="text-blue-600 hover:underline block py-1">
                    フォントサイズ・ウェイト階層
                  </Link>
                </li>
                <li>
                  <Link to="/typography/line-height" className="text-blue-600 hover:underline block py-1">
                    行間
                  </Link>
                </li>
                <li>
                  <Link to="/typography/data-font" className="text-blue-600 hover:underline block py-1">
                    データ用フォント
                  </Link>
                </li>
                <li>
                  <Link to="/typography/grid" className="text-blue-600 hover:underline block py-1">
                    グリッドシステム
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className="flex-1 p-8">
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
