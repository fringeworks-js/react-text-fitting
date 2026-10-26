// @vitest-environment node
import { renderToString } from 'react-dom/server';
import useResizeText from './useResizeText';

function Fixture({ text }: { text: string }) {
  const { ref, displayText, style, fontSize } = useResizeText(text, {
    maxFontSize: 48,
  });
  return (
    <p ref={ref} style={style} data-font-size={String(fontSize)}>
      {displayText}
    </p>
  );
}

describe('useResizeText (SSR)', () => {
  it('DOM が無い環境でも renderToString が例外なく完了する', () => {
    expect(() => renderToString(<Fixture text="1,234" />)).not.toThrow();
  });

  it('元の文字列と、未計測（null）を出力し、font-size は指定しない', () => {
    const html = renderToString(<Fixture text="1,234" />);
    expect(html).toContain('1,234');
    expect(html).toContain('data-font-size="null"');
    expect(html).toContain('style="white-space:pre"');
  });
});
