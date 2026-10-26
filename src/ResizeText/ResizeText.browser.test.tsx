import { cleanup, render } from '@testing-library/react';
import { ChooseText } from '../ChooseText';
import { FitText } from '../FitText';
import ResizeText from './ResizeText';

const LONG_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';

/**
 * 元にする font-size は親から継承する（要素のインラインの font-size は、計測に使うため）
 */
const Parent = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 16, fontFamily: 'sans-serif' }}>{children}</div>
);

describe('できあいのコンポーネント', () => {
  afterEach(() => {
    cleanup();
  });

  it('ResizeText は文字の大きさを変える', () => {
    const { getByTestId } = render(
      <Parent>
        <ResizeText
          data-testid="host"
          value={LONG_TEXT}
          style={{ width: 150 }}
        />
      </Parent>,
    );
    const host = getByTestId('host');
    expect(Number.parseFloat(host.style.fontSize)).toBeLessThan(16);
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
  });

  it('ChooseText は収まる候補を選ぶ', () => {
    const { getByTestId } = render(
      <Parent>
        <ChooseText
          data-testid="host"
          value={['2026年10月26日（月）', '2026/10/26', '10/26']}
          style={{ width: 100 }}
        />
      </Parent>,
    );
    const host = getByTestId('host');
    expect(host.textContent).not.toBe('2026年10月26日（月）');
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
  });

  it('FitText は機能を組み合わせて収める', () => {
    const { getByTestId } = render(
      <Parent>
        <FitText
          data-testid="host"
          value={['1,234,567', '1.2M']}
          maxFontSize={48}
          style={{ width: 160, height: 70, lineHeight: 1.25 }}
        />
      </Parent>,
    );
    const host = getByTestId('host');
    expect(host.textContent).toBe('1.2M');
    expect(host.style.fontSize).toBe('48px');
  });
});
