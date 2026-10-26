'use client';

import _createFittingHoc from '../_internal/_createFittingHoc';
import { useFitText, type UseFitTextOptions } from '../useFitText';

/**
 * 候補を選ぶ・文字の大きさを変える・省略するを組み合わせて、要素の大きさ（幅・高さ）と行数に文字列を収めるコンポーネントを作る HOC
 *
 * - `value` に表示する文字列か、1つの値の表現の候補（望ましい順）を渡す。表示する文字列は、包んだコンポーネントに `children` として渡す
 * - useFitText のオプションを、プロパティとして受け取る。それ以外のプロパティは、包んだコンポーネントにそのまま渡す
 * - `style` は、ライブラリのスタイルの上に利用者のスタイルを重ねる（同じプロパティは利用者を優先する。計測に使うプロパティを上書きすると正しく動かない）
 * - `ref` は、ライブラリが使う ref と合成する
 * - 包むのは、幅がレイアウトで決まるブロック要素にする（インライン要素では働かない）
 *
 * @param Component 包むコンポーネント（`'div'` などの要素名も可）
 * @param options オプション
 * @returns コンポーネント
 */
export default _createFittingHoc<string | readonly string[], UseFitTextOptions>(
  'withFitText',
  useFitText,
  {
    wrap: true,
    maxLines: true,
    disabled: true,
    ellipsis: true,
    truncatePosition: true,
    truncateBoundary: true,
    locale: true,
    maxChars: true,
    minFontSize: true,
    maxFontSize: true,
    truncate: true,
    resizeFirst: true,
  },
);
