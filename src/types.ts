import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

/**
 * HOC（withTruncateText など）のオプション
 */
export type WithTextFittingOptions = {
  /**
   * コンポーネントに設定する displayName
   */
  displayName?: string;
};

/**
 * HOC で作ったコンポーネントのプロパティ
 *
 * 包んだコンポーネントのプロパティのうち、機能のオプションと同じ名前のものと `value`・`children` は除く
 * （値は `value` だけで受け取り、表示する文字列は `children` としてライブラリが渡すため）
 */
export type FittingProps<C extends ElementType, V, O> = Omit<
  ComponentPropsWithoutRef<C>,
  keyof O | 'value' | 'children'
> &
  O & {
    /**
     * 表示する値
     */
    value: V;
  };

/**
 * HOC で作ったコンポーネント
 */
export type FittingComponent<
  C extends ElementType,
  V,
  O,
> = ForwardRefExoticComponent<
  PropsWithoutRef<FittingProps<C, V, O>> & RefAttributes<ComponentRef<C>>
>;
