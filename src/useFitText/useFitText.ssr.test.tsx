// @vitest-environment node
import { renderToString } from 'react-dom/server';
import useFitText from './useFitText';

function Fixture() {
  const { ref, displayText, style, index, fontSize, isTruncated } = useFitText(
    ['1,234,567', '1.2M'],
    { maxFontSize: 48, truncate: true },
  );
  return (
    <p
      ref={ref}
      style={style}
      data-index={index}
      data-font-size={String(fontSize)}
      data-truncated={String(isTruncated)}
    >
      {displayText}
    </p>
  );
}

describe('useFitText (SSR)', () => {
  it('最初の候補と、未計測（null）を出力し、font-size は指定しない', () => {
    const html = renderToString(<Fixture />);
    expect(html).toContain('1,234,567');
    expect(html).toContain('data-index="0"');
    expect(html).toContain('data-font-size="null"');
    expect(html).toContain('data-truncated="null"');
    expect(html).toContain('style="white-space:pre"');
  });
});
