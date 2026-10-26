import { cleanup, render } from '@testing-library/react';
import { createRef, forwardRef, StrictMode, type ComponentProps } from 'react';
import { TruncateText } from '../TruncateText';
import withTruncateText from './withTruncateText';

const LONG_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';

const BOX = { width: 150, fontSize: 16, fontFamily: 'sans-serif' };

const isOverflowing = (element: HTMLElement) =>
  element.scrollWidth > element.clientWidth;

describe('withTruncateText', () => {
  afterEach(() => {
    cleanup();
  });

  it('できあいの TruncateText は div を描き、value を省略して表示する', () => {
    const { getByTestId } = render(
      <TruncateText data-testid="host" value={LONG_TEXT} style={BOX} />,
    );
    const host = getByTestId('host');
    expect(host.tagName).toBe('DIV');
    expect(host.textContent!.endsWith('...')).toBe(true);
    expect(isOverflowing(host)).toBe(false);
  });

  it('指定した要素で描く', () => {
    const Title = withTruncateText('h2');
    const { getByTestId } = render(
      <Title data-testid="host" value={LONG_TEXT} style={BOX} />,
    );
    expect(getByTestId('host').tagName).toBe('H2');
  });

  it('自作のコンポーネントを包める', () => {
    const Box = forwardRef<HTMLParagraphElement, ComponentProps<'p'>>(
      (props, ref) => <p ref={ref} data-custom="yes" {...props} />,
    );
    const Wrapped = withTruncateText(Box);
    const { getByTestId } = render(
      <Wrapped data-testid="host" value={LONG_TEXT} style={BOX} />,
    );
    const host = getByTestId('host');
    expect(host.dataset.custom).toBe('yes');
    expect(host.textContent!.endsWith('...')).toBe(true);
  });

  it('機能のオプションを受け取り、要素には渡さない', () => {
    const { getByTestId } = render(
      <TruncateText
        data-testid="host"
        value={LONG_TEXT}
        style={BOX}
        wrap="normal"
        maxLines={2}
        ellipsis="…"
        truncatePosition="middle"
      />,
    );
    const host = getByTestId('host');
    expect(host.textContent).toContain('…');
    expect(host.textContent!.endsWith('…')).toBe(false);
    for (const name of ['wrap', 'maxlines', 'ellipsis', 'truncateposition']) {
      expect(host.hasAttribute(name)).toBe(false);
    }
  });

  it('ほかのプロパティは要素にそのまま渡す', () => {
    const { getByTestId } = render(
      <TruncateText
        data-testid="host"
        value="Hello"
        className="title"
        title="tooltip"
        aria-label="label"
      />,
    );
    const host = getByTestId('host');
    expect(host.className).toBe('title');
    expect(host.title).toBe('tooltip');
    expect(host.getAttribute('aria-label')).toBe('label');
  });

  it('ライブラリのスタイルを当て、同じプロパティは利用者のスタイルを優先する', () => {
    const { getByTestId, rerender } = render(
      <TruncateText data-testid="host" value="Hello" style={BOX} />,
    );
    const host = getByTestId('host');
    expect(host.style.whiteSpace).toBe('pre');
    rerender(
      <TruncateText
        data-testid="host"
        value="Hello"
        style={{ ...BOX, whiteSpace: 'normal', color: 'red' }}
      />,
    );
    expect(host.style.whiteSpace).toBe('normal');
    expect(host.style.color).toBe('red');
  });

  it('ref を受け取り、要素を渡す（ライブラリの ref と合成する）', () => {
    const ref = createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <TruncateText
        ref={ref}
        data-testid="host"
        value={LONG_TEXT}
        style={BOX}
      />,
    );
    expect(ref.current).toBe(getByTestId('host'));
    // ライブラリの ref も働いている（計測して省略している）
    expect(ref.current!.textContent!.endsWith('...')).toBe(true);
  });

  it('displayName を付ける', () => {
    expect(TruncateText.displayName).toBe('TruncateText');
    expect(withTruncateText('h2').displayName).toBe('withTruncateText(h2)');
    expect(withTruncateText('h2', { displayName: 'Title' }).displayName).toBe(
      'Title',
    );
  });

  it('StrictMode でも動く', () => {
    const { getByTestId } = render(
      <StrictMode>
        <TruncateText data-testid="host" value={LONG_TEXT} style={BOX} />
      </StrictMode>,
    );
    expect(getByTestId('host').textContent!.endsWith('...')).toBe(true);
  });
});
