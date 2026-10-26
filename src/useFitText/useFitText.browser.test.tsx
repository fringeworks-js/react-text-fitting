import { cleanup, render } from '@testing-library/react';
import { StrictMode } from 'react';
import type { UseFitTextOptions } from './types';
import useFitText from './useFitText';

const NUMBERS = ['1,234,567', '1.2M'];

let sheet: HTMLStyleElement;

beforeAll(() => {
  // 要素の CSS の font-size（hook が当てるインラインの font-size と区別するため、クラスで指定する）
  sheet = document.createElement('style');
  sheet.textContent =
    '.host { font-size: 16px; font-family: sans-serif; line-height: 1.25; }';
  document.head.appendChild(sheet);
});

afterAll(() => {
  sheet.remove();
});

function Fixture({
  width,
  height,
  options,
}: {
  width: number;
  height?: number;
  options?: UseFitTextOptions;
}) {
  // 描画のたびに新しい配列を渡す
  const { ref, displayText, style, index, fontSize, isTruncated } = useFitText(
    [...NUMBERS],
    options,
  );
  return (
    <div
      ref={ref}
      className="host"
      data-testid="host"
      data-index={index}
      data-font-size={String(fontSize)}
      data-truncated={String(isTruncated)}
      style={{ width, height, ...style }}
    >
      {displayText}
    </div>
  );
}

describe('useFitText', () => {
  afterEach(() => {
    cleanup();
  });

  it('resizeFirst: false では、候補を切り替えて上限の大きさを保つ', () => {
    const { getByTestId } = render(
      <Fixture width={160} height={70} options={{ maxFontSize: 48 }} />,
    );
    const host = getByTestId('host');
    expect(host.dataset.index).toBe('1');
    expect(host.dataset.fontSize).toBe('48');
    expect(host.style.fontSize).toBe('48px');
  });

  it('resizeFirst: true では、先に縮める', () => {
    const { getByTestId } = render(
      <Fixture
        width={160}
        height={70}
        options={{ maxFontSize: 48, resizeFirst: true }}
      />,
    );
    const host = getByTestId('host');
    expect(host.dataset.index).toBe('0');
    expect(Number(host.dataset.fontSize)).toBeLessThan(48);
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
  });

  it('どの候補も収まらなければ、最後の候補を省略する', () => {
    const { getByTestId } = render(
      <Fixture width={30} options={{ minFontSize: 14, truncate: true }} />,
    );
    const host = getByTestId('host');
    expect(host.dataset.index).toBe('1');
    expect(host.dataset.truncated).toBe('true');
    expect(host.dataset.fontSize).toBe('14');
  });

  it('StrictMode でも動く', () => {
    const { getByTestId } = render(
      <StrictMode>
        <Fixture width={160} height={70} options={{ maxFontSize: 48 }} />
      </StrictMode>,
    );
    expect(getByTestId('host').dataset.index).toBe('1');
  });
});
