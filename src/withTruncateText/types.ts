import type { ElementType } from 'react';
import type { FittingComponent, FittingProps } from '../types';
import type { UseTruncateTextOptions } from '../useTruncateText';

/**
 * withTruncateText で作ったコンポーネントのプロパティ\
 * 包んだコンポーネントのプロパティ、useTruncateText のオプション、`value`（省略する文字列）
 */
export type TruncateTextProps<C extends ElementType> = FittingProps<
  C,
  string,
  UseTruncateTextOptions
>;

/**
 * withTruncateText で作ったコンポーネント
 */
export type TruncateTextComponent<C extends ElementType> = FittingComponent<
  C,
  string,
  UseTruncateTextOptions
>;
