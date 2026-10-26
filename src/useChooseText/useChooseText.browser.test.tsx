import { act, cleanup, render } from '@testing-library/react';
import { StrictMode } from 'react';
import useChooseText from './useChooseText';

const CANDIDATES = ['2026年10月26日（月）', '2026/10/26', '10/26'];

function Fixture({
  width,
  onRender,
}: {
  width: number;
  onRender?: () => void;
}) {
  onRender?.();
  // 描画のたびに新しい配列を渡す
  const { ref, displayText, style, index, isOverflowing } = useChooseText([
    ...CANDIDATES,
  ]);
  return (
    <div
      ref={ref}
      data-testid="host"
      data-index={index}
      data-overflowing={String(isOverflowing)}
      style={{ width, fontSize: 16, fontFamily: 'sans-serif', ...style }}
    >
      {displayText}
    </div>
  );
}

const nextFrames = async () => {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
};

describe('useChooseText', () => {
  afterEach(() => {
    cleanup();
  });

  it('収まる候補のうち、最初のものを表示する', () => {
    const { getByTestId } = render(<Fixture width={100} />);
    const host = getByTestId('host');
    expect(Number(host.dataset.index)).toBeGreaterThan(0);
    expect(host.dataset.overflowing).toBe('false');
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
  });

  it('描画のたびに新しい配列を渡しても、描画し直しを繰り返さない', async () => {
    const onRender = vi.fn();
    render(<Fixture width={100} onRender={onRender} />);
    await act(async () => {
      await nextFrames();
    });
    // 初回の描画と、計測した結果での描画し直し（と React の内部の再描画）だけ
    expect(onRender.mock.calls.length).toBeLessThanOrEqual(4);
  });

  it('幅が広がると、前の候補に戻す', async () => {
    const { getByTestId } = render(<Fixture width={100} />);
    const host = getByTestId('host');
    await act(async () => {
      host.style.width = '500px';
      await nextFrames();
    });
    expect(host.dataset.index).toBe('0');
  });

  it('StrictMode でも動く', () => {
    const { getByTestId } = render(
      <StrictMode>
        <Fixture width={100} />
      </StrictMode>,
    );
    expect(Number(getByTestId('host').dataset.index)).toBeGreaterThan(0);
  });
});
