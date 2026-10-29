'use client';

import _createFittingHoc from '../_internal/_createFittingHoc';
import { useResizeText, type UseResizeTextOptions } from '../useResizeText';

/**
 * 要素の大きさ（幅・高さ）と行数に収まるように、文字の大きさ（font-size）を変えるコンポーネントを作る HOC
 *
 * - `value` に表示する文字列を渡す。表示する文字列は、包んだコンポーネントに `children` として渡す
 * - useResizeText のオプションを、プロパティとして受け取る。それ以外のプロパティは、包んだコンポーネントにそのまま渡す
 * - `style` は、ライブラリのスタイルの上に利用者のスタイルを重ねる（同じプロパティは利用者を優先する。計測に使うプロパティを上書きすると正しく動かない）
 * - `ref` は、ライブラリが使う ref と合成する
 * - 包むのは、幅がレイアウトで決まるブロック要素にする（インライン要素では働かない）
 *
 * @param Component 包むコンポーネント（`'div'` などの要素名も可）
 * @param options オプション
 * @returns コンポーネント
 */
export default _createFittingHoc<string, UseResizeTextOptions>(
  'withResizeText',
  useResizeText,
  {
    wrap: true,
    maxLines: true,
    disabled: true,
    detectionDelay: true,
    hideWhilePending: true,
    minFontSize: true,
    maxFontSize: true,
  },
);
