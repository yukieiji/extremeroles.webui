# showSaveFilePicker の使用とテスト

## 概要
`showSaveFilePicker` API を使用することで、ブラウザから直接ローカルファイルシステムにファイルを保存するダイアログを表示できます。従来の `<a>` タグによる自動ダウンロードと異なり、ユーザーが保存先とファイル名を選択できます。

## 実装のポイント
- `window.showSaveFilePicker` が存在するか確認し、未サポートのブラウザ（Firefoxなど）では従来の `<a>` タグによるダウンロードにフォールバックします。
- ユーザーがキャンセルした場合、`AbortError` がスローされるため、これをキャッチして静かに処理を終了します。
- TypeScript では `window` オブジェクトに型定義が不足している場合があるため、`(window as any)` 等でキャストするか、型定義を拡張する必要があります。

## テスト方法
### ユニットテスト (Vitest + JSDOM)
`vi.stubGlobal` を使用して `showSaveFilePicker` をモック化します。
```ts
const showSaveFilePicker = vi.fn().mockResolvedValue({
    createWritable: () => ({
        write: vi.fn(),
        close: vi.fn(),
    })
});
vi.stubGlobal("showSaveFilePicker", showSaveFilePicker);
```

### E2Eテスト (Playwright)
Playwright の `download` イベントは `showSaveFilePicker` では発生しません。そのため、E2Eテストでダウンロードを検証する場合は、一時的に `showSaveFilePicker` を削除してフォールバック動作を検証するか、API自体をモック化する必要があります。
```ts
await page.addInitScript(() => {
    delete (window as any).showSaveFilePicker;
});
```
