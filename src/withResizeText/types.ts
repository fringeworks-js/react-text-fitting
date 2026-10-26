import type { ElementType } from 'react';
import type { FittingComponent, FittingProps } from '../types';
import type { UseResizeTextOptions } from '../useResizeText';

/**
 * withResizeText で作ったコンポーネントのプロパティ\
 * 包んだコンポーネントのプロパティ、useResizeText のオプション、`value`（表示する文字列）
 */
export type ResizeTextProps<C extends ElementType> = FittingProps<
  C,
  string,
  UseResizeTextOptions
>;

/**
 * withResizeText で作ったコンポーネント
 */
export type ResizeTextComponent<C extends ElementType> = FittingComponent<
  C,
  string,
  UseResizeTextOptions
>;
