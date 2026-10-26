# @fringeworks/react-text-fitting

`@fringeworks/react-text-fitting` は、受け取った文字列を要素の大きさに合わせて表示する [`@fringeworks/text-fitting`](https://www.npmjs.com/package/@fringeworks/text-fitting) を React で使うための、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

現在のバージョンでは、省略する hook（`useTruncateText`）を提供しています。

## インストール

```bash
npm install @fringeworks/react-text-fitting
# または
pnpm add @fringeworks/react-text-fitting
```

`@fringeworks/text-fitting` は依存として一緒にインストールされます。

## 使い方

```tsx
import { useTruncateText } from '@fringeworks/react-text-fitting';

function Title({ text }: { text: string }) {
  const { ref, displayText, style } = useTruncateText(text, {
    wrap: 'normal',
    maxLines: 2,
  });
  return (
    <h2 ref={ref} style={style}>
      {displayText}
    </h2>
  );
}
```

戻り値の `ref`・`displayText`・`style` を、同じ要素に渡してください。`style` を渡さないと、計測した書式と表示の書式がずれて、結果が正しくなりません。ほかのスタイルと合わせる場合は、`style` を後ろに重ねてください（`style={{ ...myStyle, ...style }}`）。

### 「続きを読む」で全文を展開する

```tsx
function Description({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, displayText, style, isTruncated } = useTruncateText(text, {
    wrap: 'normal',
    maxLines: 3,
    truncateBoundary: 'word',
    disabled: expanded,
  });
  return (
    <>
      <p ref={ref} style={style}>
        {displayText}
      </p>
      {(expanded || isTruncated) && (
        <button type="button" onClick={() => setExpanded(!expanded)}>
          {expanded ? '閉じる' : '続きを読む'}
        </button>
      )}
    </>
  );
}
```

---

## API

| 関数                              | 説明                                                                |
| --------------------------------- | ------------------------------------------------------------------- |
| `useTruncateText(text, options?)` | 要素の大きさ（幅・高さ）と行数に収まるように、文字列を省略する hook |

### `useTruncateText`

```ts
useTruncateText(text: string, options?: UseTruncateTextOptions): UseTruncateTextResult
```

要素の大きさ（幅・高さ）と行数に収まる最も長い文字列を、実際に描画して測って選びます。`@fringeworks/text-fitting` の `createTruncateTextController` を使っています。

- 要素の大きさの変化とフォントの読み込みで測り直します
- 文字列とオプションが変わると、描画の後、画面に表示する前に測り直します
- サーバーでの描画と、ハイドレーションの初回の描画では、元の文字列を表示します（`isTruncated` は `null`）。その後、画面に表示する前に測ります

オプションは `createTruncateTextController` と同じです（`wrap`・`maxLines`・`maxChars`・`disabled`・`ellipsis`・`truncatePosition`・`truncateBoundary`・`locale`）。それぞれの意味と、要素の大きさについての注意（幅がレイアウトで決まる要素が要る、折り返すときは高さを決めるか `maxLines` を指定する、など）は、[`@fringeworks/text-fitting` の README](https://www.npmjs.com/package/@fringeworks/text-fitting) を参照してください。

| プロパティ    | 型                         | 説明                                                                                      |
| ------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| `ref`         | `RefCallback<HTMLElement>` | 表示する要素に渡す ref                                                                    |
| `displayText` | `string`                   | 表示する文字列                                                                            |
| `isTruncated` | `boolean \| null`          | 省略したか。未計測の間は `null`                                                           |
| `style`       | `TextFittingStyle`         | 表示する要素に渡すスタイル（`whiteSpace` と、`wrap: 'anywhere'` のときの `overflowWrap`） |
| `refresh`     | `() => void`               | 今の文字列とオプションで、その場で計測し直す                                              |

### 型

| 型                       | 説明                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| `UseTruncateTextOptions` | `useTruncateText` のオプション（`TruncateTextControllerOptions` と同じ） |
| `UseTruncateTextResult`  | `useTruncateText` の戻り値                                               |
