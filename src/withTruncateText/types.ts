import type { ElementType } from 'react';
import type { FittingComponent, FittingProps } from '../types';
import type { UseTruncateTextOptions } from '../useTruncateText';

/**
 * withTruncateText で作ったコンポーネントのプロパティ\
 * 包んだコンポーネントのプロパティ、useTruncateText のオプション、`value`（省略する文字列）
 */
export type TruncateTextProps<
  C extends ElementType,
  K extends string = 'children',
> = FittingProps<C, string, UseTruncateTextOptions, K>;

/**
 * withTruncateText で作ったコンポーネント
 */
export type TruncateTextComponent<
  C extends ElementType,
  K extends string = 'children',
> = FittingComponent<C, string, UseTruncateTextOptions, K>;
