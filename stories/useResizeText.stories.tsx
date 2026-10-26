import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { useResizeText, type UseResizeTextOptions } from '../src';

const LONG_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';

type DemoProps = UseResizeTextOptions & {
  text: string;
  /**
   * 枠の CSS（大きさなど）
   */
  boxStyle?: CSSProperties;
};

/**
 * 右下をドラッグして大きさを変えられる枠に、大きさを変えた文字列を表示する。
 * CSS の font-size（16px）は親の要素から継承する（要素のインラインの font-size は、hook の style で上書きされるため）
 */
function Demo({ text, boxStyle, ...options }: DemoProps) {
  const { ref, displayText, style, fontSize, isOverflowing } = useResizeText(
    text,
    options,
  );
  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: 16 }}>
      <div
        ref={ref}
        style={{
          width: 240,
          padding: 8,
          border: '1px solid #888',
          resize: 'both',
          overflow: 'hidden',
          lineHeight: 1.2,
          ...boxStyle,
          ...style,
        }}
      >
        {displayText}
      </div>
      <p style={{ color: '#666', fontSize: 12 }}>
        fontSize: {String(fontSize)} / isOverflowing: {String(isOverflowing)}
        （右下をドラッグして大きさを変える）
      </p>
    </div>
  );
}

const meta = {
  title: 'useResizeText',
  component: Demo,
  args: { text: LONG_TEXT },
  argTypes: {
    wrap: { control: 'inline-radio', options: ['none', 'normal', 'anywhere'] },
    minFontSize: { control: 'number' },
    maxFontSize: { control: 'number' },
    maxLines: { control: 'number' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * はみ出すときだけ縮める（既定）
 */
export const ShrinkToFit: Story = {};

/**
 * ダッシュボードの数値を、枠いっぱいに表示する
 */
export const FillBox: Story = {
  args: {
    text: '1,234,567',
    maxFontSize: 200,
    boxStyle: { width: 240, height: 80 },
  },
};

/**
 * 折り返して、枠の高さに収める
 */
export const WrapInBox: Story = {
  args: { wrap: 'normal', boxStyle: { height: 44 } },
};

/**
 * 下限でも収まらない場合（isOverflowing が true になる）
 */
export const MinFontSize: Story = {
  args: { minFontSize: 12, boxStyle: { width: 160 } },
};
