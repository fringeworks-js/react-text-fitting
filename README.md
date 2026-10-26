# @fringeworks/react-text-fitting

`@fringeworks/react-text-fitting` is a library some will find handy, for using [`@fringeworks/text-fitting`](https://www.npmjs.com/package/@fringeworks/text-fitting), which fits text into an element, in React.

**[日本語のREADMEはこちら](./README.ja.md)**

The current version provides a hook for truncation (`useTruncateText`) and a hook for resizing (`useResizeText`).

## Installation

```bash
npm install @fringeworks/react-text-fitting
# or
pnpm add @fringeworks/react-text-fitting
```

`@fringeworks/text-fitting` is installed together as a dependency.

## Usage

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

Pass the returned `ref`, `displayText`, and `style` to the same element. Without the `style`, the measured formatting and the displayed formatting differ, and the result will be wrong. To combine it with other styles, spread `style` last (`style={{ ...myStyle, ...style }}`).

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

| Function                          | Description                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `useTruncateText(text, options?)` | A hook that truncates a string to fit the element's size (width and height) and lines    |
| `useResizeText(text, options?)`   | A hook that changes the font size to fit the element's size (width and height) and lines |

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
- The returned `style` contains the selected `fontSize`. Specify the element's CSS font size with CSS, such as a class or inheritance from a parent (the element's inline `font-size` is overridden by `style`)
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

### Types

| Type                     | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `UseTruncateTextOptions` | Options of `useTruncateText` (same as `TruncateTextControllerOptions`) |
| `UseTruncateTextResult`  | The return value of `useTruncateText`                                  |
| `UseResizeTextOptions`   | Options of `useResizeText` (same as `ResizeTextControllerOptions`)     |
| `UseResizeTextResult`    | The return value of `useResizeText`                                    |
