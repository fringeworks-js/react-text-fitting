'use client';

import { createFitTextController } from '@fringeworks/text-fitting';
import useFittingController from '../_internal/_useFittingController';
import type { UseFitTextOptions, UseFitTextResult } from './types';

/**
 * 候補を選ぶ・文字の大きさを変える・省略するを組み合わせて、要素の大きさ（幅・高さ）と行数に文字列を収める hook
 *
 * 戻り値の `ref`・`displayText`・`style` を、同じ要素に渡す。各機能は、指定したときだけ有効になる
 * （候補: 第1引数に配列を渡す、文字の大きさ: minFontSize か maxFontSize、省略: truncate: true）。
 *
 * - サーバーと、ハイドレーションの初回の描画では、最初の候補を表示し、font-size を指定しない
 * - 描画した後、画面に表示する前に計測し、選んだ表示で描画し直す
 *
 * @param text 文字列か、候補の配列（望ましい順）
 * @param options オプション
 * @returns 表示する文字列、選んだ候補の番号と font-size、要素に渡す ref とスタイルなど
 */
export default function useFitText(
  text: string | readonly string[],
  options?: UseFitTextOptions,
): UseFitTextResult {
  return useFittingController(createFitTextController, text, options);
}
