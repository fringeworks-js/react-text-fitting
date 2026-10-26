import type { Meta, StoryObj } from '@storybook/react-vite';
import { useChooseText, type UseChooseTextOptions } from '../src';

type DemoProps = UseChooseTextOptions & {
  candidates: string[];
  width?: number;
};

/**
 * 右下をドラッグして大きさを変えられる枠に、収まる候補を表示する
 */
function Demo({ candidates, width = 240, ...options }: DemoProps) {
  const { ref, displayText, style, index, isOverflowing } = useChooseText(
    candidates,
    options,
  );
  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: 16 }}>
      <div
        ref={ref}
        style={{
          width,
          padding: 8,
          border: '1px solid #888',
          resize: 'horizontal',
          overflow: 'hidden',
          ...style,
        }}
      >
        {displayText}
      </div>
      <p style={{ color: '#666', fontSize: 12 }}>
        index: {index} / isOverflowing: {String(isOverflowing)}
        （右下をドラッグして幅を変える）
      </p>
    </div>
  );
}

const meta = {
  title: 'useChooseText',
  component: Demo,
  args: {
    candidates: ['2026年10月26日（月）', '2026/10/26', '10/26'],
  },
  argTypes: {
    width: { control: 'number' },
    wrap: { control: 'inline-radio', options: ['none', 'normal', 'anywhere'] },
    maxLines: { control: 'number' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 幅に収まる日付の書式を選ぶ
 */
export const DateFormats: Story = {};

/**
 * 幅が狭いときは、短い書式を選ぶ
 */
export const Narrow: Story = {
  args: { width: 100 },
};

/**
 * どの候補も収まらない場合（isOverflowing が true になる）
 */
export const Overflowing: Story = {
  args: { width: 30 },
};
