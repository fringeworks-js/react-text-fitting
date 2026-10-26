'use client';

import { createChooseTextController } from '@fringeworks/text-fitting';
import useFittingController from '../_internal/_useFittingController';
import type { UseChooseTextOptions, UseChooseTextResult } from './types';

/**
 * 要素の大きさ（幅・高さ）と行数に収まる表現を、候補から選ぶ hook
 *
 * 戻り値の `ref`・`displayText`・`style` を、同じ要素に渡す。
 * 候補は望ましい順に並べる。描画のたびに新しい配列を渡してよい（中身が同じなら測り直さない）。
 *
 * - サーバーと、ハイドレーションの初回の描画では、最初の候補を表示する（`isOverflowing` は null）
 * - 描画した後、画面に表示する前に計測し、選んだ候補で描画し直す
 *
 * @param candidates 候補（望ましい順）
 * @param options オプション
 * @returns 表示する文字列、選んだ候補の番号、要素に渡す ref とスタイルなど
 */
export default function useChooseText(
  candidates: readonly string[],
  options?: UseChooseTextOptions,
): UseChooseTextResult {
  return useFittingController(createChooseTextController, candidates, options);
}
