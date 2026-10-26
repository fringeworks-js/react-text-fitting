'use client';

import { createTruncateTextController } from '@fringeworks/text-fitting';
import {
  useCallback,
  useLayoutEffect,
  useReducer,
  useState,
  useSyncExternalStore,
} from 'react';
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
  // Controller は再描画の間も同じものを使い続ける
  const [controller] = useState(() =>
    createTruncateTextController(text, options),
  );
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const [, rerender] = useReducer((count: number) => count + 1, 0);

  // 要素を外したときは監視を止める。Controller は破棄しない（StrictMode で作り直さずに使い続けるため）
  const ref = useCallback(
    (element: HTMLElement | null) => {
      controller.attach(element);
    },
    [controller],
  );

  useLayoutEffect(() => {
    // 値が変わらなければ、Controller は何もしない
    controller.update(text, options);
    // useSyncExternalStore の購読は描画の後に始まるため、接続したときの計測の結果は届かない。
    // 画面に表示する前に描画し直し、元の文字列が一瞬見えないようにする
    if (controller.getSnapshot() !== snapshot) {
      rerender();
    }
  });

  return { ...snapshot, ref, refresh: controller.refresh };
}
