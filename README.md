# @fringeworks/react-text-fitting

`@fringeworks/react-text-fitting` is a library some will find handy, for using [`@fringeworks/text-fitting`](https://www.npmjs.com/package/@fringeworks/text-fitting), which fits text into an element, in React.

**[日本語のREADMEはこちら](./README.ja.md)**

## Installation

```bash
npm install @fringeworks/react-text-fitting
# or
pnpm add @fringeworks/react-text-fitting
```

`@fringeworks/text-fitting` is installed together as a dependency.

## Usage

### Components

This is the simplest way to use the package. Pass the value to `value` and specify the feature's options as props.

```tsx
import {
  TruncateText,
  withTruncateText,
} from '@fringeworks/react-text-fitting';

// A ready-made component (renders a div)
<TruncateText value={description} wrap="normal" maxLines={2} />;

// Render with another element, or with your own or a UI library's component
const Title = withTruncateText('h2');
<Title value={title} className="title" />;
```

- `TruncateText`, `ResizeText`, `ChooseText`, and `FitText` are made with `withTruncateText('div')` and so on
- Props other than the feature's options (`wrap`, `maxLines`, and so on, the same as the hooks) are passed to the element as is. `ref` is also accepted
- `style` is layered on top of the library's style. For the same property, the style you specify wins (overriding the styles used for measuring breaks the behavior; see below)
- Render with a block element whose width is determined by layout (it does not work on inline elements)
- Results such as whether the text was truncated (`isTruncated`) are not available from the components. Use the hooks when you need them, for example to show a "Read more" button

### Hooks

Use the hooks when you want to build the element yourself or use the results.

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

Pass the returned `ref`, `displayText`, and `style` to the same element. Without the `style`, the measured formatting and the displayed formatting differ, and the result will be wrong.

You decide how to combine it with your other styles. However, the following properties are used for measuring, so overriding them with your own styles breaks the behavior (the behavior is not guaranteed if you override them; the same applies to the components).

| Feature                                                                                    | Styles used for measuring                |
| ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Truncating and choosing (`useTruncateText`, `useChooseText`, `TruncateText`, `ChooseText`) | `whiteSpace`, `overflowWrap`             |
| Resizing and combining (`useResizeText`, `useFitText`, `ResizeText`, `FitText`)            | `whiteSpace`, `overflowWrap`, `fontSize` |

```tsx
// Combining with your own styles (do not include the properties used for measuring)
<h2 ref={ref} style={{ color: 'gray', ...style }}>
  {displayText}
</h2>
```

### Expanding the full text with "Read more"

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
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </>
  );
}
```

---

## API

| Function                                              | Description                                                                                                    |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `useTruncateText(text, options?)`                     | A hook that truncates a string to fit the element's size (width and height) and lines                          |
| `useResizeText(text, options?)`                       | A hook that changes the font size to fit the element's size (width and height) and lines                       |
| `useChooseText(candidates, options?)`                 | A hook that chooses, from candidates, the expression that fits the element's size (width and height) and lines |
| `useFitText(text, options?)`                          | A hook that fits text into the element's size and lines by combining choosing, resizing, and truncating        |
| `withTruncateText(Component, options?)`               | A HOC that creates a component with the features of `useTruncateText`                                          |
| `withResizeText(Component, options?)`                 | A HOC that creates a component with the features of `useResizeText`                                            |
| `withChooseText(Component, options?)`                 | A HOC that creates a component with the features of `useChooseText`                                            |
| `withFitText(Component, options?)`                    | A HOC that creates a component with the features of `useFitText`                                               |
| `TruncateText`, `ResizeText`, `ChooseText`, `FitText` | Ready-made components that wrap a `div` with the HOCs above                                                    |

### `useTruncateText`

```ts
useTruncateText(text: string, options?: UseTruncateTextOptions): UseTruncateTextResult
```

Selects the longest string that fits the element's size (width and height) and number of lines, by actually rendering and measuring candidates. It uses `createTruncateTextController` from `@fringeworks/text-fitting`.

- Measures again when the element's size changes or fonts finish loading
- When the string or options change, measures again after rendering and before the screen is painted
- During server rendering and the first render of hydration, the original string is displayed (`isTruncated` is `null`). It is then measured before the screen is painted

The options are the same as `createTruncateTextController` (`wrap`, `maxLines`, `maxChars`, `disabled`, `ellipsis`, `truncatePosition`, `truncateBoundary`, `locale`). For what each option means and notes about the element's size (the element's width must be determined by layout, determine the height or specify `maxLines` when wrapping, and so on), see the [`@fringeworks/text-fitting` README](https://www.npmjs.com/package/@fringeworks/text-fitting).

| Property      | Type                       | Description                                                                                     |
| ------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| `ref`         | `RefCallback<HTMLElement>` | The ref to pass to the element                                                                  |
| `displayText` | `string`                   | The text to display                                                                             |
| `isTruncated` | `boolean \| null`          | Whether the text was truncated. `null` while not yet measured                                   |
| `style`       | `TextFittingStyle`         | The style to pass to the element (`whiteSpace`, and `overflowWrap` when `wrap` is `'anywhere'`) |
| `refresh`     | `() => void`               | Measures again immediately with the current string and options                                  |

### `useResizeText`

```ts
useResizeText(text: string, options?: UseResizeTextOptions): UseResizeTextResult
```

Changes the font size so that the text fits the element's size (width and height) and number of lines. It uses `createResizeTextController` from `@fringeworks/text-fitting`.

- If `maxFontSize` is omitted, nothing changes when the text already fits; it only shrinks when the text overflows
- If `maxFontSize` is specified, the text is enlarged up to that size as long as it fits (for example, to fill a dashboard tile with a number)
- The returned `style` contains the selected `fontSize`. Specify the base font size (the size used when no adjustment is needed) with CSS, such as a class or inheritance from a parent. Setting `fontSize` in your own inline style breaks the measurement
- During server rendering and the first render of hydration, no font size is set (`fontSize` is `null`)

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

The options are the same as `createResizeTextController` (`minFontSize`, `maxFontSize`, `wrap`, `maxLines`, `disabled`).

| Property        | Type                       | Description                                                                                            |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `ref`           | `RefCallback<HTMLElement>` | The ref to pass to the element                                                                         |
| `displayText`   | `string`                   | The text to display (the original string as is)                                                        |
| `fontSize`      | `number \| null`           | The selected font size (px). `null` while not yet measured and while stopped                           |
| `isOverflowing` | `boolean \| null`          | Whether the text does not fit even at the lower limit. `null` while not yet measured and while stopped |
| `style`         | `ResizeTextStyle`          | The style to pass to the element (`whiteSpace`, `overflowWrap`, and the selected `fontSize`)           |
| `refresh`       | `() => void`               | Measures again immediately with the current string and options                                         |

### `useChooseText`

```ts
useChooseText(candidates: readonly string[], options?: UseChooseTextOptions): UseChooseTextResult
```

Chooses, from candidates, the expression that fits the element's size (width and height) and number of lines. It uses `createChooseTextController` from `@fringeworks/text-fitting`.

- Order the candidates from most to least preferred. You may pass a new array on every render (if the contents are the same, nothing is measured again)
- If no candidate fits, the last one is displayed and `isOverflowing` reports it
- During server rendering and the first render of hydration, the first candidate is displayed

```tsx
function DateLabel({ date }: { date: Date }) {
  const { ref, displayText, style } = useChooseText([
    formatLong(date), // Monday, October 26, 2026
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

The options are the same as `createChooseTextController` (`wrap`, `maxLines`, `disabled`). The return value is `ChooseTextSnapshot` (`displayText`, `index`, `isOverflowing`, `style`) plus `ref` and `refresh`.

### `useFitText`

```ts
useFitText(text: string | readonly string[], options?: UseFitTextOptions): UseFitTextResult
```

Fits a string into the element's size (width and height) and number of lines by combining choosing among candidates, resizing, and truncating. It uses `createFitTextController` from `@fringeworks/text-fitting`. Each feature is enabled only when specified (candidates: pass an array as the first argument; resizing: `minFontSize` or `maxFontSize`; truncating: `truncate: true`). For the order in which they are tried and what each option means, see the [`@fringeworks/text-fitting` README](https://www.npmjs.com/package/@fringeworks/text-fitting).

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

The return value is `FitTextSnapshot` (`displayText`, `index`, `fontSize`, `isTruncated`, `isOverflowing`, `style`) plus `ref` and `refresh`. When resizing, specify the element's CSS font size with a class or inheritance, as with `useResizeText`.

### `withTruncateText`, `withResizeText`, `withChooseText`, `withFitText`

```ts
withTruncateText<C extends ElementType>(Component: C, options?: WithTextFittingOptions): TruncateTextComponent<C>
withResizeText<C extends ElementType>(Component: C, options?: WithTextFittingOptions): ResizeTextComponent<C>
withChooseText<C extends ElementType>(Component: C, options?: WithTextFittingOptions): ChooseTextComponent<C>
withFitText<C extends ElementType>(Component: C, options?: WithTextFittingOptions): FitTextComponent<C>
```

Creates a component with the features of each hook. Pass an element name (such as `'h2'`) or a component as `Component`. The created component accepts the following props.

| Property        | Description                                                                                                                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`         | The value to display. `string` for `withTruncateText` and `withResizeText`, `readonly string[]` for `withChooseText` (representations of one value, from most to least preferred), and `string \| readonly string[]` for `withFitText` |
| Feature options | The same as the options of the corresponding hook (`wrap`, `maxLines`, `disabled`, and so on)                                                                                                                                          |
| `style`         | Layered on top of the library's style. For the same property, the style you specify wins                                                                                                                                               |
| `ref`           | Receives the rendered element (combined with the ref the library uses)                                                                                                                                                                 |
| Others          | Passed to `Component` as is                                                                                                                                                                                                            |

The text to display is passed to `Component` as `children`, so the created component does not accept `children`.

| Option         | Type     | Description                                                                         |
| -------------- | -------- | ----------------------------------------------------------------------------------- |
| `displayName?` | `string` | The displayName of the component. Defaults to a name such as `withTruncateText(h2)` |

### Types

| Type                                                                                                  | Description                                                                                                |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `UseTruncateTextOptions`                                                                              | Options of `useTruncateText` (same as `TruncateTextControllerOptions`)                                     |
| `UseTruncateTextResult`                                                                               | The return value of `useTruncateText`                                                                      |
| `UseResizeTextOptions`                                                                                | Options of `useResizeText` (same as `ResizeTextControllerOptions`)                                         |
| `UseResizeTextResult`                                                                                 | The return value of `useResizeText`                                                                        |
| `UseChooseTextOptions`                                                                                | Options of `useChooseText` (same as `ChooseTextControllerOptions`)                                         |
| `UseChooseTextResult`                                                                                 | The return value of `useChooseText`                                                                        |
| `UseFitTextOptions`                                                                                   | Options of `useFitText` (same as `FitTextControllerOptions`)                                               |
| `UseFitTextResult`                                                                                    | The return value of `useFitText`                                                                           |
| `TruncateTextProps<C>`, `ResizeTextProps<C>`, `ChooseTextProps<C>`, `FitTextProps<C>`                 | Props of the components created by the HOCs                                                                |
| `TruncateTextComponent<C>`, `ResizeTextComponent<C>`, `ChooseTextComponent<C>`, `FitTextComponent<C>` | Components created by the HOCs                                                                             |
| `WithTextFittingOptions`                                                                              | Options of the HOCs                                                                                        |
| `FittingProps<C, V, O>`, `FittingComponent<C, V, O>`                                                  | The base types of the types above (built from the wrapped component, the value type, and the options type) |
