import { act, cleanup, render } from '@testing-library/react';
import { StrictMode, type CSSProperties } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import type { UseResizeTextOptions } from './types';
import useResizeText from './useResizeText';

const LONG_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';

/**
 * 要素の CSS の font-size（クラスで指定する。hook が当てるインラインの font-size と区別するため）
 */
const BASE_FONT_SIZE = 16;

let sheet: HTMLStyleElement;

beforeAll(() => {
  sheet = document.createElement('style');
  sheet.textContent = `.host { font-size: ${BASE_FONT_SIZE}px; font-family: sans-serif; line-height: 1.25; }`;
  document.head.appendChild(sheet);
});

afterAll(() => {
  sheet.remove();
});

type FixtureProps = {
  text: string;
  options?: UseResizeTextOptions;
  boxStyle?: CSSProperties;
};

function Fixture({ text, options, boxStyle }: FixtureProps) {
  const { ref, displayText, style, fontSize, isOverflowing } = useResizeText(
    text,
    options,
  );
  return (
    <div
      ref={ref}
      className="host"
      data-testid="host"
      data-font-size={String(fontSize)}
      data-overflowing={String(isOverflowing)}
      style={{ width: 150, ...boxStyle, ...style }}
    >
      {displayText}
    </div>
  );
}

const fontSizeOf = (host: HTMLElement) => Number(host.dataset.fontSize);

const nextFrames = async () => {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
};

describe('useResizeText', () => {
  afterEach(() => {
    cleanup();
  });

  it('収まる文字列は CSS の font-size のまま', () => {
    const { getByTestId } = render(<Fixture text="Hello" />);
    const host = getByTestId('host');
    expect(fontSizeOf(host)).toBe(BASE_FONT_SIZE);
    expect(host.style.fontSize).toBe(`${BASE_FONT_SIZE}px`);
  });

  it('はみ出す文字列は縮め、要素に font-size を当てる', () => {
    const { getByTestId } = render(<Fixture text={LONG_TEXT} />);
    const host = getByTestId('host');
    expect(fontSizeOf(host)).toBeLessThan(BASE_FONT_SIZE);
    expect(host.style.fontSize).toBe(`${fontSizeOf(host)}px`);
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
  });

  it('maxFontSize を指定すると、高さが決まった枠いっぱいまで大きくする', () => {
    const { getByTestId } = render(
      <Fixture
        text="1,234"
        options={{ maxFontSize: 200 }}
        boxStyle={{ width: 400, height: 60 }}
      />,
    );
    const host = getByTestId('host');
    expect(fontSizeOf(host)).toBeGreaterThan(BASE_FONT_SIZE);
    expect(host.scrollHeight).toBeLessThanOrEqual(host.clientHeight);
  });

  it('minFontSize でも収まらなければ isOverflowing で知らせる', () => {
    const { getByTestId } = render(
      <Fixture text={LONG_TEXT} options={{ minFontSize: 12 }} />,
    );
    const host = getByTestId('host');
    expect(fontSizeOf(host)).toBe(12);
    expect(host.dataset.overflowing).toBe('true');
  });

  it('文字列の変更に追従する', () => {
    const { getByTestId, rerender } = render(<Fixture text="Hi" />);
    const host = getByTestId('host');
    expect(fontSizeOf(host)).toBe(BASE_FONT_SIZE);
    rerender(<Fixture text={LONG_TEXT} />);
    expect(fontSizeOf(host)).toBeLessThan(BASE_FONT_SIZE);
  });

  it('縮めた後に幅が広がれば、また大きくする', async () => {
    const { getByTestId } = render(<Fixture text={LONG_TEXT} />);
    const host = getByTestId('host');
    expect(fontSizeOf(host)).toBeLessThan(BASE_FONT_SIZE);
    await act(async () => {
      host.style.width = '2000px';
      await nextFrames();
    });
    expect(fontSizeOf(host)).toBe(BASE_FONT_SIZE);
  });

  it('disabled の間は font-size を当てない', () => {
    const { getByTestId } = render(
      <Fixture text={LONG_TEXT} options={{ disabled: true }} />,
    );
    const host = getByTestId('host');
    expect(host.dataset.fontSize).toBe('null');
    expect(host.style.fontSize).toBe('');
  });

  it('StrictMode でも動く', () => {
    const { getByTestId } = render(
      <StrictMode>
        <Fixture text={LONG_TEXT} />
      </StrictMode>,
    );
    expect(fontSizeOf(getByTestId('host'))).toBeLessThan(BASE_FONT_SIZE);
  });

  it('サーバーで描画したものをハイドレーションできる', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(<Fixture text={LONG_TEXT} />);
    document.body.appendChild(container);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, <Fixture text={LONG_TEXT} />);
    });
    const host = container.querySelector<HTMLElement>('[data-testid="host"]')!;
    expect(errors).not.toHaveBeenCalled();
    expect(fontSizeOf(host)).toBeLessThan(BASE_FONT_SIZE);
    errors.mockRestore();
    act(() => {
      root!.unmount();
    });
    container.remove();
  });
});
