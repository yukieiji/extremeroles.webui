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
      <h2>デザイン定義チェックリスト</h2>
      <p>メニューからセクションを選択してください。</p>
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

        <div>
          <nav>
            <div>
              <h3>カラーシステム</h3>
              <ul>
                <li>
                  <Link to="/color/basic">基本テキストカラー</Link>
                </li>
                <li>
                  <Link to="/color/role">役職カラーパレット</Link>
                </li>
                <li>
                  <Link to="/color/primary-action">プライマリーアクション色</Link>
                </li>
                <li>
                  <Link to="/color/semantic">セマンティックカラー</Link>
                </li>
                <li>
                  <Link to="/color/neutral">ニュートラルカラー</Link>
                </li>
                <li>
                  <Link to="/color/search-highlight">検索ハイライト色</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3>タイポグラフィ</h3>
              <ul>
                <li>
                  <Link to="/typography/font-size-weight">フォントサイズ・ウェイト階層</Link>
                </li>
                <li>
                  <Link to="/typography/line-height">行間</Link>
                </li>
                <li>
                  <Link to="/typography/data-font">データ用フォント</Link>
                </li>
                <li>
                  <Link to="/typography/grid">グリッドシステム</Link>
                </li>
              </ul>
            </div>
          </nav>

          <main>
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
