# @fringeworks/react-text-fitting

`@fringeworks/react-text-fitting` は、受け取った文字列を要素の大きさに合わせて表示する [`@fringeworks/text-fitting`](https://www.npmjs.com/package/@fringeworks/text-fitting) を React で使うための、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

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

| 関数                                  | 説明                                                                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `useTruncateText(text, options?)`     | 要素の大きさ（幅・高さ）と行数に収まるように、文字列を省略する hook                       |
| `useResizeText(text, options?)`       | 要素の大きさ（幅・高さ）と行数に収まるように、文字の大きさを変える hook                   |
| `useChooseText(candidates, options?)` | 要素の大きさ（幅・高さ）と行数に収まる表現を、候補から選ぶ hook                           |
| `useFitText(text, options?)`          | 候補を選ぶ・文字の大きさを変える・省略するを組み合わせて、要素の大きさと行数に収める hook |

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

### `useResizeText`

```ts
useResizeText(text: string, options?: UseResizeTextOptions): UseResizeTextResult
```

要素の大きさ（幅・高さ）と行数に収まるように、文字の大きさ（font-size）を変えます。`@fringeworks/text-fitting` の `createResizeTextController` を使っています。

- `maxFontSize` を省略した場合は、そのままで収まれば何もせず、はみ出すときだけ縮めます
- `maxFontSize` を指定すると、収まる限りその大きさまで大きくします（ダッシュボードの数値を枠いっぱいに表示する、など）
- 戻り値の `style` に、選んだ `fontSize` が入ります。要素の CSS の font-size は、クラスや親の要素からの継承など、CSS で指定してください（要素のインラインの `font-size` は `style` で上書きされます）
- サーバーでの描画と、ハイドレーションの初回の描画では、font-size を指定しません（`fontSize` は `null`）

```tsx
function Kpi({ value }: { value: string }) {
  const { ref, displayText, style } = useResizeText(value, {
    maxFontSize: 64,
  });
  return (
    <div ref={ref} className="kpi" style={style}>
      {displayText}
    </div>
  );
}
```

オプションは `createResizeTextController` と同じです（`minFontSize`・`maxFontSize`・`wrap`・`maxLines`・`disabled`）。

| プロパティ      | 型                         | 説明                                                                          |
| --------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `ref`           | `RefCallback<HTMLElement>` | 表示する要素に渡す ref                                                        |
| `displayText`   | `string`                   | 表示する文字列（元の文字列のまま）                                            |
| `fontSize`      | `number \| null`           | 選んだ font-size（px）。未計測の間と、止めている間は `null`                   |
| `isOverflowing` | `boolean \| null`          | 下限の大きさでも収まらないか。未計測の間と、止めている間は `null`             |
| `style`         | `ResizeTextStyle`          | 表示する要素に渡すスタイル（`whiteSpace`、`overflowWrap`、選んだ `fontSize`） |
| `refresh`       | `() => void`               | 今の文字列とオプションで、その場で計測し直す                                  |

### `useChooseText`

```ts
useChooseText(candidates: readonly string[], options?: UseChooseTextOptions): UseChooseTextResult
```

要素の大きさ（幅・高さ）と行数に収まる表現を、候補から選びます。`@fringeworks/text-fitting` の `createChooseTextController` を使っています。

- 候補は望ましい順に並べます。描画のたびに新しい配列を渡しても構いません（中身が同じなら測り直しません）
- どの候補も収まらない場合は最後の候補を表示し、`isOverflowing` で知らせます
- サーバーでの描画と、ハイドレーションの初回の描画では、最初の候補を表示します

```tsx
function DateLabel({ date }: { date: Date }) {
  const { ref, displayText, style } = useChooseText([
    formatLong(date), // 2026年10月26日（月）
    formatShort(date), // 2026/10/26
    formatTiny(date), // 10/26
  ]);
  return (
    <span ref={ref} style={{ display: 'block', ...style }}>
      {displayText}
    </span>
  );
}
```

オプションは `createChooseTextController` と同じです（`wrap`・`maxLines`・`disabled`）。戻り値は、`ChooseTextSnapshot`（`displayText`・`index`・`isOverflowing`・`style`）に `ref` と `refresh` を加えたものです。

### `useFitText`

```ts
useFitText(text: string | readonly string[], options?: UseFitTextOptions): UseFitTextResult
```

候補を選ぶ・文字の大きさを変える・省略するを組み合わせて、要素の大きさ（幅・高さ）と行数に文字列を収めます。`@fringeworks/text-fitting` の `createFitTextController` を使っています。各機能は、指定したときだけ有効になります（候補: 第1引数に配列を渡す、文字の大きさ: `minFontSize` か `maxFontSize`、省略: `truncate: true`）。試す順序と、各オプションの意味は、[`@fringeworks/text-fitting` の README](https://www.npmjs.com/package/@fringeworks/text-fitting) を参照してください。

```tsx
function Kpi({ value }: { value: number }) {
  const { ref, displayText, style } = useFitText(
    [formatFull(value), formatCompact(value)], // 1,234,567 / 1.2M
    { minFontSize: 12, maxFontSize: 48, truncate: true },
  );
  return (
    <div ref={ref} className="kpi" style={style}>
      {displayText}
    </div>
  );
}
```

戻り値は、`FitTextSnapshot`（`displayText`・`index`・`fontSize`・`isTruncated`・`isOverflowing`・`style`）に `ref` と `refresh` を加えたものです。文字の大きさを変える場合は、`useResizeText` と同じく、要素の CSS の font-size をクラスや継承で指定してください。

### 型

| 型                       | 説明                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| `UseTruncateTextOptions` | `useTruncateText` のオプション（`TruncateTextControllerOptions` と同じ） |
| `UseTruncateTextResult`  | `useTruncateText` の戻り値                                               |
| `UseResizeTextOptions`   | `useResizeText` のオプション（`ResizeTextControllerOptions` と同じ）     |
| `UseResizeTextResult`    | `useResizeText` の戻り値                                                 |
| `UseChooseTextOptions`   | `useChooseText` のオプション（`ChooseTextControllerOptions` と同じ）     |
| `UseChooseTextResult`    | `useChooseText` の戻り値                                                 |
| `UseFitTextOptions`      | `useFitText` のオプション（`FitTextControllerOptions` と同じ）           |
| `UseFitTextResult`       | `useFitText` の戻り値                                                    |
