import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChooseText,
  FitText,
  ResizeText,
  TruncateText,
  withTruncateText,
} from '../src';

const LONG_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';

const Title = withTruncateText('h2');

const BOX = {
  width: 240,
  padding: 8,
  border: '1px solid #888',
  resize: 'horizontal',
  overflow: 'hidden',
} as const;

/**
 * できあいのコンポーネントと、HOC で作ったコンポーネントを並べる（右下をドラッグして幅を変える）
 */
function Gallery() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        fontFamily: 'sans-serif',
        fontSize: 16,
      }}
    >
      <TruncateText value={LONG_TEXT} wrap="normal" maxLines={2} style={BOX} />
      <Title value={LONG_TEXT} style={{ ...BOX, margin: 0 }} />
      <ResizeText value={LONG_TEXT} style={BOX} />
      <ChooseText
        value={['2026年10月26日（月）', '2026/10/26', '10/26']}
        style={BOX}
      />
      <FitText
        value={['1,234,567', '1.2M']}
        minFontSize={12}
        maxFontSize={48}
        truncate
        style={{ ...BOX, height: 64, lineHeight: 1.2 }}
      />
    </div>
  );
}

const meta = {
  title: 'Components',
  component: Gallery,
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * TruncateText・withTruncateText('h2')・ResizeText・ChooseText・FitText
 */
export const AllComponents: Story = {};
