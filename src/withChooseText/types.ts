import type { ElementType } from 'react';
import type { FittingComponent, FittingProps } from '../types';
import type { UseChooseTextOptions } from '../useChooseText';

/**
 * withChooseText で作ったコンポーネントのプロパティ\
 * 包んだコンポーネントのプロパティ、useChooseText のオプション、`value`（1つの値の表現の候補（望ましい順））
 */
export type ChooseTextProps<
  C extends ElementType,
  K extends string = 'children',
> = FittingProps<C, readonly string[], UseChooseTextOptions, K>;

/**
 * withChooseText で作ったコンポーネント
 */
export type ChooseTextComponent<
  C extends ElementType,
  K extends string = 'children',
> = FittingComponent<C, readonly string[], UseChooseTextOptions, K>;
