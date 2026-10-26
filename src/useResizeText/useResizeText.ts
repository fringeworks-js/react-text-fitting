'use client';

import { createResizeTextController } from '@fringeworks/text-fitting';
import useFittingController from '../_internal/_useFittingController';
import type { UseResizeTextOptions, UseResizeTextResult } from './types';

/**
 * 要素の大きさ（幅・高さ）と行数に収まるように、文字の大きさ（font-size）を変える hook
 *
 * 戻り値の `ref`・`displayText`・`style` を、同じ要素に渡す。`style` に選んだ font-size が入る。
 * 元にする font-size は、クラスや継承などの CSS で指定する（自分のインラインのスタイルで fontSize を指定すると、計測が正しく働かない）。
 *
 * - maxFontSize を省略した場合は、そのままで収まれば何もせず、はみ出すときだけ縮める
 * - maxFontSize を指定すると、収まる限りその大きさまで大きくする
 * - サーバーと、ハイドレーションの初回の描画では、font-size を指定しない（`fontSize` は null）
 *
 * @param text 文字列
 * @param options オプション
 * @returns 表示する文字列、要素に渡す ref とスタイルなど
 */
export default function useResizeText(
  text: string,
  options?: UseResizeTextOptions,
): UseResizeTextResult {
  return useFittingController(createResizeTextController, text, options);
}
