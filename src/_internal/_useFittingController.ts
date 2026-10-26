'use client';

import {
  useCallback,
  useLayoutEffect,
  useReducer,
  useState,
  useSyncExternalStore,
  type RefCallback,
} from 'react';

/**
 * text-fitting の Controller に共通の形
 */
type FittingController<S, O> = {
  attach(element: HTMLElement | null): void;
  getSnapshot(): S;
  subscribe(listener: () => void): () => void;
  update(text: string, options?: O): void;
  refresh(): void;
};

/**
 * text-fitting の Controller を React で使うための共通の処理
 *
 * - Controller は初回の描画で作り、使い続ける。破棄しない（StrictMode でエフェクトが
 *   「マウント → アンマウント → マウント」と動くため、アンマウントで破棄すると2回目のマウントで使えなくなる）。
 *   要素を外したとき（ref に null が渡ったとき）に監視は止まり、購読は useSyncExternalStore が解除する
 * - 文字列とオプションは、描画のたびにレイアウトの副作用で update に渡す（値が同じなら Controller は何もしない）
 * - 計測の結果が変わっていたら、画面に表示する前に描画し直す
 *
 * @param create Controller を作る関数
 * @param text 文字列
 * @param options オプション
 * @returns snapshot、要素に渡す ref、計測し直す関数
 */
export default function useFittingController<S extends object, O>(
  create: (text: string, options?: O) => FittingController<S, O>,
  text: string,
  options: O | undefined,
): S & { ref: RefCallback<HTMLElement>; refresh: () => void } {
  const [controller] = useState(() => create(text, options));
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const [, rerender] = useReducer((count: number) => count + 1, 0);

  const ref = useCallback(
    (element: HTMLElement | null) => {
      controller.attach(element);
    },
    [controller],
  );

  useLayoutEffect(() => {
    controller.update(text, options);
    // useSyncExternalStore の購読は描画の後（passive effect）に始まるため、要素を接続したときの計測の結果は届かない。
    // 画面に表示する前に描画し直し、計測する前の表示が一瞬見えないようにする
    if (controller.getSnapshot() !== snapshot) {
      rerender();
    }
  });

  return { ...snapshot, ref, refresh: controller.refresh };
}
