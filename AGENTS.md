# AGENTS.md

## 🚨 最優先遵守事項 (CRITICAL RULES)
これらのルールを破ることは許されません。作業開始前に必ず再確認してください。

- **必ず日本語で返信すること**
  - 思考プロセスは英語でも良いが、ユーザーへの出力は100%日本語で行うこと。
- **尊敬語や謙譲語言い方を避けること（簡潔かつ直接的に伝える）**
  - です・ます調は使用してよいが、過剰に丁寧な表現、へりくだった言い方、冗長な挨拶、前置き、結びの言葉などは一切不要（例：「ご指示ありがとうございます」「よろしくお願いします」「〜させていただきます」「させていただきたい点があります」「お手数ですが、ご回答よろしくお願いいたします」、「ご確認とご承認をお願いいたします」など）。
  - 挨拶や感謝の言葉で文字数を使わず、要点や質問のみを端的に「〜を確認したいです」「〜を実装します」、「プランを作成しました」のように直接伝えること。
- **npmではなく必ず pnpm を使用すること**
  - `npm install` や `npm run` などのコマンドは厳禁。
- **完了前に必ず以下のコマンドを実行し、パスさせること**
  - `pnpm run check` (Biomeによるチェック・整形)
  - `pnpm run test` (Vitestによるユニットテスト)
  - `pnpm run e2e` (PlaywrightによるE2Eテスト)
    - **注意**: E2Eテストは重いため、完了前には追加・修正した箇所に絞って実行することを推奨する。
- **状態管理は必ず `zustand` を使用すること**
  - `useState` は原則使用禁止。
  - グローバルの `useStore` からデータを取得し、コンポーネントをステートレスに保つこと。
- **テスト用セレクターの優先順位を厳守すること**
  - 要素の特定には以下の順序で検討し、上位のものを使用すること：
    1. `role`
    2. `label`
    3. `placeholder`
    4. `text`
    5. `alt`
    6. `title`
    7. (どうしても不可能な場合のみ) `data-testid`
  - **id, className, xPathによる要素取得は保守性を下げるため、絶対に禁止。**
- **1作業1変更につき、必ずユニットテストとE2Eテストを実装すること。**
- **e2eでreload処理を追加したい場合、conftest.tsのreloadを使うように**

---

## 開発プロセス・ワークフロー

### 最小限の変更
- 既存のコードを最大限再利用し、必要最小限の変更にとどめる。
- 「ルールズオブプログラミング」「ロバストPython」の思想に基づき、シンプルで読みやすいコードを実装する。

### ブランチ・コミット規約
- **ブランチ名**:
  - 機能追加: `feature/{機能名}`
  - 機能以外の追加(役職等): `feat/{機能名}`
  - リファクタリング: `refactor/{リファクタ名}`
  - 修正: `fix/{修正詳細}`
- **コミットメッセージ**:
  - `feat: {詳細}`
  - `refactor: {詳細}`
  - `fix: {詳細}`
  - `change: {詳細}`
- **PR発行**: タイトルと本文は必ず**日本語**で記載すること。

### ナレッジ管理
- 開発で得た知見は `.gemini/knowledge/` 配下にフォルダを作成し、Markdownファイルとして記録する。
- `README.md` も併せて更新すること。
- デバッグ用のファイルや一時ファイルは `temp/` フォルダ配下に作成すること。

---

## コードスタイル (TypeScript / React)

### 基本ルール
- **コメントは必ず日本語で記述する。**
- **ワンライナー if / for 文は使用禁止。** 必ず `{}` を付けて記述すること。
- インデントは最小限にし、アーリーリターンを積極的に使用する。

### TypeScript
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) に準拠すること。
- オブジェクト定義は `interface` を基本とし、ユニオン型などの特殊な型を定義する場合のみ `type` を使用する。

### React / Styling
- `import React from 'react';` は不要。
- **Tailwind CSS** を使用してスタイリングを行う。
- **関数コンポーネント**: `React.FC` は使わず、通常の関数宣言で行う。
  - 引数の型名は `{関数名}Props` とする。
  - `export` は関数宣言時に行う。
- **ファイル構成**: 1ファイル1コンポーネントとし、コンポーネントの粒度に応じてフォルダ分けを行う。
- **パフォーマンス**: `useMemo`, `useCallback` 等は React Compiler が自動最適化するため、原則使用しない。
- **データ取得**: バックエンドからのデータ取得は `Suspense` を使用すること。`useEffect` は原則使用しない。
- **スタイル管理**: `margin` や `padding` は親コンポーネントが管理し、子コンポーネントには含めない。

### 記載例 (Zustandの正しい使用法)
```tsx
interface GreetingProps {
  name: string;
}

export function Greeting({ name }: GreetingProps) {
  // ❌ 悪い例: const state = useStore(); (不要な再レンダリングが発生する)
  // ✅ 良い例: 必要な値だけを個別に取得する
  const a = useStore((state) => state.a);
  const index = useStore((state) => state.indexs[a] ?? 0);

  const handleClick = () => {
    console.log("hello");
  };

  return <h1 onClick={handleClick}>Hello {name} (Index: {index})</h1>;
}
```

### ディレクトリ構造
- `src/`: ソースディレクトリ
    - `components/`: 再利用可能なコンポーネント (基本ステートレス)
        - `parts/`: UIの最小構成
        - `blocks/`: partsを組み合わせたもの
        - `extra/`: 外部モジュール由来
    - `feature/`: アプリケーション固有のコンポーネント (再利用不可)
    - `logics/`: 生のTypeScriptファイル
    - `slices/`: Zustandの状態定義 (直接インポート禁止)
    - `useStore.ts`: Zustandのメインストア
    - `App.tsx`: メインコンポーネント
    - `type.ts`: 共通型定義
- `tests/`: Vitestによるユニットテスト
- `e2e/`: PlaywrightによるE2Eテスト

### エイリアス
- `@/` エイリアスが `src/` に設定されているため、必要に応じて活用すること。
