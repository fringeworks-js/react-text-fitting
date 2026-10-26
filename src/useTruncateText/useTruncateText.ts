'use client';

import { createTruncateTextController } from '@fringeworks/text-fitting';
import useFittingController from '../_internal/_useFittingController';
import type { UseTruncateTextOptions, UseTruncateTextResult } from './types';

/**
 * 要素の大きさ（幅・高さ）と行数に収まるように、文字列を省略する hook
 *
 * 戻り値の `ref`・`displayText`・`style` を、同じ要素に渡す。
 * `style` を渡さないと、計測した書式と表示の書式がずれて、結果が正しくならない。
 *
 * - サーバーと、ハイドレーションの初回の描画では、元の文字列を表示する（`isTruncated` は null）
 * - 描画した後、画面に表示する前に計測し、省略した文字列で描画し直す
 *
 * @param text 文字列
 * @param options オプション
 * @returns 表示する文字列、要素に渡す ref とスタイルなど
 */
export default function useTruncateText(
  text: string,
  options?: UseTruncateTextOptions,
): UseTruncateTextResult {
  return useFittingController(createTruncateTextController, text, options);
}
