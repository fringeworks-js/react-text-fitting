import type { ChangeDependencies } from '@fringeworks/react-utils/hooks/useChangeEffect';
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
export type WithTextFittingOptions<K extends string = 'children'> = {
  /**
   * コンポーネントに設定する displayName
   */
  displayName?: string;

  /**
   * 表示する文字列を渡す、包んだコンポーネントのプロパティの名前（例: `'value'`・`'label'`）\
   * `'children'` 以外の場合、作ったコンポーネントは `children` を受け取り、包んだコンポーネントにそのまま渡す
   * @default 'children'
   */
  displayTextProp?: K;
};

/**
 * HOC で作ったコンポーネントのプロパティ
 *
 * 包んだコンポーネントのプロパティのうち、機能のオプションと同じ名前のものと `value`・`refreshOn`・表示する文字列を渡すプロパティ（K。既定は `children`）は除く
 * （値は `value` だけで受け取り、表示する文字列は K のプロパティとしてライブラリが渡すため）
 */
export type FittingProps<
  C extends ElementType,
  V,
  O,
  K extends string = 'children',
> = Omit<ComponentPropsWithoutRef<C>, keyof O | 'value' | 'refreshOn' | K> &
  O & {
    /**
     * 表示する値
     */
    value: V;

    /**
     * 測り直すきっかけにする値（Change Dependencies）
     *
     * 1段目のプロパティを `Object.is` で比べ、どれかが変わったら、画面に表示する前に測り直す。
     * 要素の大きさが変わらずに、文字の書式（font-size・letter-spacing など）だけが変わる場合に、
     * 書式を決めている値を渡す（例: `{ className, theme }`）。
     * react-utils の `useExecutionMark` の値を入れると、要求のたびに測り直す（例: `{ refreshAt }`）
     */
    refreshOn?: ChangeDependencies;
  };

/**
 * HOC で作ったコンポーネント
 */
export type FittingComponent<
  C extends ElementType,
  V,
  O,
  K extends string = 'children',
> = ForwardRefExoticComponent<
  PropsWithoutRef<FittingProps<C, V, O, K>> & RefAttributes<ComponentRef<C>>
>;
