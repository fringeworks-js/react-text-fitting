import type { ElementType } from 'react';
import type { FittingComponent, FittingProps } from '../types';
import type { UseResizeTextOptions } from '../useResizeText';

/**
 * withResizeText で作ったコンポーネントのプロパティ\
 * 包んだコンポーネントのプロパティ、useResizeText のオプション、`value`（表示する文字列）
 */
export type ResizeTextProps<
  C extends ElementType,
  K extends string = 'children',
> = FittingProps<C, string, UseResizeTextOptions, K>;

/**
 * withResizeText で作ったコンポーネント
 */
export type ResizeTextComponent<
  C extends ElementType,
  K extends string = 'children',
> = FittingComponent<C, string, UseResizeTextOptions, K>;
