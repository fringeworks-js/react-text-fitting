// @vitest-environment node
import { renderToString } from 'react-dom/server';
import useChooseText from './useChooseText';

function Fixture() {
  const { ref, displayText, style, index, isOverflowing } = useChooseText([
    '2026年10月26日（月）',
    '10/26',
  ]);
  return (
    <p
      ref={ref}
      style={style}
      data-index={index}
      data-overflowing={String(isOverflowing)}
    >
      {displayText}
    </p>
  );
}

describe('useChooseText (SSR)', () => {
  it('最初の候補と、未計測（null）を出力する', () => {
    const html = renderToString(<Fixture />);
    expect(html).toContain('2026年10月26日（月）');
    expect(html).toContain('data-index="0"');
    expect(html).toContain('data-overflowing="null"');
  });
});
