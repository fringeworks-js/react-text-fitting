// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { ChooseText } from '../ChooseText';
import { FitText } from '../FitText';
import { ResizeText } from '../ResizeText';
import TruncateText from './TruncateText';

describe('できあいのコンポーネント (SSR)', () => {
  it('DOM が無い環境でも、元の値（候補は最初のもの）を出力する', () => {
    const html = renderToString(
      <>
        <TruncateText value="truncate" maxLines={2} className="a" />
        <ResizeText value="resize" maxFontSize={48} />
        <ChooseText value={['choose-long', 'short']} />
        <FitText value={['fit-long', 'short']} truncate />
      </>,
    );
    expect(html).toContain(
      '<div class="a" style="white-space:pre">truncate</div>',
    );
    expect(html).toContain('resize');
    expect(html).toContain('choose-long');
    expect(html).toContain('fit-long');
    // 機能のオプションは要素の属性にしない
    expect(html).not.toMatch(/maxlines|maxfontsize|truncate=/i);
  });
});
