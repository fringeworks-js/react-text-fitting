'use client';

import type { ChangeDependencies } from '@fringeworks/react-utils/hooks/useChangeEffect';
import useChangeLayoutEffect from '@fringeworks/react-utils/hooks/useChangeLayoutEffect';
import useCombinedRefs from '@fringeworks/react-utils/hooks/useCombinedRefs';
import ensureComponent from '@fringeworks/react-utils/utils/ensureComponent';
import getComponentName from '@fringeworks/react-utils/utils/getComponentName';
import type { CSSProperties, ElementType, Ref, RefCallback } from 'react';
import { createElement, forwardRef } from 'react';
import type { FittingComponent, WithTextFittingOptions } from '../types';

/**
 * 機能の hook が返すもののうち、コンポーネントで使うもの
 */
type FittingResult = {
  ref: RefCallback<HTMLElement>;
  displayText: string;
  style: object;
  refresh: () => void;
};

/**
 * 機能の hook とオプションの名前の一覧から、HOC を作る
 *
 * - プロパティを、機能のオプションと、包んだコンポーネントに渡すものに分ける
 * - 表示する文字列を、`displayTextProp` のプロパティ（既定は `children`）として渡す。`children` 以外の場合は、`children` をそのまま渡す
 * - `style` は、ライブラリのスタイルの上に利用者のスタイルを重ねる（同じプロパティは利用者を優先する）
 * - `ref` は、ライブラリが使う ref と合成する
 * - `refreshOn` の値が変わったら、画面に表示する前に測り直す（包んだコンポーネントには渡さない）
 *
 * @param hocName HOC の名前（displayName の既定値に使う）
 * @param useFitting 機能の hook
 * @param optionKeys 機能のオプションの名前の一覧（すべてのオプションを並べる）
 * @returns HOC
 */
export default function _createFittingHoc<V, O extends object>(
  hocName: string,
  useFitting: (value: V, options?: O) => FittingResult,
  optionKeys: Readonly<Record<keyof O, true>>,
) {
  const keys = Object.keys(optionKeys);

  return function withFitting<
    C extends ElementType,
    K extends string = 'children',
  >(
    Component: C,
    options: WithTextFittingOptions<K> = {},
  ): FittingComponent<C, V, O, K> {
    const EnsuredComponent = ensureComponent<ElementType>(Component);
    const displayTextProp: string = options.displayTextProp ?? 'children';

    const FittingComponent = forwardRef<unknown, Record<string, unknown>>(
      (props, forwardedRef) => {
        const fittingOptions: Record<string, unknown> = {};
        const rest: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(props)) {
          if (keys.includes(key)) {
            // 値が同じなら測り直さないよう、undefined のものは入れない
            if (value !== undefined) {
              fittingOptions[key] = value;
            }
          } else if (
            key !== 'value' &&
            key !== 'refreshOn' &&
            key !== displayTextProp
          ) {
            rest[key] = value;
          }
        }
        const { ref, displayText, style, refresh } = useFitting(
          props.value as V,
          fittingOptions as O,
        );
        useChangeLayoutEffect(
          props.refreshOn as ChangeDependencies | undefined,
          refresh,
        );
        const combinedRef = useCombinedRefs<HTMLElement>(
          ref,
          forwardedRef as Ref<HTMLElement>,
        );
        return createElement(EnsuredComponent, {
          ...rest,
          [displayTextProp]: displayText,
          ref: combinedRef,
          // 同じプロパティは利用者のスタイルを優先する
          style: { ...style, ...(rest.style as CSSProperties | undefined) },
        });
      },
    );
    FittingComponent.displayName =
      options.displayName ?? `${hocName}(${getComponentName(Component)})`;

    return FittingComponent as unknown as FittingComponent<C, V, O, K>;
  };
}
