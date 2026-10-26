import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { useTruncateText, type UseTruncateTextOptions } from '../src';

const LONG_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!';

const JAPANESE_TEXT =
  '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。';

type DemoProps = UseTruncateTextOptions & {
  text: string;
  /**
   * 枠の CSS（大きさなど）
   */
  boxStyle?: CSSProperties;
};

/**
 * 右下をドラッグして大きさを変えられる枠に、省略した文字列を表示する
 */
function Demo({ text, boxStyle, ...options }: DemoProps) {
  const { ref, displayText, style, isTruncated } = useTruncateText(
    text,
    options,
  );
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div
        ref={ref}
        style={{
          width: 240,
          padding: 8,
          border: '1px solid #888',
          resize: 'both',
          overflow: 'hidden',
          ...boxStyle,
          ...style,
        }}
      >
        {displayText}
      </div>
      <p style={{ color: '#666', fontSize: 12 }}>
        isTruncated: {String(isTruncated)}（右下をドラッグして大きさを変える）
      </p>
    </div>
  );
}

const meta = {
  title: 'useTruncateText',
  component: Demo,
  args: { text: LONG_TEXT },
  argTypes: {
    wrap: { control: 'inline-radio', options: ['none', 'normal', 'anywhere'] },
    truncatePosition: {
      control: 'inline-radio',
      options: ['end', 'start', 'middle'],
    },
    truncateBoundary: {
      control: 'inline-radio',
      options: ['grapheme', 'word'],
    },
    maxLines: { control: 'number' },
    maxChars: { control: 'number' },
    ellipsis: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1行の末尾を省略する
 */
export const SingleLine: Story = {};

/**
 * 中央を省略する（ファイル名など）
 */
export const Middle: Story = {
  args: {
    text: 'very-long-file-name-of-the-quarterly-report-final.pdf',
    truncatePosition: 'middle',
    ellipsis: '…',
  },
};

/**
 * 先頭を省略する（パスなど）
 */
export const Start: Story = {
  args: {
    text: 'src/components/forms/inputs/NumericInput/NumericInput.tsx',
    truncatePosition: 'start',
    truncateBoundary: 'word',
  },
};

/**
 * 折り返して、行数で止める
 */
export const MaxLines: Story = {
  args: { wrap: 'normal', maxLines: 3 },
};

/**
 * 折り返して、枠の高さに収める（高さは CSS で決める）
 */
export const BoxHeight: Story = {
  args: { wrap: 'normal', boxStyle: { height: 56 } },
};

/**
 * 日本語の文章
 */
export const Japanese: Story = {
  args: { text: JAPANESE_TEXT, wrap: 'normal', maxLines: 2, ellipsis: '…' },
};

/**
 * 「続きを読む」で全文を展開する
 */
export const ReadMore: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);
    const { ref, displayText, style, isTruncated } = useTruncateText(
      LONG_TEXT,
      {
        wrap: 'normal',
        maxLines: 2,
        truncateBoundary: 'word',
        disabled: expanded,
      },
    );
    return (
      <div style={{ width: 240, fontFamily: 'sans-serif' }}>
        <div ref={ref} style={style}>
          {displayText}
        </div>
        {(expanded || isTruncated) && (
          <button type="button" onClick={() => setExpanded(!expanded)}>
            {expanded ? '閉じる' : '続きを読む'}
          </button>
        )}
      </div>
    );
  },
};
