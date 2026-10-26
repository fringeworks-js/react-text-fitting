// @vitest-environment node
import { renderToString } from 'react-dom/server';
import useTruncateText from './useTruncateText';

const TEXT = 'The quick brown fox jumps over the lazy dog.';

function Fixture({ text }: { text: string }) {
  const { ref, displayText, style, isTruncated } = useTruncateText(text, {
    wrap: 'normal',
    maxLines: 2,
  });
  return (
    <p ref={ref} style={style} data-truncated={String(isTruncated)}>
      {displayText}
    </p>
  );
}

describe('useTruncateText (SSR)', () => {
  it('DOM が無い環境でも renderToString が例外なく完了する', () => {
    expect(() => renderToString(<Fixture text={TEXT} />)).not.toThrow();
  });

  it('元の文字列と、未計測（null）を出力する', () => {
    const html = renderToString(<Fixture text={TEXT} />);
    expect(html).toContain(TEXT);
    expect(html).toContain('data-truncated="null"');
  });

  it('計測に必要なスタイルを出力する', () => {
    const html = renderToString(<Fixture text={TEXT} />);
    expect(html).toContain('white-space:pre-wrap');
  });
});
