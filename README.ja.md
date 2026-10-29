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

### コンポーネント

いちばん簡単な使い方です。`value` に値を渡し、機能のオプションをプロパティで指定します。

```tsx
import {
  TruncateText,
  withTruncateText,
} from '@fringeworks/react-text-fitting';

// できあいのコンポーネント（div を描く）
<TruncateText value={description} wrap="normal" maxLines={2} />;

// ほかの要素や、自作・外部の UI ライブラリのコンポーネントで描く
const Title = withTruncateText('h2');
<Title value={title} className="title" />;
```

- `TruncateText`・`ResizeText`・`ChooseText`・`FitText` は、それぞれ `withTruncateText('div')` などで作ったものです
- 機能のオプション（`wrap`・`maxLines` など、hook と同じもの）以外のプロパティは、要素にそのまま渡します。`ref` も受け取れます
- `style` は、ライブラリのスタイルの上に重ねます。同じプロパティは、指定したスタイルが優先されます（計測に使うスタイルを上書きすると、正しく動きません。下記）
- 幅がレイアウトで決まるブロック要素で描いてください（インライン要素では働きません）
- 省略したかどうか（`isTruncated`）などの結果は、コンポーネントからは受け取れません。「続きを読む」のボタンを出すときなどは、hook を使ってください

### hook

要素を自分で組みたいときや、結果を使いたいときは hook を使います。

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

戻り値の `ref`・`displayText`・`style` を、同じ要素に渡してください。`style` を渡さないと、計測した書式と表示の書式がずれて、結果が正しくなりません。

ほかのスタイルとどう重ねるかは、利用者が決められます。ただし、次のプロパティは計測に使うので、自分のスタイルで上書きすると正しく動きません（上書きした場合の動作は保証しません。コンポーネントでも同じです）。

| 機能                                                                                       | 計測に使うスタイル                       |
| ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| 省略する・候補から選ぶ（`useTruncateText`・`useChooseText`・`TruncateText`・`ChooseText`） | `whiteSpace`・`overflowWrap`             |
| 文字の大きさ・組み合わせ（`useResizeText`・`useFitText`・`ResizeText`・`FitText`）         | `whiteSpace`・`overflowWrap`・`fontSize` |

```tsx
// 自分のスタイルと合わせる例（計測に使うプロパティは、自分のスタイルに含めない）
<h2 ref={ref} style={{ color: 'gray', ...style }}>
  {displayText}
</h2>
```

### 書式を変えたときに測り直す

要素の大きさの変化とフォントの読み込みでは、自動で測り直します。要素の大きさが変わらずに、文字の書式（`font-size`・`letter-spacing`・`font-weight` など）だけが変わった場合は、自動では測り直しません。

コンポーネントでは、書式を決めている値を `refreshOn` に渡します。1段目のプロパティを `Object.is` で比べ、どれかが変わったら、画面に表示する前に測り直します。その場でオブジェクトを書いてかまいません。

```tsx
<TruncateText
  value={title}
  className={className}
  refreshOn={{ className, theme }}
/>
```

- 比べるのは1段目だけです。その場で作ったオブジェクト（`{ style }` など）を入れると、描画のたびに測り直します。`style` で書式を変える場合は、書式の値（`{ fontSize }` など）を入れてください
- 好きなタイミングで測り直したい場合は、react-utils の `useExecutionMark` の値を入れます（`const [refreshAt, refresh] = useExecutionMark();` と `refreshOn={{ refreshAt }}`。`refresh()` を呼ぶたびに測り直します）

hook では、戻り値の `refresh` を、書式を変えた後、画面に表示する前に呼びます。react-utils の `useChangeLayoutEffect` を使うと、コンポーネントの `refreshOn` と同じ動きになります（初回は呼ばないので、余分に測りません）。

```tsx
const { ref, displayText, style, refresh } = useTruncateText(text);
// react-utils の useChangeLayoutEffect は、値が変わったときだけ（初回を除く）表示の前に呼ぶ
useChangeLayoutEffect({ className }, refresh);
```

### 大きさを変えている間は隠す

ウィンドウの幅をドラッグで変えている間などは、既定では毎フレーム計測し、表示する文字列も毎フレーム変わります。`detectionDelay`（ミリ秒）を指定すると、大きさの変化が落ち着いてから計測します。`hideWhilePending` も指定すると、待っている間は文字列を隠します（`visibility: hidden`。要素の大きさは変わりません）。

```tsx
<TruncateText value={title} detectionDelay={150} hideWhilePending />
```

- hook では、戻り値の `isPending` で待っているかが分かります。隠す代わりに、自分で別の表示（スケルトンなど）にすることもできます
- 文字列や機能のオプションを変えたときと、`refresh`・`refreshOn` による計測は待ちません
- 詳しい動きは text-fitting の README の「変化が続くときの計測」を見てください

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

| 関数                                                  | 説明                                                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `useTruncateText(text, options?)`                     | 要素の大きさ（幅・高さ）と行数に収まるように、文字列を省略する hook                       |
| `useResizeText(text, options?)`                       | 要素の大きさ（幅・高さ）と行数に収まるように、文字の大きさを変える hook                   |
| `useChooseText(candidates, options?)`                 | 要素の大きさ（幅・高さ）と行数に収まる表現を、候補から選ぶ hook                           |
| `useFitText(text, options?)`                          | 候補を選ぶ・文字の大きさを変える・省略するを組み合わせて、要素の大きさと行数に収める hook |
| `withTruncateText(Component, options?)`               | `useTruncateText` の機能を持つコンポーネントを作る HOC                                    |
| `withResizeText(Component, options?)`                 | `useResizeText` の機能を持つコンポーネントを作る HOC                                      |
| `withChooseText(Component, options?)`                 | `useChooseText` の機能を持つコンポーネントを作る HOC                                      |
| `withFitText(Component, options?)`                    | `useFitText` の機能を持つコンポーネントを作る HOC                                         |
| `TruncateText`・`ResizeText`・`ChooseText`・`FitText` | 上の HOC で `div` を包んだ、できあいのコンポーネント                                      |

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
- 戻り値の `style` に、選んだ `fontSize` が入ります。元にする font-size（調整が要らなかったときの大きさ）は、クラスや親の要素からの継承など、CSS で指定してください。自分のインラインのスタイルで `fontSize` を指定すると、計測が正しく働きません
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

### `withTruncateText`・`withResizeText`・`withChooseText`・`withFitText`

```ts
withTruncateText<C extends ElementType, K extends string = 'children'>(Component: C, options?: WithTextFittingOptions<K>): TruncateTextComponent<C, K>
withResizeText<C extends ElementType, K extends string = 'children'>(Component: C, options?: WithTextFittingOptions<K>): ResizeTextComponent<C, K>
withChooseText<C extends ElementType, K extends string = 'children'>(Component: C, options?: WithTextFittingOptions<K>): ChooseTextComponent<C, K>
withFitText<C extends ElementType, K extends string = 'children'>(Component: C, options?: WithTextFittingOptions<K>): FitTextComponent<C, K>
```

それぞれの hook の機能を持つコンポーネントを作ります。`Component` には要素名（`'h2'` など）か、コンポーネントを渡します。作ったコンポーネントは、次のプロパティを受け取ります。

| プロパティ       | 説明                                                                                                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`          | 表示する値。`withTruncateText`・`withResizeText` は `string`、`withChooseText` は `readonly string[]`（1つの値の表現の候補。望ましい順）、`withFitText` は `string \| readonly string[]`      |
| 機能のオプション | 対応する hook のオプションと同じ（`wrap`・`maxLines`・`disabled` など）                                                                                                                       |
| `style`          | ライブラリのスタイルの上に重ねる。同じプロパティは、指定したスタイルを優先する                                                                                                                |
| `refreshOn?`     | 測り直すきっかけにする値（react-utils の `ChangeDependencies`）。1段目のプロパティを `Object.is` で比べ、どれかが変わったら測り直す。要素には渡さない（上記の「書式を変えたときに測り直す」） |
| `ref`            | 描いた要素を受け取る（ライブラリが使う ref と合成する）                                                                                                                                       |
| その他           | `Component` にそのまま渡す                                                                                                                                                                    |

表示する文字列は、`Component` に `children` として渡します。そのため、作ったコンポーネントは `children` を受け取りません。

`displayTextProp` を指定すると、`children` の代わりに指定したプロパティに渡します（`value` や `label` で文字列を受け取るコンポーネントを包む場合など）。この場合、作ったコンポーネントは `children` を受け取り、`Component` にそのまま渡します。

```tsx
const ReadOnlyField = withTruncateText('input', { displayTextProp: 'value' });
<ReadOnlyField value={path} readOnly />;
```

計測するのは、`ref` を付けた要素の大きさと書式です。`Component` が文字列を内側の別の要素（余白の付いた `<span>` など）に描く場合は、計測と表示がずれて、正しく省略されません。`ref` を付けた要素そのものに文字列を描くコンポーネントを包んでください。

| オプション         | 型       | 説明                                                                                   |
| ------------------ | -------- | -------------------------------------------------------------------------------------- |
| `displayName?`     | `string` | コンポーネントに設定する displayName。デフォルトは `withTruncateText(h2)` のような名前 |
| `displayTextProp?` | `string` | 表示する文字列を渡す、`Component` のプロパティの名前。デフォルトは `'children'`        |

### 型

| 型                                                                                                                | 説明                                                                     |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `UseTruncateTextOptions`                                                                                          | `useTruncateText` のオプション（`TruncateTextControllerOptions` と同じ） |
| `UseTruncateTextResult`                                                                                           | `useTruncateText` の戻り値                                               |
| `UseResizeTextOptions`                                                                                            | `useResizeText` のオプション（`ResizeTextControllerOptions` と同じ）     |
| `UseResizeTextResult`                                                                                             | `useResizeText` の戻り値                                                 |
| `UseChooseTextOptions`                                                                                            | `useChooseText` のオプション（`ChooseTextControllerOptions` と同じ）     |
| `UseChooseTextResult`                                                                                             | `useChooseText` の戻り値                                                 |
| `UseFitTextOptions`                                                                                               | `useFitText` のオプション（`FitTextControllerOptions` と同じ）           |
| `UseFitTextResult`                                                                                                | `useFitText` の戻り値                                                    |
| `TruncateTextProps<C, K>`・`ResizeTextProps<C, K>`・`ChooseTextProps<C, K>`・`FitTextProps<C, K>`                 | HOC で作ったコンポーネントのプロパティ                                   |
| `TruncateTextComponent<C, K>`・`ResizeTextComponent<C, K>`・`ChooseTextComponent<C, K>`・`FitTextComponent<C, K>` | HOC で作ったコンポーネント                                               |
| `WithTextFittingOptions<K>`                                                                                       | HOC のオプション                                                         |
| `FittingProps<C, V, O, K>`・`FittingComponent<C, V, O, K>`                                                        | 上の型の元になる型（包むコンポーネント、値の型、オプションの型から作る） |
