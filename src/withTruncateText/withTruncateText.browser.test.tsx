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

  describe('displayTextProp', () => {
    type LabelProps = ComponentProps<'div'> & { label?: string };
    const Label = forwardRef<HTMLDivElement, LabelProps>(
      ({ label, children, ...props }, ref) => (
        <div ref={ref} data-children={String(children ?? '')} {...props}>
          {label}
        </div>
      ),
    );

    it('表示する文字列を、指定したプロパティに渡す', () => {
      const Wrapped = withTruncateText(Label, { displayTextProp: 'label' });
      const { getByTestId } = render(
        <Wrapped data-testid="host" value={LONG_TEXT} style={BOX} />,
      );
      const host = getByTestId('host');
      expect(host.textContent!.endsWith('...')).toBe(true);
      expect(isOverflowing(host)).toBe(false);
    });

    it('children 以外を指定した場合は、children をそのまま渡す', () => {
      const Wrapped = withTruncateText(Label, { displayTextProp: 'label' });
      const { getByTestId } = render(
        <Wrapped data-testid="host" value="Hello" style={BOX}>
          icon
        </Wrapped>,
      );
      expect(getByTestId('host').dataset.children).toBe('icon');
    });

    it('value に渡すと、包んだコンポーネントの value に表示する文字列が入る', () => {
      const Input = withTruncateText('input', { displayTextProp: 'value' });
      const { getByTestId } = render(
        <Input data-testid="host" value={LONG_TEXT} style={BOX} readOnly />,
      );
      const value = (getByTestId('host') as HTMLInputElement).value;
      expect(value.endsWith('...')).toBe(true);
      expect(value.length).toBeLessThan(LONG_TEXT.length);
    });

    it('型: 指定したプロパティは受け取らない', () => {
      const Wrapped = withTruncateText(Label, { displayTextProp: 'label' });
      // @ts-expect-error label はライブラリが渡すので受け取らない
      const element = <Wrapped value="Hello" label="x" />;
      expect(element).toBeTruthy();
    });
  });

  it('detectionDelay・hideWhilePending を受け取り、要素には渡さない', () => {
    const { getByTestId } = render(
      <TruncateText
        data-testid="host"
        value={LONG_TEXT}
        style={BOX}
        detectionDelay={100}
        hideWhilePending
      />,
    );
    const host = getByTestId('host');
    expect(host.hasAttribute('detectiondelay')).toBe(false);
    expect(host.hasAttribute('hidewhilepending')).toBe(false);
    expect(host.style.visibility).toBe('');
  });

  describe('refreshOn', () => {
    // 大きさを固定し、書式（letter-spacing）を変えても要素の大きさが変わらないようにする
    const FIXED_BOX = { ...BOX, height: 24 };
    const TEXT = 'Hello world';

    it('値が変わったら測り直す', () => {
      const { getByTestId, rerender } = render(
        <TruncateText
          data-testid="host"
          value={TEXT}
          style={{ ...FIXED_BOX, letterSpacing: '0px' }}
          refreshOn={{ spacing: 0 }}
        />,
      );
      const host = getByTestId('host');
      expect(host.textContent).toBe(TEXT);

      rerender(
        <TruncateText
          data-testid="host"
          value={TEXT}
          style={{ ...FIXED_BOX, letterSpacing: '12px' }}
          refreshOn={{ spacing: 12 }}
        />,
      );
      expect(host.textContent!.endsWith('...')).toBe(true);
      expect(isOverflowing(host)).toBe(false);
    });

    it('渡さない場合は、書式だけが変わっても測り直さない', () => {
      const { getByTestId, rerender } = render(
        <TruncateText
          data-testid="host"
          value={TEXT}
          style={{ ...FIXED_BOX, letterSpacing: '0px' }}
        />,
      );
      const host = getByTestId('host');

      rerender(
        <TruncateText
          data-testid="host"
          value={TEXT}
          style={{ ...FIXED_BOX, letterSpacing: '12px' }}
        />,
      );
      expect(host.textContent).toBe(TEXT);
    });

    it('値が同じなら、その場で作ったオブジェクトでも測り直さない', () => {
      const { getByTestId, rerender } = render(
        <TruncateText
          data-testid="host"
          value={TEXT}
          style={{ ...FIXED_BOX, letterSpacing: '0px' }}
          refreshOn={{ spacing: 0 }}
        />,
      );
      const host = getByTestId('host');

      rerender(
        <TruncateText
          data-testid="host"
          value={TEXT}
          style={{ ...FIXED_BOX, letterSpacing: '12px' }}
          refreshOn={{ spacing: 0 }}
        />,
      );
      expect(host.textContent).toBe(TEXT);
    });

    it('要素には渡さない', () => {
      const { getByTestId } = render(
        <TruncateText
          data-testid="host"
          value={TEXT}
          refreshOn={{ spacing: 0 }}
        />,
      );
      expect(getByTestId('host').hasAttribute('refreshon')).toBe(false);
    });
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
