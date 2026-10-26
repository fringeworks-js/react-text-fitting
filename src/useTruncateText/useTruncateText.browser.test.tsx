import { act, cleanup, render } from '@testing-library/react';
import { StrictMode, useLayoutEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import type { UseTruncateTextOptions } from './types';
import useTruncateText from './useTruncateText';

const LONG_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';

const HOST_STYLE = {
  width: '150px',
  fontSize: '16px',
  fontFamily: 'sans-serif',
  lineHeight: '20px',
};

type FixtureProps = {
  text: string;
  options?: UseTruncateTextOptions;
  onLayout?: (displayText: string) => void;
};

function Fixture({ text, options, onLayout }: FixtureProps) {
  const { ref, displayText, style, isTruncated } = useTruncateText(
    text,
    options,
  );
  useLayoutEffect(() => {
    onLayout?.(displayText);
  });
  return (
    <div
      ref={ref}
      data-testid="host"
      data-truncated={String(isTruncated)}
      style={{ ...HOST_STYLE, ...style }}
    >
      {displayText}
    </div>
  );
}

const isOverflowing = (host: HTMLElement) =>
  host.scrollWidth > host.clientWidth || host.scrollHeight > host.clientHeight;

const nextFrames = async () => {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
};

describe('useTruncateText', () => {
  afterEach(() => {
    cleanup();
  });

  it('要素の幅に収まるように省略する', () => {
    const { getByTestId } = render(<Fixture text={LONG_TEXT} />);
    const host = getByTestId('host');
    expect(host.dataset.truncated).toBe('true');
    expect(host.textContent!.endsWith('...')).toBe(true);
    expect(isOverflowing(host)).toBe(false);
  });

  it('収まる文字列はそのまま表示する', () => {
    const { getByTestId } = render(<Fixture text="Hello" />);
    const host = getByTestId('host');
    expect(host.textContent).toBe('Hello');
    expect(host.dataset.truncated).toBe('false');
  });

  it('計測した結果で描画し直す', () => {
    // 最後のレイアウトの時点で、省略した文字列になっている。
    // act は passive effect まで流すため、画面に表示する前に描画し直したか（useTruncateText の
    // レイアウトの副作用による描画し直し）までは、このテストでは見分けられない
    const onLayout = vi.fn();
    render(<Fixture text={LONG_TEXT} onLayout={onLayout} />);
    const last = onLayout.mock.lastCall![0] as string;
    expect(last).not.toBe(LONG_TEXT);
    expect(last.endsWith('...')).toBe(true);
  });

  it('文字列とオプションの変更に追従する', () => {
    const { getByTestId, rerender } = render(<Fixture text="Hello" />);
    const host = getByTestId('host');
    rerender(<Fixture text={LONG_TEXT} />);
    expect(host.dataset.truncated).toBe('true');
    rerender(
      <Fixture
        text={LONG_TEXT}
        options={{ truncatePosition: 'start', ellipsis: '…' }}
      />,
    );
    expect(host.textContent!.startsWith('…')).toBe(true);
    expect(isOverflowing(host)).toBe(false);
  });

  it('disabled の間は元の文字列を表示する', () => {
    const { getByTestId, rerender } = render(
      <Fixture text={LONG_TEXT} options={{ disabled: true }} />,
    );
    const host = getByTestId('host');
    expect(host.textContent).toBe(LONG_TEXT);
    expect(host.dataset.truncated).toBe('false');
    rerender(<Fixture text={LONG_TEXT} options={{ disabled: false }} />);
    expect(host.dataset.truncated).toBe('true');
  });

  it('maxLines の行数に収める', () => {
    const { getByTestId } = render(
      <Fixture text={LONG_TEXT} options={{ wrap: 'normal', maxLines: 2 }} />,
    );
    const host = getByTestId('host');
    expect(host.dataset.truncated).toBe('true');
    expect(host.getBoundingClientRect().height).toBeLessThanOrEqual(40.5);
  });

  it('要素の幅が変わると測り直す', async () => {
    const { getByTestId } = render(<Fixture text={LONG_TEXT} />);
    const host = getByTestId('host');
    const narrow = host.textContent!;
    await act(async () => {
      host.style.width = '300px';
      await nextFrames();
    });
    expect(host.textContent!.length).toBeGreaterThan(narrow.length);
    expect(isOverflowing(host)).toBe(false);
  });

  it('StrictMode でも動く', async () => {
    const { getByTestId } = render(
      <StrictMode>
        <Fixture text={LONG_TEXT} />
      </StrictMode>,
    );
    const host = getByTestId('host');
    expect(host.dataset.truncated).toBe('true');
    const narrow = host.textContent!;
    await act(async () => {
      host.style.width = '300px';
      await nextFrames();
    });
    expect(host.textContent!.length).toBeGreaterThan(narrow.length);
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
    expect(host.dataset.truncated).toBe('true');
    expect(isOverflowing(host)).toBe(false);
    errors.mockRestore();
    act(() => {
      root!.unmount();
    });
    container.remove();
  });
});
