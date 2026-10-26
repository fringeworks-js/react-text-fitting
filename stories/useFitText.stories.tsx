import type { Meta, StoryObj } from '@storybook/react-vite';
import { useFitText, type UseFitTextOptions } from '../src';

type DemoProps = UseFitTextOptions & {
  candidates: string[];
  width?: number;
  height?: number;
};

/**
 * 右下をドラッグして大きさを変えられる枠に、組み合わせて収めた文字列を表示する。
 * CSS の font-size（16px）は親の要素から継承する（要素のインラインの font-size は、hook の style で上書きされるため）
 */
function Demo({ candidates, width = 240, height = 80, ...options }: DemoProps) {
  const { ref, displayText, style, index, fontSize, isTruncated } = useFitText(
    candidates,
    options,
  );
  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: 16 }}>
      <div
        ref={ref}
        style={{
          width,
          height,
          padding: 8,
          border: '1px solid #888',
          resize: 'both',
          overflow: 'hidden',
          lineHeight: 1.2,
          ...style,
        }}
      >
        {displayText}
      </div>
      <p style={{ color: '#666', fontSize: 12 }}>
        index: {index} / fontSize: {String(fontSize)} / isTruncated:{' '}
        {String(isTruncated)}（右下をドラッグして大きさを変える）
      </p>
    </div>
  );
}

const meta = {
  title: 'useFitText',
  component: Demo,
  args: {
    candidates: ['1,234,567', '1.2M'],
    minFontSize: 12,
    maxFontSize: 64,
    truncate: true,
  },
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
    minFontSize: { control: 'number' },
    maxFontSize: { control: 'number' },
    truncate: { control: 'boolean' },
    resizeFirst: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 候補を先に切り替え、文字の大きさを揃える（resizeFirst: false）
 */
export const ChooseFirst: Story = {
  args: { width: 160 },
};

/**
 * 先に縮め、正確な表現を残す（resizeFirst: true）
 */
export const ResizeFirst: Story = {
  args: { width: 160, resizeFirst: true },
};

/**
 * どの候補も下限で収まらなければ、最後の候補を省略する
 */
export const Truncate: Story = {
  args: { width: 24, height: 24 },
};
